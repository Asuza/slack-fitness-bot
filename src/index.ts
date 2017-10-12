const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const MemoryDataStore = require('@slack/client').MemoryDataStore;

const Core = require('./lib/Core');

const config = require('./config');
const messages = require('./messages');

const format = require('util').format;

const token = process.env.SLACK_API_TOKEN || '';

const rtm = new RtmClient(token, {
  logLevel: 'info', // check this out for more on logger: https://github.com/winstonjs/winston
  dataStore: new MemoryDataStore(), // pass a new MemoryDataStore instance to cache information
  autoReconnect: true
});

let cores = [];
let startData;
let userRe;
let memberOfChannelsByName = [];
let memberOfChannelsById = [];
let participants = [];

console.log('Starting RTM client...');
rtm.start();

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
  startData = rtmStartData;
  userRe = new RegExp(`<@${startData.self.id}>`);
  console.log(`Logged in to team ${rtmStartData.team.name} as user ${rtmStartData.self.name}`);
});

rtm.on(RTM_EVENTS.REACTION_ADDED, function handleRtmReactionAdded(reaction) {
  console.log('Reaction added:', reaction);

  // Determines if the user has reacted with a check mark.
  if (/_check/.test(reaction.reaction)) {
    console.log(
      'Exercise completed by %s',
      rtm.dataStore.getUserById(reaction.user).name
    );
  }
});

// Wait for the client to connect
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function() {
  // Get the user's name
  var user = rtm.dataStore.getUserById(rtm.activeUserId);

  // Get the team's name
  var team = rtm.dataStore.getTeamById(rtm.activeTeamId);

  // Log the slack team name and the bot's name
  console.log('Connected to ' + team.name + ' as ' + user.name);

  let channels = rtm.dataStore.channels;

  for (let key in channels) {
    if (channels[key].is_member) {
      memberOfChannelsByName.push(channels[key].name);
      memberOfChannelsById.push(key);
    }
  }

  console.log('Member of channel(s):', memberOfChannelsByName);

  memberOfChannelsById.forEach(channel => {
    let coreInstance = new Core(rtm, RTM_EVENTS);

    coreInstance.userRe = userRe;
    coreInstance.initChannel(channel);

    cores.push(coreInstance);
  });
});