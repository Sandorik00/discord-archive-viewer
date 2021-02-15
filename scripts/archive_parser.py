#!/usr/bin/python3

from io import TextIOWrapper
import json
import os
from os import path
from math import floor

CHANNEL_DIRECTORY = path.join('.', 'dist', 'channels')
chanCounter = dict()
curChan: str = ''


if not path.isdir(CHANNEL_DIRECTORY):
    os.mkdir(CHANNEL_DIRECTORY)

stream: TextIOWrapper

def isChanOverflowed(channelID: str):
    if chanCounter.get(channelID) is None:
        chanCounter[channelID] = 0
    else: chanCounter[channelID] += 1
    return bool((chanCounter[channelID] % 1000) == 0)

def choose_and_open(channelID: str):
    suffix = floor(chanCounter.get(channelID) / 1000)
    return open(path.join(CHANNEL_DIRECTORY, channelID + '_' + str(suffix) + '.json'), 'a')

def write_chan(id: str, data):
    global stream
    of = isChanOverflowed(data['channelID'])
    if id == '':
        stream = choose_and_open(data['channelID'])
    elif not (id == data['channelID']):
        stream.close()
        stream = choose_and_open(data['channelID'])
    elif of:
        stream.close()
        stream = choose_and_open(data['channelID'])
    chan: str = data['channelID']
    stream.write(json.dumps(data) + '\n')
    return chan


with open(os.path.join('.', 'database.json')) as f:
    for line in f:
        obj = json.loads(line)
        curChan = write_chan(curChan, obj)
        print(curChan)

stream.close()
