// react dependencies
import React from 'react';

class ChatMessage extends React.Component {

    render() {
        const { message } = this.props;
        return (
            <p>
                { <span>Sent by { message.author } at { message.time }: </span> }
                { message.text }
            </p>
        )
    }
}

export default ChatMessage;