const { collection, getDocs, query, where } = require("firebase/firestore");
const { db } = require('../services/firebaseConfig');
const Router = require('koa-router');

const router = new Router();

router.get('/userData', async (ctx) => {

    const { email } = ctx.query;

    try {
        const UserCollection = collection(db, 'creatAcc');
        const userQuery = email ? query(UserCollection, where("email", "==", email)) : UserCollection;
        const querySnapshot = await getDocs(userQuery);

        const data = [];

        querySnapshot.forEach((doc) => {
            const itemData = doc.data();
            data.push({ id: doc.id, ...itemData });
        });

        ctx.body = data;
    } catch (error) {
        console.log("error", error);
        ctx.status = 500;
        ctx.body = "Internal Server Error";
    }

});

module.exports = router;