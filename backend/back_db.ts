import * as sqlite3 from 'sqlite3';
import * as paths from 'path';
import * as express from 'express';
import { TChannel, TMessage, TMember } from '../src/global';

const sqlite = sqlite3.verbose();
const conn = new sqlite.Database(paths.join(process.cwd(), 'data', 'server.db'));

const app = express();
const port = 8000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  res.setHeader('Access-Control-Allow-Credentials', "true");

  next();
})

app.get('/channels', async (req, res) => {
  let chans = await getChannels();
  res.json(chans);
})

app.get('/members', async (req, res) => {
  let mems = await getMembers();
  res.json(mems);
})

app.get('/channels/:channel/:id', async (req, res) => {
  let messages = await getMessagesById(req.params.channel, req.params.id);
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
  let sql = 'SELECT * FROM channels ORDER BY category_id, position;'
  const result = await databaseRequest<TChannel[]>(sql);
  return result ?? null;
}

async function getMembers() {
  let sql = 'SELECT * FROM users;';
  const result = await databaseRequest<TMember[]>(sql)
  return result ?? null;
}

async function getMessagesById(chan: string, id: string) {
  let sql = 'SELECT messages.* FROM messages JOIN channels ON messages.channelID = channels.id WHERE channels.discordID = ? AND messages.id > ? ORDER BY messages.id LIMIT 100;';
  const result = await databaseRequest<TMessage[]>(sql, [chan, id]);
  return result ?? null;
}

async function serchThroughAllMessages(query: string) {
  let sql = 'SELECT messages.* FROM messages WHERE messages.content LIKE "%" || ? || "%" ESCAPE "\\" LIMIT 100;';
  const result = await databaseRequest<TMessage[]>(sql, [query]);
  return result ?? null;
}