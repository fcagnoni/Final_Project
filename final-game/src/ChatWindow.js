import React from 'react';
import PropTypes from 'prop-types'
import ioClient from 'socket.io-client';
import './ChatWindow.css';

let socket = ioClient('localhost:3001');
// let socket = io();

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);

    this.messageTextInputRef = React.createRef();
    this.state = {
      messageText: '',
      messages: []
    };
  }

  componentDidMount() {
    socket.on('client.chatMessage', this.handleChatMessage);
  }

  handleChatMessage = (message) => {
    const newMessages = [
      ...this.state.messages,
      message
    ];
    this.setState({
      messages: newMessages,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('server.chatMessage', this.state.messageText);

    this.setState({
      messageText: ''
    });

    if (this.messageTextInputRef.current) {
      this.messageTextInputRef.current.focus();
    }
  };

  render() {
    return (
      <form className="ChatWindow" onSubmit={this.handleSubmit}>
        <div className="ChatWindow__Messages">
        {this.state.messages.map((message, i) => {
          return (
            <div className="chatWindowMessage" key={i}>{message}</div>
          );
        })}
        </div>
        <input 
          ref={this.messageTextInputRef}
          type="text" 
          value={this.state.messageText} 
          onChange={(e) => {
            this.setState({
              messageText: e.target.value,
            });
          }}/>
        <input type="submit" value="Submit Me" />
      </form>
    );
  }
}


ChatWindow.propTypes = {
  
};

ChatWindow.defaultProps = {
  
};

export default ChatWindow;
