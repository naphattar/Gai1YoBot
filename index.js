const { Client, GatewayIntentBits,Partials } = require('discord.js');
const client = new Client(
    { 
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ],
        partials: [Partials.Channel]
    }
);
const dotenv = require("dotenv");

dotenv.config();

const words = ["เชี่ย มึงคิดได้ไงวะกาย","สมกับเป็นท่านกาย2โย","ไอกายเเม่งโครตสุดยอด","ที่1ภาคโยจะใครได้นอกจากกายวะ","ไม่มีไอกายจะมีงานประชุมเอเปคไหม","สำหรับใครที่รักกายกายรักเเต่ใบปอคนเดียวนะงุ้ย","อยากหล่อเท่เเบบพี่กาย2โย","เกิดอีกกี่ชาติกี่ปีก็ไม่เจอผู้ชายดีๆเเบบกายสองโย","อยากหล่อให้สาวๆหนุ่มๆเหลียวเเบบกาย2โย"];


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async(msg)  => {
    if(msg.author.id == process.env.GuyID){
        const check = msg.content.charAt(1);
        const word = check == '@' ? "ไอกายเรียกเเล้วมึงยังไม่มาอีก"+msg.content : words[Math.floor(Math.random()*words.length)];
        await msg.reply(word);
    }else{
        return;
    }
    
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'guy') {
    const msg = words[Math.floor(Math.random()*words.length)];
    await interaction.reply(msg);
  }
});

client.login(process.env.TOKEN);