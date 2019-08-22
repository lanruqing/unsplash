require('es6-promise').polyfill();
require('isomorphic-fetch');
const Unsplash = require('unsplash-js').default;
const fs = require('fs');
const download = require('download');
const unsplashKey = require('./unsplashKey');
const result = [];
const Koa = require('koa')
const router = require('koa-router')()
const app = new Koa()
// console.log(unsplashKey)

const unsplash = new Unsplash({
  applicationId: unsplashKey.access_key,
  secret: unsplashKey.secret_key
});

function getPics(page){
  return new Promise((resolve,rej)=>{
    console.log(page)
    if(!page){
      page = 1
    }
    const urls = [];
    unsplash.photos.listPhotos(page, 15, "latest")
    .then(data => {
      return data.json()
    })
    .then(pics => {
      pics.forEach(p => {
        urls.push(p.urls.regular)
      });
      console.log(urls)
      resolve(urls)
    });
  })
}

router.get('/getPics/:id', async (ctx, next) => {
  console.log(ctx.params)
  let urls = await getPics(ctx.params.id);
  ctx.response.type = 'json';
  ctx.response.body = {data:urls}
})
router.get('', async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('web/index.html');
})

app.use(router.routes())
const main = ctx => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('web/index.html');
};
app.listen(3000, () => {
  // ctx.response.body = fs.createReadStream('./web/index.html');
  console.log('server is running at http://localhost:3000')
})