const { ref, getDownloadURL } = require('firebase/storage');
const { addDoc, collection, getDocs } = require('firebase/firestore');
const { validate } = require('../schema/passwordFromSchema');
const { db, storage } = require('../services/firebaseConfig');

const Router = require('koa-router');
const router = new Router();  


const constructImageUrl = async (imagePath) => {
  const starsRef = ref(storage,   `origenImages/${imagePath}`);
  try {
    return await getDownloadURL(starsRef);
  } catch (error) {
    console.error('Error constructing image URL:', error);
    return null;
  }
};

router.post('/Origem', async (ctx) => {
  try {
    const { image, name } = ctx.request.body;

    const validationResult = validate({
      image,
      name,
    });

    if (validationResult.error) {
      ctx.throw(400, validationResult.error.message);
      return;
    }

    const origemCollection = collection(db, 'Origem');
    const newOrigemRef = await addDoc(origemCollection, validationResult.value)
      .catch(error => console.error('Error writing to Firestore:', error));
    ctx.body = { id: newOrigemRef.id, ...validationResult.value };
  } catch (error) {
    console.log('Error Writing Data: ', error);
    ctx.body = 'Internal Server Error';
  }
});

router.get('/Origem', async (ctx) => {
  try {
    const origemCollection = collection(db, 'Origem');
    const querySnapshot = await getDocs(origemCollection);

    const data = [];
    for (const doc of querySnapshot.docs) {
      const itemData = doc.data();
      const imageUrl = await constructImageUrl(itemData.image);
      data.push({ id: doc.id, ...itemData, imageUrl });
    }

    ctx.body = data;
  } catch (error) {
    console.error('Error Retrieving Data:', error);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
});

module.exports = router;