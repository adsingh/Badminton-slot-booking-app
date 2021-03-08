const http = require('http');
const { notifyMe } = require('./src/emailActor');
const { sendHeartbeat, slotBookerTask } = require('./src/slotBooker');

function MAIN() {
    setInterval(sendHeartbeat, 6 * 60 * 60 * 1000);

    setInterval(slotBookerTask, 30000);

    setTimeout(() => {
        notifyMe("BadmintonSlotChecker deployed :)");
    }, 5000);
}

MAIN();

http.createServer((req, res) => {
    res.write('Badminton slot checker is alive!!');
    res.end();
}).listen(8080);
