package server

import (
	"time"

	"github.com/Tubar2/hangman/pkg/lobby"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func New() *fiber.App {
	app := fiber.New(fiber.Config{
		IdleTimeout: 5 * time.Second,
	})

	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*", // allow all origins
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusOK)
	})

	rs := lobby.NewService()

	app.Route("/lobby", func(lobby fiber.Router) {
		lobby.Post("", rs.CreateLobby)
		lobby.Get("/join", websocket.New(rs.JoinLobby))
	})

	return app
}
