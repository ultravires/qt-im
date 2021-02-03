// Github OAuth
const client_id = 'b42e9d3c9f50c35504cb';
const client_secret = '6332d504f8d50882d450c99290726ae51820a6f5';

const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaLogger = require('koa-logger');

const axios = require('axios');
const cors = require('@koa/cors');
const glob = require('glob');
const { resolve } = require('path');
const fs = require('fs');

const app = new Koa();
const router = new KoaRouter({ prefix: '/api' });

const oauth = async ctx => {
    const requestToken = ctx.request.query.code;

    const tokenResponse = await axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token?' +
            `client_id=${client_id}&` +
            `client_secret=${client_secret}&` +
            `code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    });

    const accessToken = tokenResponse.data.access_token;

    const result = await axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
            accept: 'application/json',
            Authorization: `token ${accessToken}`
        }
    });
    const name = result.data.name;

    ctx.response.redirect(`http://localhost:8080/#/home?name=${name}`);
};

router.get('/oauth/2.0/redirect', oauth)

// register routes
glob.sync(resolve('./api', "**/*.json")).forEach(item => {
    let apiJsonPath = item && item.split('/api')[1];

    // inspect koa-router allowedMethods
    let method = apiJsonPath.endsWith('.get.json')
                    ? 'GET' : apiJsonPath.endsWith('.post.json')
                    ? 'POST' : apiJsonPath.endsWith('.patch.json')
                    ? 'PATCH' : apiJsonPath.endsWith('.put.json')
                    ? 'PUT' : apiJsonPath.endsWith('.delete.json')
                    ? 'DEL' : 'ALL'
    let apiPath = apiJsonPath
                    .replace('.get.json', '')
                    .replace('.post.json', '')
                    .replace('.put.json', '')
                    .replace('.delete.json', '');

    if (method === 'ALL') {
        ctx.body = 'OK'
        return
    }

    router[method.toLowerCase()](apiPath, ctx => {
        try {
            let jsonStr = fs.readFileSync(item).toString();
            ctx.body = {
                data: JSON.parse(jsonStr),
                code: 200,
                msg: 'OK',
                success: true
            }
        } catch(err) {
            ctx.throw('服务器错误', 500);
        }
    });
});

app
    .use(cors({
        origin: ctx => {
            console.log(ctx);
            const whiteList = ['*'];
            let url = ctx.header.referer.substr(0,ctx.header.referer.length - 1);
            if(whiteList.includes(url)){
                return url;
            }
            return "http://localhost:3000"
        },
        maxAge: 3, // https://zhuanlan.zhihu.com/p/86953757
        credentials: true, // is allowed cookie
        allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // set allowed HTTP methods
        allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Access-Control-Allow-Origin'], // set allowed HTTP fields
    }))
    .use(KoaLogger())
    .use(router.routes())
    .use(router.allowedMethods());

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

app.listen(3000);
