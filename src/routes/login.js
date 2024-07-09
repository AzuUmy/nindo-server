const Router = require('koa-router');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { initializeApp, getApp } = require('firebase/app');
const firebaseConfig = require('../services/firebaseConfig');
const { getDocs, collection, query, where } = require('firebase/firestore');
const {db} = require('../services/firebaseConfig');
const router = Router();

async function initializeFirebase() {
    let firebaseApp;
    try {
      firebaseApp = getApp();
    } catch (e) {
      firebaseApp = initializeApp(firebaseConfig);
    }
    return getAuth(firebaseApp);
  }


  router.get('/checkEmail', async (ctx) => {
    const { email } = ctx.request.query;

    if (!email) {
        ctx.throw(400, 'Email is required');
        return;
    }

    try {
      
        const emailImageCollection = collection(db, 'emailAndImage');
        const q = query(emailImageCollection, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            ctx.throw(404, 'Email not found');
            return;
        }

         const doc = querySnapshot.docs[0];

         const { email: userEmail, userImage } = doc.data();

         ctx.body = { userEmail, userImage };

    } catch (error) {
        console.error('Error checking email:', error);
        ctx.throw(500, 'Internal Server Error');
    }

  });


router.post('/login', async (ctx) => {
    const { email, password } = ctx.request.body;

    if(!email || !password){
        ctx.throw(400, 'Email our password are required');
        return;
    }

    const auth = await initializeFirebase();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();
            ctx.body = { token: idToken};
        } catch (error){
            console.log('Error signing in: ', error);
            ctx.throw(401, 'Invalid Password our Email');
        }
});



module.exports = router;