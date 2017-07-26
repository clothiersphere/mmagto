const axios = require('axios');
const parseString = require('xml2js').parseString;

function getOdds(req, res, next) {
  
  const url = 'http://lines.bookmaker.eu';

  axios.get(url).then(
    response => parseString(response.data, function (err, result) {
      res.header('Content-Type', 'text/xml').send(result.Data.Leagues[0].league.find( x => x.$.IdLeague === '206'));
      next();
    })
  )
  .catch((error) => {
    console.log('ERROR', error);
  })
}

module.exports = {
  getOdds
};