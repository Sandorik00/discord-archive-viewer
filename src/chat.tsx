import * as React from 'react';
import { ChatMessage } from './message';
import './chat.scss';

export class Chat extends React.Component {
  //messagesText: string;

  constructor(props: {}) {
    super(props);
    let a = fetch('http://127.0.0.1:5500/data/channels/500980711466074123_0.json').then(res => res.text());
    a.then(data => console.log(JSON.parse('[' + data.replace(/\n/mg, ',\n',) + ']')));
    //a.then(data => console.log('[' + data.replace(/\n/mg, ',\n',) + ']'));
  }


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