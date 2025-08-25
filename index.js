import { Client, GatewayIntentBits, Partials, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
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
    const link = args[2];

    if (!userId || !link) {
      return message.reply("❌ Usage: `!dm-embed <userId> <discohook_link>`");
    }

    try {
      const response = await fetch(link);
      const data = await response.json();

      if (!data.embeds || !Array.isArray(data.embeds) || data.embeds.length === 0) {
        return message.reply("❌ Invalid Discohook link or no embeds found.");
      }

      const user = await client.users.fetch(userId);
      const embeds = data.embeds.map(embedData => new EmbedBuilder(embedData));

      const sent = await user.send({ embeds });
      await message.reply(`✅ Embed sent. ID: **${sent.id}**`);
    } catch (err) {
      console.error(err);
      await message.reply("❌ Failed to send embed. Check if the link is valid or the user has DMs open.");
    }
  }
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.token);
