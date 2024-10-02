const EventEmitter = require('events');
const logEvents = require('./logevents');

class MyEmitter extends EventEmitter { }

const myEmitter = new MyEmitter();

// Listen for 'log' event
myEmitter.on('log', (message) => {
  logEvents(message);
});

// Emit 'log' event every 2 seconds
setTimeout(() => {
  myEmitter.emit('log', 'New log event emitted');
}, 2000);
