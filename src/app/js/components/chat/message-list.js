// react dependencies
import React from 'react';

// app dependencies
import ChatMessage from './message';
import socket from '../../config/socket/connection';

class ChatMessageList extends React.Component {

    constructor() {
        super();

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

    sendMessage(event) {
        event.preventDefault();
        const message = event.target.querySelector('textarea').value;
        socket.emit('sendMessage', { message });
        return false;
    }
}

export default ChatMessageList;