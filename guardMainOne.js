const Discord = require("discord.js")
const client = new Discord.Client({ intents: [98303] })
let embed = new Discord.MessageEmbed().setColor('RANDOM').setTimestamp().setFooter({ text: 'Rowy was here.' })
const { joinVoiceChannel } = require('@discordjs/voice');

const { guardMain } = require("./settings/tokens.json")
const whitelist = require("./settings/whitelist.json")
const config = require("./settings/config.json")

let { Guard } = require("./function/functions")

const db = require("quick.db");

client.on("ready", async () => {

    client.user.setPresence({ activities: [{ name: config.activities }] })

    let channel = client.channels.cache.get(config.channelId)

    if (!channel) return;

    joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

})

process.on("unhandledRejection", (err) => {
    return console.log(err);
});

client.on('messageCreate', async (message) => {

    if (message.author.bot || !message.guild || !config.prefix) return;
    let args = message.content.substring(config.prefix.length).trim().split(" ");
    let command = args[0].toLowerCase();
    if (!command) return;

    if (command === "setup") {

        let choice = args[1]

        if (!choice) {

            return message.channel.send({
                embeds: [embed.setTitle("Kurulum paneline hoşgeldiniz.").setDescription(`
    ${config.prefix}setup guildId 
    ${config.prefix}setup limit
    ${config.prefix}setup banLog & kickLog (AYNI KANAL)
    ${config.prefix}setup kanalLog & rolLog (AYNI KANAL)
    ${config.prefix}setup sunucuLog 
    ${config.prefix}setup databaseLog 
    ${config.prefix}setup tarayiciLog 
    `)]

            })

        }

        if (["guildId", "sunucuid", "svid", "swid"].some(x => x === choice)) {

            let ID = args[2]

            message.channel.send({ content: `Sunucu ID\'si \`\`${ID ? ID : message.guild.id + " (Otomatik)"}\`\` olarak ayarlandı!` })
            db.set(`serverData.guildId`, ID ? ID : message.guild.id)

        }

        if (["limit", "klimit", "glimit"].some(x => x === choice)) {

            let ID = args[2]

            message.channel.send({ content: `Güvenlik Limiti \`\`${ID ? ID : "2 (Otomatik)"}\`\` olarak ayarlandı!` })
            db.set(`serverData.korumaLimit`, ID ? ID : "2")

        }

        if (["banguard", "bg", "ban-guard", "banLog", "kickLog", "kg", "kickguard", "kick-guard"].some(x => x === choice)) {

            let channel = message.mentions.channels.first()

            message.channel.send({ content: `Ban ve Kick Log Kanalı ${channel ? channel : "<#" + message.channel + "> (Otomatik)"} olarak ayarlandı` })
            db.set(`serverData.bankickLog`, channel ? channel.id : message.channel.id)

        }

        if (["kanalLog", "rolLog"].some(x => x === choice)) {

            let channel = message.mentions.channels.first()

            message.channel.send({ content: `Kanal ve Rol Log Kanalı ${channel ? channel : "<#" + message.channel + "> (Otomatik)"} olarak ayarlandı` })
            db.set(`serverData.kanalrolLog`, channel ? channel.id : message.channel.id)

        }

        if (["sunucuLog"].some(x => x === choice)) {

            let channel = message.mentions.channels.first()

            message.channel.send({ content: `Sunucu Log Kanalı ${channel ? channel : "<#" + message.channel + "> (Otomatik)"} olarak ayarlandı` })
            db.set(`serverData.serverLog`, channel ? channel.id : message.channel.id)

        }

        if (["databaseLog"].some(x => x === choice)) {

            let channel = message.mentions.channels.first()

            message.channel.send({ content: `Database Log Kanalı ${channel ? channel : "<#" + message.channel + "> (Otomatik)"} olarak ayarlandı` })
            db.set(`serverData.databaseLog`, channel ? channel.id : message.channel.id)

        }

        if (["tarayiciLog"].some(x => x === choice)) {

            let channel = message.mentions.channels.first()

            message.channel.send({ content: `Database Log Kanalı ${channel ? channel : "<#" + message.channel + "> (Otomatik)"} olarak ayarlandı` })
            db.set(`serverData.tarayiciLog`, channel ? channel.id : message.channel.id)

        }
    }

    if (command === "güvenilir" || command === "whitelist" || command === "wl") {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[1])

        if (!member) return message.channel.send({ content: `Güvenli listeye eklemek istediğin kullanıcıyı etiketlemelisin.` })
        Guard.whitelist(member.id, message.channel.id)

    }

})

client.login(guardMain)

