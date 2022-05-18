let fs = require('fs')
let Alena = require('../events');
let {MessageType, Mimetype } = require('@adiwajshing/baileys');
let FilterDb = require('./sql/filters');
let Config = require('../config');
let Language = require('../language');
let Lang = Language.getString('filters');

Alena.addCommand({pattern: 'filter ?(.*)', fromMe: true, desc: Lang.FILTER_DESC, dontAddCommandList: true}, (async (message, match) => {
    match = match[1].match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (message.reply_message.text) {
    await FilterDb.setFilter(message.jid, match[0].replace(/['"“]+/g, ''), message.reply_message.text, match[0][0] === "'" ? true : false);
    await message.client.sendMessage(message.jid,Lang.FILTERED.format(match[0].replace(/['"]+/g, '')),MessageType.text);
    return;
    }
    if (match === null) {
    filtreler = await FilterDb.getFilter(message.jid);
    if (filtreler === false) {
    await message.client.sendMessage(message.jid,Lang.NO_FILTER,MessageType.text)
    } else {
    var mesaj = Lang.FILTERS + '\n';
    filtreler.map((filter) => mesaj += '```' + filter.dataValues.pattern + '```\n');
    await message.client.sendMessage(message.jid,mesaj,MessageType.text);
    }
    } else {
    if (match.length < 2) {
    return await message.client.sendMessage(message.jid,Lang.NEED_REPLY + ' ```.filter "sa" "as"',MessageType.text);
    }
    await FilterDb.setFilter(message.jid, match[0].replace(/['"“]+/g, ''), match[1].replace(/['"“]+/g, '').replace(/[#]+/g, '\n'), match[0][0] === "'" ? true : false);
    await message.client.sendMessage(message.jid,Lang.FILTERED.format(match[0].replace(/['"]+/g, '')),MessageType.text);
    }}));

Alena.addCommand({pattern: 'stop ?(.*)', fromMe: true, desc: Lang.STOP_DESC, dontAddCommandList: true}, (async (message, match) => {
    match = match[1].match(/[\'\"\“](.*?)[\'\"\“]/gsm);
    if (match === null) {
    return await message.client.sendMessage(message.jid,Lang.NEED_REPLY + '\n*Example:* ```.stop "hello"```',MessageType.text)
    }
    del = await FilterDb.deleteFilter(message.jid, match[0].replace(/['"“]+/g, ''));    
    if (!del) {
    await message.client.sendMessage(message.jid,Lang.ALREADY_NO_FILTER, MessageType.text)
    } else {
    await message.client.sendMessage(message.jid,Lang.DELETED, MessageType.text)
    }}));

Alena.addCommand({on: 'text', fromMe: false}, (async (message, match) => {
    if (message.jid.includes(Config.YAK)) {
    return;
    } 
    var filtreler = await FilterDb.getFilter(message.jid);
    if (!filtreler) return; 
    filtreler.map(
    async (filter) => {
    pattern = new RegExp(filter.dataValues.regex ? filter.dataValues.pattern : ('\\b(' + filter.dataValues.pattern + ')\\b'), 'gm');
    if (pattern.test(message.message)) {
    await message.client.sendMessage(message.jid,filter.dataValues.text, MessageType.text, {quoted: message.data});
    }});
    }));
