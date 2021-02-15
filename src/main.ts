#!/usr/bin/env node

import * as fs from 'fs';
import * as byline from 'byline';
import * as stream from 'stream';
import * as path from 'path';
import message from './main.d';

let readStream = fs.createReadStream(__dirname + '/database.json');
let blStream = byline.createStream(readStream);

fs.mkdirSync(__dirname + '/channels');

let currentChan = '';
let writeStream: fs.WriteStream;

blStream.on('data', async (bufLine) => {
  let line = JSON.parse((bufLine as Buffer).toString('utf-8')) as message;

  if (currentChan === '') {
    writeStream = createDefaultWriteStream(line.channelID);
  } else if (currentChan !== line.channelID) {
    writeStream.end();
    writeStream = createDefaultWriteStream(line.channelID);
  }
  currentChan = line.channelID;
  console.log(line);
  await tryWriting(writeStream, line);
});

blStream.on('end', () => {
  writeStream.end();
});

function createDefaultWriteStream(id: string): fs.WriteStream {
  return fs.createWriteStream(__dirname + '/channels/' + id + '.json', { flags: 'a' });
}

/* function tryWritingAsync(writable: stream.Writable, data: message): boolean {
  let written = writable.write(JSON.stringify(data) + '\n');
  if (!written) {
    writable.once('drain', () => tryWriting(writable, data));
  }
  return written;
} */

async function tryWriting(writable: stream.Writable, data: message): Promise<void> {
  console.warn(data.id);
  let stringifiedDataWithSeparator = JSON.stringify(data) + '\n';
  console.log('strinjified');
  if (!writable.write(stringifiedDataWithSeparator)) {
    await new Promise<void>((resolve) => {
      console.warn('we are in Promise now');
      writable.once('drain', resolve);
    });
  }
}

