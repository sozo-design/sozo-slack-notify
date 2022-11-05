const { context } = require('@actions/github');

function buildSlackAttachments({ message, colour, github }) {
    const { payload, ref, workflow, eventName } = github.context;
    const { owner, repo } = context.repo;
    const event = eventName;
    const branch = event === 'pull_request' ? payload.pull_request.head.ref : ref.replace('refs/head', '');
    const sha = event === 'pull_request' ? payload.pull_request.head.sha : github.context.sha;
    const runId = parseInt(process.env.GITHUB_RUN_ID, 10);
    let messageLink;

    const referenceLink = 
        event === 'pull_request'
            ? {
                title: 'Pull Request',
                value: `<${payload.pull_request.html_uri} | ${payload.pull_request.title}>`,
                short: true
            }
            : {
                title: 'Branch',
                value: `<https://github.com/${owner}/${repo}/commit/${sha} | ${branch}>`,
                short: true
            };
    
    if (message) {
        messageLink = {
            title: 'Message',
            value: message,
            short: false,
        }
    }
        
    return [
        {
            color: colour,
            fields: [
                {
                    title: 'Repo',
                    value: `<https://github.com/${owner}/${repo} | ${owner}/${repo}>`,
                    short: true
                },
                {
                    title: 'WorkFlow',
                    value: `<https://github.com/${owner}/${repo}/actions/runs/${runId} | ${workflow}>`,
                    short: true,
                },
                referenceLink,
                {
                    title: 'Event',
                    value: event,
                    short: true,
                },
                messageLink
            ],
            footer_icon: 'https://github.githubassets.com/favicon.ico',
            footer: `<https://github.com/${owner}/${repo} | ${owner}/${repo}>`,
            ts: Math.floor(Date.now() / 1000),
        },
    ];
}

module.exports.buildSlackAttachments = buildSlackAttachments;

function formatChannelName(channel) {
    return channel.replace(/[#@]/g, '');
}

module.exports.formatChannelName = formatChannelName;