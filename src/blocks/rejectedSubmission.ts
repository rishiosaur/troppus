export const rejectedSubmission = (msg: string, to: string, hashedUid: string) => {
    return [
        {
            type: "section",
            text: {
              type: "mrkdwn",
              text: ":octagonal_sign: *Submission rejected!*"
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
}
