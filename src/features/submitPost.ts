import { firestore } from './../firebase/';

import { App } from '@slack/bolt';
import { filterChannelType, filterNoBotMessages } from '../middleware/index';

const submitPost = (app: App) => {
    app.message(filterChannelType("im"), filterNoBotMessages, (/<@(.+?)>: (.+)/ as any), async ({ message, say, context }) => {

        const uid = message.user;
        const hashedUid = require("sha1")(uid);
        const to = context.matches[1];
        const msg = context.matches[2]

        say(`Your message to <@${to}> has been submitted for review!`)

        await firestore.collection("reviewing").add({
            uid,
            hashedUid,
            msg,
            to
        }).catch(err => say(`Server-Side error on SubmitPost: ${err}`))
    })
}

export default submitPost;