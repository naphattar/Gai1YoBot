const { Client, GatewayIntentBits,Partials } = require('discord.js');
const  { joinVoiceChannel} = require('@discordjs/voice');
const { createAudioResource, createAudioPlayer,AudioPlayerStatus,NoSubscriberBehavior,AudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const client = new Client(
    { 
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates,
        ],
        partials: [Partials.Channel]
    }
);
const dotenv = require("dotenv");

dotenv.config();

const words = ["เชี่ย มึงคิดได้ไงวะกาย","สมกับเป็นท่านกาย2โย","กาย2โยเเม่งโครตสุดยอด","ที่1ภาคโยจะใครได้นอกจากกาย2โย","ไม่มีท่านกายคงไม่มีงานประชุมเอเปค","สำหรับใครที่รักกายกายรักเเต่ใบปอคนเดียวนะงุ้ย","อยากหล่อเท่เเบบพี่กาย2โย","เกิดอีกกี่ชาติกี่ปีก็ไม่เจอผู้ชายดีๆเเบบกายสองโย","อยากหล่อให้สาวๆหนุ่มๆเหลียวเเบบกาย2โย"];
const tagword = "ไอกายเรียกเเล้วมึงยังไม่มาอีก";
const banword = ["เหี้ยกาย","ควายกาย","ควยกาย","กายหัวควย","กายโง่","กายหน้าหี","หีกาย"];
const banreplyword = ["มึงด่าไอกายทำเหี้ยไร","อย่ามาว่าลูกพี่กายผม","ต่อยกับกูไหม มึงด่าท่านกาย2โย","กายด่าตัวเองทำไม","คนเหี้ยไรด่าตัวเอง"];
const resourcepath = process.env.ResourcePath;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate' , async(msg) =>{
    for(var i = 0;i<banword.length;i++){
      if(msg.content.includes(banword[i])){
        const word = (msg.author.id == process.env.GuyID) ? banreplyword[3+Math.floor(Math.random()*2)] :banreplyword[Math.floor(Math.random()*(banreplyword.length-2))];
        await msg.reply(word);
        return;
      }
    }

    if(msg.content.includes("รักกาย") && msg.content !== words[5] && msg.author.id !== process.env.GuyID){
      await msg.reply(words[5]);
      return;
    }
    const summonguy = "<@"+process.env.GuyID+">"+ " ท่านกายครับเพื่อนเรียก";
    if(msg.content.includes(process.env.GuyID) && !msg.content.includes(summonguy) && msg.author.id !== process.env.BotID){
      await msg.channel.send(summonguy);
    }

    if(msg.author.id == process.env.GuyID){
      const check = msg.content.charAt(1);
      const word = check == '@' ? tagword + msg.content : words[Math.floor(Math.random()*words.length)];
      await msg.reply(word);
    }else{
      return;
  }
});

// for intraction Event
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'guy') {
    const msg = words[Math.floor(Math.random()*words.length)];
    await interaction.reply(msg);
  }else if(interaction.commandName === 'summon'){
    console.log(interaction);
  }
});

client.on('voiceStateUpdate' , async(oldUser,newUser) =>{
    const newUserID = newUser.id;
    const channelID = newUser.channelId;
    const guildID = newUser.guild.id;
    // Guy join
    if( channelID != null && (newUserID == process.env.GuyID)){
      console.log("Guy2Yo join voice channel")
      const player = createAudioPlayer();
      const connection = await joinVoiceChannel({
        channelId: newUser.channelId,
        guildId: newUser.guild.id,
        adapterCreator: newUser.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
      })
      const resource = createAudioResource(resourcepath, {
        inlineVolume: true
      });
      connection.subscribe(player)
      player.play(resource);
      player.on('error', error => {
        console.error(error);
      });


    } // Guy left
    else if(channelID === null && (newUserID == process.env.GuyID)){
      console.log("Guy2Yo left");
      await joinVoiceChannel({
        channelId: newUser.channelId,
        guildId: newUser.guild.id,
        adapterCreator: newUser.guild.voiceAdapterCreator,
      }).destroy();
    }
  
});

client.login(process.env.TOKEN);