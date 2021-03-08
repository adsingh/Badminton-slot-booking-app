const https = require('https');
const jsDom = require('jsdom');
const {exec} = require('child_process');
const { performance } = require('perf_hooks');
const {
    bookingCommandByDay,
    daysToBookFor,
    getPathForDay,
    slotToBookByDay
 } = require('./cypress/BookingUtils');
 const { notifyAll, notifyMe } = require('./emailActor');
 const { state, reInitState } = require('./state');

const { JSDOM } = jsDom;
let lastSlotCheckTime = performance.now();

function isItFridayOrSaturday(date) {
    return date.getDay() == 5 || date.getDay() == 6;
}

function bookIfSlotsOpenForDay(day) {
    console.log("checking for day: " + day);
    const path = getPathForDay(day);
    const options = {
        host: 'northwestbadmintonacademy.sites.zenplanner.com',
        path
    };

    const request = https.request(options, function (res) {
        let data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            onSlotCheckRequestEnd(day, data);
        });
    });
    request.on('error', function (e) {
        console.log(e.message);
    });
    request.end();
}

function onSlotCheckRequestEnd(day, data) {
    // console.log("Request ended");
    if (state.areSlotsOpenByDay[day])
        return;

    const dom = new JSDOM(data);

    // Slots not yet open
    if (!dom.window.document.querySelector(".list.calendar tr")) 
        return;

    // console.log("slots open");
    const clickables = dom.window.document.querySelectorAll('div.clickable');

    if (clickables && clickables.length > 0) {
        // console.log("found clickables");

        clickables.forEach(clickable => {
            if (clickable.innerHTML == slotToBookByDay[day]) {
                
                if (clickable.classList.contains('sessionFull')) {
                    notifyAll(`Slots already full for ${day} :(`);
                }
                else {
                    bookSlotsForDay(day);

                    if (daysToBookFor.length == state.daysRemainingToCheck.size) {
                        notifyAll(`Started bookings for next week!! Stay tuned for updates :)`);
                    }
                }

                state.areSlotsOpenByDay[day] = true;
                state.daysRemainingToCheck.delete(day);
                state.slotsForAllDaysChecked = state.daysRemainingToCheck.size == 0;
            }
        });
    }

    // Slots have just started to open, so enqueue another task immediately
    if (!state.areSlotsOpenByDay[day]) {
        setTimeout(slotBookerTask, 8000);
    }

    // console.log("done checking ********");
}

function sendHeartbeat() {
    notifyMe("My heart is beating!");
}

function bookSlotsForDay(day) {
    exec(bookingCommandByDay[day], (error, _stdout, stderr) => {
        if (error) {
            console.error(`*** [${day}] *** booking FAILED!!`);
            notifyAll(`Your booking might have failed for ${day} - Try manually if so!!`);

            return;
        }
        // console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        console.log("**** Ended booking for day: " + day + " *******");
    });
}

function bookSlotsForNextWeek() {
    daysToBookFor.forEach(day => {
        if (state.areSlotsOpenByDay[day])
            return;

        bookIfSlotsOpenForDay(day);
    });
}

function slotBookerTask() {
    const today = new Date();

    if (!isItFridayOrSaturday(today)) {
        state.shouldReInit = true
        return;
    }

    reInitState();

    if (state.slotsForAllDaysChecked)
        return;

    const currentCheckTime = performance.now();
    if (currentCheckTime - lastSlotCheckTime < 10000)
        return;

    lastSlotCheckTime = currentCheckTime;
    bookSlotsForNextWeek();
}

exports.sendHeartbeat = sendHeartbeat;
exports.slotBookerTask = slotBookerTask;