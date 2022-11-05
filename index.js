const core = require('@actions/core');
const github = require('@actions/github');
const { WebClient } = require('@slack/web-api');
const { buildSlackBlocks, formatChannelName } = require('./src/utils');

(async() => {
    try {
        const channel = core.getInput('channel');
        const message = core.getInput('message');
        const colour = core.getInput('colour');
        const messageId = core.getInput('message_id');
        const token = process.env.SLACK_BOT_TOKEN;
        const slack = new WebClient(token);
        const apiMethod = Boolean(messageId) ? 'update' : 'postMessage';

        if (!channel) {
            core.setFailed(`Channel is a required field`);
        }

        const channelId = (await lookupChannelId({ slack, channel }));
        if (!channelId) {
            core.setFailed(`Slack channel ${channel} could not be found`);
        }

        const blocks = buildSlackBlocks({ message, colour, github })
        console.log(`The blocks payload:`);
        console.log(blocks);

        const args = {
            channel: channelId,
            blocks
        };

        if (messageId) {
            args.ts = messageId;
        }

        console.log(`The full payload:`);
        console.log(args);
        const response = await slack.chat[apiMethod](args);

        core.setOutput('message_id', response.ts);
    } catch(error) {
        core.setFailed(error);
    }
})();

async function lookupChannelId({ slack, channel }) {
    let result;
    const formattedChannel = formatChannelName(channel);

    for await (const page of slack.paginate('conversations.list', { types: 'public_channel, private_channel' })) {
        const match = page.channels.find(c => c.name === formattedChannel);
        if (match) {
            result = match.id;
            break;
        }
    }
    return result;
}