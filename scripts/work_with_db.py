import sqlite3
from os import path
import os
from sqlite3.dbapi2 import Error
from typing import Literal, Tuple

data_folder = path.join(os.getcwd(), 'data')

def connect_to_db(file_path: str):
  conn = None

  try:
    conn = sqlite3.connect(path.join(file_path, 'server.db'))
    print("Connected")
  except Error as e:
    print(e)
  finally:
    return conn

def create_table(conn: sqlite3.Connection, mode: Literal["channels", "messages", "users"]):
  sql = None
  sql = {
    "channels": """ CREATE TABLE IF NOT EXISTS channels (
      id integer PRIMARY KEY,
      name text NOT NULL,
      type text NOT NULL,
      position integer NOT NULL,
      category_id text,
      topic text,
      nsfw boolean,
      discordID text NOT NULL
      ); """,
    "messages": """ CREATE TABLE IF NOT EXISTS messages(
      id integer PRIMARY KEY,
      channelID integer NOT NULL,
      authorID text NOT NULL,
      messageID text NOT NULL,
      content text,
      embeds text,
      attachments text,
      reference text,
      created_at text NOT NULL,
      FOREIGN KEY (channelID) REFERENCES channels (id)
      ); """,
    "users": """ CREATE TABLE IF NOT EXISTS users(
      id integer PRIMARY KEY,
      discordID text NOT NULL,
      name text NOT NULL,
      bot boolean NOT NULL,
      avatar_url text NOT NULL
      ); """
  }.get(mode)
  try:
    cur = conn.cursor()
    cur.execute(sql)
  except Error as e:
    print(e)

def insert_data(conn: sqlite3.Connection, mode: Literal["channels", "messages", "users"], data):
  sql = None
  sql = {
    "channels": """ INSERT INTO channels(name,type,position,category_id,topic,nsfw,discordID)
      VALUES(:name,:type,:position,:category_id,:topic,:nsfw,:discordID) """,
    "messages": """ INSERT INTO messages(channelID,authorID,messageID,content,embeds,attachments,reference,created_at)
      VALUES(:channelID,:authorID,:messageID,:content,:embeds,:attachments,:reference,:created_at) """,
    "users": """ INSERT INTO users(avatar_url,bot,name,discordID)
      VALUES(:avatar_url,:bot,:name,:discordID) """
  }.get(mode)
  try:
    cur = conn.cursor()
    if mode == 'messages':
      cur.executemany(sql, data)
    else:
      cur.execute(sql, data)
    conn.commit()
  except Error as e:
    print(e)
  finally:
    return cur.lastrowid
