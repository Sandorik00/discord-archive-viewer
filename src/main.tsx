import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Chat } from './chat';
import { ChannelsTree } from './tree';
import './main.scss';

class Main extends React.Component {
  render() {
    return (
      <div className="mainWindow">
        <ChannelsTree></ChannelsTree>
        <Chat></Chat>
      </div>
    );
  }
}


const container = document.getElementById('root');
ReactDOM.render(<Main />, container);