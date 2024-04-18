import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { httpLogger } from './utills/httpLogger.js';
import { router } from './router.js';
// import serverless from "serverless-http";

export const app = express();
const port = 3001;

// Middleware
dotenv.config();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
if (process.env.NODE_ENV === 'production') {
  app.use(httpLogger);
}

// Route for sending emails
sgMail.setApiKey(process.env.SENDGRID_API_KEY.trim());

app.use(router);

// Start the server
// export const handler = serverless(app);
app.listen(port, () => {
  console.log('server started on port ', port)
})

