import express from 'express';
import { emailsList } from './utills/data-processing.js';
import { sendEmailWithGuestsList, sendManyEmails, sendNewGuestEvent } from './sendGrid/sendgridEmail.js';
import {
  addNewGuest,
  declineGuestData,
  getClientDataMW,
  getClientInfo,
  getGuestData,
  getGuestsList,
  updateGuestData
} from './firebase/collections.js';
import { excelDoc } from './utills/excel-processing.js';

const sendEmails = async (req, res) => {
  const emails = await emailsList(req.params.clientId);
  const tmpId = req.params.templateId ?? 'd-c838acb437d1470abe03792f078689a6';
  await sendManyEmails(req, res, emails, tmpId);
};

const saveNewGuest = async (req, res) => {
  const newGuest = await addNewGuest(req.body, req.params.emailDBName);
  const client = await getClientInfo(req.body.clientId);

  if (!newGuest) {
    res.status(400).json('Guest for this client already exist');
  } else {
    await sendNewGuestEvent(req, res, client, {...req.body, id: newGuest.id});
  }
};

const getClientData = async (req, res) => {
  const client = await getClientInfo(req.params.clientId);

  if (client) {
    res.json(client);
  } else {
    res.status(400).json('Client does not found');
  }
};

const getGuestList = async (req, res) => {
  const client = await getClientInfo(req.params.clientId);

  if (client) {
    const guests = await getGuestsList(client.emailDBName);
    const filePath = await excelDoc(guests, client);
    await sendEmailWithGuestsList(res, client, filePath);
  } else {
    res.status(400).json('Client does not found');
  }
}
export const router = express.Router();
router.get("/", (req, res) => {
  res.send("App is running..");
});
router.get('/client/:clientId', getClientData);
router.get('/guest/:clientId/:guestId', getClientDataMW, getGuestData);
router.post('/guest-invitation', getClientDataMW, saveNewGuest);
router.put('/guest-invitation/:guestId', getClientDataMW, updateGuestData);
router.get('/guest-invitation/decline/:clientId/:guestId', getClientDataMW, declineGuestData);
router.get('/send-multiple-emails/:clientId/:templateId', sendEmails);
router.get('/guest-list/:clientId', getGuestList)
