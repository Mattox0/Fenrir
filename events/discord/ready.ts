import {client} from "../../index";
import {ActivityType} from "discord.js";

module.exports = {
  name: 'ready',
  once: true,
  execute() {
    client.user.setPresence({
      activities: [{
        name: "/help",
        type: ActivityType.Watching
      }],
      status: 'online'
    })
    console.log('Bonjour! :D')
  }
};