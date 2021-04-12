import * as React from 'react';
import { ChannelButton } from './channel';
import './tree.scss';

export class ChannelsTree extends React.Component {
  render() {
    return (
      <div className="tree">
        CHANNELS
        <ChannelButton></ChannelButton>
        <ChannelButton></ChannelButton>
        <ChannelButton></ChannelButton>
        <ChannelButton></ChannelButton>
        <ChannelButton></ChannelButton>
        <ChannelButton></ChannelButton>
        <ChannelButton></ChannelButton>
        <ChannelButton></ChannelButton>
        <ChannelButton></ChannelButton>
        <ChannelButton></ChannelButton>
        <ChannelButton></ChannelButton>
      </div>
    )
  }
}