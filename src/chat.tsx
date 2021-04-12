import * as React from 'react';
import { ChatMessage } from './message';
import './chat.scss';

export class Chat extends React.Component {
  render() {
    return (
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
      </div>
    )
  }
}