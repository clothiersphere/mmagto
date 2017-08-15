const axios = require('axios');
const parseString = require('xml2js').parseString;

function getEvents(req, res, next) {
  
  const url = 'http://lines.bookmaker.eu';

  axios.get(url).then(
    response => parseString(response.data, {explicitChildren:true, preserveChildrenOrder:true}, function (err, result) {
      //had to set options: explicitChildren, preserveChildrenOrder to get correct order
      const data = []; 
      data.push(result.Data.$$[0].$$.find( x => x.$.IdLeague === '206'))
      //non UFC feed
      // data.push(result.Data.Leagues[0].league.find( x => x.$.IdLeague === '12639'))
      //parse data 
      res.send(fightParser(data[0].$$));     
      // res.send(data[0].$$);
      next();
    })
  )
  .catch((error) => {
    console.log('ERROR', error);
  })
}

function getEventInfo(req, res, next) {
  const url = 'http://ufc-data-api.ufc.com/api/v1/us/events';
  axios.get(url).then( response => response.data ) 
  .then((data) => {
    var event = data.find( x => x.title_tag_line.includes('Volkov') )
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

function getEventInfo2(fighterName) {
  const url = 'http://ufc-data-api.ufc.com/api/v1/us/events';
  axios.get(url).then( response => response.data )
  .then((data) => {
    console.log(fighterName, "fighterNamegetevent2")
    var eventInfo = data.find( x => x.title_tag_line.includes(fighterName));
    console.log(eventInfo, "eventInfo")
    console.log("HIHIHI")
    return eventInfo;
  })
  .catch((error) => {
    console.log('ERROR', error);
  })
}

function fightParser(array) {

  var storage = []; 
  var counter = 0;
  var pointer = 0;

  storage[pointer] = [{banner:[]}, {fights:[]}];
  
  for (var i = 0; i < array.length; i++) {
    if (array[i]['#name'] === 'banner' && array[i]['$'].ab === 'True' && i !== 0) {
          pointer++ 
          storage[pointer] = [{banner:[]}, {fights:[]}]
       
    }

    if (array[i]['#name'] === 'banner') {
      storage[pointer][0]['banner'].push(array[i])
    } else {
    storage[pointer][1]['fights'].push(array[i]);
    }
  }
  return storage;
}



module.exports = {
  getEvents,
  getEventInfo
};
