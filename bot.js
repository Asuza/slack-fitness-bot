const { WebClient } = require('@slack/client');
const { format } = require('util');
const { bot, minutesBetweenExercises, messages, exercises } = require('./config');

// An access token (from your Slack app or custom integration - xoxp, xoxb, or xoxa)
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

// Will be set via getConversationId
let conversationId = 'tbd';

/**
 * Gets a random integer up to the max number provided.
 *
 * @param {Number} max
 *     The maximum integer to get
 */
function getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Accepts a template and variables to populate the template with, and sends
 * that message to the configured channel.
 *
 * @param {*} params
 *     Any number of parameters to create a message. The first argument should
 *     be the string to be formatted, followed by any arguments that the string
 *     might need.
 */
function sendMessage (...params) {
    // See: https://api.slack.com/methods/chat.postMessage
    web.chat.postMessage({
        channel: conversationId,
        text: format.apply(null, params),
        as_user: false,
        username: bot.username,
        icon_emoji: bot.icon_emoji
    })
    .then((res) => {
        // `res` contains information about the posted message
        console.log('Sent message (', res.message.text, ') at', res.ts);
    })
    .catch(console.error);
}

/**
 * Sends a random stretch message to all users in the channel.
 */
function sendRandomStretchMessage () {
    let exerciseIndex = getRandomInt(exercises.stretches.length - 1);
    let exercise = exercises.stretches[exerciseIndex];

    sendMessage('Time to stretch, <!here|here>!', '\n*' + exercise[0] + '*\n_' + exercise[1] + '_');
    sendMessage(messages.announcement_upcoming, minutesBetweenExercises.stretches);
}

/**
 * Searches the list of conversations for one matching the given name, then
 * passes the ID of that conversation to the callback function. If the channel
 * cannot be found, the callback will not be called.
 *
 * @param {String} name
 *     The name of the channel being looked for.
 * @param {Function} callback
 *     The function to give the conversation id to.
 */
function getConversationId (name, callback) {
    web.conversations.list()
    .then(res => {
        let channels = res.channels;

        channels = channels.filter(channel => {
            return (channel.name_normalized === name);
        });

        if (!channels[0].id) {
            return console.error(`Unable to find channel named "${name}"`);
        }

        callback(channels[0].id);
    })
    .catch(console.error);
}

getConversationId(process.env.SLACK_CHANNEL, id => {
    console.log(`Will post messages to channel "${process.env.SLACK_CHANNEL}" (${id})`);
    conversationId = id;
    sendMessage(messages.greeting, minutesBetweenExercises.stretches);
    setInterval(sendRandomStretchMessage, minutesBetweenExercises.stretches * 60000);
});

let exitAttempt;
process.on('SIGINT', () => {
    if (!exitAttempt) {
        sendMessage(messages.exit);
        console.log('Press Ctrl-C again to exit.');
        exitAttempt = true;
    } else {
        process.exit(0);
    }
});