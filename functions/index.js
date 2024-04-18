import { functions } from 'firebase-functions';
// import { app } from '../server'; // Adjust the path as necessary
//
// exports.app = functions?.https?.onRequest(app);
export const bigben = functions.https.onRequest((req, res) => {
  const hours = (new Date().getHours() % 12) + 1  // London is UTC + 1hr;
  res.status(200).send(`<!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      ${'BONG '.repeat(hours)}
    </body>
  </html>`);
});
