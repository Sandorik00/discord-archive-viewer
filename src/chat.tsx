import * as React from 'react';
import { ChatMessage } from './message';
import './chat.scss';
import { fetchMessages } from './database_controller';
import { TMember, TMessage } from './global';

interface IChatProps {
  channelID: string;
  messageID: string;
  members: Promise<TMember[]>;
}

interface IChatState {
  ready: boolean;
  mesToRender: JSX.Element[];
}

export class Chat extends React.Component<IChatProps, IChatState> {
  messages: Promise<TMessage[]> | undefined;
  readyMessages: TMessage[] | undefined;
  readyMembers: TMember[];

  constructor(props: IChatProps) {
    super(props);

    this.messages = undefined;
    this.readyMessages = [];
    this.readyMembers = [];

    this.getReadyMessages = this.getReadyMessages.bind(this);

    this.state = { ready: false, mesToRender: [] };
  }

  async componentDidMount() {
    this.readyMembers = await this.props.members;
    await this.getReadyMessages();
    let messageElements = this.readyMessages?.map((v) => {
      return <ChatMessage key={v.id} content={v.content ?? ''}></ChatMessage>;
    });
    console.log(messageElements?.length);
    this.setState({ mesToRender: messageElements ?? [] });
  }

  async getReadyMessages() {
    this.messages = fetchMessages(this.props.channelID, this.props.messageID);
    this.readyMessages = await this.messages;
  }

  componentDidUpdate(prevProps: IChatProps) {
    if (
      this.props.channelID !== prevProps.channelID ||
      this.props.messageID !== prevProps.messageID
    ) {
      this.getReadyMessages();
      let messageElements = this.readyMessages?.map((v) => {
        return <ChatMessage key={v.id} content={v.content ?? ''}></ChatMessage>;
      });
      console.log(messageElements?.length);
      this.setState({ mesToRender: messageElements ?? [] });
    }
  }

  render() {
    return (
      <div className='chatWrapper'>
        <div className='chat'>
          CHAT
          {this.state.mesToRender ?? null}
          <PageControls></PageControls>
        </div>
      </div>
    );
  }
}

class PageControls extends React.Component {
  render() {
    return (
      <div className='chatFooter'>
        <div className='pageControls'>
          <button>BUTTONS</button>
        </div>
      </div>
    );
  }
}
