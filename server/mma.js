const axios = require('axios');
const parseString = require('xml2js').parseString;

function getEvents(req, res, next) {
  
  const url = 'http://lines.bookmaker.eu';

  axios.get(url).then(
    response => parseString(response.data, {explicitChildren:true, preserveChildrenOrder:true}, function (err, result) {
      //had to set options: explicitChildren, preserveChildrenOrder to get correct order
      console.log(result.Data.$$[0].$$.find( x => x.$.IdLeague === '206'), "result")
      const data = []; 
      data.push(result.Data.$$[0].$$.find( x => x.$.IdLeague === '206'))
      //non UFC feed
      // data.push(result.Data.Leagues[0].league.find( x => x.$.IdLeague === '12639'))
      //parse data      
      res.send(data[0].$$)
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

function strawberrTest(req, res, next) {
  axios.get(url).then(

  )
}

function fightParser(array) {

  var storage = []; 


  for (var i = 0; i < array.length; i++) {
    var counter = 0;
    if (array[i].#name === 'banner') {
      counter++
    }
    if (counter = 3) {
      //move storage up one index
      var pointer = storage[pointer+1]
      push 
    }

  }
}

module.exports = {
  getEvents,
  getEventInfo
};

//loop through array
//if 
  // 


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
