const { getDefaultSlotOpenObj, daysToBookFor } = require('./cypress/BookingUtils');

const defaultState = {
    areSlotsOpenByDay: getDefaultSlotOpenObj(),
    daysRemainingToCheck: new Set(daysToBookFor),
    slotsForAllDaysChecked: false,
    shouldReInit: true
};

let state = {
    ...defaultState
};

function reInitState() {
    if (!state.shouldReInit)
        return;

    state = {
        ...defaultState
    };

    state.shouldReInit = false;
}

exports.state = state;
exports.reInitState = reInitState;