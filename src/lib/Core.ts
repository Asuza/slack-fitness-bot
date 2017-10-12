import Parser from './Parser';
const format = require('util').format;

const messageParser = new Parser();

const messages = require('../messages');
const config = require('../config');

let participants = new Set();
let announcements = [];
let api;

let API_EVENTS;

class Core {

    channel: string;
    userRe: RegExp;

    constructor (rtm, rtmEvents) {
        api = rtm;
        API_EVENTS = rtmEvents;
    }

    initChannel (channelId) {

        this.channel = channelId;

        let channel = api.dataStore.getChannelById(channelId);

        if (channel.members && channel.members.length) {
            channel.members.forEach(memberId => {
                let memberInfo = api.dataStore.getUserById(memberId);

                if (memberInfo && memberInfo.presence === 'active') {
                    this.participantAdd(memberId);
                }
            });
        }

        this.sendMessage(messages.greeting, config.minutes_between_announcements);
        this.handleEvents();
        this.startAnnouncementTimer();
    }

    handleEvents () {
        api.on(API_EVENTS.MESSAGE, message => {
            if (this.userRe.test(message.text)) {
                this.processMessage(message);
            }
        });

        api.on(API_EVENTS.MEMBER_JOINED_CHANNEL, message => {
            let memberInfo = api.dataStore.getUserById(message.user);

            if (memberInfo && memberInfo.presence === 'active') {
                this.participantAdd(message.user);
            }
        });

        api.on(API_EVENTS.MEMBER_LEFT_CHANNEL, message => {
            this.participantRemove(message.user);
        });

        api.on(API_EVENTS.PRESENCE_CHANGE, message => {
            if (message.presence === 'away') {
                this.participantRemove(message.user);
            } else {
                this.participantAdd(message.user);
            }
        });

        api.on(API_EVENTS.MANUAL_PRESENCE_CHANGE, message => {
            if (message.presence === 'away') {
                this.participantRemove(message.user);
            } else {
                this.participantAdd(message.user);
            }
        });
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
            this.startAnnouncementTimer();
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

    participantAdd (memberId: string) {
        console.log(`Added ${memberId}`);
        participants.add(memberId);
    }

    participantRemove (memberId: string) {
        console.log(`Removed ${memberId}`);
        participants.delete(memberId);
    }

    presenceChange (message) {

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