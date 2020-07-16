import { firestore } from "./../firebase/";
// import firebase from 'firebase'

import { App } from "@slack/bolt";
import { filterChannelType, filterNoBotMessages } from "../middleware/index";
import { token, adminChannel } from '../config';
import { newSubmission } from '../blocks/newSubmission';

const submitPost = (app: App) => {
  app.message(
    filterChannelType("im"),
    filterNoBotMessages,
    /<@(.+?)>: (.+)/ as any,
    async ({ message, say, context }) => {
      const uid = message.user;
      const hashedUid = require("sha1")(uid);
      const to = context.matches[1];
      const msg = context.matches[2];

      say(`Your message to <@${to}> has been submitted for review!`);

      const { id } =await firestore
        .collection("messages")
        .add({
          uid,
          hashedUid,
          msg,
          to,
          status: "reviewing",
        })
        .catch((err) => say(`Server-Side error on SubmitPost: ${err}`));

      app.client.chat
        .postMessage({
          channel: adminChannel,
          text: "",

          blocks: newSubmission(msg, to, hashedUid, id),

          token: token,
        })
        .then(async ({ ts }) => firestore.collection("messages").doc(id).set({ts: ts}, {merge: true}))
        .catch(console.log);
    }
  );
};

export default submitPost;
