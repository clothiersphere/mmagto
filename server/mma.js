const axios = require('axios');
const parseString = require('xml2js').parseString;

function getOdds(req, res, next) {

const url = 'http://lines.bookmaker.eu';

axios.get(url).then(
  response => parseString(response.data, function (err, result) {
      
      // console.log(result.Data.Leagues[0].league.find( x => x.$.IdLeague === '206'))
      res.send(result.Data.Leagues[0].league.find( x => x.$.IdLeague === '206'));
      next();
    })
  )
    
  // .then((data) => {
  //   res.send(data);
  //   next();
  .catch((error) => {
    console.log('ERROR', error);
  })
}

module.exports = {
  getOdds
};