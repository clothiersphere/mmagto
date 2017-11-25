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
  //     var ufcNumberedEvent = fightName.substring(fightName.indexOf('c') + 2, fightName.indexOf(':'));
  //     if (/^\d+$/.test(ufcNumberedEvent)) {
  //       parsedData[i].eventInfo = findNumberedEvent(eventData, ufcNumberedEvent);
  //     }
  //   }
  //   return parsedData;
  // }
  // parsedBookMakerData = await populateEventInfo(parsedBookMakerData, ufcEventsApiQuery);
  // res.send(parsedBookMakerData);
  const temp = [{"banner":[{"$":{"ab":"True","vtm":"MMA - UFC - Nov 25","htm":""},"#name":"banner"},{"$":{"ab":"False","vtm":"UFC Fight Night 122: Bisping vs. Gastelum","htm":"Mercedes-Benz Arena @ Shanghai, China"},"#name":"banner"}],"fights":[{"date":"20171125","time":"05:35:00","visitor":"Michael Bisping","visitorOdds":"+215","home":"Kelvin Gastelum","homeOdds":"-275","over":"o2&frac12;-115","under":"u2&frac12;-115","homeInfo":{"id":307092,"nickname":null,"wins":14,"statid":2070,"losses":3,"last_name":"Gastelum","weight_class":"Middleweight","title_holder":false,"draws":0,"first_name":"Kelvin","fighter_status":"Active","rank":"9","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FKelvin-Gastelum%252FKelvin-Gastelum_307092_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FKelvin_Gastelum%252F205-GASTELUM_KELVIN_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FKelvin_Gastelum%252FGASTELUM_KELVIN_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FKelvin_Gastelum%252FGASTELUM_KELVIN.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Kelvin-Gastelum"},"visitorInfo":{"id":758,"nickname":"The Count","wins":31,"statid":368,"losses":8,"last_name":"Bisping","weight_class":"Middleweight","title_holder":false,"draws":0,"first_name":"Michael","fighter_status":"Active","rank":"2","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FMichael-Bisping%252FMichael-Bisping_758_medium_thumbnail.jpg?w640-h320-tc1","belt_thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252F%252FMichael_Bisping%252FBISPING_MICHAEL_L_BELT-PRINT.png?w600-h600-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMichael_Bisping%252FBISPING_MICHAEL_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FMichael_Bisping%252FBISPING_MICHAEL_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMichael_Bisping%252FBISPING_MICHAEL.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Michael-Bisping"}},{"date":"20171125","time":"05:30:00","visitor":"Zak Ottow","visitorOdds":"+165","home":"Li Jingliang","homeOdds":"-200","over":"o2&frac12;-201","under":"u2&frac12;+156","homeInfo":{"id":469195,"nickname":"The Leech","wins":13,"statid":2206,"losses":4,"last_name":"Jingliang","weight_class":"Welterweight","title_holder":false,"draws":0,"first_name":"Li","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FLi-Jingliang%252FLi-Jingliang_469195_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FLi_Jingliang%252FJINGLIANG_LI_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FLi_Jingliang%252FJINGLIANG_LI_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FLi_Jingliang%252FJINGLIANG_LI.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Li-Jingliang"},"visitorInfo":{"id":607243,"nickname":"The Barbarian","wins":15,"statid":2826,"losses":4,"last_name":"Ottow","weight_class":"Welterweight","title_holder":false,"draws":0,"first_name":"Zak","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fzak-ottow%252Fzak-ottow_607243_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FZak_Ottow%252FOTTOW_ZAK_R.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FZak_Ottow%252FOTTOW_ZAK_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FZak_Ottow%252FOTTOW_ZAK.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/zak-ottow"}},{"date":"20171125","time":"05:15:00","visitor":"Wang Guan","visitorOdds":"+122","home":"Alex Caceres","homeOdds":"-152","over":"o2&frac12;-180","under":"u2&frac12;+140","homeInfo":{"id":109406,"nickname":"Bruce Leeroy","wins":13,"statid":1755,"losses":10,"last_name":"Caceres","weight_class":"Featherweight","title_holder":false,"draws":0,"first_name":"Alex","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FAlex-Caceres%252FAlex-Caceres_109406_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAlex_Caceres%252FCACERES_ALEX_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAlex_Caceres%252FCACERES_ALEX_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FAlex_Caceres%252FCACERES_ALEX.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Alex-Caceres"},"visitorInfo":{"id":643439,"nickname":"The Dongbei Tiger","wins":19,"statid":2888,"losses":1,"last_name":"Guan","weight_class":"Featherweight","title_holder":false,"draws":1,"first_name":"Wang","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FWang-Guan%252FWang-Guan_643439_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FWang_Guan%252FWANG_GUAN_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FWang_Guan%252FWANG_GUAN_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FWang_Guan%252FWANG_GUAN.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Wang-Guan"}},{"date":"20171125","time":"05:00:00","visitor":"Alex Garcia","visitorOdds":"+170","home":"Muslim Salikhov","homeOdds":"-215","over":"o1&frac12;-120","under":"u1&frac12;-110","homeInfo":{"id":642113,"nickname":"King of Kung Fu","wins":12,"statid":3021,"losses":1,"last_name":"Salikhov","weight_class":"Welterweight","title_holder":false,"draws":0,"first_name":"Muslim","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FMuslim-Salikhov%252FMuslim-Salikhov_642113_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMuslim_Salikhov%252FSALIKHOV_MUSLIM_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMuslim_Salikhov%252FSALIKHOV_MUSLIM_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMuslim_Salikhov%252FSALIKHOV_MUSLIM.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Muslim-Salikhov"},"visitorInfo":{"id":459193,"nickname":"The Dominican Nightmare","wins":14,"statid":2130,"losses":4,"last_name":"Garcia","weight_class":"Welterweight","title_holder":false,"draws":0,"first_name":"Alex","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FAlex-Garcia%252FAlex-Garcia_459193_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAlex_Garcia%252FGARCIA_ALEX_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAlex_Garcia%252FGARCIA_ALEX_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAlex_Garcia%252FGARCIA_ALEX.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Alex-Garcia"}},{"date":"20171125","time":"03:30:00","visitor":"Sheymon Moraes","visitorOdds":"+412","home":"Zabit Magomedsharipov","homeOdds":"-513","over":"o1&frac12;-200","under":"u1&frac12;+155","homeInfo":{"id":635808,"nickname":null,"wins":13,"statid":2965,"losses":1,"last_name":"Magomedsharipov","weight_class":"Featherweight","title_holder":false,"draws":0,"first_name":"Zabit","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FZabit-Magomedsharipov%252FZabit-Magomedsharipov_635808_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FZabit_Magomedsharipov%252FMAGOMEDSHARIPOV_ZABIT_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FZabit_Magomedsharipov%252FMAGOMEDSHARIPOV_ZABIT_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FZabit_Magomedsharipov%252FMAGOMEDSHARIPOV_ZABIT.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Zabit-Magomedsharipov"},"visitorInfo":{"id":641333,"nickname":null,"wins":9,"statid":3017,"losses":1,"last_name":"Moraes","weight_class":"Featherweight","title_holder":false,"draws":0,"first_name":"Sheymon","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FSheymon-Moraes%252FSheymon-Moraes_641333_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FSheymon_Moraes%252FMORAES_SHEYMON_R.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FSheymon_Moraes%252FMORAES_SHEYMON_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FSheymon_Moraes%252FMORAES_SHEYMON.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Sheymon-Moraes"}},{"date":"20171125","time":"03:15:00","visitor":"Kenan Song","visitorOdds":"+250","home":"Bobby Nash","homeOdds":"-300","over":"o1&frac12;-145","under":"u1&frac12;+115","homeInfo":{"id":616674,"nickname":"Nashty","wins":8,"statid":2855,"losses":3,"last_name":"Nash","weight_class":"Welterweight","title_holder":false,"draws":0,"first_name":"Bobby","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fbobby-nash%252Fbobby-nash_616674_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FBobby_Nash%252FNASH_BOBBY_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FBobby_Nash%252FNASH_BOBBY_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FBobby_Nash%252FNASH_BOBBY.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/bobby-nash"},"visitorInfo":{"id":643435,"nickname":"The Assassin","wins":12,"statid":3024,"losses":4,"last_name":"Kenan","weight_class":"Welterweight","title_holder":false,"draws":0,"first_name":"Song","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FKenan-Song%252FKenan-Song_643435_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FKenan_Song%252FSONG_KENAN_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FKenan_Song%252FSONG_KENAN_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FKenan_Song%252FSONG_KENAN.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Kenan-Song"}},{"date":"20171125","time":"03:00:00","visitor":"Kailin Curran","visitorOdds":"+131","home":"Xiaonan Yan","homeOdds":"-156","over":"o2&frac12;-175","under":"u2&frac12;+145","visitorInfo":{"id":497150,"nickname":null,"wins":4,"statid":2306,"losses":5,"last_name":"Curran","weight_class":"Women_Strawweight","title_holder":false,"draws":0,"first_name":"Kailin","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FKailin-Curran%252FKailin-Curran_497150_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FKailin_Curran%252FCURRAN_KAILIN_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FKailin_Curran%252FCURRAN_KAILIN_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FKailin_Curran%252FCURRAN_KAILIN.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Kailin-Curran"}},{"date":"20171125","time":"02:45:00","visitor":"Bharat Khandare","visitorOdds":"+125","home":"Yadong Song","homeOdds":"-145","over":"o2&frac12;-123","under":"u2&frac12;-107"},{"date":"20171125","time":"02:30:00","visitor":"Chase Sherman","visitorOdds":"+110","home":"Shamil Abdurakhimov","homeOdds":"-130","over":"o1&frac12;-300","under":"u1&frac12;+245","homeInfo":{"id":516943,"nickname":"Abrek","wins":17,"statid":2424,"losses":4,"last_name":"Abdurakhimov","weight_class":"Heavyweight","title_holder":false,"draws":0,"first_name":"Shamil","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fshamil-abdurakhimov%252Fshamil-abdurakhimov_516943_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FShamil_Abdurakihimov%252FABDURAKHIMOV_SHAMIL_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FShamil_Abdurakihimov%252FABDURAKHIMOV_SHAMIL_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FShamil_Abdurakihimov%252FABDURAKHIMOV_SHAMIL.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/shamil-abdurakhimov"},"visitorInfo":{"id":596984,"nickname":"The Vanilla Gorilla","wins":11,"statid":2787,"losses":3,"last_name":"Sherman","weight_class":"Heavyweight","title_holder":false,"draws":0,"first_name":"Chase","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fchase-sherman%252Fchase-sherman_596984_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FChase_Sherman%252FSHERMAN_CHASE_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FChase_Sherman%252FSHERMAN_CHASE_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FChase_Sherman%252FSHERMAN_CHASE.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/chase-sherman"}},{"date":"20171125","time":"02:15:00","visitor":"Yanan Wu","visitorOdds":"-118","home":"Gina Mazany","homeOdds":"-102","over":"o2&frac12;-140","under":"u2&frac12;+110","homeInfo":{"id":453508,"nickname":"Danger","wins":4,"statid":2866,"losses":1,"last_name":"Mazany","weight_class":"Women_Bantamweight","title_holder":false,"draws":0,"first_name":"Gina","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FGina-Mazany%252FGina-Mazany_453508_medium_thumbnail.jpg?w640-h320-tc1","belt_thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FGina_Mazany%252FMAZANY_GINA_R-PRINT.png?w600-h600-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FGina_Mazany%252FMAZANY_GINA_R.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FGina_Mazany%252FMAZANY_GINA_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FGina_Mazany%252FMAZANY_GINA.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Gina-Mazany"},"visitorInfo":{"id":640288,"nickname":"Mulan","wins":9,"statid":3009,"losses":1,"last_name":"Yanan","weight_class":"Women_Bantamweight","title_holder":false,"draws":0,"first_name":"Wu","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FYanan-Wu%252FYanan-Wu_640288_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FWu_Yanan%252FWU_YANAN_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FWu_Yanan%252FWU_YANAN_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FWu_Yanan%252FWU_YANAN.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Yanan-Wu"}},{"date":"20171125","time":"02:00:00","visitor":"Wuliji Buren","visitorOdds":"+135","home":"Rolando Dy","homeOdds":"-160","over":"o2&frac12;-160","under":"u2&frac12;+130","homeInfo":{"id":630706,"nickname":"Dy Incredible ","wins":8,"statid":2904,"losses":6,"last_name":"Dy","weight_class":"Featherweight","title_holder":false,"draws":1,"first_name":"Rolando","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FRolando-Dy%252FRolando-Dy_630706_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252F%252FLuiz_Henrique-Da-Silva%252F1DY_ROLANDO_R.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252F%252FLuiz_Henrique-Da-Silva%252F1DY_ROLANDO_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252F%252FRolando_Dy%252F1DY_ROLANDO.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Rolando-Dy"},"visitorInfo":{"id":643436,"nickname":"Beast Master","wins":10,"statid":3027,"losses":4,"last_name":"Buren","weight_class":"Featherweight","title_holder":false,"draws":0,"first_name":"Wuliji","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FWuliji-Buren%252FWuliji-Buren_643436_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FWuliji_Buren%252FBUREN_WULIJI_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FWuliji_Buren%252FBUREN_WULIJI_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FWuliji_Buren%252FBUREN_WULIJI.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Wuliji-Buren"}},{"date":"20171125","time":"01:45:00","visitor":"Cyril Asker","visitorOdds":"-245","home":"Yaozong Hu","homeOdds":"+205","over":"o1&frac12;+150","under":"u1&frac12;-190","homeInfo":{"id":644081,"nickname":"Bad Boy","wins":3,"statid":3029,"losses":0,"last_name":"Yaozong","weight_class":"Heavyweight","title_holder":false,"draws":0,"first_name":"Hu","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FYaozong-Hu%252FYaozong-Hu_644081_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FYaozong_Hu%252FHU_YAOZONG_R.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FYaozong_Hu%252FHU_YAOZONG_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FYaozong_Hu%252FHU_YAOZONG.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Yaozong-Hu"},"visitorInfo":{"id":582930,"nickname":"Silverback","wins":8,"statid":2761,"losses":3,"last_name":"Asker","weight_class":"Heavyweight","title_holder":false,"draws":0,"first_name":"Cyril","fighter_status":"Active","rank":null,"pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fcyril-asker%252Fcyril-asker_582930_medium_thumbnail.jpg?w640-h320-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCyril_Asker%252FASKER_CYRIL_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCyril_Asker%252FASKER_CYRIL_L.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCyril_Asker%252FASKER_CYRIL.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/cyril-asker"}}],"eventInfo":{"id":635192,"event_date":"2017-11-25T00:00:00Z","secondary_feature_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffeatures%252F019907_WEB_EventPlaceholderRebrand_PPV.jpg?-mw500-mh500-tc1","ticket_image":"","event_time_zone_text":"ETPT","short_description":"","event_dategmt":"2017-11-25T23:00:00Z","end_event_dategmt":"2017-11-26T05:00:00Z","ticketurl":"https://en.damai.cn/event/tickets_127248/","ticket_seller_name":null,"base_title":"UFC Fight Night","title_tag_line":"Bisping vs Gastelum","twitter_hashtag":"","ticket_general_sale_date":"2017-08-01T10:00:00Z","statid":844,"feature_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffeatures%252F019907_WEB_EventPlaceholderRebrand_PPV.jpg?-mw500-mh500-tc1","event_time_text":"7AM/4AM","ticket_general_sale_text":"Public On-sale","subtitle":"Live on UFC FIGHT PASS","event_status":"FINALIZED","isppvevent":false,"corner_audio_available":false,"corner_audio_blue_stream_url":null,"corner_audio_red_stream_url":null,"last_modified":"2017-11-24T15:26:13Z","url_name":"ufc-fight-night-shanghai-nov-25-2017","created":"2017-07-25T11:04:54Z","trailer_url":null,"arena":"Mercedes-Benz Arena","location":"","fm_fnt_feed_url":"http://liveapi.fightmetric.com/V1/844/Fnt.json","main_event_fighter1_id":758,"main_event_fighter2_id":307092,"latitude":31.2303904,"longitude":121.4737021}},{"banner":[{"$":{"ab":"True","vtm":"MMA - UFC - Dec 02","htm":""},"#name":"banner"},{"$":{"ab":"False","vtm":"UFC 218: Holloway vs. Aldo 2","htm":"Little Caesars Arena @ Detroit, Michigan"},"#name":"banner"}],"fights":[{"date":"20171202","time":"23:00:00","visitor":"Jose Aldo","visitorOdds":"+236","home":"Max Holloway","homeOdds":"-309","over":"","under":"","homeInfo":{"id":235332,"nickname":"Blessed","wins":18,"statid":1936,"losses":3,"last_name":"Holloway","weight_class":"Featherweight","title_holder":true,"draws":0,"first_name":"Max","fighter_status":"Active","rank":"C","pound_for_pound_rank":"4","thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FMax-Holloway%252FMax-Holloway_235332_medium_thumbnail.jpg?w640-h320-tc1","belt_thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FMax_Holloway%252FHOLLOWAY_MAX_BELT-PRINT.png?w600-h600-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMax_Holloway%252FHOLLOWAY_MAX_R_212.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMax_Holloway%252FHOLLOWAY_MAX_R_212.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMax_Holloway%252FHOLLOWAY_MAX_212.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Max-Holloway"},"visitorInfo":{"id":911,"nickname":null,"wins":26,"statid":1052,"losses":3,"last_name":"Aldo","weight_class":"Featherweight","title_holder":false,"draws":0,"first_name":"Jose","fighter_status":"Active","rank":"1","pound_for_pound_rank":"14","thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FJose-Aldo%252FJose-Aldo_911_medium_thumbnail.jpg?w640-h320-tc1","belt_thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJose_Aldo%252FALDO_JOSE_L-PRINT_UFC212.png?w600-h600-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJose_Aldo%252FALDO_JOSE_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJose_Aldo%252FALDO_JOSE_R_NOBELT.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJose_Aldo%252FALDO_JOSE.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Jose-Aldo"}}],"eventInfo":{"id":635181,"event_date":"2017-12-02T00:00:00Z","secondary_feature_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Features%252F019907_WEB_EventPlaceholderRebrand_PPV.jpg?-mw500-mh500-tc1","ticket_image":"","event_time_zone_text":"ETPT","short_description":"","event_dategmt":"2017-12-02T23:00:00Z","end_event_dategmt":"2017-12-03T05:00:00Z","ticketurl":"https://www1.ticketmaster.com/ufc-218-detroit-michigan-12-02-2017/event/0800534939BA740F?artistid=806762&majorcatid=10004&minorcatid=830","ticket_seller_name":"Ticketmaster","base_title":"UFC 218","title_tag_line":"Holloway vs Aldo 2","twitter_hashtag":"","ticket_general_sale_date":"2017-10-13T10:00:00Z","statid":850,"feature_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Features%252F019907_WEB_EventPlaceholderRebrand_PPV.jpg?-mw500-mh500-tc1","event_time_text":"10PM/7PM","ticket_general_sale_text":"Public On-sale","subtitle":"Live on Pay-Per-View","event_status":"FINALIZED","isppvevent":true,"corner_audio_available":false,"corner_audio_blue_stream_url":null,"corner_audio_red_stream_url":null,"last_modified":"2017-11-24T15:26:13Z","url_name":"UFC-218","created":"2017-07-25T09:38:34Z","trailer_url":"http://pdvid.ufc.tv/2017/11/13/UFC218_PRO2_30_V1_EN_1202_PPVnew.mp4","arena":"Little Caesars Arena","location":"Detroit, Michigan","fm_fnt_feed_url":"http://liveapi.fightmetric.com/V1/850/Fnt.json","main_event_fighter1_id":235332,"main_event_fighter2_id":911,"latitude":42.331427,"longitude":-83.0457538}},{"banner":[{"$":{"ab":"True","vtm":"MMA - UFC - Dec 30","htm":""},"#name":"banner"},{"$":{"ab":"False","vtm":"UFC 219","htm":"T-Mobile Arena @ Las Vegas, Nevada"},"#name":"banner"}],"fights":[{"date":"20171230","time":"23:00:00","visitor":"Holly Holm","visitorOdds":"+256","home":"Cris Cyborg","homeOdds":"-327","over":"","under":"","homeInfo":{"id":241895,"nickname":null,"wins":18,"statid":1194,"losses":1,"last_name":"Cyborg","weight_class":"Women_Featherweight","title_holder":true,"draws":0,"first_name":"Cris","fighter_status":"Active","rank":"C","pound_for_pound_rank":"10","thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FCris-Cyborg%252FCris-Cyborg_241895_medium_thumbnail.jpg?w640-h320-tc1","belt_thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCris_Cyborg%252FCYBORG_CRIS_L-CHAMP-PRINT.png?w600-h600-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCris_Cyborg%252FCYBORG_CRIS_L-CHAMP.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCris_Cyborg%252FCYBORG_CRIS_L-CHAMP.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FCris_Cyborg%252FCYBORG_CRIS.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/Cris-Cyborg"},"visitorInfo":{"id":500044,"nickname":"The Preacher's Daughter","wins":11,"statid":2317,"losses":3,"last_name":"Holm","weight_class":"Women_Bantamweight","title_holder":false,"draws":0,"first_name":"Holly","fighter_status":"Active","rank":"2","pound_for_pound_rank":null,"thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fholly-holm%252Fholly-holm_500044_medium_thumbnail.jpg?w640-h320-tc1","belt_thumbnail":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FHolly_Holm%252FHOLM_HOLLY_L-PRINT.png?w600-h600-tc1","left_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FHolly_Holm%252FHOLM_HOLLY_L.png?mh530","right_full_body_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FHolly_Holm%252FHOLM_HOLLY_R.png?mh530","profile_image":"http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FHolly_Holm%252FHOLM_HOLLY.png?w600-h600-tc1","link":"http://www.ufc.com/fighter/holly-holm"}}]}];
  res.send(temp);
  next();
}

async function getFighterStats(req, res, next) {
  
  console.log(req.params)
  console.log(req.params.id)
  
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

  console.log(data, "data")
  res.send(data);
  next();
}

module.exports = {
  getEvents,
  getFighterStats,
};



