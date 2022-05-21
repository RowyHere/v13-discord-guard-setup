const Discord = require("discord.js")
const client = new Discord.Client({ intents: [98303] })

const { joinVoiceChannel } = require('@discordjs/voice');

const { guardThree } = require("./settings/tokens.json")
const whitelist = require("./settings/whitelist.json")
const config = require("./settings/config.json")


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

client.login(guardThree)

client.on(`roleCreate`, async role => {
    let entry = await role.guild.fetchAuditLogs({ type: 'ROLE_CREATE' }).then(audit => audit.entries.first());
    if (!entry || !entry.executor || Date.now() - entry.createdTimestamp > 5000) return;;
    const user = role.guild.members.cache.get(entry.executor.id)

    let logChannel = client.channels.cache.get(await db.get(`serverData.kanalrolLog`))

        if(Guard.checkWhitelist(entry.executor.id)) {

            if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${role.name}\`\` adlı rolü oluşturdu, güvenilir listede olduğu için işlem uygulamadım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Rol: ${role.name} (\`\`${role.id}\`\`)`)]}
            )
            } else {
        
                client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${role.name}\`\` adlı rolü oluşturdu, güvenilir listede olduğu için işlem uygulamadım.
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Yetkili: ${user} (\`\`${user.id}\`\`)
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Tarih: <t:${Math.floor(new Date.now() / 1000)}>
                ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
                Rol: ${role.name} (\`\`${role.id}\`\`)`)]}
                
            ).catch(err => { })
            }
            return;
        }
    
        if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${role.name}\`\` adlı rolü oluşturdu rolü sildim, eylemi gerçekleştiren kişiyi sunucudan banladım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Rol: ${role.name} (\`\`${role.id}\`\`)`)]}
        )
        } else {
    
            client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${role.name}\`\` adlı rolü oluşturdu rolü sildim, eylemi gerçekleştiren kişiyi sunucudan banladım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Rol: ${role.name} (\`\`${role.id}\`\`)`)]}
            
        ).catch(err => { })
        }
        
        role.delete()
        user.ban({ reason: "Rowy Koruma" })

})
client.on(`roleDelete`, async role => {
    let entry = await role.guild.fetchAuditLogs({ type: 'ROLE_DELETE' }).then(audit => audit.entries.first());
    if (!entry || !entry.executor || Date.now() - entry.createdTimestamp > 5000) return;;
    const user = role.guild.members.cache.get(entry.executor.id)

    let logChannel = client.channels.cache.get(await db.get(`serverData.kanalrolLog`))

    if(Guard.checkWhitelist(entry.executor.id)) {

        if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${role.name}\`\` adlı rolü sildi, güvenilir listede olduğu için işlem uygulamadım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Rol: ${role.name} (\`\`${role.id}\`\`)`)]}
        )
        } else {
    
            client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${role.name}\`\` adlı rolü sildi, güvenilir listede olduğu için işlem uygulamadım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Rol: ${role.name} (\`\`${role.id}\`\`)`)]}
            
        ).catch(err => { })
        }
        return;
    }

    if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${role.name}\`\` adlı rolü sildi rolü geri oluşturdum, eylemi gerçekleştiren kişiyi sunucudan banladım.
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Yetkili: ${user} (\`\`${user.id}\`\`)
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Tarih: <t:${Math.floor(new Date.now() / 1000)}>
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Rol: ${role.name} (\`\`${role.id}\`\`)`)]}
    )
    } else {

        client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${role.name}\`\` adlı rolü sildi rolü geri oluşturdum, eylemi gerçekleştiren kişiyi sunucudan banladım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Rol: ${role.name} (\`\`${role.id}\`\`)`)]}
        
    ).catch(err => { })
    }
    
    role.guild.roles.create({ name: role.name, reason: "Rowy Koruma", permissions: role.permissions, color: role.color, position: role.position })
    user.ban({ reason: "Rowy Koruma" })

})
client.on(`roleUpdate`, async (oldRole, newRole) => {
    let entry = await oldRole.guild.fetchAuditLogs({ type: 'ROLE_UPDATE' }).then(audit => audit.entries.first());
    if (!entry || !entry.executor || Date.now() - entry.createdTimestamp > 5000) return;;
    const user = oldRole.guild.members.cache.get(entry.executor.id)

    let logChannel = client.channels.cache.get(await db.get(`serverData.kanalrolLog`))

    if(Guard.checkWhitelist(entry.executor.id)) {

        if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${role.name}\`\` adlı rolü güncelledi, güvenilir listede olduğu için işlem uygulamadım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Rol: ${role.name} (\`\`${role.id}\`\`)`)]}
        )
        } else {
    
            client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${role.name}\`\` adlı rolü güncelledi, güvenilir listede olduğu için işlem uygulamadım.
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Yetkili: ${user} (\`\`${user.id}\`\`)
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Tarih: <t:${Math.floor(new Date.now() / 1000)}>
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
            Rol: ${role.name} (\`\`${role.id}\`\`)`)]}
            
        ).catch(err => { })
        }
        return;
    }

    if(logChannel) { logChannel.send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${role.name}\`\` adlı rolü güncelledi rolü geri güncelledim, eylemi gerçekleştiren kişiyi sunucudan banladım.
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Yetkili: ${user} (\`\`${user.id}\`\`)
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Tarih: <t:${Math.floor(new Date.now() / 1000)}>
    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
    Rol: ${role.name} (\`\`${role.id}\`\`)`)]}
    )
    } else {

        client.users.cache.get(member.guild.ownerId).send({ embeds: [embed.setDescription(`${user} adlı yetkili \`\`${role.name}\`\` adlı rolü güncelledi rolü geri güncelledim, eylemi gerçekleştiren kişiyi sunucudan banladım.
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Yetkili: ${user} (\`\`${user.id}\`\`)
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Tarih: <t:${Math.floor(new Date.now() / 1000)}>
        ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        Rol: ${role.name} (\`\`${role.id}\`\`)`)]}
        
    ).catch(err => { })
    }
    
    if(newRole !== oldRole){

        newRole.edit({
            
            name: oldRole.name,
            reason: "Rowy Koruma",
            permissions: oldRole.permissions,
            color: oldRole.color,
            position: oldRole.position

        })

    }

    //role.guild.roles.create({ name: role.name, reason: "Rowy Koruma", permissions: role.permissions, color: role.color, position: role.position })
    user.ban({ reason: "Rowy Koruma" })

})
