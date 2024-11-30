const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");

class Bot {
  constructor(token, prefix = "!") {
    this.token = token;
    this.prefix = prefix;
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Required to read message content
      ],
    });

    this.commands = new Map();
    this.loadCommands();
  }

  loadCommands() {
    fs.readdirSync("./discord_commands").forEach((file) => {
      const command = require(path.join(__dirname, "discord_commands", file));
      this.commands.set(command.name, command);
    });
  }

  start() {
    this.client.once("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.on("messageCreate", async (message) =>
      this.handleMessage(message)
    );

    this.client.login(this.token);
  }

  handleMessage(message) {
    if (message.author.bot || !message.content.startsWith(this.prefix)) return;

    const args = message.content.slice(this.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (this.commands.has(commandName)) {
      this.commands.get(commandName).execute(message, args);
    } else {
      message.reply("Unknown command. Please try again.");
    }
  }
}

module.exports = Bot;
