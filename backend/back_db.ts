import * as sqlite3 from 'sqlite3';
import * as paths from 'path';
import * as express from 'express';
import { TChannel, TMessage, TMember } from '../src/global';

const sqlite = sqlite3.verbose();
const conn = new sqlite.Database(paths.join(process.cwd(), 'data', 'server.db'));

const app = express();
const port = 8000;

app.get('/channels', async (req, res) => {
  let chans = await getChannels();
  res.json(chans);
})

app.get('/members', async (req, res) => {
  let mems = await getMembers();
  res.json(mems);
})

app.get('/channels/:channel/:date', async (req, res) => {
  let messages = await getMessagesByDate(req.params.channel, req.params.date);
  res.json(messages);
})

app.get('/messages/:query', async (req, res) => {
  let messages = await serchThroughAllMessages(req.params.query);
  res.json(messages);
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

function databaseRequest<T>(sql: string, values?: string[]) {
  return new Promise<T>((res, rej) => {
    conn.all(sql, values ?? [], (err, rows) => {
      if (err) {
        console.log(err);
      }
      res(rows as unknown as T);
    })
  })
}

async function getChannels() {
  let sql = 'SELECT * FROM channels;'
  const result = await databaseRequest<TChannel[]>(sql);
  return result ?? null;
}

async function getMembers() {
  let sql = 'SELECT * FROM users;';
  const result = await databaseRequest<TMember[]>(sql)
  return result ?? null;
}

async function getMessagesByDate(chan: string, timestamp: string) {
  let sql = 'SELECT messages.* FROM messages JOIN channels ON messages.channelID = channels.id WHERE channels.discordID = ? AND created_at >= ? ORDER BY created_at LIMIT 100;';
  const result = await databaseRequest<TMessage[]>(sql, [chan, timestamp]);
  return result ?? null;
}

async function serchThroughAllMessages(query: string) {
  let sql = 'SELECT messages.* FROM messages WHERE messages.content LIKE "%" || ? || "%" ESCAPE "\\" LIMIT 100;';
  const result = await databaseRequest<TMessage[]>(sql, [query]);
  return result ?? null;
}