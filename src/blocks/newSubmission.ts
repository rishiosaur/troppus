export const newSubmission = (msg: string, to: string, hashedUid: string, id: string) => (
    [
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
              text: `*To:*\n<@${to}>`,
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
              action_id: "post_reject",
              text: {
                type: "plain_text",
                emoji: true,
                text: "Deny",
              },
              style: "danger",
              value: id,
            },
          ],
        },
      ]
)