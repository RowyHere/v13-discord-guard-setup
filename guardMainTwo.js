const Discord = require("discord.js")
const client = new Discord.Client({ intents: [98303] })

const { joinVoiceChannel } = require('@discordjs/voice');

const { guardTwo } = require("./settings/tokens.json")
const whitelist = require("./settings/whitelist.json")
const config = require("./settings/config.json");
const { NSFWLevels } = require("discord.js/typings/enums");


client.on("ready", async () => {

    client.user.setPresence({ activities: [{ name: config.activities }] })
    
    let channel = client.channels.cache.get(config.channelId)

    if(!channel) return;

    joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

})

process.on("unhandledRejection", (err) => {
    return console.log(err);
});

client.login(guardTwo)

client.on(`channelCreate`, async channel => {
    let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000) return;;
    const user = channel.guild.members.cache.get(entry.executor.id)

    let logChannel = client.channels.cache.get(await db.get(`serverData.kanalrolLog`))

    if(Guard.checkWhitelist(entry.executor.id)) {

        if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${channel.name}\`\` adlı kanalı oluşturdu, güvenilir listede olduğu için işlem uygulamadım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Kanal: ${channel.name} (\`\`${channel.id}\`\`)`)]}
        )
        } else {
    
            client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${channel.name}\`\` adlı kanalı oluşturdu, güvenilir listede olduğu için işlem uygulamadım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Kanal: ${channel.name} (\`\`${channel.id}\`\`)`)]}
            
        ).catch(err => { })
        }
        return;
    }

    if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${channel.name}\`\` adlı kanalı oluşturdu kanalı sildim, eylemi gerçekleştiren kişiyi sunucudan banladım.
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Yetkili: ${user} (\`\`${user.id}\`\`)
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Tarih: <t:${Math.floor(new Date.now() / 1000)}>
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Kanal: ${channel.name} (\`\`${channel.id}\`\`)`)]}
    )
    } else {

        client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${channel.name}\`\` adlı kanalı oluşturdu kanalı sildim, eylemi gerçekleştiren kişiyi sunucudan banladım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Kanal: ${channel.name} (\`\`${channel.id}\`\`)`)]}
        
    ).catch(err => { })
    }
    
    channel.delete({ reason: "Rowy Koruma" })
    user.ban({ reason: "Rowy Koruma" })

    })
    client.on(`channelDelete`, async channel => {
    let entry = await channel.guild.fetchAuditLogs({type: 'DELETE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000) return;;
    const user = channel.guild.members.cache.get(entry.executor.id)

    let logChannel = client.channels.cache.get(await db.get(`serverData.kanalrolLog`))

    if(Guard.checkWhitelist(entry.executor.id)) {

        if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${channel.name}\`\` adlı kanalı oluşturdu, güvenilir listede olduğu için işlem uygulamadım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Kanal: ${channel.name} (\`\`${channel.id}\`\`)`)]}
        )
        } else {
    
            client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${channel.name}\`\` adlı kanalı oluşturdu, güvenilir listede olduğu için işlem uygulamadım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Kanal: ${channel.name} (\`\`${channel.id}\`\`)`)]}
            
        ).catch(err => { })
        }
        return;
    }

    if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${channel.name}\`\` adlı kanalı oluşturdu kanalı sildim, eylemi gerçekleştiren kişiyi sunucudan banladım.
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Yetkili: ${user} (\`\`${user.id}\`\`)
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Tarih: <t:${Math.floor(new Date.now() / 1000)}>
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Kanal: ${channel.name} (\`\`${channel.id}\`\`)`)]}
    )
    } else {

        client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${channel.name}\`\` adlı kanalı oluşturdu kanalı sildim, eylemi gerçekleştiren kişiyi sunucudan banladım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Kanal: ${channel.name} (\`\`${channel.id}\`\`)`)]}
        
    ).catch(err => { })
    }
    
    channel.clone({ reason: "Rowy Koruma" }).then(async (x) => {

        if(channel.parentId !== null) await x.setParent(channel.parentId)
        await x.setPosition(channel.position)

        if(channel.type == "GUILD_CATEGORY") await channel.guild.channels.cache.filter(x = x.parentId == channel.id).forEach(k => k.setParent(x.id))

    })
    user.ban({ reason: "Rowy Koruma" })

    })
    client.on(`channelUpdate`, async(oldChannel,newChannel) => {
    let entry = await oldChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());
    if(!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000) return;;
    const user = oldChannel.guild.members.cache.get(entry.executor.id)

    if(Guard.checkWhitelist(entry.executor.id)) {

        if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${channel.name}\`\` adlı kanalı oluşturdu, güvenilir listede olduğu için işlem uygulamadım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Kanal: ${channel.name} (\`\`${channel.id}\`\`)`)]}
        )
        } else {
    
            client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${channel.name}\`\` adlı kanalı oluşturdu, güvenilir listede olduğu için işlem uygulamadım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Kanal: ${channel.name} (\`\`${channel.id}\`\`)`)]}
            
        ).catch(err => { })
        }
        return;
    }

    if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${channel.name}\`\` adlı kanalı oluşturdu kanalı sildim, eylemi gerçekleştiren kişiyi sunucudan banladım.
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Yetkili: ${user} (\`\`${user.id}\`\`)
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Tarih: <t:${Math.floor(new Date.now() / 1000)}>
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Kanal: ${channel.name} (\`\`${channel.id}\`\`)`)]}
    )
    } else {

        client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${channel.name}\`\` adlı kanalı oluşturdu kanalı sildim, eylemi gerçekleştiren kişiyi sunucudan banladım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Kanal: ${channel.name} (\`\`${channel.id}\`\`)`)]}
        
    ).catch(err => { })
    }
    
    if(newChannel.type !== "GUILD_CATEGORY" && newChannel.parentId !== oldChannel.parentId) newChannel.setParent(oldChannel.parentId)
    if(newChannel.type === "GUILD_CATEGORY") {

        newChannel.edit({

            name: oldChannel.name,
            reason: "Rowy Koruma"

        })

    }

    if(newChannel.type === "GUILD_VOICE") {

        newChannel.edit({

            name: oldChannel.name,
            reason: "Rowy Koruma",
            bitrate: oldChannel.bitrate,
            userLimit: oldChannel.userLimit

        })

    }

    if(newChannel.type === "GUILD_TEXT") {

        newChannel.edit({

            name: oldChannel.name,
            topic: oldChannel.topic,
            NSFWLevels: oldChannel.NSFWLevels,
            rateLimitPerUser: oldChannel.rateLimitPerUser

        })

    }

    oldChannel.permissionOverwrites.forEach(x => {

        let thisPermOverwrites = {}
        
        x.allow.toArray().forEach(pusha => {

            thisPermOverwrites[pusha] = true;

        })

        x.deny.toArray().forEach(rowy => {

            thisPermOverwrites[rowy] = false;

        })

        newChannel.permissionOverwrites.create(x.id, { thisPermOverwrites })

    })

    })