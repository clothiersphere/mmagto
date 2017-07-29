const axios = require('axios');
const parseString = require('xml2js').parseString;

function getOdds(req, res, next) {
  
  const url = 'http://lines.bookmaker.eu';

  axios.get(url).then(
    response => parseString(response.data, function (err, result) {
      const data = []; 
      data.push(result.Data.Leagues[0].league.find( x => x.$.IdLeague === '206'))
      

      //non UFC feed
      // data.push(result.Data.Leagues[0].league.find( x => x.$.IdLeague === '12639'))
      //parse data
      
      res.send(data)
      next();
    })
  )
  .catch((error) => {
    console.log('ERROR', error);
  })
}

function getEventInfo(req, res, next) {
  const url = 'http://ufc-data-api.ufc.com/api/v1/us/events';
  axios.get(url).then(
    response => response.data
  )
  .then((data) => {
    var event = data.find( x => x.base_title === 'UFC 214')
    console.log(event, "EVENTIMG")
    res.send(event)
  })
  .catch((error) => {
    console.log('ERROR', error);
  })
}

module.exports = {
  getOdds,
  getEventInfo
};



//obj
  //banner [ {}, {} ]
  //game - 12 item []
    // $": {
    // "idgm": "2491575",
    // "gdesc": "",
    // "idgmtyp": "107",
    // "gmdt": "20170729",
    // "idlg": "206",
    // "gmtm": "21:15:00",
    // "idspt": "MU",
    // "vpt": "",
    // "hpt": "",
    // "vnum": "24225",
    // "hnum": "24226",
    // "evtyp": "",
    // "idgp": "2491575",
    // "gpd": "Game",
    // "vtm": "Daniel Cormier",
    // "htm": "Jon Jones",
    // "stats": "false",
    // "propCount": "0",
    // "descgmtyp": "5k USD*"
    // },
  //line: [{
    // $": {
    // "voddst": "205",
    // "hoddst": "-255",
    // "ovt": "-4.5",
    // "ovoddst": "-180",
    // "unt": "4.5",
    // "unoddst": "140",
    // "vsprdt": "",
    // "vsprdoddst": "",
    // "hsprdt": "",
    // "hsprdoddst": "",
    // "vspt": "",
    // "vspoddst": "",
    // "hspt": "",
    // "hspoddst": "",
    // "voddsh": "+205",
    // "hoddsh": "-255",
    // "vsprdh": "",
    // "hsprdh": "",
    // "ovh": "o4&frac12;-180",
    // "unh": "u4&frac12;+140",
    // "vsph": "",
    // "hsph": "",
    // "voddshr": "0",
    // "vsprdhr": "0",
    // "ovhr": "0",
    // "vsphr": "0",
    // "vsproddsnr": "",
    // "hsproddsnr": "",
    // "ovoddsnr": "",
    // "unoddsnr": "",
    // "voddsnr": "",
    // "hoddsnr": "",
    // "vspoddsnr": "",
    // "hspoddsnr": "",
    // "voddsnrh": "",
    // "hoddsnrh": "",
    // "vsprdnrh": "",
    // "hsprdnrh": "",
    // "ovnrh": "",
    // "unnrh": "",
    // "vspnrh": "",
    // "hspnrh": "",
    // "btot": "False",
    // "bsprd": "False",
    // "bml": "False",
    // "haschild": "True",
    // "related": "True",
    // "EmptyGame": "False"
    // }
  // }]
