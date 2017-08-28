const axios = require('axios');
const parseString = require('xml2js').parseString;

function getEvents(req, res, next) {
  
  const bookmakerAPI = 'http://lines.bookmaker.eu';
  const ufcEventsAPI = 'http://ufc-data-api.ufc.com/api/v1/us/events';

  axios.get(bookmakerAPI).then(
    response => parseString(response.data, {explicitChildren:true, preserveChildrenOrder:true}, function (err, result) {
      //had to set options: explicitChildren, preserveChildrenOrder to get correct order
      const data = []; 
      data.push(result.Data.$$[0].$$.find( x => x.$.IdLeague === '206'))
      //non UFC feed
      // data.push(result.Data.Leagues[0].league.find( x => x.$.IdLeague === '12639'))
      //parse data 
      var parsedData = fightParser(data[0].$$);     
      
      getFighterInfo(parsedData);



      // axios.get(ufcEventsAPI).then( response => response.data )
      //   .then((data) => {
      //     for (var i = 0; i < parsedData.length; i++) {
  
      //       var fighterName = parsedData[i][0]['banner'][1]['$']['vtm'];
      //       fighterName = fighterName.substring(fighterName.indexOf(":") + 2);
      //       fighterName = fighterName.substring(0, fighterName.indexOf(' '));
            
      //       console.log(fighterName, "fightername")
      //       var eventLoc = parsedData[i][0]['banner'][1]['$']['htm'];
      //       eventLoc = eventLoc.substring(0, eventLoc.indexOf("@"));
      //       eventLoc = eventLoc.substring(0, eventLoc.indexOf(' '));
            
      //       console.log(eventLoc, "eventLoc")
      //       console.log( data.find( x => x.title_tag_line.includes(fighterName) && x.arena.includes(eventLoc)) , "TEST TEST")
      //       parsedData[i].push( { eventInfo: data.find( x => x.title_tag_line.includes(fighterName) && x.arena.includes(eventLoc)) } )
      //     }
        

      //     })
      //     .then(() => {
            res.send(parsedData);
            next();
    
        // })
        // .catch((error) => {
        //   console.log('ERROR', error);
        // })
      //api call to ufc/events
      //iterate through parsedData
        //for each index - filter response based on the fighter name and push
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

// function getEventInfo2(array) {
//   eventInfo = data.find( x => x.title_tag_line.includes(fighterName));
// }

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


function getFighterInfo(array) {
  // console.log(array, "ARRAY")
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j< array[i][1]['fights'].length; j++) {
    console.log(array[i][1]['fights'][j]['$']['vtm'], "fights")
    console.log(array[i][1]['fights'][j]['$$'][0]['$']['voddsh'], "$$")
    console.log(array[i][1]['fights'][j]['$$'][0]['$']['hoddsh'], "$$$")
    }
  }
  return array;
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
