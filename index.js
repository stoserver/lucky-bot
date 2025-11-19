import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const __dirname = path.resolve();

// ───────────────────────────────
// 1) Discord Client
// ───────────────────────────────

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ───────────────────────────────
// 2) 슬래시 명령어 로드
// ───────────────────────────────

const commands = [];
const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

  for (const file of commandFiles) {
    const pull = await import(`./commands/${file}`);
    if (pull.data) commands.push(pull.data.toJSON());
  }
}

// ───────────────────────────────
// 3) 슬래시 커맨드 등록 함수
// ───────────────────────────────

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(config.token);

  console.log("⏳ 등록 중…");

  await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    { body: commands }
  );

  console.log("✅ 슬래시 명령어 등록 완료");
}

// ───────────────────────────────
// 4) 이벤트 로더
// ───────────────────────────────

const eventsPath = path.join(__dirname, "events");

if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith(".js"));

  for (const file of eventFiles) {
    const evt = await import(`./events/${file}`);

    if (!evt.default || !evt.default.name) continue;

    client.on(evt.default.name, (...args) =>
      evt.default.execute(client, config, ...args)
    );
  }
}

// ───────────────────────────────
// 5) 실행 모드 선택
//    node index.js register      ➜ 슬래시 커맨드 등록
//    node index.js               ➜ 봇 실행
// ───────────────────────────────

if (process.argv[2] === "register") {
  await registerCommands();
  process.exit(0);
}

// 밥 주기 버튼 처리
if (interaction.isButton() && interaction.customId === "FEED_ACTION") {
    const feeding = require("../systems/feedingSystem");
    return feeding.feedUser(interaction);
}

const evt = require("./events/interactionCreate");
client.on(evt.name, (...args) => evt.execute(client, config, ...args));
// ───────────────────────────────
// 6) 봇 로그인
// ───────────────────────────────

client.once("ready", () => {
  console.log(`🎉 Lucky Bot Logged in as ${client.user.tag}`);
});

client.login(config.token);
