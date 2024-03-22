const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const from = process.env.SENDGRID_FROM_EMAIL;

const sendEmail = (to, subject, url) => {
  const output = `
    <p>We received a request to reset your user password.</p>
    <h4>This message is valid for 10 minutes!</h4>
    <p>Protecting your data is important to us.
    Please go to the url below to set new password. If you didn't request, then ignore this email!</p>
    <p>${url}</p>
    `;
  const msg = {
    to,
    from,
    subject,
    html: output,
  };
  sgMail.send(msg, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('Email was sent!');
    }
  });
};

module.exports = sendEmail;
