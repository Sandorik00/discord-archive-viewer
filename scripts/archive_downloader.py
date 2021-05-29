#!/usr/bin/python3

from datetime import datetime
from typing import List
import discord
import argparse
import time
from os import path
import json

def main():

    parser = argparse.ArgumentParser()
    parser.add_argument('--guild-id', '-g')
    parser.add_argument('--bot-token-file', '-bt')
    cli_args = parser.parse_args()

    DATA_DIR = path.join('.', 'test')

    allOfTheMessagesIMeanALLOfThem = {}
    allOfTheChannels = {}
    allOfTheMembers = {}

    channelsType = set(["type", "name", "position", "category_id", "topic"])
    membersType = set(["name", "bot", "avatar_url"])

    token: str

    if not cli_args.bot_token_file:
        raise Exception('Not specified token file.')
    try:
        with open(cli_args.bot_token_file) as f:
            token = f.read()
    except:
        raise Exception('Not file or empty.')

    intents = discord.Intents.default()
    intents.members = True

    class Client(discord.Client):
        async def on_ready(self):
            print('Logged on as {0}!'.format(self.user))
            guild = await self.fetch_guild(cli_args.guild_id)
            chans = await guild.fetch_channels()
            members = await guild.fetch_members().flatten()
            clientMember = await guild.fetch_member(self.user.id)
            for mem in members:
                allOfTheMembers[mem.id] = parseObj(mem, membersType)
            for chan in chans:
                id = chan.id
                read_history_perm = chan.permissions_for(clientMember).read_message_history
                if isinstance(chan, discord.TextChannel):
                    if read_history_perm == False:
                        continue
                    opt_after = None
                    all_messages = []
                    it = 0
                    while True:
                        try:
                            fetched_messages = await chan.history(limit=100, after=opt_after, oldest_first=True).flatten()
                        except:
                            fetched_messages = await chan.history(limit=100, after=opt_after, oldest_first=True).flatten()
                        it += 1
                        print(it)
                        all_messages = all_messages + fetched_messages
                        if len(fetched_messages) < 100:
                            break
                        opt_after = fetched_messages[99]
                        time.sleep(1)
                        break
                    print(len(all_messages))
                    allOfTheMessagesIMeanALLOfThem[id] = parseMessages(all_messages)
                allOfTheChannels[id] = parseObj(chan, channelsType)
                if isinstance(chan, discord.TextChannel):
                    break
            open(path.join(DATA_DIR, 'massage.json'), 'w').write(json.dumps(allOfTheMessagesIMeanALLOfThem, ensure_ascii=False, default=replacer))
            open(path.join(DATA_DIR, 'mems.json'), 'w').write(json.dumps(allOfTheMembers, ensure_ascii=False, default=replacer))
            open(path.join(DATA_DIR, 'chanhuan.json'), 'w').write(json.dumps(allOfTheChannels, ensure_ascii=False, default=replacer))
            print("Members: {0}".format(len(allOfTheMembers)), "Channels: {0}".format(len(allOfTheChannels)), "Messages: {0}".format(len(allOfTheMessagesIMeanALLOfThem)), sep="\n")


    def parseMessages(messageList):
        messages = []
        for m in messageList:
            d = {}
            specialEntries = set(["channel", "author"])
            messageFilter = set(
                ["content", "embeds", "attachments", "created_at", "id"])
            for k in dir(m):    
                if k in messageFilter:
                    d[k] = getattr(m, k)
                elif k in specialEntries:
                    d[k + "ID"] = getattr(getattr(m, k), "id")
            messages.append(d)
        return messages

    def parseObj(obj, typeSet: set):
            d = {}
            if isinstance(obj, discord.TextChannel):
                d["nsfw"] = obj.is_nsfw()
            elif isinstance(obj, discord.CategoryChannel):
                typeSet = set(["name", "position"])
                d["type"] = "category"
            for k in dir(obj):
                if k in typeSet:
                    d[k] = getattr(obj, k)
            return d

    def replacer(o):
        if isinstance(o, datetime):
            return str(o)
        if isinstance(o, discord.Asset):
            return str(o)
        if isinstance(o, discord.Embed):
            result = o.to_dict()
            return result
        if isinstance(o, discord.Colour):
            return o.value
        if isinstance(o, discord.Attachment):
            return str(o)
        return str(o)


    client = Client(intents=intents)

    client.run(token)


main()
