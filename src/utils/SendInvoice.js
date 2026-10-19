import RNFS from 'react-native-fs';
import axios from 'axios';
import {generateInvoicePdf} from './GenerateInvoice';

const API_KEY =
  '';
const senderMail = 'burak.buyuktumturk@ogr.sakarya.edu.tr';

export const SendInvoice = async (
  recipientEmail,
  shoppingList,
  totalPrice,
  unitPrice,
  t,
) => {
  try {
    const pdfPath = await generateInvoicePdf(shoppingList, totalPrice, t);
    const pdfBase64 = await RNFS.readFile(pdfPath, 'base64');

    const emailHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Hello,</h2>
          <p>Attached to this email, you can find your invoice in PDF format.</p>
          <p>Have a great day!</p>
          <br />
          <img src="https://www.selftech-tr.com/wp-content/uploads/2022/06/stlogoqqqq.png"
               style="width: 200px; height: 150px;" alt="Company Logo" />
        </body>
      </html>`;

    const emailData = {
      sender: {email: senderMail, name: 'Selfchart Order System'},
      to: [{email: recipientEmail}],
      subject: 'Shopping Invoice',
      htmlContent: emailHtml,
      attachment: [
        {
          content: pdfBase64,
          name: 'invoice.pdf',
        },
      ],
    };

    const response = await axios.post(
      '****',
      emailData,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': API_KEY,
        },
      },
    );

    return true;
  } catch (error) {
    console.error('Email send error:', error?.response?.data || error.message);
    return false;
  }
};
