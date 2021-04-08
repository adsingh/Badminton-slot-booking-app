/// <reference types="Cypress" />

const { password, profileNames } = require('../authCreds');

const days = {
    'Monday': 'Monday',
    'Tuesday': 'Tuesday',
    'Wednesday': 'Wednesday',
    'Thursday': 'Thursday',
    'Friday': 'Friday',
    'Saturday': 'Saturday',
    'Sunday': 'Sunday'
}

const daysToBookFor = [
    days.Monday,
    days.Wednesday,
    days.Friday,
    days.Saturday,
    days.Sunday
];

const offsetSubtractorByDay = {
    [days.Sunday]: 7,
    [days.Monday]: 8,
    [days.Tuesday]: 9,
    [days.Wednesday]: 10,
    [days.Thursday]: 11,
    [days.Friday]: 12,
    [days.Saturday]: 13
};

const slotToBookByDay = {
    [days.Monday]: '10:00 PM',
    [days.Wednesday]: '10:00 PM',
    [days.Friday]: '10:00 PM',
    [days.Saturday]: '2:00 PM',
    [days.Sunday]: '2:00 PM',
    [days.Tuesday]: '2:00 PM',
    [days.Thursday]: '2:00 PM'
}

const bookingCommandByDay = {
    [days.Monday]: 'npm run monday',
    [days.Tuesday]: 'npm run tuesday',
    [days.Wednesday]: 'npm run wednesday',
    [days.Thursday]: 'npm run thursday',
    [days.Friday]: 'npm run friday',
    [days.Saturday]: 'npm run saturday',
    [days.Sunday]: 'npm run sunday',
}

function getDefaultSlotOpenObj() {
    return {
        [days.Monday]: false,
        [days.Tuesday]: false,
        [days.Wednesday]: false,
        [days.Thursday]: false,
        [days.Friday]: false,
        [days.Saturday]: false,
        [days.Sunday]: false
    }
}

function getNextDateForDay(day) {
    const today = new Date();
    let dayOffset = (offsetSubtractorByDay[day] - today.getDay()) % 7;

    if (dayOffset === 0) {
        dayOffset = 7;
    }

    today.setDate(today.getDate() + dayOffset);
    return today;
}

function getPathForDay(day) {
    const nextMonday = getNextDateForDay(day);
    return `/calendar.cfm?DATE=${nextMonday.getFullYear()}-${nextMonday.getMonth()+1}-${nextMonday.getDate()}&VIEW=LIST`;
}

function bookSlotsForDayAndAccount(day, accountId) {
    cy.visit("https://northwestbadmintonacademy.sites.zenplanner.com/login.cfm");

    cy.get("#idUsername").type(accountId);
    cy.get("#idPassword").type(`${password}{enter}`);

    profileNames.forEach((profileName) => {
        cy.log(profileName)
        cy.visit(`https://northwestbadmintonacademy.sites.zenplanner.com${getPathForDay(day)}`);

        cy.get('div.clickable').contains(slotToBookByDay[day]).click();

        cy.get('select#familyMembers').select(profileName);

        cy.get('a').contains('Reserve').click();
    });

}

exports.days = days;
exports.daysToBookFor = daysToBookFor;
exports.slotToBookByDay = slotToBookByDay;
exports.bookingCommandByDay = bookingCommandByDay;
exports.getPathForDay = getPathForDay;
exports.bookSlotsForDayAndAccount = bookSlotsForDayAndAccount;
exports.getDefaultSlotOpenObj = getDefaultSlotOpenObj;
