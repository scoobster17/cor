// react dependencies
import React from 'react';

// socket dependencies
import socket from '../../config/socket/connection';
import EVENTS from '../../config/socket/event-names';

// app dependencies
import ChatMessage from './message';

class ChatMessageList extends React.Component {

    constructor() {
        super();

        // bind methods
        this.sendMessage = this.sendMessage.bind(this);
    }

    render() {
        const { title } = this.props;
        const messages = [
            {
                text: "Hi there!",
                author: "Phil",
                time: "Mon 13:41"
            },
            {
                text: "Hi there back!",
                author: "Friend1",
                time: "Mon 13:42"
            }
        ];

        return (
            <section>
                {
                    title &&
                    <h2 className="visually-hidden">
                        { title }
                    </h2>
                }
                {
                    messages &&
                    messages.map((message, index) => {
                        return (
                            <ChatMessage message={ message } key={ index } />
                        )
                    })
                }
                <form onSubmit={ this.sendMessage } >
                    <label htmlFor="chat-message">
                        Send a message to the [name] chat
                    </label>
                    <textarea id="chat-message" name="chat-message"></textarea>
                    <input type="submit" value="Send" />
                </form>
            </section>
        )
    }

    componentDidUpdate() {
        socket.on(EVENTS.CHAT.SAVED, (data) => console.log(data) );
        socket.on(EVENTS.ERROR.CHAT.SEND, (data) => console.log(data) );
    }

    sendMessage(event) {

        event.preventDefault();

        const { tracker } = this.props;

        socket.emit(EVENTS.CHAT.SEND, {
            chatId: tracker.id,
            messageData: {
                author: 'authorId',
                text: event.target.querySelector('textarea').value,
                time: new Date().getTime()
            }
        });

        return false;
    }

}

export default ChatMessageList;