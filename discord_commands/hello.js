module.exports = {
  name: "hello",
  description: "Greet the user.",
  execute(message) {
    message.reply(`Hello, ${message.author.username}!`);
  },
};
