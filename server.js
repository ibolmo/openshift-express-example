#!/bin/env node
const debug = require('debug')('server');
const app = require('./app');
const http = require('http');

// Removed 'SIGPIPE' from the list - bugz 852598.
const signals = [
  'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
  'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM',
];

function normalizePort(val) {
  const parsed = parseInt(val, 10);
  if (isNaN(parsed)) return val;
  if (parsed >= 0) return parsed;
  return false;
}

const ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
const port = normalizePort(process.env.OPENSHIFT_NODEJS_PORT || 3000);

function terminator(signal) {
  if (!signal) {
    debug(`${new Date()}: Node server stopped.`);
  } else {
    debug(`${new Date()}: Received ${signal} - terminating sample app ...`);
    process.exit(1);
  }
}

process.on('exit', () => terminator());
signals.forEach((signal) => process.on(signal, terminator.bind(null, signal)));

const server = http.createServer(app);
app.io.attach(server);

server.listen(port, ipaddress, () => {
  debug(`${new Date()}: Node server started on ${ipaddress}:${port} ...`);
});

server.on('error', (error) => {
  if (error.syscall !== 'listen') throw error;

  const bind = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      debug(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      debug(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => debug(`Server on port: ${server.address().port}`));
