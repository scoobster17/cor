// sockets dependencies
import EVENTS from '../../app/js/config/socket/event-names';

const ioSetup = (io, db) => {

    // socket.io event bindings
    io.on('connection', (socket) => {

        console.log('connection', socket.id);

        socket.on('disconnect', () => {
            console.log('disconnect', socket.id);
        });

        // demonstrate to the user that there is a successful connection
        socket.emit(EVENTS.CONNECTION.TEST, { message: 'You have received this from the server, your connection is running' });

        // bind server functionality to socket events
        socket.on(EVENTS.CHAT.SEND,           (data) => { storeChatMessage(  data, socket); });
        socket.on(EVENTS.CHAT.FETCH,          (data) => { getChatMessages(   data, socket); });
        socket.on(EVENTS.SCORES.FETCH.SINGLE, (data) => { getTrackerDetails( data, socket); });
        socket.on(EVENTS.SCORES.FETCH.ALL,    (data) => { getTrackers(       data, socket); });

    });


    // socket.io callbacks
    const storeChatMessage = (data, socket) => {

        // update the chat with a new message
        db.chats().update({ id: data.chatId }, { $push: { messages: data.messageData } }, (err, saved) => {

            if (err || !saved) socket.emit(EVENTS.ERROR.CHAT.SEND, {
                message: "Message not saved to database"
            });

            socket.emit(EVENTS.SUCCESS.CHAT.SEND, {
                message: "Message saved to database",
                messageData: data.messageData
            });

        });
    };

    const getChatMessages = (data, socket) => {
        db.chats().find({
            "id": data.chatId
        }).toArray((err, doc) => {

            if (err) {

                socket.emit(EVENTS.ERROR.CHAT.FETCH, {
                    message: "Messages not fetched from database"
                });

            // if a chat was found for the tracker
            } else if (doc.length) {

                let messagesToReturn = doc[0].messages;

                // limit the amount of messages returned to 10
                if (messagesToReturn.length > 10) {
                    messagesToReturn = messagesToReturn.slice(doc.length - 11); // zero-indexed
                }

                // send messages found back to the client
                socket.emit(EVENTS.SUCCESS.CHAT.FETCH, {
                    message: "Messages found in database",
                    chatMessages: messagesToReturn
                });
            }
        });
    };

    const getTrackerDetails = (data, socket) => {
        db.scores().find({
            "urlText": data.urlText
        }).toArray((err, doc) => {
            if (err) {
                socket.emit(EVENTS.ERROR.SCORES.FETCH.SINGLE, {
                    message: "Tracker details not found in database"
                });
            } else if (doc.length) {
                socket.emit(EVENTS.SUCCESS.SCORES.FETCH.SINGLE, {
                    message: "Tracker details found in database",
                    tracker: doc[0]
                });
            }
        });
    };

    const getTrackers = (data, socket) => {

        // find trackers owned
        db.scores().find({
            "creator": data.id
        }).toArray((err1, ownedTrackers) => {

            if (err1) {
                socket.emit(EVENTS.ERROR.SCORES.FETCH.ALL, {
                    message: "Users trackers not found in database"
                });
            }

            // find trackers participating in
            db.scores().find({
                "competitors": { "$in": [ data.id ] }
            }).toArray((err2, trackersParticipatingIn) => {

                if (err2) {
                    socket.emit(EVENTS.ERROR.SCORES.FETCH.ALL, {
                        message: "Trackers not owned not found in database"
                    });
                } else if (ownedTrackers.length || trackersParticipatingIn.length) {
                    socket.emit(EVENTS.SUCCESS.SCORES.FETCH.ALL, {
                        message: "Trackers found in database",
                        owned: ownedTrackers,
                        participating: trackersParticipatingIn
                    });
                }
            });
        });
    };
};

export default ioSetup;