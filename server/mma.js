const axios = require('axios');
const parseString = require('xml2js').parseString;

function getEvents(req, res, next) {
  
  const bookmakerAPI = 'http://lines.bookmaker.eu';
  const ufcEventsAPI = 'http://ufc-data-api.ufc.com/api/v3/iphone/events'
  const ufcFightersAPI = 'http://ufc-data-api.ufc.com/api/v3/iphone/fighters';

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
      
      //if the lines aren't up yet
      if (!result.Data.$$[0].$$.find( x => x.$.IdLeague === '206')) {
        res.send('failed');
        return;
      }

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
          var hasNick = data.filter(x => x.nickname);
          for (var i = 0; i < parsedData.length; i++) {
            for (var j = 0; j < parsedData[i]['fights'].length; j++) {
              visitor = parsedData[i]['fights'][j]['visitor'].toLowerCase().replace(/\"/g, "");
              visitorFirst = visitor.substr(0, visitor.indexOf(' '));
              visitorLast = visitor.substr(visitor.indexOf(' ')+1);
              visitorLast = visitorLast.substr(visitorLast.indexOf(' ')+1);
              home = parsedData[i]['fights'][j]['home'].toLowerCase().replace(/\"/g, "");
              homeFirst = home.substr(0, home.indexOf(' '));
              //seperate out the actual last name in case it's bad formatting on either side of bookmamker or UFC API
              homeLast = home.substr(home.indexOf(' ')+1);
              homeLast = homeLast.substr(homeLast.indexOf(' ')+1);
              //backup in case naming convention is messed up from booksports.eu
              //find by last name && first name
              parsedData[i]['fights'][j]['homeInfo'] = data.find( x => x.last_name.toLowerCase().includes(homeLast) && x.first_name.toLowerCase().includes(homeFirst));
              if (!parsedData[i]['fights'][j]['homeInfo']) {
               //try by nickname 
                parsedData[i]['fights'][j]['homeInfo'] = hasNick.find( x => x.nickname.toLowerCase().includes(homeFirst))
                //try by last name
                if (!parsedData[i]['fights'][j]['homeInfo']) {
                  parsedData[i]['fights'][j]['homeInfo'] = data.find( x => x.last_name.toLowerCase().includes(homeLast))
                }
              }
              parsedData[i]['fights'][j]['visitorInfo'] = data.find( x => x.last_name.toLowerCase().includes(visitorLast) && x.first_name.toLowerCase().includes(visitorFirst));
              if (!parsedData[i]['fights'][j]['visitorInfo']) {
                parsedData[i]['fights'][j]['visitorInfo'] = data.find( x => x.last_name.toLowerCase().includes(visitorFirst))
                if (!parsedData[i]['fights'][j]['visitorInfo']) {
                  parsedData[i]['fights'][j]['visitorInfo'] = data.find( x => x.last_name.toLowerCase().includes(visitorLast))
                }
              }
            }
          }
        })
        .then(() => {
          axios.get(ufcEventsAPI).then( response => response.data )
          .then((data) => {
            console.log(parsedData, "parsedData")
            for (var i = 0; i < parsedData.length; i++) {
              var fightName = parsedData[i]['banner'][1]['$']['vtm'];
              console.log(fightName, "fightName")
              var lastFighterName = fightName.split(' ').pop()
              console.log(lastFighterName)

              // console.log(fightName.substring(0, fightName.indexOf(':')) , "fightName")
              if (fightName.includes('UFC Fight Night')) {
                parsedData[i]['eventInfo'] = data.find( x => x.base_title.includes('UFC Fight Night') && x.title_tag_line.includes(lastFighterName))
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
  getEvents
};
