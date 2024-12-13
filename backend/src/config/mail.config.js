import nodemailer from 'nodemailer';

export function getClient() {
  // Create a Nodemailer transporter using Gmail's SMTP details
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'listerrodriguez8@gmail.com',  // Your Gmail address
      pass: 'uucf sxia vzej nutv'         // Use your app-specific password here
    },
  });

  return transporter;
}