client.on(`guildBanAdd`, async (guild, ban) => {
    let entry = await ban.guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' }).then(audit => audit.entries.first());
    if (!entry || !entry.executor || Date.now() - entry.createdTimestamp > 5000) return;;
    const user = ban.guild.members.cache.get(entry.executor.id)

    let logChannel = client.channels.cache.get(await db.get(`serverData.bankickLog`))

        if(Guard.checkWhitelist(entry.executor.id)) {

            if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan yasakladı, güvenilir listede olduğu için işlem uygulamadım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
            )
            } else {
        
                client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan yasakladı, güvenilir listede olduğu için işlem uygulamadım.
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Yetkili: ${user} (\`\`${user.id}\`\`)
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
                
            ).catch(err => { })
            }
            return;
        }
    
        if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan yasakladı, eylemi gerçekleştiren kişiyi sunucudan banladım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
        )
        } else {
    
            client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan yasakladı, eylemi gerçekleştiren kişiyi sunucudan banladım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
            
        ).catch(err => { })
        }
        
        guild.members.unban(ban.id, { reason: "Banlandığı için geri açıldı!" })
        user.ban({ reason: "Rowy Koruma" })
    
})
client.on(`guildMemberAdd`, async member => {
    let entry = await member.guild.fetchAuditLogs({ type: 'BOT_ADD' }).then(audit => audit.entries.first());
    if (!entry || !entry.executor || Date.now() - entry.createdTimestamp > 5000) return;;
    if (member.user.bot) {
        const user = member.guild.members.cache.get(entry.executor.id)

        let logChannel = client.channels.cache.get(await db.get(`serverData.bankickLog`))

        if(Guard.checkWhitelist(entry.executor.id)) {

            if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı botu sunucuya ekledi, güvenilir listede olduğu için işlem uygulamadım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
            )
            } else {
        
                client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı botu sunucuya ekledi, güvenilir listede olduğu için işlem uygulamadım.
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Yetkili: ${user} (\`\`${user.id}\`\`)
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
                
            ).catch(err => { })
            }
            return;
        }
    
        if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı botu sunucuya ekledi, eylemi gerçekleştiren kişiyi sunucudan banladım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
        )
        } else {
    
            client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı botu sunucuya ekledi, eylemi gerçekleştiren kişiyi sunucudan banladım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
            
        ).catch(err => { })
        }
    
        user.ban({ reason: "Rowy Koruma" })
        member.ban({ reason: "Rowy Koruma" })

    }
})
client.on(`guildMemberRemove`, async member => {

    let entry = await member.guild.fetchAuditLogs({ type: 'MEMBER_KICK' }).then(audit => audit.entries.first());
    if (!entry || !entry.executor || Date.now() - entry.createdTimestamp > 5000) return;
    const user = member.guild.members.cache.get(entry.executor.id)
    
    let logChannel = client.channels.cache.get(await db.get(`serverData.bankickLog`))

    if(Guard.checkWhitelist(entry.executor.id)) {

        if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan kickledi, güvenilir listede olduğu için işlem uygulamadım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
        )
        } else {
    
            client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan kickledi, güvenilir listede olduğu için işlem uygulamadım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
            
        ).catch(err => { })
        }
        return;
    }

    if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan kickledi, eylemi gerçekleştiren kişiyi sunucudan banladım.
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Yetkili: ${user} (\`\`${user.id}\`\`)
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
    )
    } else {

        client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan kickledi, eylemi gerçekleştiren kişiyi sunucudan banladım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
        
    ).catch(err => { })
    }

    user.ban({ reason: "Rowy Koruma" })

})
client.on(`guildUpdate`, async (oldGuild,newGuild) => {
    let entry = await oldGuild.fetchAuditLogs({type: 'GUİLD_UPDATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000) return;;
    const user = oldGuild.members.cache.get(entry.executor.id)

    let logChannel = client.channels.cache.get(await db.get(`serverData.bankickLog`))

        if(Guard.checkWhitelist(entry.executor.id)) {

            if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan yasakladı, güvenilir listede olduğu için işlem uygulamadım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
            )
            } else {
        
                client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan yasakladı, güvenilir listede olduğu için işlem uygulamadım.
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Yetkili: ${user} (\`\`${user.id}\`\`)
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
                
            ).catch(err => { })
            }
            return;
        }
    
        if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan yasakladı, eylemi gerçekleştiren kişiyi sunucudan banladım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
        )
        } else {
    
            client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili ${member} adlı üyeyi sunucudan yasakladı, eylemi gerçekleştiren kişiyi sunucudan banladım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>`)]}
            
        ).catch(err => { })
        }

        user.ban({ reason: "Rowy Koruma" })

        if (newGuild.name !== oldGuild.name) newGuild.setName(oldGuild.name);

})