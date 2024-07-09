module.exports = () => ({
  // JWT Expires in 7 Days
  "users-permissions": {
    config: {
      jwt: {
        expiresIn: "7d",
      },
    },
  },

  // Socket.IO plugin config
  io: {
    enabled: true,
    config: {
      socket: {
        serverOptions: {
          cors: {
            origin: process.env.FRONTEND_WEB_ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
          },
        },
      },
      // This will listen for all supported events on the chat session type
      contentTypes: ["api::chat-session.chat-session"],
      events: [
        {
          name: "connection",
          handler: ({ strapi }, socket) => {
            strapi.log.info(
              `[io] a new client with id ${socket.id} has connected`
            );
          },
        },
        {
          name: "disconnect",
          handler: ({ strapi }, socket) => {
            strapi.log.info(
              `[io] a client with id ${socket.id} has DISconnected`
            );
          },
        },
        {
          name: "message",
          handler: async ({ strapi }, socket, sessionId, message, chatLog) => {
            // strapi.log.info(`[io] message by socket ${socket.id}`);
            chatLog = [...chatLog, message];
            // Update chat log in db
            const entries = await strapi.entityService.update(
              "api::chat-session.chat-session",
              sessionId, // updates the selected chat session
              {
                data: {
                  // Updating chat log - Strapi doesn't support appending a single item to it for some reason
                  // so entire log with new message is again updated
                  chat_log: chatLog,
                },
              }
            );
            // Reply/EMITTING with same message - ECHOING
            socket.emit("message", sessionId, chatLog);
          },
        },
      ],
    },
  },
});
