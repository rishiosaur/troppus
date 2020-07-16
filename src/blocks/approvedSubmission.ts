export const approvedSubmission = (msg: string, to: string, hashedUid: string) => {
    return [
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
}

export const approvedMessageDm = (msg: string, hashedUid: string) => (
    [
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
    ]
)