package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Tubar2/hangman/pkg/server"
)

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	app := server.New()

	go func() {
		if err := app.Listen(":3000"); err != nil {
			log.Fatal(err)
		}
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	<-c

	log.Println("Gracefully shutting down...")
	if err := app.ShutdownWithTimeout(3 * time.Second); err != nil {
		log.Fatal(err)
	}

	log.Println("Fiber was successful shutdown.")
}
