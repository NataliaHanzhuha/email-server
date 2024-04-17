import app from './firebase.js';
import { addDoc, collection, doc, getDocs,getDoc, getFirestore, query, updateDoc, where, deleteDoc } from 'firebase/firestore';

const db = getFirestore(app);
// let emailDBName = 'emails-Juliet';

const emailsCollectionRef = (emailDBName) =>
  collection(db, emailDBName);

export const queryCollection = (clientId, emailDBName) => getDocs(
  query(emailsCollectionRef(emailDBName), where('clientId', '==', clientId)));

export const getClientDataMW = async(req, res, next) => {
  const client = await getClientInfo(req.body.clientId ?? req.params?.clientId);
  req.params.emailDBName = client.emailDBName;
  next();
}

export const getGuestsList = async(emailDBName) => {
  const snaps = await getDocs(query(emailsCollectionRef(emailDBName)));
  const arr = [];

  snaps.forEach((item) => {
    arr.push(item.data());
  })

  return arr;

}

export const addNewGuest = async (guest, emailDBName) => {
  const emailExist = await getDocs(
    query(emailsCollectionRef(emailDBName), where('email', '==', guest.email)));

  if (emailExist.docs?.length) {
    const existedRecords = [];
    emailExist.forEach((i) => {
      const item = i.data();
      if (item.clientId === guest.clientId) {
        existedRecords.push({...item, id: i.id})
      }
    })

    if (existedRecords?.length) {
      if (existedRecords.some((item) => item.status === 2)) {
        const docRef = doc(db, emailDBName, existedRecords[0].id);
        await deleteDoc(docRef);
        return await addDoc(emailsCollectionRef(emailDBName), {...guest, status: 0});
      } else {
        return null;
      }
    }
    return null;
  } else {
    return addDoc(emailsCollectionRef(emailDBName), {...guest, status: 0});
  }
};

export const getGuestData = async(req, res) => {
  const docRef = doc(db, req.params.emailDBName, req.params?.guestId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    res.json(docSnap.data());
  }
  else {
    return res.status(400).json({message: 'No found guest with id: ' + req.params?.guestId})
  }
}

export const  updateGuestData = async(req, res) => {
  updateDoc(doc(db, req.params.emailDBName, req.params?.guestId), req.body)
    .then((upd) => res.json({...req.body, id: req.params?.guestId}) )
    .catch((error) => res.status(400).json({message: JSON.stringify(error)}));

};

export const  declineGuestData = async(req, res) => {
  const docRef = doc(db, req.params.emailDBName, req.params?.guestId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const upd = await updateDoc(
      doc(db, req.params.emailDBName, req.params?.guestId),
      {...docSnap.data(), status: 2});
    res.json({...upd});
  } else {
    res.status(400).json({message: 'No found guest with id: ' + req.params?.guestId});
  }
};

export const getClientInfo = async(id) => {
  const docRef = doc(db, "clients", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
}

// enum Status{
//   Created,
//   Edited,
//   Decline
// }
