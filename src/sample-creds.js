const password = "password for northwest booking website";

// The necessary emails will be sent to this email id
const primaryEmailId = "email id of person running the app";

// These are the email login details from which you want the email
// PLEASE create a dummy account with gmail (that is not at all connected to your main accounts)
const senderEmailLogin = {
    email: 'someemail@gmail.com',
    password: 'password'
}

const profileNames = [
    'Yeshwanth Nagaraja',
    'Amita V Menon'
]


// Account ids for the badminton booking website
// Add all the ids you need to book for
const accountIds = [
    primaryEmailId /* If primaryEmailId is not same as one being used for badminton website change this */
];

// Add all email addresses you want to notify about the booking
const allEmailIds = [
    primaryEmailId
];

exports.password = password;
exports.accountIds = accountIds;
exports.allEmailIds = allEmailIds;
exports.primaryEmailId = primaryEmailId;
exports.senderEmailLogin = senderEmailLogin;
exports.profileNames = profileNames;
