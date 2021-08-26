'use strict';

const Command = require("../../structure/Command.js");
const { loadavg, cpus, totalmem } = require('os');

class Stats extends Command {
    constructor() {
        super({
            name: 'stats',
            category: 'utils',
            description: 'Obtenez les stats du bot',
            usage: 'stats',
            example: ['stats'],
            aliases: ['botinfo','botstats']
        });
    }

    async run(client, message) {
        let cpuCores = cpus().length;

        await message.reply({
    failIfNotExists: false,
  components:[{
    type: "ACTION_ROW",
    components:[{
      type:"BUTTON",
      customId: "delete",
      emoji: "🗑️",
      style: "DANGER"
    }]
  }],
  allowedMentions : {
    repliedUser: false
  },
            embeds: [{
                title: client.user.username,
                color: client.colors.default,
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.displayAvatarURL(),
                    text: client.user.username
                },
                thumbnail: {
                    url: client.user.displayAvatarURL()
                },
                fields: [
                    {
                        name: "Mon nombre d'utilisateurs",
                        value: "Utilisateurs:" + `\`${client.users.cache.size}\``,
                        inline: true
                    },
                    {
                        name: "Mes serveurs",
                        value: "Serveurs :" + `\`${client.guilds.cache.size}\``,
                        inline: true
                    },
                    {
                        name: "Processeur utilisé",
                        value: `${(loadavg()[0]/cpuCores).toFixed(2)}% / 100%`,
                        inline: true
                    },
                    {
                        name: "RAM utilisé",
                        value: `${Math.trunc((process.memoryUsage().heapUsed) / 1000 / 1000)} MB / ${Math.trunc(totalmem() / 1000 / 1000)} MB`,
                        inline: true
                    }
                ]
            }]
        });
    }
}

module.exports = new Stats;