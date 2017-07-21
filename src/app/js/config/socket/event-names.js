// define socket event name variables for re-use / easier maintenance
const EVENTS = {

    CONNECTION: {
        TEST: 'Connection Check'
    },
    CHAT: {
        FETCH: 'Fetching Latest Chat Messages',
        SEND: 'Sending Chat Message',
        RECEIVED: 'Chat Message Received'
    },
    SCORES: {
        FETCH: 'Fetching Score Tracker Details'
    },

    ERROR: {
        CHAT: {
            FETCH: 'Error Fetching Chat Messages',
            SEND: 'Error Sending Chat Message'
        },
        SCORES: {
            FETCH: 'Tracker details not found'
        }
    },

    SUCCESS: {
        CHAT: {
            FETCH: 'Chat Messages Fetched Successfully',
            SEND: 'Message Saved',
        },
        SCORES: {
            FETCH: 'Tracker details found'
        }
    }
}

export default EVENTS;