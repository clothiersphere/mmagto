const axios = require('axios');
const parseString = require('xml2js').parseString;

function getEvents(req, res, next) {
  
  const bookmakerAPI = 'http://lines.bookmaker.eu';
  const ufcEventsAPI = 'http://ufc-data-api.ufc.com/api/v1/us/events';
  const ufcFightersAPI = 'http://ufc-data-api.ufc.com/api/v1/us/fighters';

  axios.get(bookmakerAPI).then(
    response => parseString(response.data, {explicitChildren:true, preserveChildrenOrder:true}, function (err, result) {
      //had to set options: explicitChildren, preserveChildrenOrder to get correct order
      const data = []; 
      data.push(result.Data.$$[0].$$.find( x => x.$.IdLeague === '206'))
      //non UFC feed
      // data.push(result.Data.Leagues[0].league.find( x => x.$.IdLeague === '12639'))
      
      //parse data into seperate arrays
      var parsedData = fightParser(data[0].$$);
      //create new data obj w/ just relevant fight stats
      parsedData = parseFighterInfo(parsedData);

      axios.get(ufcFightersAPI).then( response => response.data )
        .then((data) => {
          for (var i = 0; i < parsedData.length; i++) {
            for (var j = 0; j < parsedData[i]['fights'].length; j++) {              
              var visitor = parsedData[i]['fights'][j]['visitor'];
              var visitorFirst = visitor.substr(0, visitor.indexOf(' '));
              var visitorLast = visitor.substr(visitor.indexOf(' ')+1);
              var home = parsedData[i]['fights'][j]['home'];
              var homeFirst = home.substr(0, home.indexOf(' '));
              var homeLast = home.substr(home.indexOf(' ')+1);
              
              parsedData[i]['fights'][j]['visitorInfo'] = data.find( x => x.last_name === visitorLast && x.first_name === visitorFirst)
              parsedData[i]['fights'][j]['homeInfo'] = data.find( x => x.last_name === homeLast && x.first_name === homeFirst)
            }
          }
        })
        .then(() => {
          axios.get(ufcEventsAPI).then( response => response.data )
          .then((data) => {
            for (var i = 0; i < parsedData.length; i++) {
              var fightName = parsedData[i]['banner'][1]['$']['vtm'];
              
              if (fightName.includes('UFC Fight Night')) {
                parsedData[i]['eventInfo'] = data.find( x => x.base_title.includes('UFC Fight Night') && x.title_tag_line.includes('Struve'))
              }

              if (fightName.includes('UFC 215')) {
                parsedData[i]['eventInfo'] = data.find( x => x.base_title.includes('UFC 215'))
              }
            }
          })
          .then(() => {
            res.send(parsedData);
            next();
          })
          .catch((error) => {
          console.log('ERROR', error);
          })
        })
        .catch((error) => {
          console.log('ERROR', error);
        })
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
  };
  return storage;
}


function parseFighterInfo(array) {  

var result = [];
  for (var i = 0; i < array.length; i++) {  
    result[i] = {
      banner: [],
      fights: []
    };

    result[i]['banner'] = array[i][0]['banner'];

    for (var j = 0; j< array[i][1]['fights'].length; j++) {
      var fights = {
        date: array[i][1]['fights'][j]['$']['gmdt'],
        time: array[i][1]['fights'][j]['$']['gmtm'],
        visitor: array[i][1]['fights'][j]['$']['vtm'],
        visitorOdds: array[i][1]['fights'][j]['$$'][0]['$']['voddsh'],
        home: array[i][1]['fights'][j]['$']['htm'],
        homeOdds: array[i][1]['fights'][j]['$$'][0]['$']['hoddsh'],
      };
      result[i]['fights'].push(fights);
    }
  }
  return result;
}

// {
//   date: gmdt
//   time: gmtm
//   visiting team: array[i][1]['fights'][j]['$']['vtm'],
//   hometeam : array[i][1]['fights'][j]['$']['htm'],
//   voddst: '100',
//   hoddst: '-130',
// }


module.exports = {
  getEvents,
  getEventInfo
};
