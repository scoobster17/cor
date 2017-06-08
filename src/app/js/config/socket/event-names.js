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

    ERROR: {
        CHAT: {
            FETCH: 'Error Fetching Chat Messages',
            SEND: 'Error Sending Chat Message'
        }
    },

    SUCCESS: {
        CHAT: {
            FETCH: 'Chat Messages Fetched Successfully',
            SEND: 'Message Saved',
        }
    }
}

export default EVENTS;