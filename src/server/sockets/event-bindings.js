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
        socket.on(EVENTS.CHAT.SEND, storeChatMessage);
        socket.on(EVENTS.CHAT.FETCH, getChatMessages);
        socket.on(EVENTS.SCORES.FETCH, getTrackerDetails);

    });


    // socket.io callbacks
    const storeChatMessage = (data) => {

        // update the chat with a new message
        db.chats().update({ id: data.chatId }, { $push: { messages: data.messageData } }, (err, saved) => {

            if (err || !saved) io.emit(EVENTS.ERROR.CHAT.SEND, {
                message: "Message not saved to database"
            });

            io.emit(EVENTS.SUCCESS.CHAT.SEND, {
                message: "Message saved to database",
                messageData: data.messageData
            });

        });
    };

    const getChatMessages = (data) => {
        db.chats().find({
            "id": data.chatId
        }).toArray((err, doc) => {

            if (err) {

                io.emit(EVENTS.ERROR.CHAT.FETCH, {
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
                io.emit(EVENTS.SUCCESS.CHAT.FETCH, {
                    message: "Messages found in database",
                    chatMessages: messagesToReturn
                });
            }
        });
    };

    const getTrackerDetails = (data) => {
        db.scores().find({
            "creator": data.id,
            "urlText": data.urlText
        }).toArray((err, doc) => {
            if (err) {
                io.emit(EVENTS.ERROR.SCORES.FETCH, {
                    message: "Tracker details not found in database"
                });
            } else if (doc.length) {
                io.emit(EVENTS.SUCCESS.SCORES.FETCH, {
                    message: "Tracker details found in database",
                    tracker: doc[0]
                });
            }
        });
    }
};

export default ioSetup;