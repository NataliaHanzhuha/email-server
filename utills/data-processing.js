import { queryCollection } from '../firebase/collections.js';

const validateEmail = (email) => {
  return email.match(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/);
};

export const emailsList = async (clientId) => {
  const data = await queryCollection(clientId);
  const emails = [];

  data.forEach((doc) => {
    if (!emails.find(item => item.email === doc.data().email)) {
      if (validateEmail(doc.data().email)) {
        emails.push({email: doc.data().email, name: doc.data()?.name ?? null});
      }
    }
  });

  return [...emails];
}
