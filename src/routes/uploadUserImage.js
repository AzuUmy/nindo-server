const Router = require('koa-router');
const multer = require('@koa/multer');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { initializeApp, getApp } = require('firebase/app');
const firebaseConfig = require('../services/firebaseConfig');

const upload = multer();
const uploadRouter = new Router();

uploadRouter.post('/uploadImage', upload.single('file'), async (ctx) => {
  let firebaseApp = null;
  try {
    firebaseApp = getApp(); 
  } catch (e) {
    firebaseApp = initializeApp(firebaseConfig);
  }

  
  const storage = getStorage(firebaseApp);
  const file = ctx.file;

  console.log('Received file:', file);

    const storageRef = ref(storage, `UserImages/${Date.now()}_${file.originalname}`);
  
  try {
    await uploadBytes(storageRef, file.buffer);
    const url = await getDownloadURL(storageRef);
    ctx.body = { url };
  } catch (error) {
    console.error('Error uploading image:', error);
    ctx.throw(500, 'Internal Server Error');
  }
});


module.exports = uploadRouter;