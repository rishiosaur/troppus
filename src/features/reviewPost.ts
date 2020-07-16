import { App, SlackActionMiddlewareArgs } from '@slack/bolt';
import firebase from '../firebase/'
import { firestore } from '../firebase/index';
// import firebase from 'firebase';
import { token, adminChannel } from '../config';

const reviewPostActions = (app: App) => {
    app.action('post_approve', async ({ack, body, action}) => {
        await ack();

        const ref = firebase.firestore().collection("messages").doc((action as any).value)
        // update status of message in firestore
        // send message to user
        await ref.set({
            status: "approved"
        }, { merge: true })

        const { msg, uid, to, hashedUid, ts } = await ref.get().then(e => e.data());

        await app.client.chat.postEphemeral({
            channel: to,
            user: to,
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `:bell:  New Message from ${hashedUid}`
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `> ${msg}`
                    }
                }
            ],
            text: "",
            token: token
        })

        await app.client.chat.postEphemeral({
            channel: uid,
            user: uid,
            text: `Your message to <@${to}> has been approved and sent anonymously.`,
            token: token
        })

        console.log(ts)

        await app.client.chat.update({
            channel: adminChannel,
            text: "awef",
            blocks: 
                [
                    {
                        type: "section",
                        text: {
                          type: "mrkdwn",
                          text: ":white_check_mark: *Submission approved!*"
                        },
                      },
                      {
                        type: "section",
                        fields: [
                          {
                            type: "mrkdwn",
                            text: `*From:*\nh${hashedUid}`,
                          },
                          {
                            type: "mrkdwn",
                            text: `*To:*\n${to}`,
                          },
                        ],
                      },
                      {
                        type: "divider",
                      },
                      {
                        type: "section",
                        text: {
                          type: "mrkdwn",
                          text:
                            `> ${msg}`,
                        },
                      },
                ]
            ,
            ts: ts,
            token: token
        }).then(x => console.log(x)).catch(console.log)
    })

    app.action('post_reject', async ({ack, say, context}) => {
        await ack();
    })
}

export default reviewPostActions;
