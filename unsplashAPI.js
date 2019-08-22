const fetch = require('node-fetch')
const fs = require('fs');
const download = require('download');
const Koa = require('koa')
const router = require('koa-router')()
const app = new Koa()
const url = "https://api.unsplash.com/photos"
const token = {
  "access_key":"22faab8899c2a1a50ca6ab287e9bc9f18ed95dc8df57a27d2f3dac615ae583e0",
  "secret_key":"862cc7735867b6cd93e714d9a8b7ebdb8c25e104e211c57bd7e58f6347abc6a7"
}



  let result = [],
  picUrls = []
  fetch(`${url}/?client_id=${token.access_key}&per_page=20`).then(function(response) {
    return response.json();
  }).then(function(pics) {
    pics.forEach(p => {
      if(!fs.existsSync(`dist/${p.id}.jpg`)){
        result.push(new Promise((resolve,rej)=>{
          picUrls.push(p.urls.small)
          download(p.urls.small).then(data => {
            fs.writeFileSync(`dist/${p.id}.jpg`, data);
            console.log(`${p.id}.jpg was downloaded`)
            resolve('ok')
          }).catch(err=>{
            rej(err)
          });
        }))
      }else{
        console.log(`${p.id}.jpg is exists`)
      }
    });
    Promise.all(result).then(data=>{
      console.log(picUrls)
      fs.writeFileSync(`pictures.jd`, picUrls);
      console.log('FINISH')
    })
  });