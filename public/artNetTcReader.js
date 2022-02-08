const dgram = require('dgram');
const { Buffer } = require('buffer');
let server = dgram.createSocket('udp4');
server.bind(6454)

console.log('TOP OF CHILD');


// Clock Variables
let hours = 0;
let mins = 0
let secs = 0;
let frames = 0
let framerate = 30
let running = false

// Output Variables
let consoleAddress = ''
let output = false
let speed = 1

// artTimecode Packet Constants
const opCodeHigh = 0x97
const opCodeLow = 0
const protVerLow = 14
const protVerHigh = 0
const id = new Buffer.from('Art-Net\0')
const opCode = new Buffer.from([opCodeLow, opCodeHigh])
const protVer = new Buffer.from([protVerHigh, protVerLow])
const filler = new Buffer.from([0, 0])
const header = Buffer.concat([id, opCode, protVer, filler])

let outBuffer = Buffer.alloc(19)

const makeRate = (type) => {
    switch (type) {
        case 0:
            return 24

        case 1:
            return 25

        case 2:
            return 29.97

        case 3:
            return 30

        default:
            throw new Error('Invalid rate')
    }
}

const makeTimeBytes = () => {
    return new Buffer.from([frames, secs, mins, hours, makeTypeByte()])
}

const addZero = (num) => {
    if (num < 10) return '0' + num
    return num
}

const checkValidTime = () => {
    // Increment Seconds
    if (frames >= framerate) {
        frames = 0
        secs++
    }

    // Increment Minutes
    if (secs > 59) {
        secs = 0
        mins++
    }

    if (framerate === 29.97) {
        if (frames === 0 || frames === 1) {
            if (mins % 10 === 0) {
                console.log('Devisible by ten');
            } else {
                console.log('Dropped Frames');
                frames = 2;
            }
        }
    }

    // Increment hours
    if (mins > 59) {
        mins = 0
        hours++
        if (hours > 23) hours = 0
    }
}


process.on('message', (msg) => {
    //console.log('Child got a message');

    switch (msg.cmd) {

        case 'consoleAddress':
            //console.log('Console Address In Child');
            if (output) {
                output = false
                consoleAddress = ''
            } else {
                consoleAddress = msg.address
                output = true
            }

            process.send({ cmd: 'output', output })
            break;

        case 'speed':
            //console.log('Speed Change', msg.speed);
            speed = msg.speed
            process.send({ cmd: 'speed', speed })
            break;

        case 'rate':
            //console.log('Rate Change');
            process.send({ cmd: 'rate', rate: setFrameRate(msg.rate) })
            break;

        case 'state':
            //console.log('state Command', msg.state);
            if (msg.state === 'run') {
                startClock()
            } else if (msg.state === 'stop') {
                stopClock()
            }
            process.send({ cmd: 'state', state: msg.state })
            break;

        case 'time':
            handleTime(msg.time)
            break;

        default:
            console.log('ELSE');
            break;
    }
})

server.on('message', (msg, rInfo) => {
    if (msg[9] !== 0x97) return
        //console.log(rInfo);
        //console.log(msg.toString());
    const clock = { time: `${addZero(msg[17])}:${addZero(msg[16])}:${addZero(msg[15])}:${addZero(msg[14])}`, rate: makeRate(msg[18]), from: rInfo.address }
    process.send({ cmd: 'time', clock })
})

server.on('listening', () => {
    console.log('Server Listening');
})