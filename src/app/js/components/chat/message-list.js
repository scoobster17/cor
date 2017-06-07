// react dependencies
import React from 'react';

// app dependencies
import ChatMessage from './message';

class ChatMessageList extends React.Component {

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
            </section>
        )
    }
}

export default ChatMessageList;