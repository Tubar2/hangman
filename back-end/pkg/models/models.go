package models

import (
	"errors"
	"slices"
	"strings"

	"github.com/google/uuid"
)

type LobbyState string

const (
	InLobby LobbyState = "in_lobby"
	InGame  LobbyState = "in_game"
	InSetup LobbyState = "in_setup"
)

type Lobby struct {
	ID         uuid.UUID  `json:"id"`
	Name       string     `json:"name"`
	State      LobbyState `json:"state"`
	Players    []*Player  `json:"players"`
	Game       *Game      `json:"game"`
	PlayerTurn int        `json:"player_turn"`
}

func (l *Lobby) AddPlayer(player *Player) {
	l.Players = append(l.Players, player)
}

func (l *Lobby) RemovePlayer(playerID uuid.UUID) {
	l.Players = slices.DeleteFunc(l.Players, func(p *Player) bool {
		return p.ID == playerID
	})
}

type Player struct {
	ID   uuid.UUID `json:"id"`
	Name string    `json:"name"`
}

type Game struct {
	Word         string `json:"word"`
	Underscores  string `json:"underscores"`
	Clue         string `json:"clue"`
	RightLetters string `json:"rightLetters"`
	WrongLetters string `json:"wrongLetters"`
}

func (g *Lobby) CheckLetter(letter string) error {
	if len(letter) != 1 {
		return errors.New("letter must be a single character")
	}

	letter = strings.ToUpper(letter)

	if strings.Contains(g.Game.RightLetters, letter) || strings.Contains(g.Game.WrongLetters, letter) {
		return nil
	}

	if strings.Contains(g.Game.Word, letter) {
		g.Game.RightLetters += letter
	} else {
		g.Game.WrongLetters += letter
	}

	// handle underscores
	g.Game.Underscores = ""
	for _, char := range g.Game.Word {
		if strings.Contains(g.Game.RightLetters, string(char)) {
			g.Game.Underscores += string(char)
		} else {
			g.Game.Underscores += "_"
		}
	}

	g.PlayerTurn = (g.PlayerTurn + 1) % len(g.Players)

	return nil
}

func (lobby *Lobby) StartGame() error {
	lobby.Game.Word = strings.ToUpper("Hello")
	lobby.Game.Clue = "a greeting"
	lobby.Game.RightLetters = ""
	lobby.Game.WrongLetters = ""
	lobby.Game.Underscores = strings.Repeat("_", len(lobby.Game.Word))

	lobby.PlayerTurn = 0
	lobby.State = InGame

	return nil
}
