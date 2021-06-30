#!/usr/bin/python3

from datetime import datetime
from typing import List
import discord
import argparse
import time
from os import path
import json
from work_with_db import *
import time

def main():

    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group()
    group.add_argument('-tf', '--to-file', action='store_true')
    group.add_argument('-tdb', '--to-db', action='store_true')
    group.add_argument('-ff', '--from-file', action='store_true')
    parser.add_argument('--guild-id', '-g')
    parser.add_argument('--bot-token-file', '-bt')
    cli_args = parser.parse_args()

    data_folder = path.join(os.getcwd(), 'data')

    if not path.isdir(data_folder):
        os.mkdir(data_folder)

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

    if cli_args.to_db:
        conn = connect_to_db(data_folder)
        create_table(conn, 'channels')
        create_table(conn, 'messages')
        create_table(conn, 'users')
        conn.commit()

    class Client(discord.Client):
        async def on_ready(self):
            print('Logged on as {0}!'.format(self.user))
            guild = await self.fetch_guild(cli_args.guild_id)
            chans = await guild.fetch_channels()
            members = await guild.fetch_members().flatten()
            clientMember = await guild.fetch_member(self.user.id)
            for mem in members:
                dict_mem: dict = json.loads(json.dumps(parseObj(mem, membersType), ensure_ascii=False, default=replacer))
                dict_mem["discordID"] = str(mem.id)
                insert_data(conn, 'users', dict_mem)
                """ allOfTheMembers[mem.id] = parseObj(mem, membersType) """
            for chan in chans:
                id = chan.id
                dict_chan: dict = json.loads(json.dumps(parseObj(chan, channelsType), ensure_ascii=False, default=replacer))
                dict_chan["discordID"] = str(id)
                row_id = insert_data(conn, 'channels', dict_chan)
                if isinstance(chan, discord.TextChannel):
                    read_history_perm = chan.permissions_for(clientMember).read_message_history
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
                    print(len(all_messages))
                    message_list: list = json.loads(json.dumps(parseMessages(all_messages, row_id), ensure_ascii=False, default=replacer))
                    insert_data(conn, 'messages', message_list)

                    """ allOfTheMessagesIMeanALLOfThem[id] = parseMessages(all_messages) """
                """ allOfTheChannels[id] = parseObj(chan, channelsType) """
            conn.close()
            print("closed")
            """ open(path.join(DATA_DIR, 'massage.json'), 'w').write(json.dumps(allOfTheMessagesIMeanALLOfThem, ensure_ascii=False, default=replacer))
            open(path.join(DATA_DIR, 'mems.json'), 'w').write(json.dumps(allOfTheMembers, ensure_ascii=False, default=replacer))
            open(path.join(DATA_DIR, 'chanhuan.json'), 'w').write(json.dumps(allOfTheChannels, ensure_ascii=False, default=replacer))
            print("Members: {0}".format(len(allOfTheMembers)), "Channels: {0}".format(len(allOfTheChannels)), "Messages: {0}".format(len(allOfTheMessagesIMeanALLOfThem)), sep="\n") """


    def parseMessages(messageList, row_id=None):
        messages = []
        for m in messageList:
            d = {}
            messageFilter = set(
                ["content", "reference"])
            for k in dir(m):    
                if k in messageFilter:
                    d[k] = getattr(m, k)
                elif k == "author":
                    d[k + "ID"] = getattr(getattr(m, k), "id")
                elif k == "created_at":
                    stamp: datetime = getattr(m, k)
                    d[k] = stamp.replace(microsecond=0).timestamp()
                elif k == "id":
                    d["messageID"] = getattr(m, k)
                elif k == "embeds" or k == "attachments":
                    e = getattr(m, k)
                    if len(e) == 0:
                        d[k] = None
                    else:
                        d[k] = json.dumps(e, ensure_ascii=False, default=replacer)
            if row_id:
                d["channelID"] = row_id
            messages.append(d)
        return messages

    def parseObj(obj, typeSet: set):
            d = {}
            if isinstance(obj, discord.TextChannel):
                d["nsfw"] = obj.is_nsfw()
            elif isinstance(obj, discord.CategoryChannel):
                typeSet = set(["name", "position"])
                d["type"] = "category"
                d["category_id"] = None
                d["topic"] = None
                d["nsfw"] = None
            else:
                d["nsfw"] = None
            for k in dir(obj):
                if k == "type":
                    d[k] = getattr(obj, k)[0]
                elif k in typeSet:
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
