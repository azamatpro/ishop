const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Azamat Rasulov <${process.env.EMAIL_FROM}>`;
  }

  createNewTransport() {
    if (process.env.NODE_ENV === 'production') {
      // we will use send grid for prod
      return nodemailer.createTransport({
        service: 'Sendgrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject) {
    // 1) Render html template

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      //   html,
      //   text: htmlToText.convert(html),
    };
    // 3) Create a transport and send email
    await this.createNewTransport().sendMail(mailOptions);
  }

  // send welcome email
  async sendWelcome() {
    await this.send('Welcome to the Ishop Market!');
  }

  // send password reset email
  async sendPasswordReset() {
    await this.send('Your password reset token (valid for 10 minutes)!');
  }
};
