/// <reference types="Cypress" />

const { days, bookSlotsForDayAndAccount } = require('./BookingUtils');
const { accountIds } = require('../authCreds');
const DAY_TO_BOOK = days.Monday;

describe("sample", () => {
    accountIds.forEach((accountId) => {
        it ("logs in to badminton website", () => {
            bookSlotsForDayAndAccount(DAY_TO_BOOK, accountId);
        });
    });
});