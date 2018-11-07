const express = require('express');
const mma = require('./server/mma');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/getEvents', mma.getEvents);

app.get('/api/getFighterStats/:id', mma.getFighterStats);

app.listen(1234, () => {
  console.log('%s listening at %d', app.name, 1234);
});

module.exports = 'api';
