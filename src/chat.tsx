import * as React from 'react';
import { ChatMessage } from './message';
import './chat.scss';

export class Chat extends React.Component {
  render() {
    return (
      <div className="chatWrapper">
        <div className="chat">
        CHAT
        <ChatMessage></ChatMessage>
        <ChatMessage></ChatMessage>
        <ChatMessage></ChatMessage>
        <ChatMessage></ChatMessage>
        <ChatMessage></ChatMessage>
        <ChatMessage></ChatMessage>
        <ChatMessage></ChatMessage>
        <ChatMessage></ChatMessage>
        <ChatMessage></ChatMessage>
        <ChatMessage></ChatMessage>
        <ChatMessage></ChatMessage>
        <PageControls></PageControls>
      </div>
      </div>
    )
  }
}

class PageControls extends React.Component {
  render() {
    return(
      <div className="chatFooter">
        <div className="pageControls">
          <button>BUTTONS</button>
        </div>
      </div>
    )
  }
}