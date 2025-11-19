const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const config = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// 상태 메시지 목록
const statuses = [
    { text: "게임을", type: "하는중" },
    { text: "IRIS OUT을", type: "듣는중" },
    { text: "지필평가를 준비", type: "하는중" },
    { text: "모험을", type: "하는중" },
    { text: "레벨업을", type: "하는중" },
    { text: "프로젝트를 진행", type: "하는중" },
    { text: "OST를", type: "듣는중" },
    { text: "서버 점검을", type: "하는중" }
];

client.once("ready", () => {
    console.log(`${client.user.tag} 로 로그인 완료`);

    let i = 0;
    setInterval(() => {
        const status = statuses[i];

        // ActivityType 지정: 'Playing', 'Listening', 'Watching' 등
        let activityType;
        switch (status.type) {
            case "하는중":
                activityType = ActivityType.Playing; // "게임을 (하는중)" → Playing
                break;
            case "듣는중":
                activityType = ActivityType.Listening; // "IRIS OUT을 (듣는중)" → Listening
                break;
            default:
                activityType = ActivityType.Playing;
        }

        client.user.setActivity(`${status.text} (${status.type})`, { type: activityType });
        i = (i + 1) % statuses.length;
    }, 15 * 1000); // 15초마다 상태 변경
});

client.login(config.token);
