'use strict';

/**
 * chat-session service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::chat-session.chat-session');
