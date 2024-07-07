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
        { name: "create-chat-session" },
        { name: "update-chat-session" },
        {
          name: "get-chat-sessions",
          handler: async ({ strapi }, socket, userId) => {
            strapi.log.info(
              `[io] get chat sessions request by socket ${socket.id}`
            );
            const entries = await strapi.entityService.findMany('api::chat-session.chat-session', {
              populate: { "users_permissions_user": userId }, 
            });
            
          },
        },
      ],
    },
  },
});
