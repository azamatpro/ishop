const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const from = process.env.SENDGRID_FROM_EMAIL;

exports.sendWelcomeEmail = (to, name) => {
  const output = `
    <p>Dear, ${name}</p>
    <p>Welcome to iShop, your ultimate destination for all things shopping! We're delighted to have you join our ever-growing community of savvy shoppers. 🛍️</p>
    <p>Thank you for choosing iShop as your go-to shopping destination. We're excited to accompany you on your shopping journey and help you discover new treasures along the way.</p>
    <p>Happy shopping!</p>
    <p>Best regards,</p>
    <p>iShop Ecommerce</p>
    <p>${from}</p>
    `;

  const msg = {
    to,
    from,
    subject: 'Welcome to iShop Market!',
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
exports.sendPasswordResetEmail = (to, url) => {
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
    subject: 'Password Reset Token!',
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
