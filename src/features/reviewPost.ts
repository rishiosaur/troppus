import { App } from '@slack/bolt';
const reviewPostActions = (app: App) => {
    app.action('post_approve', async ({ack, say, context}) => {
        await ack();
    })

    app.action('post_reject', async ({ack, say, context}) => {
        await ack();
    })
}

export default reviewPostActions;