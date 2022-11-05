const { context } = require('@actions/github');

function buildSlackBlocks({ message, colour, github }) {
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
                type: 'mrkdwn',
                text: '*Pull Request*\n`<${payload.pull_request.html_uri} | ${payload.pull_request.title}>`',
            }
            : {
                type: 'mrkdwn',
                text: '*Branch* `<https://github.com/${owner}/${repo}/commit/${sha} | ${branch}>`',
            };
    
    if (message) {
        messageLink = {
            "type": "section",
			"text": {
				"type": "mrkdwn",
				"text": message
			},
        },
		{
			"type": "divider"
		}
    }
        
    return [
        messageLink,
        {
            type: 'Section',
            fields: [
                {
                    type: "mrkdwn",
                    text: "*Repo*\n`<https://github.com/${owner}/${repo} | ${owner}/${repo}>`"
                },
                {
                    type: "mrkdwn",
                    text: "*WorkFlow*\n`<https://github.com/${owner}/${repo}/actions/runs/${runId} | ${workflow}>`"
                },
                referenceLink,
                {
                    type: "mrkdwn",
                    text: "*Event*\n`${event}`"
                },
            ]
        },
    ];
}

module.exports.buildSlackBlocks = buildSlackBlocks;

function formatChannelName(channel) {
    return channel.replace(/[#@]/g, '');
}

module.exports.formatChannelName = formatChannelName;