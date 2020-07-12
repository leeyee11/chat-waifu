const Koa = require('koa');
const router = require('koa-router');
const app = new Koa();
const serve = require('koa-static');
const proxy = require('koa-proxy');

const APP_PORT = 3000;
const BOT_HOST = 'http://localhost:8080';

app.use(serve('./dist'));

app.use(proxy({
  host: BOT_HOST,
  match: /^\/api\/user\/input$/
}));


// app.use(router.post('/api/user/input'), ctx => {

// })

app.listen(APP_PORT, (err) => console.log(`Chart-Waifu running in localhost:${APP_PORT} . ${err||''}`));