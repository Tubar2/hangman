package lobby

import (
	"errors"
	"log"
	"sync"

	"github.com/Tubar2/hangman/pkg/common"
	"github.com/Tubar2/hangman/pkg/models"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

var (
	ErrLobbyNotFound  = errors.New("lobby not found")
	ErrPlayerNotFound = errors.New("player not found")
)

type Client struct {
	lock *sync.Mutex
	conn *websocket.Conn
}

func NewClient(conn *websocket.Conn) *Client {
	return &Client{
		lock: &sync.Mutex{},
		conn: conn,
	}
}

func (c *Client) Close() {
	c.lock.Lock()
	defer c.lock.Unlock()

	if c.conn != nil {
		if err := c.conn.Close(); err != nil {
			log.Println("Error closing connection:", err)
		}
		c.conn = nil
	}
}

func (c *Client) SendMessage(msg *OutgoingMessage) {
	c.lock.Lock()
	defer c.lock.Unlock()

	if c.conn == nil {
		return
	}

	if err := c.conn.WriteJSON(msg); err != nil {
		log.Println("error sending message:", err)
	}

}

type Lobby struct {
	model   *models.Lobby
	clients map[uuid.UUID]*Client
}

func (l *Lobby) RemovePlayer(playerID uuid.UUID) {
	delete(l.clients, playerID)
	l.model.RemovePlayer(playerID)
}

func (l *Lobby) BroadcastMessage(msg *OutgoingMessage) {
	for _, clientConn := range l.clients {
		go clientConn.SendMessage(msg)
	}
}

type Service struct {
	lobbies map[uuid.UUID]*Lobby
}

func (s *Service) getLobbyByID(id uuid.UUID) (*Lobby, error) {
	lobby, ok := s.lobbies[id]
	if !ok {
		return nil, ErrLobbyNotFound
	}

	return lobby, nil
}

func NewService() *Service {
	return &Service{
		lobbies: make(map[uuid.UUID]*Lobby),
	}
}

type CreateLobbyRequest struct {
	LobbyName string `json:"lobby_name" validate:"required"`
}

func (s *Service) CreateLobby(c *fiber.Ctx) error {
	req := new(CreateLobbyRequest)
	if err := common.ParseBody(c, req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	lobby := &Lobby{
		model: &models.Lobby{
			ID:      uuid.New(),
			Name:    req.LobbyName,
			Players: make([]*models.Player, 0),
			Game:    &models.Game{},
			State:   models.InLobby,
		},
		clients: map[uuid.UUID]*Client{},
	}

	s.lobbies[lobby.model.ID] = lobby

	return c.Status(fiber.StatusCreated).JSON(lobby.model)
}

type JoinLobbyRequest struct {
	LobbyID    uuid.UUID `json:"lobby_id" validate:"required"`
	PlayerName string    `json:"player_name" validate:"required"`
}

type IncomingMessageType string
type OutgoingMessageType string

const (
	SetLobbyMessage  OutgoingMessageType = "set_lobby"
	SetPlayerMessage OutgoingMessageType = "set_player"
	SetErrorMessage  OutgoingMessageType = "set_error"

	ClickLetterEvent IncomingMessageType = "click_letter"
	StartGameEvent   IncomingMessageType = "start_game"
)

type IncomingMessage struct {
	Type IncomingMessageType `json:"type"`
	Data any                 `json:"data"`
}

type OutgoingMessage struct {
	Type OutgoingMessageType `json:"type"`
	Data any                 `json:"data"`
}

func (s *Service) JoinLobby(c *websocket.Conn) {
	log.Println("handling join lobby")

	client := NewClient(c)
	defer client.Close()

	req := new(JoinLobbyRequest)
	if err := common.ParseBodyFromWebsocket(c, req); err != nil {
		log.Println("error parsing request:", err)
		client.SendMessage(&OutgoingMessage{
			Type: SetErrorMessage,
			Data: err.Error(),
		})
		return
	}

	lobby, err := s.getLobbyByID(req.LobbyID)
	if err != nil {
		log.Println("error getting lobby:", err)
		client.SendMessage(&OutgoingMessage{
			Type: SetErrorMessage,
			Data: err.Error(),
		})
		return
	}

	player := &models.Player{
		ID:   uuid.New(),
		Name: req.PlayerName,
	}

	lobby.clients[player.ID] = client
	lobby.model.AddPlayer(player)

	defer s.RemovePlayerFromLobby(lobby, player.ID)

	client.SendMessage(&OutgoingMessage{
		Type: SetPlayerMessage,
		Data: player,
	})

	lobby.BroadcastMessage(&OutgoingMessage{
		Type: SetLobbyMessage,
		Data: lobby.model,
	})

	for {
		msg := new(IncomingMessage)
		if err := c.ReadJSON(msg); err != nil {
			log.Println("error reading incoming message:", err)
			log.Println(err)
			return
		}

		switch msg.Type {
		case StartGameEvent:
			if err := lobby.model.StartGame(); err != nil {
				log.Println("error starting game:", err)
				client.SendMessage(&OutgoingMessage{
					Type: SetErrorMessage,
					Data: err.Error(),
				})
				continue
			}

		case ClickLetterEvent:
			letter, ok := msg.Data.(string)
			if !ok {
				log.Printf("error casting letter to string: %v", msg.Data)
				continue
			}

			if err := lobby.model.CheckLetter(letter); err != nil {
				log.Println("error checking letter:", err)
				client.SendMessage(&OutgoingMessage{
					Type: SetErrorMessage,
					Data: err.Error(),
				})
				continue
			}

		}

		lobby.BroadcastMessage(&OutgoingMessage{
			Type: SetLobbyMessage,
			Data: lobby.model,
		})
	}
}

func (s *Service) RemovePlayerFromLobby(lobby *Lobby, playerID uuid.UUID) error {
	lobby.RemovePlayer(playerID)

	if len(lobby.clients) == 0 {
		// delete(s.lobbies, lobby.model.ID)
	}

	return nil
}
