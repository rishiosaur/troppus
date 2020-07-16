import { firestore } from "./../firebase/";

import { App } from "@slack/bolt";
import { filterChannelType, filterNoBotMessages } from "../middleware/index";
import { token } from '../config';

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
          channel: "C01618Q87PY",
          text: "",

          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: ":bell: *You have a new submission!*"
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
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    emoji: true,
                    text: "Approve :white_check_mark:",
                  },
                  style: "primary",
                  action_id: "post_approve",
                  value: id
                },
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    emoji: true,
                    text: "Deny",
                  },
                  style: "danger",
                  value: "click_me_123",
                },
              ],
            },
          ] as any,

          token: token,
        })
        .catch(console.log);
    }
  );
};

export default submitPost;
