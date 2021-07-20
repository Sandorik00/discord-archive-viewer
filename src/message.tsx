import * as React from 'react';
import './message.scss';

interface IMessageProps {
  content: string;
}

export class ChatMessage extends React.Component<IMessageProps> {
  constructor(props: IMessageProps) {
    super(props);
  }

  render() {
    return (
      <div className="message">
        {this.props.content}
      </div>
    )
  }
}