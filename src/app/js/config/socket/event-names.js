// define socket event name variables for re-use / easier maintenance
const EVENTS = {
    CONNECTION: {
        TEST: 'Connection Check'
    },
    CHAT: {
        SAVED: 'Message Saved',
        SEND: 'Sending Chat Message',
        RECEIVED: 'Chat Message Received'
    },
    ERROR: {
        CHAT: {
            SEND: 'Error Sending Chat Message'
        }
    }
}

export default EVENTS;