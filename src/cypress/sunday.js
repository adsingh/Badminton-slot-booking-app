/// <reference types="Cypress" />

const { days, bookSlotsForDayAndAccount } = require('./BookingUtils');
const { accountIds } = require('../authCreds');
const DAY_TO_BOOK = days.Sunday;

describe("sample", () => {
    accountIds.forEach((accountId) => {
        it ("logs in to badminton website", () => {
            bookSlotsForDayAndAccount(DAY_TO_BOOK, accountId);
        });
    });
});