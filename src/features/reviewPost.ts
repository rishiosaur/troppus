import { App, SlackActionMiddlewareArgs } from '@slack/bolt';
import firebase from '../firebase/'
import { firestore } from '../firebase/index';
// import firebase from 'firebase';
import { token } from '../config';

const reviewPostActions = (app: App) => {
    app.action('post_approve', async ({ack, body, action}) => {
        await ack();

        const ref = firebase.firestore().collection("messages").doc((action as any).value)
        // update status of message in firestore
        // send message to user
        await ref.set({
            status: "approved"
        }, { merge: true })

        const message = await ref.get().then(e => e.data());

        await app.client.chat.postEphemeral({
            channel: message.to,
            user: message.to,
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `:bell:  New Message from ${message.hashedUid}`
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `> ${message.msg}`
                    }
                }
            ],
            text: "",
            token: token
        })

        await app.client.chat.postEphemeral({
            channel: message.uid,
            user: message.uid,
            text: `Your message to <@${message.to}> has been approved and sent anonymously.`,
            token: token
        })

        await app.client.chat.
    })

    app.action('post_reject', async ({ack, say, context}) => {
        await ack();
    })
}

export default reviewPostActions;
