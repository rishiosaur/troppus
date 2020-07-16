import { App, SlackActionMiddlewareArgs } from "@slack/bolt";
import firebase from "../firebase/";
import { token, adminChannel } from "../config";
import {
  approvedMessageDm,
  approvedSubmission,
} from "../blocks/approvedSubmission";

const reviewPostActions = (app: App) => {
  app.action("post_approve", async ({ ack, body, action }) => {
    await ack();

    const ref = firebase
      .firestore()
      .collection("messages")
      .doc((action as any).value);
    await ref.set(
      {
        status: "approved",
      },
      { merge: true }
    );

    const { msg, uid, to, hashedUid, ts } = await ref
      .get()
      .then((e) => e.data());

    await app.client.chat.postEphemeral({
      channel: to,
      user: to,
      blocks: approvedMessageDm(msg, hashedUid),
      text: "",
      token: token,
    });

    await app.client.chat.postEphemeral({
      channel: uid,
      user: uid,
      text: `Your message to <@${to}> has been approved and sent anonymously.`,
      token: token,
    });

    console.log(ts);

    await app.client.chat
      .update({
        channel: adminChannel,
        text: "",
        blocks: approvedSubmission(msg, to, hashedUid),
        ts: ts,
        token: token,
      })
      .then((x) => console.log(x))
      .catch(console.log);
  });

  app.action("post_reject", async ({ ack, say, context }) => {
    await ack();
  });
};

export default reviewPostActions;
