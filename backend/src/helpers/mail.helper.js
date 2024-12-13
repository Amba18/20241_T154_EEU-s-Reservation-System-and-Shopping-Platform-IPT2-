import { getClient } from '../config/mail.config.js';

// Function to send an order receipt email
export const sendEmailReceipt = function (order) {
  const mailClient = getClient(); // Get the configured email client (Gmail)

  const mailOptions = {
    from: 'listerrodriguez8@gmail.com', // Your Gmail address
    to: order.email, // Recipient's email
    subject: `Order ${order.id} is being processed`,
    html: getReceiptHtml(order), // HTML content for the email
  };

  mailClient.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const getReceiptHtml = function (order) {
  return `
  <html>
    <head>
      <style>
      table {
        border-collapse: collapse;
        max-width: 35rem;
        width: 100%;
      }
      th, td {
        text-align: left;
        padding: 8px;
      }
      th {
        border-bottom: 1px solid #dddddd;
      }
      </style>
    </head>
    <body>
      <h1>Order Payment Confirmation</h1>
      <p>Dear ${order.name},</p>
      <p>Thank you for choosing us! Your order has been successfully paid and is now being processed.</p>
      <p><strong>Tracking ID:</strong> ${order.id}</p>
      <p>
          <strong>Order Date:</strong> 
          ${new Date(order.createdAt).toLocaleString('en-PH', {
            timeZone: 'Asia/Manila',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).replace(',', '')}
        </p>
      <h2>Order Details</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
        ${order.items
          .map(
            item =>
              ` 
            <tr>
              <td>${item.food.name}</td>
              <td>₱${item.food.price}</td>
              <td>${item.quantity}</td>    
              <td>₱${item.price.toFixed(2)}</td>
            </tr>
            `
          )
          .join('\n')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3"><strong>Total:</strong></td>
            <td>₱${order.totalPrice}</td>
          </tr>
        </tfoot>
      </table>
    </body>
  </html>
  `;
};

// Function to send a verification code email
export const sendVerificationCodeEmail = function (email, code) {
  const mailClient = getClient(); // Get the configured email client (Gmail)

  const mailOptions = {
    from: 'listerrodriguez8@gmail.com', // Your Gmail address
    to: email, // Recipient's email
    subject: 'Your Verification Code',
    html: getVerificationCodeHtml(code), // HTML content for the email
  };

  mailClient.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Verification email sent: ' + info.response);
    }
  });
};

const getVerificationCodeHtml = function (code) {
  return `
  <html>
    <body>
      <h1>Email Verification</h1>
      <p>Thank you for registering! Please use the verification code below to complete your registration process:</p>
      <h2 style="color: #2d89ef;">${code}</h2>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thank you!</p>
    </body>
  </html>
  `;
};
