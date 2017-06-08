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

        this.state = {
            messages: []
        };

        // bind methods
        this.sendMessage = this.sendMessage.bind(this);
    }

    render() {
        const { title } = this.props;
        const { messages } = this.state;

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

    componentWillReceiveProps() {

        socket.on(EVENTS.SUCCESS.CHAT.SEND, this.updateMessages.bind(this) );
        socket.on(EVENTS.ERROR.CHAT.SEND, (data) => console.log(data) );

        socket.on(EVENTS.SUCCESS.CHAT.FETCH, this.updateMessages.bind(this) );

    }

    sendMessage(event) {

        event.preventDefault();

        const { tracker } = this.props;
        const form = event.target;

        socket.emit(EVENTS.CHAT.SEND, {
            chatId: tracker.id,
            messageData: {
                author: 'authorId',
                text: form.querySelector('textarea').value,
                time: new Date().getTime()
            }
        });

        form.reset();

        return false;
    }

    updateMessages( data ) {

        const { messages } = this.state;

        this.setState({
            messages: [ ...messages, data.messageData ]
        });
        // emit to other users that another message has been saved
    }

}

export default ChatMessageList;