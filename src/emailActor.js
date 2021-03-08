const nodemailer = require("nodemailer");
const { primaryEmailId, allEmailIds, senderEmailLogin } = require('./authCreds');

let transporter = undefined;

const allRecipients = allEmailIds.join(",");

async function notifyMe(content) {
    sendEmail(primaryEmailId, content);
}

async function notifyAll(content) {
    sendEmail(allRecipients, content).catch(console.error);
}

async function sendEmail(recipients, content) {
    const transporter = getTransporter();

    await transporter.sendMail({
        from: senderEmailLogin.email, // sender address
        to: recipients, // list of receivers
        subject: `Badminton slots - ${content}`, // Subject line
        text: content, // plain text body
    });
}

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            auth: {
              user: senderEmailLogin.email,
              pass: senderEmailLogin.password
            }
          });
    }
    
    return transporter;
}

exports.notifyMe = notifyMe;
exports.notifyAll = notifyAll;