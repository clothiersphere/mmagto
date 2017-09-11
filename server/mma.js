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
      let visitor;
      let visitorFirst;
      let visitorLast;
      let home;
      let homeFirst;
      let homeLast;

      data.push(result.Data.$$[0].$$.find( x => x.$.IdLeague === '206'))
      //non UFC feed
      // data.push(result.Data.Leagues[0].league.find( x => x.$.IdLeague === '12639'))
      
      // console.log(data[0]['banner'][1]['$']['vtm'], "data")
      //parse data into seperate arrays
      var parsedData = fightParser(data[0].$$);
      //create new data obj w/ just relevant fight stats
      parsedData = parseFighterInfo(parsedData);

      axios.get(ufcFightersAPI).then( response => response.data )
        .then((data) => {
          for (var i = 0; i < parsedData.length; i++) {
            for (var j = 0; j < parsedData[i]['fights'].length; j++) {              
              visitor = parsedData[i]['fights'][j]['visitor'];
              visitorFirst = visitor.substr(0, visitor.indexOf(' '));
              visitorLast = visitor.substr(visitor.indexOf(' ')+1);
              // console.log(visitor, "visitor")
              // console.log(visitorFirst, "visitorFirst")
              // console.log(visitorLast, "visitorLast")
              home = parsedData[i]['fights'][j]['home'];
              homeFirst = home.substr(0, home.indexOf(' '));
              homeLast = home.substr(home.indexOf(' ')+1);
              // console.log(home, "home")
              // console.log(homeFirst, "homeFirst")
              // console.log(homeLast, "homeLast")

              parsedData[i]['fights'][j]['visitorInfo'] = data.find( x => x.last_name.toLowerCase().includes(visitorLast.toLowerCase()) && x.first_name.toLowerCase() === visitorFirst.toLowerCase())
              parsedData[i]['fights'][j]['homeInfo'] = data.find( x => x.last_name.toLowerCase().includes(homeLast.toLowerCase()) && x.first_name.toLowerCase() === homeFirst.toLowerCase())
            }
          }
        })
        .then(() => {
          axios.get(ufcEventsAPI).then( response => response.data )
          .then((data) => {
            for (var i = 0; i < parsedData.length; i++) {
              var fightName = parsedData[i]['banner'][1]['$']['vtm'];
              // console.log(fightName.substring(0, fightName.indexOf(':')) , "fightName")
              if (fightName.includes('UFC Fight Night')) {
                parsedData[i]['eventInfo'] = data.find( x => x.base_title.includes('UFC Fight Night') && x.title_tag_line.includes(visitorFirst))
              }
              //example - UFC 215: Johnson vs. Borg
              //pulls the # from the UFC event - should spit out 215
              var ufcNumberedEvent = fightName.substring(fightName.indexOf('C')+2, fightName.indexOf(':'))
              //if it is a number - then we know it follows UFC ### conventions and is a main UFC event.
              if (/^\d+$/.test(ufcNumberedEvent)) {
                //find event where base title includes the numbered UFC event eg: UFC 215
                // parsedData[i]['eventInfo'] = data.find( x => x.base_title.includes(fightName.substring(0, indexOf(':'))))
                parsedData[i]['eventInfo'] = data.find( x => x.base_title.includes(ufcNumberedEvent))
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

module.exports = {
  getEvents,
  getEventInfo
};
