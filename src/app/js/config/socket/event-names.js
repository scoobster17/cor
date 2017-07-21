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
        FETCH: {
            SINGLE: 'Fetching Score Tracker Details',
            ALL: 'Fetching Score Trackers'
        }
    },

    ERROR: {
        CHAT: {
            FETCH: 'Error Fetching Chat Messages',
            SEND: 'Error Sending Chat Message'
        },
        SCORES: {
            FETCH: {
                SINGLE: 'Tracker details not found',
                ALL: 'Trackers not found for user'
            }
        }
    },

    SUCCESS: {
        CHAT: {
            FETCH: 'Chat Messages Fetched Successfully',
            SEND: 'Message Saved',
        },
        SCORES: {
            FETCH: {
                SINGLE: 'Tracker details found',
                ALL: 'Trackers found for user'
            }
        }
    }
}

export default EVENTS;