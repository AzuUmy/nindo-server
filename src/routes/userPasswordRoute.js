const { ref, getDownloadURL } = require('firebase/storage');
const {addDoc, collection, getDocs, query, where} = require("firebase/firestore");
const { db, storage } = require('../services/firebaseConfig');
const { validate } = require("../schema/userPasswordSchema");
const Router = require('koa-router');
const router = new Router();  


const constructImageUrl = async (imagePath) => {
    const starsRef = ref(storage, imagePath);
    try {
      return await getDownloadURL(starsRef);
    } catch (error) {
      console.error('Error constructing image URL:', error);
      return null;
    }
  };



router.post('/SavedPassword', async (ctx) => {
    try {
        const {origemName, LoggedUser, OrigemLogin, EncryptedPassword, origemTag } = ctx.request.body;

        const validateResult = validate({
            origemName,
            LoggedUser,
            OrigemLogin,
            EncryptedPassword,
            origemTag
        });

        if(validateResult.error){
            ctx.throw(400, validateResult.error.message);
            return;
        }

        const passwordCollection = collection(db, 'SavedPassword');
        const newPasswordRef = await addDoc(passwordCollection, validateResult.value);
        ctx.body = { id: newPasswordRef.id, ...validateResult.value};
    } catch(error){
        console.log('Error Writing Data: ', error);
        ctx.body = 'Internal Server Error';
    }

});

router.get('/SavedPassword', async(ctx) => {

    const { LoggedUser } = ctx.query;
    try {
        const savedCollection = collection(db, 'SavedPassword');
        const userQuery = LoggedUser ? query(savedCollection, where("LoggedUser", "==", LoggedUser)) : savedCollection;
        const querySnapshot = await getDocs(userQuery);

        const data = [];

        //for(const doc of querySnapshot.docs) {
          //  const itemData = doc.data();
            //const imageUrl = await constructImageUrl(itemData.origemTag);
            //data.push({ id: doc.id,  ...itemData, imageUrl});
        //}

        querySnapshot.forEach((doc) => {
            const itemData = doc.data();
            data.push({ id: doc.id, ...itemData});
        });

        ctx.body = data;
    }catch (error){
        console.log('Error retriving data:', error);
        ctx.status = 500;
        ctx.body = 'Internal Server Error'
    }
});


module.exports = router;