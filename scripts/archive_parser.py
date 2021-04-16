#!/usr/bin/python3

from io import TextIOWrapper
import json
import os
from os import path
from math import floor

DATA_DIR = path.join('.', 'data')
CHANNEL_DIR = path.join(DATA_DIR, 'channels')
chanCounter = dict()
curChan: str = ''


if not path.isdir(CHANNEL_DIR):
    os.makedirs(CHANNEL_DIR)

stream: TextIOWrapper

def isChanOverflowed(channelID: str):
    if chanCounter.get(channelID) is None:
        chanCounter[channelID] = 0
    else: chanCounter[channelID] += 1
    return bool((chanCounter[channelID] % 1000) == 0)

def choose_and_open(channelID: str):
    suffix = floor(chanCounter.get(channelID) / 1000)
    return open(path.join(CHANNEL_DIR, channelID + '_' + str(suffix) + '.json'), 'a')

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

def makeDictAndWrite(fileName: str, filterSet: set):
    dict = {}
    with open(path.join('.', fileName + '.json')) as f:
        for line in f:
            obj = json.loads(line)
            id = obj["id"]
            dict[id] = {}
            for k in list(obj.keys()):
                if k in filterSet:
                    dict[id][k] = obj[k]
                
    open(path.join(DATA_DIR, fileName + 'Dict.json'), 'w').write(json.dumps(dict))

membersType = set(["username", "bot", "displayAvatarURL"])
makeDictAndWrite('members', membersType)

channelsType = set(["type", "name", "rawPosition", "parentID", "topic", "nsfw"])
makeDictAndWrite('channels', channelsType)


