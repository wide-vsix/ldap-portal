#!/usr/bin/env node

const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {log} = require('./lib');

const index = require('./routes');
const api = require('./routes/api');

const port = process.env.port || 3000;
const app = express();
const server = http.createServer(app);

app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(log.connectLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', api);
app.use('/', index);

server.on('listening', () => {
  const addr = server.address();
  const address = addr.family === 'IPv6' ? `[${addr.address}]` : addr.address;
  log.logger.info(`Listening on ${address}:${addr.port}`);
});

server.on('error', (err) => {
  log.logger.error(err.stack);
  throw err;
});

process.on('unhandledRejection', (err) => {
  log.logger.error(err.stack);
});

server.listen(port);
