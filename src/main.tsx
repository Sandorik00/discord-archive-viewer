import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Chat } from './chat';
import { ChannelsTree } from './tree';
import './main.scss';
import { TMember, TChannel } from './global';
import { fetchChannels, fetchMembers } from './database_controller';

interface IMain {
  channelSelected: string;
  lastMessageID: string;
}

class Main extends React.Component<{}, IMain> {
  members: Promise<TMember[]>;
  channels: Promise<TChannel[]>;

  constructor(props: {}) {
    super(props);
    this.members = fetchMembers();
    this.channels = fetchChannels();
    this.state = { channelSelected: '', lastMessageID: '0' };

    this.updateChan = this.updateChan.bind(this);
  }

  updateChan(value: string) {
    this.setState({ channelSelected: value });
  }

  updateMessage(value: string) {
    this.setState({ lastMessageID: value });
  }
  
  render() {
    return (
      <div className="mainWindow">
        <ChannelsTree chans={this.channels} updateMainState={this.updateChan}></ChannelsTree>
        {this.state.channelSelected !== '' && <Chat members={this.members} channelID={this.state.channelSelected} messageID={this.state.lastMessageID}></Chat>}
      </div>
    );
  }
}


const container = document.getElementById('root');
ReactDOM.render(<Main />, container);