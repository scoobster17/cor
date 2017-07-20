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
            isChatShown: false
        };

        // bind methods
        this.sendMessage = this.sendMessage.bind(this);
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
                <button id="chat-toggle" aria-hidden="true">{ isChatShown ? 'Hide' : 'Show' } chat for activity</button>
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

    componentDidMount() {
        const { isChatShown } = this.state;
        const chatToggle = document.getElementById('chat-toggle');

        chatToggle.addEventListener('click', () => {
            this.setState({
                isChatShown: !this.state.isChatShown
            });
        });
    };

    componentDidUpdate() {

        const { messages } = this.state;
        if (!messages.length) {

            // fetch tracker's chat messages
            this.getChatMessages().then((messages) => {
                this.setChatMessages(JSON.parse(messages));
            });
        }

    }

    // setup score tracker promise
    getChatMessages() {

        const { tracker } = this.props;

        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open('POST', '/data/chat/get', true);
            request.setRequestHeader("Content-Type", "application/json");
            request.onload = () => {
                if (request.status >= 200 && request.status < 300) {
                    resolve(request.response);
                } else {
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }
            };
            request.onerror = () => {
                reject({
                    status: request.status,
                    statusText: request.statusText
                });
            };
            request.send(JSON.stringify({
                "id": "9e0945f0-87e1-4dda-a28e-047b4500b1d7",
                "chatId": tracker.id
            })); // needs to be dynamic, and also search through competitor lists for trackers not owned
        });
    }

    setChatMessages(messages) {
        this.setState({ messages });
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