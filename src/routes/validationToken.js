const Router = require('koa-router');
const admin = require('../secure/files/privateKey.js');

const router = Router();

router.post('/validateToken', async (ctx) => {
    const { token } = ctx.request.body;
    


    if (!token) {
        ctx.throw(400, 'Token is required');
        return;
    }

    try {
        
        const decodedToken = await admin.auth().verifyIdToken(token);
        ctx.body = { valid: true }
        console.log(ctx.body);
    } catch (error) {
        console.error('Error validating token:', error);
        ctx.throw(401, 'Invalid token');
    }
});

module.exports = router;