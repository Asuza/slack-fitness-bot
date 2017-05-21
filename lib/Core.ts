import Parser from './Parser';
const format = require('util').format;

const messageParser = new Parser();

const messages = require('../messages');
const config = require('../config');

let participants = new Set();
let announcements = [];
let api;

class Core {

    channel: string;

    constructor (rtm) {
        api = rtm;
    }

    initChannel (channel) {

        this.channel = channel;

        this.sendMessage(messages.greeting, config.minutes_between_announcements);
        this.startAnnouncementTimer();
    }

    sendMessage (...params) {
        api.sendMessage(format.apply(this, params), this.channel);
    }

    startAnnouncementTimer () {
        let amountInMs = config.minutes_between_announcements * 60000;
        let wobbleInMs = config.wobble_between_announcements * 60000;

        // About half of the time, wobble positively, and the other half, wobble negatively.
        amountInMs = amountInMs + (Math.random() * (Math.random() > 0.5 ? wobbleInMs : -wobbleInMs));
        amountInMs = Math.round(amountInMs);

        console.log(`Next event to occur in ${amountInMs}ms`);

        if (amountInMs > 0) {
            this.sendMessage(messages.announcement_upcoming, amountInMs / 60000);
            setTimeout(this.announce.bind(this), amountInMs);
        }
    }

    announce () {
        if (participants.size > 0) {
            api.sendMessage(format(messages.announcement, this.getParticipantsFormatted(), config.minutes_between_announcements), this.channel);
        } else {
            console.log('There are currently no participants.');
        }
    }

    processMessage (message) {
        if (message.channel !== this.channel) {
            return;
        }

        let decision = messageParser.decide(message.text);

        if (decision !== false) {
            let methodName = decision.type + decision.action[0].toUpperCase() + decision.action.substring(1);

            this[methodName].call(this, message);
        }

        return false;
    }

    participantAdd (message) {
        console.log(`Added participant "${api.dataStore.getUserById(message.user).name}"`)
        participants.add(message.user);
        api.sendMessage(format(messages.participant_added, `<@${message.user}>`), message.channel);
    }

    participantRemove (message) {
        console.log(`Removed participant "${api.dataStore.getUserById(message.user).name}"`)
        participants.delete(message.user);
        api.sendMessage(format(messages.participant_removed, `<@${message.user}>`), message.channel);
    }

    getParticipantsFormatted () {
        let list = [];
        let items = participants.values();

        for (let item of items) {
            list.push(`<@${item}>`);
        }

        return list.join(' ');
    }

}

module.exports = Core;