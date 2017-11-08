const express = require('express');
const mma = require('./server/mma');
const app = express();

const data = require('./tempData.js');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// app.get('/api/getEvents', mma.getEvents)
app.get('/api/getEvents', (req, res) => {
  console.log(data, "TD")
  res.send(data);
});

app.listen(1234, () => {
  console.log('%s listening at %s', app.name, app.url);
});


module.exports = 'api';

