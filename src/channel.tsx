import * as React from 'react';
import './channel.scss';
import cc from 'classcat';

interface IChanButtonProps {
  title: string;
  type: string;
  trueID: string;
  updateTreeState(data: string): void;
}

export class ChannelButton extends React.Component<IChanButtonProps> {
  constructor(props: IChanButtonProps) {
    super(props);

    this.activeChanChange = this.activeChanChange.bind(this);
  }

  activeChanChange(e: any) {
    this.props.updateTreeState(this.props.trueID);
  }

  render() {
    return (
      <div className={cc(["channel", this.props.type])} onClick={this.activeChanChange}>
        {this.props.title}
      </div>
    )
  }
}