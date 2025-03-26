package common

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

var (
	validete = validator.New()
)

func ParseBody(c *fiber.Ctx, req any) error {
	if err := c.BodyParser(req); err != nil {
		return err
	}

	if err := validete.Struct(req); err != nil {
		return err
	}

	return nil
}

func ParseBodyFromWebsocket(c *websocket.Conn, req any) error {
	if err := c.ReadJSON(req); err != nil {
		return err
	}

	if err := validete.Struct(req); err != nil {
		return err
	}

	return nil
}
