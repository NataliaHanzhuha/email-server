import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';
import { deleteExcelFile } from '../utills/excel-processing.js';

export const sendManyEmails = async (req, res, emails, templateId) => {
  const msg = {
    personalizations: emails.map((item) => {
      return {
        to: [{email: item.email}],
        dynamic_template_data: {
          name: item.name
        }
      };
    }),
    from: 'nataliiahanzhuha@gmail.com',
    subject: 'Jonathan Aremu Party',
    template_id: templateId
  };

  console.log(emails, msg);
  res.send('Email sent');
  // sendManyEmailsRequest(res, msg);
};

export const sendNewGuestEvent = async (
  req, res, client, guest, templateId = 'd-9253bfb94c9c4bbcb4d5a36e48c8d789'
) => {
  const msg = {
    subject: `Thanks for accepting ${client.name} party invitation`,
    template_id: templateId,
    from: 'nataliiahanzhuha@gmail.com',
    personalizations: [{
      to: {email: guest.email},
      dynamic_template_data: {
        guest_name: guest.name,
        client_name: client.name,
        weblink_edited: `http://localhost:4200/invitation/${guest?.clientId}/${guest.id}`,
        weblink_reject: `http://localhost:4200/rejection/${guest?.clientId}/${guest.id}`
      }
    }]
  };

  console.log(client, guest, msg);
  await sendSingleEvent(res, msg);
};

const sendSingleEvent = async (res, msg) => {
  sgMail
    .sendMultiple(msg)
    .then(() => {
      console.log('Email sent');
      res.send('Email sent');
    })
    .catch((error) => {
      console.error(JSON.stringify(error));
      res.status(400).json(JSON.stringify(error));
    });
};

const sendManyEmailsRequest = (res, msg) => {
  sgMail
    .sendMultiple(msg)
    .then(() => {
      console.log('Email sent');
      res.send('Email sent');
    })
    .catch((error) => {
      console.error(JSON.stringify(error));
      res.error(JSON.stringify(error));
    });
};

export const sendEmailWithGuestsList = (res, client, link1) => {
  const pathToAttachment = path.resolve(link1);
  const attachment = fs.readFileSync(pathToAttachment).toString('base64');

  const msg = {
    to: client.email,
    from: 'nataliiahanzhuha@gmail.com',
    subject: 'Party guest list',
    text: `Hi, ${client.name}. I attached excel file with list of your party guests bellow.`,
    attachments: [
      {
        content: attachment,
        filename: path.basename(link1),
        type: 'text/html',
        disposition: 'attachment'
      }
    ]
  };

  sgMail.send(msg)
    .then(() => {
      console.log('Email sent');
      res.send('Email sent');
      deleteExcelFile(link1);
    })
    .catch((error) => {
      console.error(JSON.stringify(error));
      res.error(JSON.stringify(error));
    });
};
