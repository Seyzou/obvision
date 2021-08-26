'use strict';
const Command = require("../../structure/Command.js");
const ytdl = require("ytdl-core");

class Play extends Command {
    constructor() {
        super({
            name: 'play',
            category: 'vocal',
            description: 'Joué de la musique en vocal',
            usage: 'play <Chanson>',
            example: ['play anamaguchi','play https://www.youtube.com/watch?v=Zpl_VaQnGO0'],
            botPerms: ['CONNECT',"SPEAK","USE_VAD"]
        });
    }

    async run(client, message, args) {       
    let EOR = client.functions.EOR;
 if(!message.member.voice.channel) return message.channel.send({ embeds:[ EOR({ desc: "Vous devez rejoindre un salon vocal",error: "yes"},message)]})
if(!args[1])  return message.channel.send({ embeds:[ EOR({ desc: "Vous devez écrire l'url Youtube, ou le titre de la musique/vidéo",error: "yes"},message)]})
     require("node-fetch")(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&maxResults=50&key=AIzaSyAgpPns8AwUjlXc63jXw7T4bQ9bRoCy7As&q=${encodeURIComponent(args.slice(1).join(" "))}`,{
        }).then(r =>r.json()).then(js =>{
            if(js.items.length < 1) return message.channel.send({ embeds: [EOR({ desc: "Aucune chanson n'as été trouvé pour ce titre",error: "yes"},message)]}) 
require("node-fetch")(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=AIzaSyAgpPns8AwUjlXc63jXw7T4bQ9bRoCy7As&maxResults=50&playlistId=${encodeURIComponent(js.items[0].id.playlistId)}`,{
        }).then(res =>res.json()).then(json =>{
if (client.timeoutsVoc.guild.has(message.guild.id) && client.timeoutsVoc.cmd.has(`play-${message.guild.id}`)) return message.channel.send({ embeds :[EOR({desc:"> Le bot doit d'abord quitté le salon où il est, ou finir de joué la musique avant de vous rejoindre et joué de la musique !", error:"yes"},message)]});
client.timeoutsVoc.guild.add(message.guild.id);
const trackAudio = ytdl("https://www.youtube.com/watch?v="+json.items[0].snippet.resourceId.videoId, { filter: "audioonly", quality: "highestaudio"})
const chan = message.member.voice.channel;
 const connection = client.voc.joinVoiceChannel({
                        channelId: chan.id,
    guildId: chan.guild.id,
    adapterCreator: chan.guild.voiceAdapterCreator,
                    })
client.timeoutsVoc.guild.add(message.guild.id);
 const player = client.voc.createAudioPlayer();
setVoiceTrack(trackAudio);
ReplyWithCurrentTrack(json.items[0].snippet)
function setVoiceTrack(currentTrack){
    const resource = client.voc.createAudioResource(currentTrack, { inlineVolume: true });
    resource.volume.setVolume(1.5);
    player.play(resource);
}
let counter = 1, TrackList = json.items;
function SearchTrack() {
    if(TrackList.length <= counter){
require("node-fetch")(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&maxResults=50&key=AIzaSyAgpPns8AwUjlXc63jXw7T4bQ9bRoCy7As&q=${encodeURIComponent(TrackList[TrackList.length-1].snippet.title)}`,{
        }).then(r2 =>r2.json()).then(js2 =>{
require("node-fetch")(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=AIzaSyAgpPns8AwUjlXc63jXw7T4bQ9bRoCy7As&maxResults=50&playlistId=${encodeURIComponent(js2.items[0].id.playlistId)}`,{
        }).then(res2 =>res2.json()).then(json2 =>{
            setVoiceTrack(ytdl("https://www.youtube.com/watch?v="+json2.items[0].snippet.resourceId.videoId, { filter: "audioonly", quality: "highestaudio"}));
            ReplyWithCurrentTrack(TrackList[0].snippet)
            TrackList = json2.items
            counter = 1;
        })
    })
    }else{
        setVoiceTrack(ytdl("https://www.youtube.com/watch?v="+TrackList[counter].snippet.resourceId.videoId, { filter: "audioonly", quality: "highestaudio"}));
        ReplyWithCurrentTrack(TrackList[counter].snippet)
        counter += 1;
    }
}
connection.on(client.voc.VoiceConnectionStatus.Ready, () => {

    message.channel.send({ embeds:[EOR({desc:"Le bot est connecté"},message)]})
if(chan.type === "stage"){
    if(message.guild.me.permissions.has("ADMINISTRATOR") || message.member.voice.channel.manageable){
  message.guild.me.voice.setSuppressed(false);
  PlayTts();
  }else{
    connection.destroy();
    return message.channel.send({ embeds:[EOR({title:"Global Voice Error",desc:"Le bot n'as pas les permissions suffisante pour parlé dans le salon de stage, donné lui la permission `Administrateur` ou bien ajouté le rôle du bot en tant que modérateur de conférence pour qu'il puisse parler", error: "yes"},message)]})
  }
}else {
    PlayTts();
}
function PlayTts(){
connection.subscribe(player);
player.on("playing",() =>{
    client.timeoutsVoc.cmd.add(`play-${message.guild.id}`)
    message.channel.send({ embeds: [EOR({ desc: "La musique est en train de joué"},message)]})
})
player.on('idle', () => {
   message.channel.send({ embeds: [EOR({ desc: "Musique terminé"},message)]}) 
client.timeoutsVoc.cmd.delete(`play-${message.guild.id}`)
      
  player.stop();
SearchTrack();
  //Song stopped  
});
}
});

// Always remember to handle errors appropriately!
connection.on(client.voc.VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
    try {
        await Promise.race([
            client.voc.entersState(connection, client.voc.VoiceConnectionStatus.Signalling, 5e3),
            client.voc.entersState(connection, client.voc.VoiceConnectionStatus.Connecting, 5e3),
        ]);
        // Seems to be reconnecting to a new channel - ignore disconnect
    } catch (error) {
        // Seems to be a real disconnect which SHOULDN'T be recovered from
        connection.destroy();
    }
});
function ReplyWithCurrentTrack(track){
            message.reply({
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
    },embeds:[{
    color: "#FF0000",
    title: track.title,
    url: "https://www.youtube.com/watch?v="+track.resourceId.videoId,
    author: {
        name: track.channelTitle,
    },
    description: track.description.substr(0,3900),

    image: {
        url: track.thumbnails.high.url,
    },
    timestamp: new Date(track.publishedAt),
}] })
}
        })
 })
}
}

module.exports = new Play;