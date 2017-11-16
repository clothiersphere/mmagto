const axios = require('axios');
const parseString = require('xml2js').parseString;
const mma = require('mma');

async function getEvents(req, res, next) {
  const bookmakerAPI = 'http://lines.bookmaker.eu';
  const ufcEventsAPI = 'http://ufc-data-api.ufc.com/api/v3/iphone/events';
  const ufcFightersAPI = 'http://ufc-data-api.ufc.com/api/v3/iphone/fighters';

  // const queryBookMaker = await axios.get(bookmakerAPi.then(response => )

  axios.get(bookmakerAPI).then(response => parseString(response.data, { explicitChildren: true, preserveChildrenOrder: true }, (err, result) => {
    // had to set options: explicitChildren, preserveChildrenOrder to get correct order
    const data = [];
    let visitor;
    let visitorFirst;
    let visitorLast;
    let home;
    let homeFirst;
    let homeLast;
    if (!result.Data.$$[0].$$.find(x => x.$.IdLeague === '206')) {
      res.send('failed');
      return;
    }
    data.push(result.Data.$$[0].$$.find(x => x.$.IdLeague === '206'))
    // non UFC feed
    // data.push(result.Data.Leagues[0].league.find( x => x.$.IdLeague === '12639'))
    // console.log(data[0]['banner'][1]['$']['vtm'], "data")
    // parse data into seperate arrays
    var parsedData = fightParser(data[0].$$);
    // console.log(parsedData[0][1]['fights'][0]['$$'], "pasredData")
    // create new data obj w/ just relevant fight stats
    parsedData = parseFighterInfo(parsedData);
    axios.get(ufcFightersAPI).then(response => response.data)
      .then((fighterList) => {
        const hasNick = fighterList.filter(x => x.nickname);
        const searchFighterDB = (first, last) => {
          let fighterData = fighterList.find(x => x.last_name === last && x.first_name === first);
          if (!fighterData) {
            fighterData = hasNick.find(x => x.nickname === first);
            if (!fighterData) {
              fighterData = fighterList.find(x => x.last_name === last);
              if (!fighterData) {
                fighterData = fighterList.find(x => x.last_name === first);
              }
            }
          }
          return fighterData;
        };
        const fighterParse = (name, side) => {
          if (side === 'v') {
            visitor = name.replace(/\"/g, '');
            visitorFirst = visitor.substr(0, visitor.indexOf(' '));
            visitorLast = visitor.substr(visitor.indexOf(' ') + 1);
            visitorLast = visitorLast.substr(visitorLast.indexOf(' ') + 1);
          }
          home = name.replace(/"/g, '');
          homeFirst = home.substr(0, home.indexOf(' '));
          homeLast = home.substr(home.indexOf(' ') + 1);
          homeLast = homeLast.substr(homeLast.indexOf(' ') + 1);
        };
        for (let i = 0; i < parsedData.length; i += 1) {
          for (let j = 0; j < parsedData[i].fights.length; j += 1) {
            fighterParse(parsedData[i].fights[j].visitor, 'v');
            fighterParse(parsedData[i].fights[j].home, 'h');
            parsedData[i].fights[j].homeInfo = searchFighterDB(homeFirst, homeLast, hasNick);
            parsedData[i].fights[j].visitorInfo = searchFighterDB(visitorFirst, visitorLast, hasNick);
            
            if (i === 0 && j === 0) {
              const homeName = parsedData[i].fights[j].home;
              mma.retrieve(homeName).then((data) => {
                console.log(data, "data")
                parsedData[0].fights[0].homeInfo = data;
                
              })
            }
          }
        }
      }).then(() => {
          axios.get(ufcEventsAPI).then(response => response.data)
            .then((data) => {
              for (var i = 0; i < parsedData.length; i++) {
                var fightName = parsedData[i]['banner'][1]['$']['vtm'].toLowerCase();
                if (parsedData[i]['banner'][2]) {
                  fightName = parsedData[i]['banner'][2]['$']['vtm'].toLowerCase();
                }
                var venue = parsedData[i]['banner'][1]['$']['htm'].split(' ').shift();
                // console.log(venue, "venue")
                var eventName = fightName.substring(fightName.indexOf(':') + 2).split(' ');
                // console.log(eventName, "eventName")
                var vsMarker = eventName.indexOf('vs.');
                var firstFighter = eventName[0];
                // console.log(firstFighter, "Ff")
                var secondFighter = eventName[2];
                // console.log(secondFighter, "sf")

                var UFN = ('ufc fight night');

                if (fightName.includes(UFN)) {
                  var fightNightEvents = data.filter( x => x.base_title === "UFC Fight Night");
                  // console.log(fightNightEvents, "FNE")
                  //include both fighter name
                  parsedData[i]['eventInfo'] = fightNightEvents.find( x => x.title_tag_line.toLowerCase().includes(firstFighter) && x.title_tag_line.toLowerCase().includes(secondFighter) && x.arena.toLowerCase().includes(venue));
                  if (!parsedData[i]['eventInfo']) {
                    parsedData[i]['eventInfo'] = fightNightEvents.find( x => x.title_tag_line.toLowerCase().includes(firstFighter) && x.title_tag_line.toLowerCase().includes(secondFighter));
                    if (!parsedData[i]['eventInfo']) {
                      parsedData[i]['eventInfo'] = fightNightEvents.find( x => x.title_tag_line.toLowerCase().includes(secondFighter) && x.arena.toLowerCase().includes(venue));
                    }
                  }
                }
                //example - UFC 215: Johnson vs. Borg
                //pulls the # from the UFC event - should spit out 215
                var ufcNumberedEvent = fightName.substring(fightName.indexOf('c') + 2, fightName.indexOf(':'));
                // console.log(ufcNumberedEvent, "ufcNumberedEvent")
                //if it is a number - then we know it follows UFC ### conventions and is a main UFC event.
                if (/^\d+$/.test(ufcNumberedEvent)) {
                  // console.log(ufcNumberedEvent, "got inside")
                  //find event where base title includes the numbered UFC event eg: UFC 215
                  // parsedData[i]['eventInfo'] = data.find( x => x.base_title.includes(fightName.substring(0, indexOf(':'))))
                  parsedData[i].eventInfo = findNumberedEvent(data, ufcNumberedEvent);
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

function findNumberedEvent(data, ufcNumberedEvent) {
  return data.find(x => x.base_title.includes(ufcNumberedEvent));
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
          over: array[i][1]['fights'][j]['$$'][0]['$']['ovh'],
          under: array[i][1]['fights'][j]['$$'][0]['$']['unh']
        };
        result[i]['fights'].push(fights);
      }
    }
  return result;
}



module.exports = {
  getEvents
};

