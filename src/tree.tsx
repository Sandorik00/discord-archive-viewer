import * as React from 'react';
import { ChannelButton } from './channel';
import { TChannel } from './global';
import './tree.scss';

interface IChannelProps {
  chans: Promise<TChannel[]>;
  updateMainState(data: string): void;
}

interface IChannelState {
  ready: boolean;
  selectedChanID: string;
}

export class ChannelsTree extends React.Component<IChannelProps, IChannelState> {
  readyProps: TChannel[] | null;

  constructor(props: IChannelProps) {
    super(props);
    this.readyProps = null;
    this.state = { ready: false, selectedChanID: '' };

    this.updateActiveChan = this.updateActiveChan.bind(this);
  }

  async componentDidMount() {
    this.readyProps = await this.props.chans;
    let categoryChans = this.readyProps.filter(v => v.category_id === null).sort((a, b) => a.position - b.position);
      let otherChans = this.readyProps.filter(v => v.category_id !== null ).sort((a, b) => a.position - b.position);
      let chansList: TChannel[] = [];
      otherChans.forEach((v) => {
        let category = categoryChans.find((val) => val.discordID === v.category_id);
        if (category) {
          chansList.push(category);
          let index = categoryChans.findIndex((v) => v.id === category?.id);
          if (index !== -1) categoryChans.splice(index, 1);
        }
        chansList.push(v);
      });
      let selectChan = chansList.find(v => v.category_id !== null);
      this.readyProps = chansList;
      this.props.updateMainState(selectChan?.discordID ?? '');
    this.setState({ ready: true, selectedChanID: selectChan?.discordID ?? '' });
  }

  updateActiveChan(data: string) {
    this.props.updateMainState(data);
    this.setState({ selectedChanID: data });
  }

  render() {
    if (this.readyProps) {
      let chansArray = this.readyProps.map((chan, i) => {
        return <ChannelButton key={chan.id} title={chan.name} type={chan.type} trueID={chan.discordID} updateTreeState={this.updateActiveChan}></ChannelButton>;
      });

      return (
        <div className='treeWrapper'>
          <div className='tree'>
            CHANNELS
            {chansArray}
          </div>
        </div>
      );
    } else return null;
  }
}
