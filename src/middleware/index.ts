// import { SlackEventMiddlewareArgs, MessageEvent } from "@slack/bolt"
const filterEvent = filterFn => async ({ event, next }) => {
        if (filterFn(event)) {
            await next()
        }
    }

export const filterChannel = id => filterEvent(event => event.channel === id)

export const filterChannelType = (type => filterEvent(event => event.channel_type === type)) as any

export const filterDM = (filterEvent(event => event.channel_type === 'im')) as any

export const filterNoBotMessages = filterEvent(event => !('subtype' in event) || event.subtype !== 'bot_message')

export const filterThreaded = (shouldBeThreaded = true) => filterEvent(event => 'thread_ts' in event === shouldBeThreaded)