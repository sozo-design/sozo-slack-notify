# SOZO Slack Notify

This action allows the sending of slack messages while your GitHub Action is running.

## Inputs

### channel

### colour

The notification colour accent. Can either be a hex code or [a valid Slack colour level](https://api.slack.com/reference/messaging/attachment#fields). Defaults to `#dddddd`

## Outputs

### message_id

## Usage

### Configure Slack

1. Visit the Slack App page - [Create an app](https://api.slack.com/apps/) to create a new Slack App, click **Create an App**.
2. Click **From scratch** to use the UI to fill in the information.
3. Set the **App Name** to GitHub Action, or something more suitable to your usage.
4. Set the **workspace** to the Company that has the channel you want to output in and click **Create App**.
5. In the left hand menu under **Settings** click **Basic Information**, scroll down to **Display Information** and update the **Short Description** to GitHub Actions notification service or something more suitable to your usage. Click Save Changes at the bottom.
6. In the left hand menu under **Features** click **OAuth & Permissions**, scroll down to **Scopes** and **Bot Token Scopes** add the following:
    1. **chat:write** - To write messages to a channel
    2. **channels:read** - To find the channel to post to (public)
    3. **groups:read** - To find the channel to post to (private)
7. Click back to **Basic Information** and then click **Install to Workspace**, allow the permissions to add the app to your Slack WorkSpace.
