#!/usr/bin/env node

import * as fs from 'fs';
import * as byline from 'byline';
import * as stream from 'stream';
import message from './main.d';

async function go_go_power_fd() {
    let fd = await fs.promises.open('./database.json', 'r');
    while (true) {
        let buf = Buffer.alloc(1000);
        let line = await fd.read(buf);
        console.log(line.bytesRead);
    }
}

void go_go_power_fd();