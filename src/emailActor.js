const nodemailer = require("nodemailer");
const { primaryEmailId, emailsToNotifyAboutBooking, emailsToNotifyAboutSlots, senderEmailLogin } = require('./authCreds');

let transporter = undefined;

const allRecipientsOfBookingEmails = emailsToNotifyAboutBooking.join(",");
const allRecipientsOfSlotOpenEmails = emailsToNotifyAboutSlots.join(",");

async function notifyMe(content) {
    sendEmail(primaryEmailId, content);
}

async function notifyAllAboutBooking(content) {
    sendEmail(allRecipientsOfBookingEmails, content).catch(console.error);
}

async function notifyAllAboutSlotOpen() {
    sendEmail(allRecipientsOfSlotOpenEmails, "Slots have started to open!!").catch(console.error);
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
exports.notifyAllAboutBooking = notifyAllAboutBooking;
exports.notifyAllAboutSlotOpen = notifyAllAboutSlotOpen;