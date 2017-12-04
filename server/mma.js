const axios = require('axios');
const { parseString } = require('xml2js');
const scraper = require('google-search-scraper');
const DeathByCaptcha = require('deathbycaptcha');
const dbc = new DeathByCaptcha('xchrislee','***REMOVED***')
const ufc = require('ufc');
const sherdog = require('sherdog');
const cheerio = require("cheerio");


function bookmakerEventParser(array) {
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

function findNumberedEvent(data, ufcNumberedEvent) {
  return data.find(x => x.base_title.includes(ufcNumberedEvent));
}

async function getEvents(req, res, next) {
  // const bookmakerAPI = 'http://lines.bookmaker.eu';
  // const ufcEventsAPI = 'http://ufc-data-api.ufc.com/api/v3/iphone/events';
  // const ufcFightersAPI = 'http://ufc-data-api.ufc.com/api/v3/iphone/fighters';
  // const queryBookMaker = await axios.get(bookmakerAPI).then(response => response.data);
  // let parsedBookMakerData = [];
  // parseString(queryBookMaker, { explicitChildren: true, preserveChildrenOrder: true }, (err, result) => {
  //   const data = [];
  //   if (!result.Data.$$[0].$$.find(x => x.$.IdLeague === '206')) {
  //     res.send('failed');
  //     return;
  //   }
  //   data.push(result.Data.$$[0].$$.find(x => x.$.IdLeague === '206'));
  //   const parsedEventData = bookmakerEventParser(data[0].$$);
  //   parsedBookMakerData = parseFighterInfo(parsedEventData);
  // });
  // const ufcFightersApiQuery = await axios.get(ufcFightersAPI).then(response => response.data);
  // const populateHomeVisitorInfo = async (fighterList, parsedData) => {
  //   let visitor; 
  //   let visitorFirst;
  //   let visitorLast;
  //   let home;
  //   let homeFirst;
  //   let homeLast;

  //   const hasNick = fighterList.filter(x => x.nickname);
  //   const searchFighterDB = (first, last, hasNick, fighterList) => {
  //     let fighterData = fighterList.find(x => x.last_name === last && x.first_name === first);
  //     if (!fighterData) {
  //       fighterData = hasNick.find(x => x.nickname === first);
  //       if (!fighterData) {
  //         fighterData = fighterList.find(x => x.last_name === last);
  //         if (!fighterData) {
  //           fighterData = fighterList.find(x => x.last_name === first);
  //         }
  //       }
  //     }
  //     return fighterData;
  //   };
  //   const fighterParse = (name, side) => {
  //     if (side === 'v') {
  //       visitor = name.replace(/\"/g, '');
  //       visitorFirst = visitor.substr(0, visitor.indexOf(' '));
  //       visitorLast = visitor.substr(visitor.indexOf(' ') + 1);
  //       visitorLast = visitorLast.substr(visitorLast.indexOf(' ') + 1);
  //     }
  //     home = name.replace(/"/g, '');
  //     homeFirst = home.substr(0, home.indexOf(' '));
  //     homeLast = home.substr(home.indexOf(' ') + 1);
  //     homeLast = homeLast.substr(homeLast.indexOf(' ') + 1);
  //   };
  //   for (let i = 0; i < parsedData.length; i += 1) {
  //     for (let j = 0; j < parsedData[i].fights.length; j += 1) {
  //       fighterParse(parsedData[i].fights[j].visitor, 'v');
  //       fighterParse(parsedData[i].fights[j].home, 'h');
  //       const homeName = parsedData[i].fights[j].home;
  //       const visitorName = parsedData[i].fights[j].visitor;
  //       parsedData[i].fights[j].homeInfo = searchFighterDB(homeFirst, homeLast, hasNick, ufcFightersApiQuery);
  //       parsedData[i].fights[j].visitorInfo = searchFighterDB(visitorFirst, visitorLast, hasNick, ufcFightersApiQuery);
  //     }
  //   }
  //   return parsedData;
  // };
  // parsedBookMakerData = await populateHomeVisitorInfo(ufcFightersApiQuery, parsedBookMakerData);
  // const ufcEventsApiQuery = await axios.get(ufcEventsAPI).then(response => response.data);
  // function populateEventInfo(parsedData, eventData) {
  //   for (var i = 0; i < parsedData.length; i++) {
  //     var fightName = parsedData[i]['banner'][1]['$']['vtm'].toLowerCase();
  //     if (parsedData[i]['banner'][2]) {
  //       fightName = parsedData[i]['banner'][2]['$']['vtm'].toLowerCase();
  //     }
  //     var venue = parsedData[i]['banner'][1]['$']['htm'].split(' ').shift();
  //     // console.log(venue, "venue")
  //     var eventName = fightName.substring(fightName.indexOf(':') + 2).split(' ');
  //     // console.log(eventName, "eventName")
  //     var vsMarker = eventName.indexOf('vs.');
  //     var firstFighter = eventName[0];
  //     // console.log(firstFighter, "Ff")
  //     var secondFighter = eventName[2];
  //     // console.log(secondFighter, "sf")
  //     const UFN = ('ufc fight night');
  //     const TUF = ('the ultimate fighter');

      
  //     let fightNameSplit = fightName.split(' ');
  //     let fightNumber = fightNameSplit[1].substr(0, 3);
      
      

  //     if (fightName.includes(UFN)) {
  //       var fightNightEvents = eventData.filter( x => x.base_title === "UFC Fight Night");
  //       parsedData[i]['eventInfo'] = fightNightEvents.find( x => x.title_tag_line.toLowerCase().includes(firstFighter) && x.title_tag_line.toLowerCase().includes(secondFighter) && x.arena.toLowerCase().includes(venue));
  //       if (!parsedData[i]['eventInfo']) {
  //         parsedData[i]['eventInfo'] = fightNightEvents.find( x => x.title_tag_line.toLowerCase().includes(firstFighter) && x.title_tag_line.toLowerCase().includes(secondFighter));
  //         if (!parsedData[i]['eventInfo']) {
  //           parsedData[i]['eventInfo'] = fightNightEvents.find( x => x.title_tag_line.toLowerCase().includes(secondFighter) && x.arena.toLowerCase().includes(venue));
  //         }
  //       }
  //     }
  //     if (fightName.includes(TUF)) {
  //       let fightNightEvents = eventData.filter( x => x.base_title === "The Ultimate Fighter Finale");
  //       parsedData[i]['eventInfo'] = fightNightEvents.find( x => x.arena.includes(venue));
  //     }

  //     // var ufcNumberedEvent = fightName.substring(fightName.indexOf('c') + 2, fightName.indexOf(':'));
  //     var ufcNumberedEvent = fightNumber;
  //     if (/^\d+$/.test(ufcNumberedEvent)) {
  //       parsedData[i].eventInfo = findNumberedEvent(eventData, ufcNumberedEvent);
  //     }
  //   }
  //   return parsedData;
  // }
  // parsedBookMakerData = await populateEventInfo(parsedBookMakerData, ufcEventsApiQuery);
  // res.send(parsedBookMakerData);

  let temp = [{"banner":[{"$":{"ab":"True","vtm":"MMA - UFC - Dec 01","htm":""},"#name":"banner"},{"$":{"ab":"False","vtm":"The Ultimate Fighter 26 Finale","htm":"Park Theatre @ Las Vegas, Nevada"},"#name":"banner"}],"fights":[{"date":"20171201","time":"21:15:00","visitor":"Roxanne Modafferi","visitorOdds":"+170","home":"Nicco Montano","homeOdds":"-200","over":"o4&frac12;-130","under":"u4&frac12;+110","homeInfo":{"id":644622,"nickname":null,"wins":4,"statid":3041,"losses":2,"last_name":"Montano","weight_class":"Women_Flyweight","title_holder":false,"draws":0,"first_name":"Nicco","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FNicco-Montano%252FNicco-Montano_644622_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FNicco_Montano%252FMONTANO_NICCO_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FNicco_Montano%252FMONTANO_NICCO_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FNicco_Montano%252FMONTANO_NICCO.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Nicco-Montano"},"visitorInfo":{"id":453509,"nickname":"The Happy Warrior","wins":21,"statid":1430,"losses":14,"last_name":"Modafferi","weight_class":"Women_Flyweight","title_holder":false,"draws":0,"first_name":"Roxanne","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FRoxanne-Modafferi%252FRoxanne-Modafferi_453509_medium_thumbnail.jpg?w640-h320-tc1","belt_thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRoxanne_Modafferi%252FRoxanneModafferi_Headshot.png?w600-h600-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRoxanne_Modafferi%252FMODAFFERI_ROXANNE_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRoxanne_Modafferi%252FMODAFFERI_ROXANNE_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRoxanne_Modafferi%252FMODAFFERI_ROXANNE.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Roxanne-Modafferi"}},{"date":"20171201","time":"18:30:00","visitor":"Ryan Janes","visitorOdds":"+445","home":"Andrew Sanchez","homeOdds":"-585","over":"o2&frac12;-225","under":"u2&frac12;+185","homeInfo":{"id":587578,"nickname":"El Dirte","wins":10,"statid":2789,"losses":3,"last_name":"Sanchez","weight_class":"Middleweight","title_holder":false,"draws":0,"first_name":"Andrew","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fandrew-sanchez%252Fandrew-sanchez_587578_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAndrew_Sanchez%252FSANCHEZ_ANDREW_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAndrew_Sanchez%252FSANCHEZ_ANDREW_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAndrew_Sanchez%252FSANCHEZ_ANDREW.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/andrew-sanchez"},"visitorInfo":{"id":599180,"nickname":null,"wins":9,"statid":2803,"losses":3,"last_name":"Janes","weight_class":"Middleweight","title_holder":false,"draws":0,"first_name":"Ryan","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fryan-janes%252Fryan-janes_599180_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FRyan_Janes%252FJANES_RYAN_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FRyan_Janes%252FJANES_RYAN_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FRyan_Janes%252FJANES_RYAN.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/ryan-janes"}},{"date":"20171201","time":"20:00:00","visitor":"Joe Soto","visitorOdds":"+138","home":"Brett Johns","homeOdds":"-162","over":"o2&frac12;-200","under":"u2&frac12;+160","homeInfo":{"id":610265,"nickname":"The Pikey","wins":14,"statid":2839,"losses":0,"last_name":"Johns","weight_class":"Bantamweight","title_holder":false,"draws":0,"first_name":"Brett","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fbrett-johns%252Fbrett-johns_610265_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FBrett_Johns%252FJOHNS_BRETT_L_new.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FBrett_Johns%252FJOHNS_BRETT_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FBrett_Johns%252FJOHNS_BRETT.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/brett-johns"},"visitorInfo":{"id":497684,"nickname":null,"wins":18,"statid":2309,"losses":5,"last_name":"Soto","weight_class":"Bantamweight","title_holder":false,"draws":0,"first_name":"Joe","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fjoe-soto%252Fjoe-soto_497684_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FJoe_Soto%252FSOTO_JOE_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FJoe_Soto%252FSOTO_JOE_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FJoe_Soto%252FSOTO_JOE.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/joe-soto"}},{"date":"20171201","time":"21:00:00","visitor":"Terrion Ware","visitorOdds":"+210","home":"Sean O'Malley","homeOdds":"-260","over":"o2&frac12;-170","under":"u2&frac12;+145","homeInfo":{"id":634224,"nickname":"Sugar","wins":8,"statid":2917,"losses":0,"last_name":"O'Malley","weight_class":"Bantamweight","title_holder":false,"draws":0,"first_name":"Sean","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FSean-O-Malley%252FSean-O-Malley_634224_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FSean_Omalley%252FO%2527MALLEY_SEAN_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FSean_Omalley%252FO%2527MALLEY_SEAN_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FSean_Omalley%252FO%2527MALLEY_SEAN.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Sean-O-Malley"},"visitorInfo":{"id":632522,"nickname":"Flash","wins":17,"statid":2931,"losses":5,"last_name":"Ware","weight_class":"Bantamweight","title_holder":false,"draws":0,"first_name":"Terrion","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FTerrion-Ware%252FTerrion-Ware_632522_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252Fterrion_ware%252FWARE_TERRION_R.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252Fterrion_ware%252FWARE_TERRION_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252Fterrion_ware%252FWARE_TERRION.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Terrion-Ware"}},{"date":"20171201","time":"20:30:00","visitor":"Eric Spicely","visitorOdds":"+150","home":"Gerald Meerschaert","homeOdds":"-190","over":"o1&frac12;-130","under":"u1&frac12;+110","homeInfo":{"id":612265,"nickname":"GM3","wins":26,"statid":2844,"losses":9,"last_name":"Meerschaert","weight_class":"Middleweight","title_holder":false,"draws":0,"first_name":"Gerald","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fgerald-meerschaert%252Fgerald-meerschaert_612265_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FGerald_Meerschaert%252FMEERSCHAERT_GERALD_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FGerald_Meerschaert%252FMEERSCHAERT_GERALD_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FGerald_Meerschaert%252FMEERSCHAERT_GERALD.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/gerald-meerschaert"},"visitorInfo":{"id":587580,"nickname":"Zebrinha","wins":10,"statid":2782,"losses":3,"last_name":"Spicely","weight_class":"Middleweight","title_holder":false,"draws":0,"first_name":"Eric","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Feric-spicely%252Feric-spicely_587580_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FEric_Sicely%252FSPICELY_ERIC_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FEric_Sicely%252FSPICELY_ERIC_R_212.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FEric_Sicely%252FSPICELY_ERIC.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/eric-spicely"}},{"date":"20171201","time":"20:15:00","visitor":"Melinda Fabian","visitorOdds":"+400","home":"DeAnna Bennett","homeOdds":"-500","over":"o2&frac12;+120","under":"u2&frac12;-145","homeInfo":{"id":644625,"nickname":"Vitamin D","wins":8,"statid":3038,"losses":3,"last_name":"Bennett","weight_class":"Women_Flyweight","title_holder":false,"draws":0,"first_name":"DeAnna","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FDeAnna-Bennett%252FDeAnna-Bennett_644625_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252FDeanna_Bennett%252FBENNETT_DEANNA_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252FDeanna_Bennett%252FBENNETT_DEANNA_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252FDeanna_Bennett%252FBENNETT_DEANNA.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/DeAnna-Bennett"}},{"date":"20171201","time":"18:45:00","visitor":"Christina Marks","visitorOdds":"+285","home":"Montana De La Rosa","homeOdds":"-350","over":"o1&frac12;-170","under":"u1&frac12;+143","visitorInfo":{"id":644623,"nickname":null,"wins":8,"statid":3036,"losses":8,"last_name":"Marks","weight_class":"Women_Flyweight","title_holder":false,"draws":0,"first_name":"Christina","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FChristina-Marks%252FChristina-Marks_644623_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FChristina_Marks%252FMARKS_CHRISTINA_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FChristina_Marks%252FMARKS_CHRISTINA_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FChristina_Marks%252FMARKS_CHRISTINA.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Christina-Marks"}},{"date":"20171201","time":"18:15:00","visitor":"Karine Gevorgyan","visitorOdds":"+346","home":"Rachael Ostovich","homeOdds":"-446","over":"o2&frac12;-115","under":"u2&frac12;-105","homeInfo":{"id":644621,"nickname":null,"wins":3,"statid":3043,"losses":3,"last_name":"Ostovich","weight_class":null,"title_holder":false,"draws":0,"first_name":"Rachael","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FRachael-Ostovich%252FRachael-Ostovich_644621_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRachael_Ostovich%252FOSTOVICH_RACHAEL_R.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRachael_Ostovich%252FOSTOVICH_RACHAEL_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRachael_Ostovich%252FOSTOVICH_RACHAEL.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Rachael-Ostovich"},"visitorInfo":{"id":644626,"nickname":"Princess","wins":3,"statid":3035,"losses":2,"last_name":"Gevorgyan","weight_class":"Women_Flyweight","title_holder":false,"draws":0,"first_name":"Karine","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FKarine-Gevorgyan%252FKarine-Gevorgyan_644626_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FKarine_Gevorgyan%252FGEVORGYAN_KARINE_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FKarine_Gevorgyan%252FGEVORGYAN_KARINE_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FKarine_Gevorgyan%252FGEVORGYAN_KARINE.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Karine-Gevorgyan"}},{"date":"20171201","time":"18:00:00","visitor":"Ariel Beck","visitorOdds":"+158","home":"Shana Dobson","homeOdds":"-198","over":"o2&frac12;-210","under":"u2&frac12;+175","homeInfo":{"id":644632,"nickname":"Danger","wins":2,"statid":3034,"losses":1,"last_name":"Dobson","weight_class":"Women_Flyweight","title_holder":false,"draws":0,"first_name":"Shana","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FShana-Dobson%252FShana-Dobson_644632_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FShana_Dobson%252FDOBSON_SHANA_R.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FShana_Dobson%252FDOBSON_SHANA_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FShana_Dobson%252FDOBSON_SHANA.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Shana-Dobson"},"visitorInfo":{"id":644633,"nickname":null,"wins":4,"statid":3033,"losses":4,"last_name":"Beck","weight_class":"Women_Flyweight","title_holder":false,"draws":0,"first_name":"Ariel","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FAriel-Beck%252FAriel-Beck_644633_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252FAriel_Beck%252FBECK_ARIEL_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252FAriel_Beck%252FBECK_ARIEL_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252FAriel_Beck%252FBECK_ARIEL.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Ariel-Beck"}},{"date":"20171201","time":"17:30:00","visitor":"Gillian Robertson","visitorOdds":"+160","home":"Emily Whitmire","homeOdds":"-200","over":"o2&frac12;-200","under":"u2&frac12;+160","homeInfo":{"id":644634,"nickname":"Spitfire","wins":2,"statid":3032,"losses":1,"last_name":"Whitmire","weight_class":"Women_Flyweight","title_holder":false,"draws":0,"first_name":"Emily","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FEmily-Whitmire%252FEmily-Whitmire_644634_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FEmily_Whitmire%252FWHITMIRE_EMILY_R.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FEmily_Whitmire%252FWHITMIRE_EMILY_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FEmily_Whitmire%252FWHITMIRE_EMILY.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Emily-Whitmire"},"visitorInfo":{"id":644627,"nickname":"The Savage","wins":3,"statid":3031,"losses":2,"last_name":"Robertson","weight_class":null,"title_holder":false,"draws":0,"first_name":"Gillian","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FGillian-Robertson%252FGillian-Robertson_644627_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FGillian_Robertson%252FROBERTSON_GILLIAN_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FGillian_Robertson%252FROBERTSON_GILLIAN_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FGillian_Robertson%252FROBERTSON_GILLIAN.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Gillian-Robertson"}},{"date":"20171201","time":"20:30:00","visitor":"Lauren Murphy","visitorOdds":"+200","home":"Barb Honchak","homeOdds":"-250","over":"o2&frac12;-285","under":"u2&frac12;+235","homeInfo":{"id":644630,"nickname":"The Little Warrior","wins":10,"statid":3040,"losses":3,"last_name":"Honchak","weight_class":"Women_Flyweight","title_holder":false,"draws":0,"first_name":"Barb","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FBarb-Honchak%252FBarb-Honchak_644630_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FBarb_Honchak%252FHONCHAK_BARB_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FBarb_Honchak%252FHONCHAK_BARB_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FBarb_Honchak%252FHONCHAK_BARB.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Barb-Honchak"},"visitorInfo":{"id":492976,"nickname":"Lucky","wins":9,"statid":2293,"losses":3,"last_name":"Murphy","weight_class":"Women_Flyweight","title_holder":false,"draws":0,"first_name":"Lauren","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FLauren-Murphy%252FLauren-Murphy_492976_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FLauren_Murphy%252FMURPHY_LAUREN_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FLauren_Murphy%252FMURPHY_LAUREN_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FLauren_Murphy%252FMURPHY_LAUREN_2017.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Lauren-Murphy"}}],"eventInfo":{"id":635193,"event_date":"2017-12-01T00:00:00Z","secondary_feature_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252FTUF26%252F37716_TUF26FIN_UFCdotCOMSchedule_337x362.jpg?-mw500-mh500-tc1","ticket_image":"","event_time_zone_text":"ETPT","short_description":"","event_dategmt":"2017-12-01T23:00:00Z","end_event_dategmt":"2017-12-02T05:00:00Z","ticketurl":"https://www1.ticketmaster.com/event/2E005350EF004CBA","ticket_seller_name":"Ticketmaster","base_title":"The Ultimate Fighter Finale","title_tag_line":"Montano vs Modafferi","twitter_hashtag":"","ticket_general_sale_date":"2017-10-20T10:00:00Z","statid":849,"feature_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252FTUF26%252F37716_TUF26FIN_UFCdotCOMSchedule_644x362.jpg?-mw500-mh500-tc1","event_time_text":"10PM/7PM","ticket_general_sale_text":"Public On-sale","subtitle":"Live on FS1","event_status":"FINALIZED","isppvevent":false,"corner_audio_available":false,"corner_audio_blue_stream_url":null,"corner_audio_red_stream_url":null,"last_modified":"2017-12-01T12:57:59Z","url_name":"the-ultimate-fighter-finale-dec-1-2017","created":"2017-07-25T11:23:53Z","trailer_url":null,"arena":"Park Theatre","location":"Las Vegas, Nevada","fm_fnt_feed_url":"http://liveapi.fightmetric.com/V1/849/Fnt.json","main_event_fighter1_id":644622,"main_event_fighter2_id":453509,"latitude":36.1699412,"longitude":-115.1398296}},{"banner":[{"$":{"ab":"True","vtm":"MMA - UFC - Dec 02","htm":""},"#name":"banner"},{"$":{"ab":"False","vtm":"UFC 218: Holloway vs. Aldo 2","htm":"Little Caesars Arena @ Detroit, Michigan"},"#name":"banner"}],"fights":[{"date":"20171202","time":"22:15:00","visitor":"Jose Aldo","visitorOdds":"+243","home":"Max Holloway","homeOdds":"-305","over":"o2&frac12;-172","under":"u2&frac12;+133","homeInfo":{"id":235332,"nickname":"Blessed","wins":18,"statid":1936,"losses":3,"last_name":"Holloway","weight_class":"Featherweight","title_holder":true,"draws":0,"first_name":"Max","fighter_status":"Active","rank":"C","pound_for_pound_rank":"4","thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FMax-Holloway%252FMax-Holloway_235332_medium_thumbnail.jpg?w640-h320-tc1","belt_thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FMax_Holloway%252FHOLLOWAY_MAX_BELT-PRINT.png?w600-h600-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMax_Holloway%252FHOLLOWAY_MAX_L_BELT_S.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMax_Holloway%252FHOLLOWAY_MAX_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMax_Holloway%252FHOLLOWAY_MAX_BELT.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Max-Holloway"},"visitorInfo":{"id":911,"nickname":null,"wins":26,"statid":1052,"losses":3,"last_name":"Aldo","weight_class":"Featherweight","title_holder":false,"draws":0,"first_name":"Jose","fighter_status":"Active","rank":"1","pound_for_pound_rank":"14","thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FJose-Aldo%252FJose-Aldo_911_medium_thumbnail.jpg?w640-h320-tc1","belt_thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJose_Aldo%252FALDO_JOSE_L-PRINT_UFC212.png?w600-h600-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJose_Aldo%252FALDO_JOSE_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJose_Aldo%252FALDO_JOSE_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJose_Aldo%252FALDO_JOSE.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Jose-Aldo"}},{"date":"20171202","time":"21:45:00","visitor":"Alistair Overeem","visitorOdds":"+170","home":"Francis Ngannou","homeOdds":"-216","over":"o1&frac12;+111","under":"u1&frac12;-142","homeInfo":{"id":557184,"nickname":"The Predator","wins":10,"statid":2659,"losses":1,"last_name":"Ngannou","weight_class":"Heavyweight","title_holder":false,"draws":0,"first_name":"Francis","fighter_status":"Active","rank":"4","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Ffrancis-ngannou%252Ffrancis-ngannou_557184_medium_thumbnail.jpg?w640-h320-tc1","belt_thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FFrancis_Ngannou%252FNGANNOU_FRANCIS_R-PRINT.png?w600-h600-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FFrancis_Ngannou%252FNGANNOU_FRANCIS_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FFrancis_Ngannou%252FNGANNOU_FRANCIS_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FFrancis_Ngannou%252FNGANNOU_FRANCIS.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/francis-ngannou"},"visitorInfo":{"id":226169,"nickname":"The Demolition Man","wins":43,"statid":808,"losses":15,"last_name":"Overeem","weight_class":"Heavyweight","title_holder":false,"draws":0,"first_name":"Alistair","fighter_status":"Active","rank":"1","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FAlistair-Overeem%252FAlistair-Overeem_226169_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAlistair_Overeem%252FOVEREEM_ALISTAIR_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAlistair_Overeem%252FOVEREEM_ALISTAIR_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAlistair_Overeem%252FOVEREEM_ALISTAIR.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Alistair-Overeem"}},{"date":"20171202","time":"21:15:00","visitor":"Sergio Pettis","visitorOdds":"+220","home":"Henry Cejudo","homeOdds":"-280","over":"o2&frac12;-300","under":"u2&frac12;+240","homeInfo":{"id":490666,"nickname":"The Messenger","wins":11,"statid":2299,"losses":2,"last_name":"Cejudo","weight_class":"Flyweight","title_holder":false,"draws":0,"first_name":"Henry","fighter_status":"Active","rank":"2","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FHenry-Cejudo%252FHenry-Cejudo_490666_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FHenry_Cejudo%252FCEJUDO_HENRY_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FHenry_Cejudo%252FCEJUDO_HENRY_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FHenry_Cejudo%252FCEJUDO_HENRY.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Henry-Cejudo"},"visitorInfo":{"id":458701,"nickname":null,"wins":16,"statid":2118,"losses":2,"last_name":"Pettis","weight_class":"Flyweight","title_holder":false,"draws":0,"first_name":"Sergio","fighter_status":"Active","rank":"4","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FSergio-Pettis%252FSergio-Pettis_458701_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FSergio_Pettis%252FPETTIS_SERGIO_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FSergio_Pettis%252FPETTIS_SERGIO_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FSergio_Pettis%252FPETTIS_SERGIO.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Sergio-Pettis"}},{"date":"20171202","time":"20:45:00","visitor":"Eddie Alvarez","visitorOdds":"+145","home":"Justin Gaethje","homeOdds":"-185","over":"o1&frac12;-166","under":"u1&frac12;+128","homeInfo":{"id":628288,"nickname":"The Highlight","wins":18,"statid":2896,"losses":0,"last_name":"Gaethje","weight_class":"Lightweight","title_holder":false,"draws":0,"first_name":"Justin","fighter_status":"Active","rank":"5","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FJustin-Gaethje%252FJustin-Gaethje_628288_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJustin_Gaethje%252FGAETHJE_JUSTIN_R.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJustin_Gaethje%252FGAETHJE_JUSTIN_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJustin_Gaethje%252FGAETHJE_JUSTIN.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Justin-Gaethje"},"visitorInfo":{"id":498601,"nickname":"The Underground King","wins":28,"statid":890,"losses":5,"last_name":"Alvarez","weight_class":"Lightweight","title_holder":false,"draws":0,"first_name":"Eddie","fighter_status":"Active","rank":"4","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Feddie-alvarez%252Feddie-alvarez_498601_medium_thumbnail.jpg?w640-h320-tc1","belt_thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FEddie_Alvarez%252F205-ALVAREZ_EDDIE_L-PRINT.png?w600-h600-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FEddie_Alvarez%252FALVAREZ_EDDIE_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FEddie_Alvarez%252FALVAREZ_EDDIE_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FEddie_Alvarez%252FALVAREZ_EDDIE.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/eddie-alvarez"}},{"date":"20171202","time":"20:15:00","visitor":"Michelle Waterson","visitorOdds":"+195","home":"Tecia Torres","homeOdds":"-245","over":"o2&frac12;-315","under":"u2&frac12;+245","homeInfo":{"id":501836,"nickname":"The Tiny Tornado","wins":9,"statid":2340,"losses":1,"last_name":"Torres","weight_class":"Women_Strawweight","title_holder":false,"draws":0,"first_name":"Tecia","fighter_status":"Active","rank":"5","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FTecia-Torres%252FTecia-Torres_501836_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FTecia_Torres%252FTORRES_TECIA_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FTecia_Torres%252FTORRES_TECIA_L2.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FTecia_Torres%252FTORRES_TECIA.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Tecia-Torres"},"visitorInfo":{"id":530951,"nickname":"The Karate Hottie","wins":14,"statid":1347,"losses":5,"last_name":"Waterson","weight_class":"Women_Strawweight","title_holder":false,"draws":0,"first_name":"Michelle","fighter_status":"Active","rank":"6","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fmichelle-waterson%252Fmichelle-waterson_530951_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FMichelle_Waterson%252FMICHELLE_WATERSON_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FMichelle_Waterson%252FWATERSON_MICHELLE_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FMichelle_Waterson%252FWATERSON_MICHELLE.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/michelle-waterson"}},{"date":"20171202","time":"19:45:00","visitor":"Charles Oliveira","visitorOdds":"-135","home":"Paul Felder","homeOdds":"+110","over":"o1&frac12;-135","under":"u1&frac12;+105","homeInfo":{"id":499765,"nickname":"The Irish Dragon","wins":14,"statid":2316,"losses":3,"last_name":"Felder","weight_class":"Lightweight","title_holder":false,"draws":0,"first_name":"Paul","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fpaul-felder%252Fpaul-felder_499765_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FPaul_Felder%252FFELDER_PAUL_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FPaul_Felder%252FFELDER_PAUL_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FPaul_Felder%252FFELDER_PAUL.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/paul-felder"},"visitorInfo":{"id":1168,"nickname":"Do Bronx","wins":22,"statid":1531,"losses":7,"last_name":"Oliveira","weight_class":"Lightweight","title_holder":false,"draws":0,"first_name":"Charles","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FCharles-Oliveira%252FCharles-Oliveira_1168_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FCharles_Oliveira%252FOLIVEIRA_CHARLES_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FCharles_Oliveira%252FOLIVIERA_CHARLES_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCharles_Oliveira%252FOLIVEIRA_CHARLES.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Charles-Oliveira"}},{"date":"20171202","time":"19:15:00","visitor":"Yancy Medeiros","visitorOdds":"+200","home":"Alex Oliveira","homeOdds":"-250","over":"o1&frac12;-180","under":"u1&frac12;+140","homeInfo":{"id":524184,"nickname":"Cowboy","wins":17,"statid":2469,"losses":3,"last_name":"Oliveira","weight_class":"Welterweight","title_holder":false,"draws":1,"first_name":"Alex","fighter_status":"Active","rank":"15","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Falex-oliveira%252Falex-oliveira_524184_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FAlex_Oliveira%252FOLIVEIRA_ALEX_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAlex_Oliveira%252FOLIVIERA_ALEX_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FAlex_Oliveira%252FOLIVEIRA_ALEX.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/alex-oliveira"},"visitorInfo":{"id":242506,"nickname":null,"wins":14,"statid":1481,"losses":4,"last_name":"Medeiros","weight_class":"Lightweight","title_holder":false,"draws":0,"first_name":"Yancy","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FYancy-Medeiros%252FYancy-Medeiros_242506_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FYancy_Medeiros%252FMEDEIROS_YANCY_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FYancy_Medeiros%252FMEDEIROS_YANCY_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FYancy_Medeiros%252FMEDEIROS_YANCY.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Yancy-Medeiros"}},{"date":"20171202","time":"18:45:00","visitor":"Drakkar Klose","visitorOdds":"+160","home":"David Teymur","homeOdds":"-203","over":"o2&frac12;-200","under":"u2&frac12;+160","homeInfo":{"id":574489,"nickname":null,"wins":6,"statid":2734,"losses":1,"last_name":"Teymur","weight_class":"Lightweight","title_holder":false,"draws":0,"first_name":"David","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FDavid-Teymur%252FDavid-Teymur_574489_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FDavid_Teymur%252FTEYMUR_DAVID_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FDavid_Teymur%252FTEYMUR_DAVID_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FDavid_Teymur%252FTEYMUR_DAVID.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/David-Teymur"},"visitorInfo":{"id":616449,"nickname":null,"wins":8,"statid":2854,"losses":0,"last_name":"Klose","weight_class":"Lightweight","title_holder":false,"draws":1,"first_name":"Drakkar","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fdrakkar-klose%252Fdrakkar-klose_616449_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FDrakkar_Klose%252FKLOSE_DRAKKAR_R.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FDrakkar_Klose%252FKLOSE_DRAKKAR_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FDrakkar_Klose%252FKLOSE_DRAKKAR.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/drakkar-klose"}},{"date":"20171202","time":"18:15:00","visitor":"Cortney Casey","visitorOdds":"+105","home":"Felice Herrig","homeOdds":"-135","over":"o2&frac12;-235","under":"u2&frac12;+185","homeInfo":{"id":501702,"nickname":"Lil Bulldog","wins":13,"statid":2343,"losses":6,"last_name":"Herrig","weight_class":"Women_Strawweight","title_holder":false,"draws":0,"first_name":"Felice","fighter_status":"Active","rank":"9","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FFelice-Herrig%252FFelice-Herrig_501702_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FFelice_Herrig%252FHERRIG_FELICE_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FFelice_Herrig%252FHERRIG_FELICE_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FFelice_Herrig%252FHERRIG_FELICE.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Felice-Herrig"},"visitorInfo":{"id":538698,"nickname":"Cast Iron","wins":7,"statid":2603,"losses":4,"last_name":"Casey","weight_class":"Women_Strawweight","title_holder":false,"draws":0,"first_name":"Cortney","fighter_status":"Active","rank":"11","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fcortney-casey%252Fcortney-casey_538698_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FCortney_Casey_Sanchez%252FCASEY-SANCHEZ_CORTNEY_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCortney_Casey_Sanchez%252FCASEY_CORTNEY_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCortney_Casey_Sanchez%252FCASEY_CORTNEY.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/cortney-casey"}},{"date":"20171202","time":"17:45:00","visitor":"Abdul Razak Alhassan","visitorOdds":"-250","home":"Sabah Homasi","homeOdds":"+200","over":"o1&frac12;-110","under":"u1&frac12;-120","homeInfo":{"id":530247,"nickname":"The Problem","wins":11,"statid":1462,"losses":6,"last_name":"Homasi","weight_class":"Welterweight","title_holder":false,"draws":0,"first_name":"Sabah","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fsabah-homasi%252Fsabah-homasi_530247_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FSabah_Homasi%252FHOMASI_SABAH_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FHomasi_Sabah%252FHOMASI_SABAH_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FSabah_Homasi%252FHOMASI_SABAH.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/sabah-homasi"}},{"date":"20171202","time":"17:15:00","visitor":"Jeremy Kimball","visitorOdds":"+400","home":"Dominick Reyes","homeOdds":"-500","over":"o1&frac12;-115","under":"u1&frac12;-115","homeInfo":{"id":631694,"nickname":"The Devastator","wins":7,"statid":2907,"losses":0,"last_name":"Reyes","weight_class":"Light_Heavyweight","title_holder":false,"draws":0,"first_name":"Dominick","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FDominick-Reyes%252FDominick-Reyes_631694_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FDominick_Reyes%252FREYES_DOMINICK_R.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FDominick_Reyes%252FREYES_DOMINICK_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FDominick_Reyes%252FREYES_DOMINICK.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Dominick-Reyes"},"visitorInfo":{"id":618953,"nickname":"Grizzly","wins":15,"statid":2860,"losses":6,"last_name":"Kimball","weight_class":"Light_Heavyweight","title_holder":false,"draws":0,"first_name":"Jeremy","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FJeremy-Kimball%252FJeremy-Kimball_618953_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJeremy_Kimball%252FKIMBALL_JEREMY_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FJeremy_Kimball%252FKIMBALL_JEREMY_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FJeremy_Kimball%252FKIMBALL_JEREMY.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Jeremy-Kimball"}},{"date":"20171202","time":"16:45:00","visitor":"Allen Crowder","visitorOdds":"+175","home":"Justin Willis","homeOdds":"-230","over":"o1&frac12;-155","under":"u1&frac12;+125","homeInfo":{"id":620099,"nickname":"Big Pretty","wins":5,"statid":2867,"losses":1,"last_name":"Willis","weight_class":"Heavyweight","title_holder":false,"draws":0,"first_name":"Justin","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FJustin-Willis%252FJustin-Willis_620099_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJustin_Willis%252FWILLIS_JUSTIN_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJustin_Willis%252FWILLIS_JUSTIN_R_NEW.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJustin_Willis%252FWILLIS_JUSTIN.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Justin-Willis"},"visitorInfo":{"id":636460,"nickname":"Pretty Boy","wins":9,"statid":2998,"losses":2,"last_name":"Crowder","weight_class":"Heavyweight","title_holder":false,"draws":0,"first_name":"Allen","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FAllen-Crowder%252FAllen-Crowder_636460_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FAllen_Crowder%252FCROWDER_ALLEN_R.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FAllen_Crowder%252FCROWDER_ALLEN_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FAllen_Crowder%252FCROWDER_ALLEN.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Allen-Crowder"}},{"date":"20171202","time":"16:15:00","visitor":"Angela Magana","visitorOdds":"+400","home":"Amanda Cooper","homeOdds":"-500","over":"o2&frac12;-155","under":"u2&frac12;+125","homeInfo":{"id":587577,"nickname":"ABC","wins":3,"statid":2792,"losses":3,"last_name":"Cooper","weight_class":"Women_Strawweight","title_holder":false,"draws":0,"first_name":"Amanda","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Famanda-cooper%252Famanda-cooper_587577_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAmanda_Cooper%252FCOOPER_AMANDA_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAmanda_Cooper%252FCOOPER_AMANDA_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAmanda_Cooper%252FCOOPER_AMANDA.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/amanda-cooper"},"visitorInfo":{"id":501824,"nickname":"Your Majesty","wins":11,"statid":2348,"losses":8,"last_name":"Magana","weight_class":"Women_Strawweight","title_holder":false,"draws":0,"first_name":"Angela","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FAngela-Magana%252FAngela-Magana_501824_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAngela_Magana%252FMAGANA_ANGELA_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAngela_Magana%252FMAGANA_ANGELA_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FAngela_Magana%252FMAGANA_ANGELA.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Angela-Magana"}}],"eventInfo":{"id":635181,"event_date":"2017-12-02T00:00:00Z","secondary_feature_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Features%252F019907_WEB_EventPlaceholderRebrand_PPV.jpg?-mw500-mh500-tc1","ticket_image":"","event_time_zone_text":"ETPT","short_description":"","event_dategmt":"2017-12-02T23:00:00Z","end_event_dategmt":"2017-12-03T05:00:00Z","ticketurl":"https://www1.ticketmaster.com/ufc-218-detroit-michigan-12-02-2017/event/0800534939BA740F?artistid=806762&majorcatid=10004&minorcatid=830","ticket_seller_name":"Ticketmaster","base_title":"UFC 218","title_tag_line":"Holloway vs Aldo 2","twitter_hashtag":"","ticket_general_sale_date":"2017-10-13T10:00:00Z","statid":850,"feature_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Features%252F019907_WEB_EventPlaceholderRebrand_PPV.jpg?-mw500-mh500-tc1","event_time_text":"10PM/7PM","ticket_general_sale_text":"Public On-sale","subtitle":"Live on Pay-Per-View","event_status":"FINALIZED","isppvevent":true,"corner_audio_available":false,"corner_audio_blue_stream_url":null,"corner_audio_red_stream_url":null,"last_modified":"2017-12-01T14:38:52Z","url_name":"UFC-218","created":"2017-07-25T09:38:34Z","trailer_url":"http://pdvid.ufc.tv/2017/11/13/UFC218_PRO2_30_V1_EN_1202_PPVnew.mp4","arena":"Little Caesars Arena","location":"Detroit, Michigan","fm_fnt_feed_url":"http://liveapi.fightmetric.com/V1/850/Fnt.json","main_event_fighter1_id":235332,"main_event_fighter2_id":911,"latitude":42.331427,"longitude":-83.0457538}},{"banner":[{"$":{"ab":"True","vtm":"MMA - UFC - Dec 30","htm":""},"#name":"banner"},{"$":{"ab":"False","vtm":"UFC 219","htm":"T-Mobile Arena @ Las Vegas, Nevada"},"#name":"banner"}],"fights":[{"date":"20171230","time":"23:00:00","visitor":"Holly Holm","visitorOdds":"+262","home":"Cris Cyborg","homeOdds":"-333","over":"","under":"","homeInfo":{"id":241895,"nickname":null,"wins":18,"statid":1194,"losses":1,"last_name":"Cyborg","weight_class":"Women_Featherweight","title_holder":true,"draws":0,"first_name":"Cris","fighter_status":"Active","rank":"C","pound_for_pound_rank":"10","thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FCris-Cyborg%252FCris-Cyborg_241895_medium_thumbnail.jpg?w640-h320-tc1","belt_thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCris_Cyborg%252FCYBORG_CRIS_L-CHAMP-PRINT.png?w600-h600-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCris_Cyborg%252FCYBORG_CRIS_L-CHAMP.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCris_Cyborg%252FCYBORG_CRIS_L-CHAMP.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCris_Cyborg%252FCYBORG_CRIS.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Cris-Cyborg"},"visitorInfo":{"id":500044,"nickname":"The Preacher's Daughter","wins":11,"statid":2317,"losses":3,"last_name":"Holm","weight_class":"Women_Bantamweight","title_holder":false,"draws":0,"first_name":"Holly","fighter_status":"Active","rank":"2","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fholly-holm%252Fholly-holm_500044_medium_thumbnail.jpg?w640-h320-tc1","belt_thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FHolly_Holm%252FHOLM_HOLLY_L-PRINT.png?w600-h600-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FHolly_Holm%252FHOLM_HOLLY_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FHolly_Holm%252FHOLM_HOLLY_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FHolly_Holm%252FHOLM_HOLLY.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/holly-holm"}}],"eventInfo":{"id":635182,"event_date":"2017-12-30T00:00:00Z","secondary_feature_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffeatures%252F019907_WEB_EventPlaceholderRebrand_PPV.jpg?-mw500-mh500-tc1","ticket_image":"","event_time_zone_text":"ETPT","short_description":"","event_dategmt":"2017-12-30T23:00:00Z","end_event_dategmt":"2017-12-31T05:00:00Z","ticketurl":"https://www.axs.com/events/346095/ufc-219-tickets","ticket_seller_name":"AXS","base_title":"UFC 219","title_tag_line":"Cyborg vs Holm","twitter_hashtag":"","ticket_general_sale_date":"2017-12-01T10:00:00Z","statid":null,"feature_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffeatures%252F019907_WEB_EventPlaceholderRebrand_PPV.jpg?-mw500-mh500-tc1","event_time_text":"10PM/7PM","ticket_general_sale_text":"Public On-sale","subtitle":"Live on Pay-Per-View","event_status":"FINALIZED","isppvevent":true,"corner_audio_available":false,"corner_audio_blue_stream_url":null,"corner_audio_red_stream_url":null,"last_modified":"2017-12-01T09:26:08Z","url_name":"UFC-219","created":"2017-07-25T09:40:07Z","trailer_url":null,"arena":"T-Mobile Arena","location":"Las Vegas, Nevada","fm_fnt_feed_url":"http://liveapi.fightmetric.com/V1/-1/Fnt.json","main_event_fighter1_id":241895,"main_event_fighter2_id":500044,"latitude":36.1699412,"longitude":-115.1398296}}]
  res.send(temp)
  next();
}

async function getFighterStats(req, res, next) {
  const fighter = req.params.id;
  let data;
  async function retrieve(query) {
    let sherdogUrl;
    let ufcUrl;
    let fighter = {
      name: "",
      nickname: "",
      fullname: "",
      record: "",    
      association: "",
      age: "",
      birthday: "",
      hometown: "",
      nationality: "",
      location: "",
      height: "",
      height_cm: "",
      weight: "",
      weight_kg: "",
      weight_class: "",
      college: "",
      degree: "",
      summary: [],
      wins: {
        total: 0,
        knockouts: 0,
        submissions: 0,
        decisions: 0,
        others: 0
      },
      losses: {
        total: 0,
        knockouts: 0,
        submissions: 0,
        decisions: 0,
        others: 0
      },
      strikes: {
        attempted: 0,
        successful: 0,
        standing: 0,
        clinch: 0,
        ground: 0
      },
      takedowns: {
        attempted: 0,
        successful: 0,
        submissions: 0,
        passes: 0,
        sweeps: 0
      },
      fights: []
    };

    const sherDogOpt = {
      query: query + ' site:www.sherdog.com/fighter/',
      solver: dbc,
      limit: 10,
    };

    const ufcOptions = {
      query: query + ' site:www.ufc.com/fighter',
      solver: dbc,
      limit: 10,
    };
    const searchSherdog = () => {
      return new Promise((resolve, reject) => {
        const results = [];
        scraper.search(sherDogOpt, (err, url) => {
          if (err) {
            reject(err);
          } else {
            results.push(url);
            if (results.length === 10) {
              resolve(results);
            }
          }
        });
      });
    };

    const searchUfc = () => {
      return new Promise((resolve, reject) => {
        const results = [];
        scraper.search(ufcOptions, (err, url) => {
          if (err) {
            reject(err);
          } else {
            results.push(url);
            if (results.length === 10) {
              resolve(results);
            }
          }
        });
      });
    };

    const parseSherdog = ($) => {
      $('h1[itemprop="name"]').filter(function() {
        var el = $(this);
        name = el.find('span.fn').text();
        nickname = el.find('span.nickname').text();
        fighter.name = name;
        fighter.nickname = nickname.replace(/['"]+/g, '');
      });
      // Fighter image
      fighter.image_url = $(".profile_image.photo").attr("src"); 
      // Fighter bio
      $('.bio').filter(function() {
        var el = $(this);
        age = el.find('.item.birthday strong').text();
        birthday = el.find('span[itemprop="birthDate"]').text();
        locality = el.find('span[itemprop="addressLocality"]').text();
        nationality = el.find('strong[itemprop="nationality"]').text();
        association = el.find('.item.association span[itemprop="name"]').text();
        height = el.find('.item.height strong').text();
        weight = el.find('.item.weight strong').text();
        weight_class = el.find('.item.wclass strong').text();
        fighter.age = age.slice(5); 
        fighter.birthday = birthday;
        fighter.locality = locality;
        fighter.nationality = nationality;
        fighter.association = association;
        fighter.height = height;
        fighter.weight = weight;
        fighter.weight_class = weight_class;
      }); 
      // Fighter record
      $('.record .count_history').filter(function() {
        var el = $(this);
        var wins = el.find('.left_side .bio_graph').first();
        var winsByKnockout = wins.find('.graph_tag:nth-child(3)');
        var winsBySubmission = wins.find('.graph_tag:nth-child(5)');
        var winsByDecision = wins.find('.graph_tag:nth-child(7)');
        var winsByOther = wins.find('.graph_tag:nth-child(9)');
        var losses = el.find('.left_side .bio_graph.loser');
        var lossesByKnockout = losses.find('.graph_tag:nth-child(3)');
        var lossesBySubmission = losses.find('.graph_tag:nth-child(5)');
        var lossesByDecision = losses.find('.graph_tag:nth-child(7)');
        var lossesByOther = losses.find('.graph_tag:nth-child(9)');
        var noContests = el.find('.right_side .bio_graph');
        var getTotal = function(el) { return parseInt(el.text().split(' ')[0] || 0); }
        var getPercent = function(el) { return el.find('em').text().split('%')[0]; } 
        wins_total = parseInt(wins.find('.card .counter').text());
        losses_total = parseInt(losses.find('.counter').text());
        no_contests_total = parseInt(noContests.find('.counter').text());        
        fighter.wins.total = wins_total;
        fighter.losses.total = losses_total;
        fighter.no_contests = no_contests_total;
        fighter.wins.knockouts = getTotal(winsByKnockout);
        fighter.wins.submissions = getTotal(winsBySubmission);
        fighter.wins.decisions = getTotal(winsByDecision);
        fighter.wins.others = getTotal(winsByOther);
        fighter.losses.knockouts = getTotal(lossesByKnockout);
        fighter.losses.submissions = getTotal(lossesBySubmission);
        fighter.losses.decisions = getTotal(lossesByDecision);
      });
      // Fighter Fight History
      $('.module.fight_history tr:not(.table_head)').each(function() {
        var el = $(this);
        result = el.find('td:nth-child(1) .final_result').text();
        opponent_name = el.find('td:nth-child(2) a').text();
        opponent_url = el.find('td:nth-child(2) a').attr('href');
        event_name = el.find('td:nth-child(3) a').text();
        event_url = el.find('td:nth-child(3) a').attr('href');
        event_date = el.find('td:nth-child(3) .sub_line').text();
        method = el.find('td:nth-child(4)').text().split(/\)(.*)/)[0] + ")";
        referee = el.find('td:nth-child(4) .sub_line').text();
        round = el.find('td:nth-child(5)').text();
        time = el.find('td:nth-child(6)').text();
        //----------------------------------+
        //  JSON object for Fight
        //----------------------------------+
        var fight = {
          name: event_name,
          date: event_date,
          url: event_url,
          result: result,          
          method: method,
          referee: referee,
          round: round,
          time: time,
          opponent: opponent_name
        };

        if (result !== "") {
          fighter.fights.push(fight);
        }
      });
      return fighter;
    };

    const parseUfc = ($) => {
     $('#fighter-details h1').filter(function() {
          var el = $(this);
          name = el.text();
          fighter.name = name;
      });
      // Nickname
      $('td#fighter-nickname').filter(function() {
          var el = $(this);
          nickname = el.text();
          fighter.nickname = nickname;
      });
      // Fullname
      $('head title').filter(function() {
          var el = $(this);
          fullname = el.text().split(' -')[0];
          fighter.fullname = fullname;
      });
      // Hometown
      $('td#fighter-from').filter(function() {
          var el = $(this);
          hometown = el.text().replace(/[\n\t]/g,"");
          fighter.hometown = hometown;
      });
      // Location
      $('td#fighter-lives-in').filter(function() {
          var el = $(this);
          location = el.text().replace(/[\n\t]/g,"");
          fighter.location = location;
      });
      // Age
      $('td#fighter-age').filter(function() {
          var el = $(this);
          age = el.text();
          fighter.age = age;
      });
      // Height
      $('td#fighter-height').filter(function() {
          var el = $(this);
          height = el.text().split(' (')[0];
          height_cm = el.text().split('( ')[1].split(' cm )')[0];
          fighter.height = height;
          fighter.height_cm = height_cm;
      });
      // Weight
      $('td#fighter-weight').filter(function() {
          var el = $(this);
          weight = el.text().split(' lb (')[0];
          weight_kg = el.text().split('( ')[1].split(' kg )')[0];
          fighter.weight = weight;
          fighter.weight_kg = weight_kg;
      });
      // Record
      $('td#fighter-skill-record').filter(function() {
          var el = $(this);
          record = el.text();
          fighter.record = record;
      });
      // College
      $('td#fighter-college').filter(function() {
          var el = $(this);
          college = el.text();
          fighter.college = college;
      });
      
      // Degree
      $('td#fighter-degree').filter(function() {
          var el = $(this);
          degree = el.text();
          fighter.degree = degree;
      });
      // Summary
      $('td#fighter-skill-summary').filter(function() {
          var el = $(this);
          summary = el.text().split(", ");
          fighter.summary = summary;
      });
      // Striking Metrics
      $('#fight-history .overall-stats').first().filter(function() {
          var el = $(this);
          var stAttempted = el.find('.graph').first();
          var stSuccessful = el.find('.graph#types-of-successful-strikes-graph');
          strikes_attempted = parseInt(stAttempted.find('.max-number').text());
          strikes_successful = parseInt(stAttempted.find('#total-takedowns-number').text());
          strikes_standing = parseInt(stSuccessful.find('.text-bar').first().text());
          strikes_clinch = parseInt(stSuccessful.find('.text-bar').first().next().text());
          strikes_ground = parseInt(stSuccessful.find('.text-bar').first().next().next().text());
          fighter.strikes.attempted = strikes_attempted;
          fighter.strikes.successful = strikes_successful;
          fighter.strikes.standing = strikes_standing;
          fighter.strikes.clinch = strikes_clinch;
          fighter.strikes.ground = strikes_ground;
      });
      // Grappling Metrics
      $('#fight-history .overall-stats').first().next().filter(function() {
          var el = $(this);
          var tdAttempted = el.find('.graph').first();
          var tdSuccessful = el.find('.graph#grappling-totals-by-type-graph');
          takedowns_attempted = parseInt(tdAttempted.find('.max-number').text());
          takedowns_successful = parseInt(tdAttempted.find('#total-takedowns-number').text());
          takedowns_submissions = parseInt(tdSuccessful.find('.text-bar').first().text());
          takedowns_passes = parseInt(tdSuccessful.find('.text-bar').first().next().text());
          takedowns_sweeps = parseInt(tdSuccessful.find('.text-bar').first().next().next().text());
          fighter.takedowns.attempted = takedowns_attempted;
          fighter.takedowns.successful = takedowns_successful;
          fighter.takedowns.submissions = takedowns_submissions;
          fighter.takedowns.passes = takedowns_passes;
          fighter.takedowns.sweeps = takedowns_sweeps;
      });

      return fighter;
    };

    const sherdogLinks = await searchSherdog();
    sherdogUrl = sherdogLinks[0];
    const sherdogHtml = await axios.get(sherdogUrl).then(response => response.data);
    const sherdogDom = cheerio.load(sherdogHtml);
    const ufcLinks = await searchUfc();
    ufcUrl = ufcLinks[0];
    const ufcHtml = await axios.get(ufcUrl).then(response => response.data);
    const ufcDom = cheerio.load(ufcHtml);

    fighter = parseSherdog(sherdogDom);
    fighter = parseUfc(ufcDom)

    return fighter;
  }
  data = await retrieve(fighter);
  res.send(data);
  next();
}

module.exports = {
  getEvents,
  getFighterStats,
};

