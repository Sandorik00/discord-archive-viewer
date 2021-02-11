#!/usr/bin/env node

import * as fs from 'fs';
import * as byline from 'byline';
import * as stream from 'stream';
import * as path from 'path';

interface message {
  channelID: string;
  id: string;
  type: 'DEFAULT' | 'GUILD_MEMBER_JOIN';
  system: boolean;
  content: string;
  authorID: string;
  pinned: boolean;
  embeds: [];
  attachments: [];
  createdTimestamp: number;
  editedTimestamp: number | null;
  reference: object | null;
  guildID: string;
  cleanContent: string;
}

let readStream = fs.createReadStream(__dirname + '/database.json');
let blStream = byline.createStream(readStream);

let currentChan = '';
let writeStream: fs.WriteStream;

blStream.on('data', async (bufLine) => {
  let line = JSON.parse((bufLine as Buffer).toString('utf-8')) as message;

  if (currentChan === '') {
    writeStream = createDefaultWriteStream(line.channelID);
  } else if (currentChan !== line.channelID) {
    writeStream.close();
    writeStream = createDefaultWriteStream(line.channelID);
  }

  console.log(line);
  await tryWriting(writeStream, line)
});

blStream.on('end', () => {
  writeStream.close();
});

function createDefaultWriteStream(id: string): fs.WriteStream {
  return fs.createWriteStream(__dirname + '/channels/' + id + '.json', { flags: 'a' });
}

function tryWritingAsync(writable: stream.Writable, data: message): boolean {
  let written = writable.write(JSON.stringify(data) + '\n');
  if (!written) {
    writable.once('drain', () => tryWriting(writable, data));
  }
  return written;
}

function tryWriting(writable: stream.Writable, data: message): Promise<void> {
  return new Promise((resolve, reject) => {
    tryWritingAsync(writable, data);
    resolve();
  })
}
