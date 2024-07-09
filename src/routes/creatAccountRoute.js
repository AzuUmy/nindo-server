const { db } = require('../services/firebaseConfig');
const { validate } = require('../schema/creatAccountSchema');
const { addDoc, collection } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { initializeApp, getApp } = require('firebase/app');

const Router = require('koa-router');
const router = new Router();

router.post('/creatAcc', async (ctx) => {
    try {
        const { name, email, birthDate, telNumber, password, userImage } = ctx.request.body;

        const validateResult = validate({
            name,
            email,
            birthDate,
            telNumber,
            password,
            userImage
        });

        if (validateResult.error) {
            ctx.throw(400, validateResult.error.message);
            return;
        }

        let firebaseApp = null;
        try {
            firebaseApp = getApp(); 
        } catch (e) {
            firebaseApp = initializeApp(firebaseConfig);
        }

        const auth = getAuth(firebaseApp);

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created in Firebase Auth:', userCredential.user);

        const idToken = await userCredential.user.getIdToken();
        console.log('Authentication Token:', idToken);

        const accountCollection = collection(db, 'creatAcc');
        const newAccRef = await addDoc(accountCollection, validateResult.value);
        ctx.body = { id: newAccRef.id, ...validateResult.value };

        const emailAndImageColletion = collection(db, 'emailAndImage');
        await addDoc(emailAndImageColletion, { email, userImage });
    } catch (error) {
        console.error('Error writing data:', error);
        ctx.throw(500, 'Internal Server Error');
    }
});

module.exports = router;