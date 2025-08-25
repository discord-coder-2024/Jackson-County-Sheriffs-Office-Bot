import { Client, GatewayIntentBits, Partials, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!dm")) {
    const args = message.content.split(" ");
    if (args[0] === "!dm-embed") return;

    const userId = args[1];
    const dmMessage = args.slice(2).join(" ");

    if (!userId || !dmMessage) {
      return message.reply("❌ Usage: `!dm <userId> <message>`");
    }

    try {
      const user = await client.users.fetch(userId);
      const formattedMessage = 
        `**Message from the Jackson County Sheriffs Office**:\n${dmMessage}\n\n<:JacksonCountySheriffsOffice:1409338513417048105> | **Jackson County Office of the Sheriff** | *Sheriff Elijah Smith*`;

      const sent = await user.send(formattedMessage);
      await message.reply(`✅ Message sent. ID: **${sent.id}**`);
    } catch (err) {
      console.error(err);
      await message.reply("❌ Failed to send DM. Check if the user exists or has DMs open.");
    }
  }

  if (message.content.startsWith("!dm-embed")) {
    const args = message.content.split(" ");
    const userId = args[1];
    const jsonString = args.slice(2).join(" ");

    if (!userId || !jsonString) {
      return message.reply("❌ Usage: `!dm-embed <userId> <json_code>`");
    }

    try {
      const embedData = JSON.parse(jsonString);

      if (!embedData.embeds || !Array.isArray(embedData.embeds) || embedData.embeds.length === 0) {
        return message.reply("❌ Invalid JSON code or no embeds found.");
      }

      const user = await client.users.fetch(userId);
      const embeds = embedData.embeds.map(e => new EmbedBuilder(e));

      const sent = await user.send({ embeds });
      await message.reply(`✅ Embed sent. ID: **${sent.id}**`);
    } catch (err) {
      console.error(err);
      await message.reply("❌ Failed to parse JSON. Make sure you pasted valid Discohook JSON.");
    }
  }
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.token);

