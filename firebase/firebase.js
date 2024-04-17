import * as firebase from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import dotenv from 'dotenv';
// import { getStorage } from 'firebase/storage';
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = firebase.initializeApp(firebaseConfig, {
  experimentalForceLongPolling: true, // this line
  useFetchStreams: false, // and this line
});

export default app;


// exports.queryCollection = queryCollection;


// export const storage = getStorage(app);
// export const imageLink = (folder, imageName, token = process.env.IMAGE_TOKEN) =>
//   `https://firebasestorage.googleapis.com/v0/b/dad-birthday-party.appspot.com/o/${folder}%2F${imageName}?alt=media&token=${token}`;
