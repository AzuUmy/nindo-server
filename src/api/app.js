const Koa = require('koa');
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const origemRouter = require('../routes/passwordFromRoute');
const saveUserPassword = require('../routes/userPasswordRoute');
const creatAccount = require('../routes/creatAccountRoute');
const uploadUserImage = require('../routes/uploadUserImage');
const login = require('../routes/login');
const validateToken = require('../routes/validationToken');
const getUserData = require('../routes/featchUssserData');


const app = new Koa();

app.use(cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(async (ctx, next) => {
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    ctx.set('Access-Control-Allow-Origin', ctx.get('Origin'));
    ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.set('Access-Control-Max-Age', '86400');
  } else {
    await next();
  }
});


app.use(bodyParser());
app.use(origemRouter.routes());
app.use(saveUserPassword.routes());
app.use(uploadUserImage.routes());
app.use(creatAccount.routes());
app.use(login.routes());
app.use(validateToken.routes());
app.use(getUserData.routes());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});