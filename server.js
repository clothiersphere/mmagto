const express = require('express');
const mma = require('./server/mma');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/api/getEvents', mma.getEvents)

app.get('/api/getEventImage', mma.getEventInfo)

app.listen(1234, () => {
  console.log('%s listening at %s', app.name, app.url);
});


module.exports = 'api';

