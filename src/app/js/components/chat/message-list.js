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
            messages: [],
            isChatShown: false,
            chatHistoryFetched: false
        };

        // bind methods
        this.sendMessage = this.sendMessage.bind(this);
        this.handleToggleChat = this.handleToggleChat.bind(this);
    }

    render() {
        const { title } = this.props;
        const { messages, isChatShown } = this.state;

        return (
            <section>
                {
                    title &&
                    <h2 className="visually-hidden">
                        { title }
                    </h2>
                }
                <button id="chat-toggle" aria-hidden="true" onClick={ this.handleToggleChat }>
                    { isChatShown ? 'Hide' : 'Show' } chat for activity
                </button>
                {
                    isChatShown && messages &&
                    messages.map((message, index) => {
                        return (
                            <ChatMessage message={ message } key={ index } />
                        )
                    })
                }
                {
                    isChatShown &&
                    <form onSubmit={ this.sendMessage } >
                        <label htmlFor="chat-message">
                            Send a message to the [name] chat
                        </label>
                        <textarea id="chat-message" name="chat-message"></textarea>
                        <input type="submit" value="Send" />
                    </form>
                }
            </section>
        )
    }

    handleToggleChat() {

        const { tracker } = this.props;
        const { isChatShown, chatHistoryFetched } = this.state;

        // if the chat is not shown and messages have not been fetched from
        // the database, fetch previous messages from the database
        if (!isChatShown && !chatHistoryFetched) {

            // fetch the history
            socket.emit(EVENTS.CHAT.FETCH, {
                // "userId": "9e0945f0-87e1-4dda-a28e-047b4500b1d7" // TODO needs to be used for searching competitor chats too
                "chatId": tracker.id
            });

        }

        // hide/show the chat as necessary
        this.toggleChatVisibility();

    };

    toggleChatVisibility() {
        this.setState({
            isChatShown: !this.state.isChatShown
        });
    }

    setChatMessages(messages) {
        this.setState({ messages });
    }


    componentWillReceiveProps() {

        // socket.on(EVENTS.SUCCESS.CHAT.SEND, this.showMessageSent.bind(this) );
        socket.on(EVENTS.CHAT.NEW, this.updateMessages.bind(this) );
        socket.on(EVENTS.ERROR.CHAT.SEND, (data) => console.log(data) );

        socket.on(EVENTS.SUCCESS.CHAT.FETCH, this.setInitialMessages.bind(this) );

    }

    sendMessage(event) {

        event.preventDefault();

        const { tracker } = this.props;
        const form = event.target;

        socket.emit(EVENTS.CHAT.SEND, {
            trackerId: tracker.id,
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

    setInitialMessages( data ) {
        this.setState({
            messages: data.chatMessages,
            chatHistoryFetched: true
        });
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