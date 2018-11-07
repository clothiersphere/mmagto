const keys = require('../keys.js');
const axios = require('axios');
const { parseString } = require('xml2js');
const scraper = require('google-search-scraper');
const DeathByCaptcha = require('deathbycaptcha');


const dbc = new DeathByCaptcha('xchrislee', keys.dbc);
const ufc = require('ufc');
const sherdog = require('sherdog');
const cheerio = require('cheerio');


// function bookmakerEventParser(array) {
//   const storage = [];
//   const counter = 0;
//   let pointer = 0;

//   storage[pointer] = [{ banner: [] }, { fights: [] }];

//   for (let i = 0; i < array.length; i++) {
//     if (array[i]['#name'] === 'banner' && array[i].$.ab === 'True' && i !== 0) {
//       pointer++;
//       storage[pointer] = [{ banner: [] }, { fights: [] }];
//     }
//     if (array[i]['#name'] === 'banner') {
//       storage[pointer][0].banner.push(array[i]);
//     } else {
//       storage[pointer][1].fights.push(array[i]);
//     }
//   }
//   return storage;
// }

// function parseFighterInfo(array) {
//   const result = [];
//   for (let i = 0; i < array.length; i++) {
//     result[i] = {
//       banner: [],
//       fights: [],
//     };

//     result[i].banner = array[i][0].banner;
//     for (let j = 0; j < array[i][1].fights.length; j++) {
//       const fights = {
//         date: array[i][1].fights[j].$.gmdt,
//         time: array[i][1].fights[j].$.gmtm,
//         visitor: array[i][1].fights[j].$.vtm,
//         visitorOdds: array[i][1].fights[j].$$[0].$.voddsh,
//         home: array[i][1].fights[j].$.htm,
//         homeOdds: array[i][1].fights[j].$$[0].$.hoddsh,
//         over: array[i][1].fights[j].$$[0].$.ovh,
//         under: array[i][1].fights[j].$$[0].$.unh,
//       };
//       result[i].fights.push(fights);
//     }
//   }
//   return result;
// }

// function findNumberedEvent(data, ufcNumberedEvent) {
//   return data.find(x => x.base_title.includes(ufcNumberedEvent));
// }

// async function getEvents(req, res, next) {
//   const bookmakerAPI = 'http://lines.bookmaker.eu';
//   const ufcEventsAPI = 'http://ufc-data-api.ufc.com/api/v3/iphone/events';
//   const ufcFightersAPI = 'http://ufc-data-api.ufc.com/api/v3/iphone/fighters';
//   const queryBookMaker = await axios.get(bookmakerAPI).then(response => response.data);
//   let parsedBookMakerData = [];
//   parseString(queryBookMaker, { explicitChildren: true, preserveChildrenOrder: true }, (err, result) => {
//     const data = [];
//     if (!result.Data.$$[0].$$.find(x => x.$.IdLeague === '206')) {
//       res.send('failed');
//       return;
//     }
//     data.push(result.Data.$$[0].$$.find(x => x.$.IdLeague === '206'));
//     const parsedEventData = bookmakerEventParser(data[0].$$);
//     parsedBookMakerData = parseFighterInfo(parsedEventData);
//   });
//   const ufcFightersApiQuery = await axios.get(ufcFightersAPI).then(response => response.data);
//   const populateHomeVisitorInfo = async (fighterList, parsedData) => {
//     let visitor;
//     let visitorFirst;
//     let visitorLast;
//     let home;
//     let homeFirst;
//     let homeLast;

//     const hasNick = fighterList.filter(x => x.nickname);
//     const searchFighterDB = (first, last, hasNick, fighterList) => {
//       let fighterData = fighterList.find(x => x.last_name === last && x.first_name === first);
//       if (!fighterData) {
//         fighterData = hasNick.find(x => x.nickname === first);
//         if (!fighterData) {
//           fighterData = fighterList.find(x => x.last_name === last);
//           if (!fighterData) {
//             fighterData = fighterList.find(x => x.last_name === first);
//           }
//         }
//       }
//       return fighterData;
//     };
//     const fighterParse = (name, side) => {
//       if (side === 'v') {
//         visitor = name.replace(/\"/g, '');
//         visitorFirst = visitor.substr(0, visitor.indexOf(' '));
//         visitorLast = visitor.substr(visitor.indexOf(' ') + 1);
//         visitorLast = visitorLast.substr(visitorLast.indexOf(' ') + 1);
//       }
//       home = name.replace(/"/g, '');
//       homeFirst = home.substr(0, home.indexOf(' '));
//       homeLast = home.substr(home.indexOf(' ') + 1);
//       homeLast = homeLast.substr(homeLast.indexOf(' ') + 1);
//     };
//     for (let i = 0; i < parsedData.length; i += 1) {
//       for (let j = 0; j < parsedData[i].fights.length; j += 1) {
//         fighterParse(parsedData[i].fights[j].visitor, 'v');
//         fighterParse(parsedData[i].fights[j].home, 'h');
//         const homeName = parsedData[i].fights[j].home;
//         const visitorName = parsedData[i].fights[j].visitor;
//         parsedData[i].fights[j].home = searchFighterDB(homeFirst, homeLast, hasNick, ufcFightersApiQuery);
//         parsedData[i].fights[j].visitor = searchFighterDB(visitorFirst, visitorLast, hasNick, ufcFightersApiQuery);
//       }
//     }
//     return parsedData;
//   };
//   parsedBookMakerData = await populateHomeVisitorInfo(ufcFightersApiQuery, parsedBookMakerData);
//   const ufcEventsApiQuery = await axios.get(ufcEventsAPI).then(response => response.data);
//   function populateEventInfo(parsedData, eventData) {
//     for (let i = 0; i < parsedData.length; i++) {
//       let fightName = parsedData[i].banner[1].$.vtm.toLowerCase();
//       if (parsedData[i].banner[2]) {
//         fightName = parsedData[i].banner[2].$.vtm.toLowerCase();
//       }
//       var venue = parsedData[i].banner[1].$.htm.split(' ').shift();
//       // console.log(venue, "venue")
//       const eventName = fightName.substring(fightName.indexOf(':') + 2).split(' ');
//       // console.log(eventName, "eventName")
//       const vsMarker = eventName.indexOf('vs.');
//       var firstFighter = eventName[0];
//       // console.log(firstFighter, "Ff")
//       var secondFighter = eventName[2];
//       // console.log(secondFighter, "sf")
//       const UFN = ('ufc fight night');
//       const TUF = ('the ultimate fighter');


//       const fightNameSplit = fightName.split(' ');
//       const fightNumber = fightNameSplit[1].substr(0, 3);


//       if (fightName.includes(UFN)) {
//         const fightNightEvents = eventData.filter(x => x.base_title === 'UFC Fight Night');
//         parsedData[i].eventInfo = fightNightEvents.find(x => x.title_tag_line.toLowerCase().includes(firstFighter) && x.title_tag_line.toLowerCase().includes(secondFighter) && x.arena.toLowerCase().includes(venue));
//         if (!parsedData[i].eventInfo) {
//           parsedData[i].eventInfo = fightNightEvents.find(x => x.title_tag_line.toLowerCase().includes(firstFighter) && x.title_tag_line.toLowerCase().includes(secondFighter));
//           if (!parsedData[i].eventInfo) {
//             parsedData[i].eventInfo = fightNightEvents.find(x => x.title_tag_line.toLowerCase().includes(secondFighter) && x.arena.toLowerCase().includes(venue));
//           }
//         }
//       }
//       if (fightName.includes(TUF)) {
//         const fightNightEvents = eventData.filter(x => x.base_title === 'The Ultimate Fighter Finale');
//         parsedData[i].eventInfo = fightNightEvents.find(x => x.arena.includes(venue));
//       }

//       // var ufcNumberedEvent = fightName.substring(fightName.indexOf('c') + 2, fightName.indexOf(':'));
//       const ufcNumberedEvent = fightNumber;
//       if (/^\d+$/.test(ufcNumberedEvent)) {
//         parsedData[i].eventInfo = findNumberedEvent(eventData, ufcNumberedEvent);
//       }
//     }
//     return parsedData;
//   }
//   parsedBookMakerData = await populateEventInfo(parsedBookMakerData, ufcEventsApiQuery);
//   res.send(parsedBookMakerData);
//   next();
// }

function getEvents(req, res, next) {
  const temp = [{
    banner: [{ $: { ab: 'True', vtm: 'MMA - UFC - May 12', htm: '' }, '#name': 'banner' }, { $: { ab: 'False', vtm: 'UFC 224: Nunes vs. Pennington', htm: 'Jeunesse Arena @ Rio de Janeiro, Brazil' }, '#name': 'banner' }],
    fights: [{
      date: '20180512',
      time: '18:00:00',
      visitor: {
        id: 453512, nickname: 'Rocky', wins: 9, statid: 2150, losses: 6, last_name: 'Pennington', weight_class: 'Women_Bantamweight', title_holder: false, draws: 0, first_name: 'Raquel', fighter_status: 'Active', rank: '2', pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FRaquel-Pennington%252FRaquel-Pennington_453512_medium_thumbnail.jpg?w640-h320-tc1', belt_thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRaquel_Pennington%252F205-PENNINGTON_RAQUEL_R-PRINT.png?w600-h600-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRaquel_Pennington%252FPENNINGTON_RAQUEL_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRaquel_Pennington%252F205-PENNINGTON_RAQUEL_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRaquel_Pennington%252F205-PENNINGTON_RAQUEL.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Raquel-Pennington',
      },
      visitorOdds: '+375',
      home: {
        id: 242516, nickname: 'The Lioness', wins: 15, statid: 1719, losses: 4, last_name: 'Nunes', weight_class: 'Women_Bantamweight', title_holder: true, draws: 0, first_name: 'Amanda', fighter_status: 'Active', rank: 'C', pound_for_pound_rank: '12', thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FAmanda-Nunes%252FAmanda-Nunes_242516_medium_thumbnail.jpg?w640-h320-tc1', belt_thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAmanda_Nunes%252FNUNES_AMANDA_L-PRINT.png?w600-h600-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FAmanda_Nunes%252FNUNES_AMANDA_L_BELT_S.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAmanda_Nunes%252FNUNES_AMANDA_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FAmanda_Nunes%252FNUNES_AMANDA_BELT_LS.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Amanda-Nunes',
      },
      homeOdds: '-525',
      over: '',
      under: '',
    }, {
      date: '20180512',
      time: '18:00:00',
      visitor: {
        id: 307092, nickname: null, wins: 15, statid: 2070, losses: 3, last_name: 'Gastelum', weight_class: 'Middleweight', title_holder: false, draws: 0, first_name: 'Kelvin', fighter_status: 'Active', rank: '5', pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FKelvin-Gastelum%252FKelvin-Gastelum_307092_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FKelvin_Gastelum%252F205-GASTELUM_KELVIN_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FKelvin_Gastelum%252FGASTELUM_KELVIN_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FKelvin_Gastelum%252FGASTELUM_KELVIN.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Kelvin-Gastelum',
      },
      visitorOdds: '+110',
      home: {
        id: 241887, nickname: 'Jacare', wins: 25, statid: 896, losses: 5, last_name: 'Souza', weight_class: 'Middleweight', title_holder: false, draws: 0, first_name: 'Ronaldo', fighter_status: 'Active', rank: '2', pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FRonaldo-Souza%252FRonaldo-Souza_241887_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252F%252FRonaldo_Souza%252FSOUZA_JACARE_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252F%252FRonaldo_Souza%252F2015-12-08_UFC_194_JACARE_SOUZA_0053.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252F%252FRonaldo_Souza%252FSOUZA_JACARE.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Ronaldo-Souza',
      },
      homeOdds: '-140',
      over: '',
      under: '',
    }, {
      date: '20180512',
      time: '18:00:00',
      visitor: {
        id: 587577, nickname: 'ABC', wins: 4, statid: 2792, losses: 3, last_name: 'Cooper', weight_class: 'Women_Strawweight', title_holder: false, draws: 0, first_name: 'Amanda', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Famanda-cooper%252Famanda-cooper_587577_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAmanda_Cooper%252FCOOPER_AMANDA_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAmanda_Cooper%252FCOOPER_AMANDA_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAmanda_Cooper%252FCOOPER_AMANDA.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/amanda-cooper',
      },
      visitorOdds: '+210',
      home: {
        id: 647235, nickname: null, wins: 6, statid: 3054, losses: 0, last_name: 'Dern', weight_class: 'Women_Strawweight', title_holder: false, draws: 0, first_name: 'Mackenzie', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fmackenzie-dern%252Fmackenzie-dern_647235_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMackenzie_Dern%252FDERN_MACKENZIE_R.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMackenzie_Dern%252FDERN_MACKENZIE_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FMackenzie_Dern%252FDERN_MACKENZIE.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/mackenzie-dern',
      },
      homeOdds: '-270',
      over: '',
      under: '',
    }, {
      date: '20180512',
      time: '18:00:00',
      visitor: {
        id: 628993, nickname: 'Boom', wins: 19, statid: 2895, losses: 8, last_name: 'Kelleher', weight_class: 'Bantamweight', title_holder: false, draws: 0, first_name: 'Brian', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FBrian-Kelleher%252FBrian-Kelleher_628993_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FBrian_Kelleher%252FKELLEHER_BRIAN_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FBrian_Kelleher%252FKELLEHER_BRIAN_R-02-26-18.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FBrian_Kelleher%252FKELLEHER_BRIAN-02-26-18.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Brian-Kelleher',
      },
      visitorOdds: '+185',
      home: {
        id: 235798, nickname: 'Hands of Stone', wins: 30, statid: 1966, losses: 8, last_name: 'Lineker', weight_class: 'Bantamweight', title_holder: false, draws: 0, first_name: 'John', fighter_status: 'Active', rank: '6', pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FJohn-Lineker%252FJohn-Lineker_235798_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FJohn_Lineker%252FLINEKER_JOHN_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FJohn_Lineker%252FLINEKER_JOHN_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FJohn_Lineker%252FLINEKER_JOHN.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/John-Lineker',
      },
      homeOdds: '-230',
      over: '',
      under: '',
    }, {
      date: '20180512',
      time: '18:00:00',
      visitor: {
        id: 19, nickname: 'The Phenom', wins: 26, statid: 295, losses: 13, last_name: 'Belfort', weight_class: 'Middleweight', title_holder: false, draws: 0, first_name: 'Vitor', fighter_status: 'Active', rank: '9', pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FVitor-Belfort%252FVitor-Belfort_19_medium_thumbnail.jpg?w640-h320-tc1', belt_thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FVitor_Belfort%252FVitorBelfort_Belt.png?w600-h600-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FVitor_Belfort%252FBELFORT_VITOR_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FVitor_Belfort%252FBELFORT_VITOR_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FVitor_Belfort%252FBELFORT_VITOR.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Vitor-Belfort',
      },
      visitorOdds: '+200',
      home: {
        id: 831, nickname: 'The Dragon', wins: 23, statid: 346, losses: 8, last_name: 'Machida', weight_class: 'Middleweight', title_holder: false, draws: 0, first_name: 'Lyoto', fighter_status: 'Active', rank: '12', pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FLyoto-Machida%252FLyoto-Machida_831_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FLyoto_Machida%252FMACHIDA_LYOTO_R.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FLyoto_Machida%252FMACHIDA_LYOTO_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FLyoto_Machida%252FMACHIDA_LYOTO.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Lyoto-Machida',
      },
      homeOdds: '-250',
      over: '',
      under: '',
    }, {
      date: '20180512',
      time: '18:00:00',
      visitor: {
        id: 631548, nickname: 'Baby K ', wins: 6, statid: 2936, losses: 0, last_name: 'Roberson', weight_class: 'Middleweight', title_holder: false, draws: 0, first_name: 'Karl', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FKarl-Roberson%252FKarl-Roberson_631548_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FKarl_Roberson%252FROBERSON_KARL_R.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FKarl_Roberson%252FROBERSON_KARL_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FKarl_Roberson%252FROBERSON_KARL.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Karl-Roberson',
      },
      visitorOdds: '-160',
      home: {
        id: 242231, nickname: 'Mutante', wins: 13, statid: 1991, losses: 6, last_name: 'Ferreira', weight_class: 'Middleweight', title_holder: false, draws: 0, first_name: 'Cezar', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FCezar-Ferreira%252FCezar-Ferreira_242231_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FCezar_Ferreira%252FFERREIRA_CEZAR_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FCezar_Ferreira%252FFERREIRA_CEZAR_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FCezar_Ferreira%252FFERREIRA_CEZAR.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Cezar-Ferreira',
      },
      homeOdds: '+130',
      over: '',
      under: '',
    }, {
      date: '20180512',
      time: '18:00:00',
      visitor: {
        id: 629443, nickname: 'Baby', wins: 14, statid: 2901, losses: 3, last_name: 'Albini', weight_class: 'Heavyweight', title_holder: false, draws: 0, first_name: 'Junior', fighter_status: 'Active', rank: '14', pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FJunior-Albini%252FJunior-Albini_629443_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252Fjunior_albini%252FALBINI_JUNIOR_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252Fjunior_albini%252FALBINI_JUNIOR_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252Fjunior_albini%252FALBINI_JUNIOR.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Junior-Albini',
      },
      visitorOdds: '-120',
      home: {
        id: 465945, nickname: 'The Boa Constrictor', wins: 52, statid: 2155, losses: 11, last_name: 'Oleinik', weight_class: 'Heavyweight', title_holder: false, draws: 1, first_name: 'Aleksei', fighter_status: 'Active', rank: '10', pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FOleksiy-Oliynyk%252FOleksiy-Oliynyk_465945_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FAleskei_Oleinik%252FOLEINIK_ALEKSEI_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FAleskei_Oleinik%252FOLEINIK_ALESKEI_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FAleskei_Oleinik%252FOLEINIK_ALEKSEI.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Oleksiy-Oliynyk',
      },
      homeOdds: '-110',
      over: '',
      under: '',
    }, {
      date: '20180512',
      time: '18:00:00',
      visitor: {
        id: 623083, nickname: 'Tasmanian Devil', wins: 7, statid: 2877, losses: 2, last_name: 'Ramos', weight_class: 'Lightweight', title_holder: false, draws: 0, first_name: 'Davi', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fdavi-ramos%252Fdavi-ramos_623083_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FDavi_Ramos%252FRAMOS_DAVI_R.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FDavi_Ramos%252FRAMOS_DAVI_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FDavi_Ramos%252FRAMOS_DAVI.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/davi-ramos',
      },
      visitorOdds: '-133',
      home: {
        id: 473935, nickname: 'Sergeant', wins: 14, statid: 2207, losses: 2, last_name: 'Hein', weight_class: 'Lightweight', title_holder: false, draws: 0, first_name: 'Nick', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FNick-Hein%252FNick-Hein_473935_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FNick_Hein%252FHEIN_NICK_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FNick_Hein%252FHEIN_NICK_L.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FNick_Hein%252FHEIN_NICK.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Nick-Hein',
      },
      homeOdds: '+103',
      over: '',
      under: '',
    }, {
      date: '20180512',
      time: '18:00:00',
      visitorOdds: '-148',
      home: {
        id: 475289, nickname: 'Tarzan', wins: 18, statid: 2204, losses: 2, last_name: 'Strickland', weight_class: 'Welterweight', title_holder: false, draws: 1, first_name: 'Sean', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FSean-Strickland%252FSean-Strickland_475289_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FSean_Strickland%252FSTRICKLAND_SEAN_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FSean_Strickland%252FSTRICKLAND_SEAN_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FSean_Strickland%252FSTRICKLAND_SEAN.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Sean-Strickland',
      },
      homeOdds: '+114',
      over: '',
      under: '',
    }, {
      date: '20180512',
      time: '18:00:00',
      visitor: {
        id: 511032, nickname: null, wins: 14, statid: 2365, losses: 2, last_name: 'Aliev', weight_class: 'Welterweight', title_holder: false, draws: 0, first_name: 'Sultan', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fsultan-aliev%252Fsultan-aliev_511032_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FSultan_Aliev%252FALIEV_SULTAN_R.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FSultan_Aliev%252FALIEV_SULTAN_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FSultan_Aliev%252FALIEV_SULTAN.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/sultan-aliev',
      },
      visitorOdds: '+175',
      home: {
        id: 477623, nickname: null, wins: 12, statid: 2247, losses: 2, last_name: 'Alves', weight_class: 'Welterweight', title_holder: false, draws: 0, first_name: 'Warlley', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fwarlley-alves%252Fwarlley-alves_477623_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FWarlley_Alves%252FALVES_WARLLEY_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FWarlley_Alves%252FALVES_WARLLEY_L.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FWarlley_Alves%252FALVES_WARLLEY.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/warlley-alves',
      },
      homeOdds: '-220',
      over: '',
      under: '',
    }, {
      date: '20180512',
      time: '18:00:00',
      visitor: {
        id: 592624, nickname: 'The Joker', wins: 16, statid: 2775, losses: 4, last_name: 'Hermansson', weight_class: 'Middleweight', title_holder: false, draws: 0, first_name: 'Jack', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252Fjack-hermansson%252Fjack-hermansson_592624_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FJack_Hermansson%252FHERMANSSON_JACK_L_stockholm.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FJack_Hermansson%252FHERMANSSON_JACK_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FJack_Hermansson%252FHERMANSSON_JACK.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/jack-hermansson',
      },
      visitorOdds: '-145',
      home: {
        id: 803, nickname: null, wins: 27, statid: 449, losses: 8, last_name: 'Leites', weight_class: 'Middleweight', title_holder: false, draws: 0, first_name: 'Thales', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FThales-Leites%252FThales-Leites_803_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FThales_Lietes%252FLEITES_THALES_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FThales_Lietes%252FLEITES_THALES_L.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FThales_Lietes%252FLEITES_THALES.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Thales-Leites',
      },
      homeOdds: '+115',
      over: '',
      under: '',
    }, {
      date: '20180512',
      time: '18:00:00',
      visitor: {
        id: 472511, nickname: 'Soldier of God', wins: 13, statid: 2186, losses: 0, last_name: 'Mina', weight_class: 'Welterweight', title_holder: false, draws: 0, first_name: 'Alberto', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FAlberto-Mina%252FAlberto-Mina_472511_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAlberto_Mina%252FMINA_ALBERT_R.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAlberto_Mina%252FMINA_ALBERT_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FAlberto_Mina%252FMINA_ALBERTO.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Alberto-Mina',
      },
      visitorOdds: '+160',
      home: {
        id: 636493, nickname: 'Gorets', wins: 16, statid: 3001, losses: 3, last_name: 'Emeev', weight_class: 'Middleweight', title_holder: false, draws: 0, first_name: 'Ramazan', fighter_status: 'Active', rank: null, pound_for_pound_rank: null, thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FRamazan-Emeev%252FRamazan-Emeev_636493_medium_thumbnail.jpg?w640-h320-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRamazan_Emeev%252FEMEEV_RAMAZAN_R.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRamazan_Emeev%252FEMEEV_RAMAZAN_R.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FRamazan_Emeev%252FEMEEV_RAMAZAN.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Ramazan-Emeev',
      },
      homeOdds: '-200',
      over: '',
      under: '',
    }],
    eventInfo: {
      id: 649465, event_date: '2018-05-12T00:00:00Z', secondary_feature_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F224%252F040479_224_UFCdotComScheduleFeature_337x362.jpg?-mw500-mh500-tc1', ticket_image: '', event_time_zone_text: 'ETPT', short_description: '', event_dategmt: '2018-05-12T23:00:00Z', end_event_dategmt: '2018-05-13T05:00:00Z', ticketurl: 'http://www.tudus.com.br/evento/UFC-224-rio', ticket_seller_name: 'Tudus', base_title: 'UFC 224', title_tag_line: 'Nunes vs Pennington', twitter_hashtag: '', ticket_general_sale_date: null, statid: 867, feature_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F224%252F040479_224_UFCdotComScheduleFeature_644x362.jpg?-mw500-mh500-tc1', event_time_text: '10PM/7PM', ticket_general_sale_text: 'Public On-sale', subtitle: 'Live on Pay-Per-View', event_status: 'FINALIZED', isppvevent: true, corner_audio_available: false, corner_audio_blue_stream_url: null, corner_audio_red_stream_url: null, last_modified: '2018-04-24T09:26:12Z', url_name: 'UFC-224', created: '2018-02-07T08:00:47Z', trailer_url: null, arena: 'Jeunesse Arena', location: '', fm_fnt_feed_url: 'http://liveapi.fightmetric.com/V1/867/Fnt.json', main_event_fighter1_id: 242516, main_event_fighter2_id: 453512, latitude: -22.9068467, longitude: -43.1728965,
    },
  }, {
    banner: [{ $: { ab: 'True', vtm: 'MMA - UFC - Jul 07', htm: '' }, '#name': 'banner' }, { $: { ab: 'False', vtm: 'UFC 226: Miocic vs Cormier', htm: 'T-Mobile Arena @ Las Vegas, NV' }, '#name': 'banner' }],
    fights: [{
      date: '20180707',
      time: '21:00:00',
      visitor: {
        id: 241888, nickname: 'DC', wins: 20, statid: 1409, losses: 1, last_name: 'Cormier', weight_class: 'Light_Heavyweight', title_holder: true, draws: 0, first_name: 'Daniel', fighter_status: 'Active', rank: 'C', pound_for_pound_rank: '5', thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FDaniel-Cormier%252FDaniel-Cormier_241888_medium_thumbnail.jpg?w640-h320-tc1', belt_thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FDaniel_Cormier%252FCORMIER_DANIEL_L-PRINT.png?w600-h600-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FDaniel_Cormier%252FCORMIER_DANIEL_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FDaniel_Cormier%252FDaniel-Cormier-UFC166-0013.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FDaniel_Cormier%252FCORMIER_DANIEL.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Daniel-Cormier',
      },
      visitorOdds: '+144',
      home: {
        id: 205676, nickname: null, wins: 18, statid: 1852, losses: 2, last_name: 'Miocic', weight_class: 'Heavyweight', title_holder: true, draws: 0, first_name: 'Stipe', fighter_status: 'Active', rank: 'C', pound_for_pound_rank: '3', thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Fgenerated_images_sorted%252FFighter%252FStipe-Miocic%252FStipe-Miocic_205676_medium_thumbnail.jpg?w640-h320-tc1', belt_thumbnail: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FStipe_Miocic%252FMIOCIC_STIPE_L_BELT_S-PRINT_211.png?w600-h600-tc1', left_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FStipe_Miocic%252FMIOCIC_STIPE_L.png?mh530', right_full_body_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252F%252Ffighter_images%252FStipe_Miocic%252FMIOCIC_STIPE_BELT_L.png?mh530', profile_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffighter_images%252FStipe_Miocic%252FMIOCIC_STIPE.png?w600-h600-tc1', link: 'http://www.ufc.com/fighter/Stipe-Miocic',
      },
      homeOdds: '-184',
      over: '',
      under: '',
    }],
    eventInfo: {
      id: 648798, event_date: '2018-07-07T00:00:00Z', secondary_feature_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffeatures%252F019907_WEB_EventPlaceholderRebrand_PPV.jpg?-mw500-mh500-tc1', ticket_image: '', event_time_zone_text: '', short_description: '', event_dategmt: '2018-07-07T23:00:00Z', end_event_dategmt: '2018-07-08T05:00:00Z', ticketurl: 'https://www.axs.com/events/352157/ufc-226-miocic-vs-cormier-tickets?skin=tmobile', ticket_seller_name: 'AXS', base_title: 'UFC 226', title_tag_line: 'Miocic vs Cormier', twitter_hashtag: '', ticket_general_sale_date: '2018-04-27T10:00:00Z', statid: 864, feature_image: 'http://imagec.ufc.com/http%253A%252F%252Fmedia.ufc.tv%252Ffeatures%252F019907_WEB_EventPlaceholderRebrand_PPV.jpg?-mw500-mh500-tc1', event_time_text: '', ticket_general_sale_text: 'Public On-sale', subtitle: 'Live on Pay-Per-View', event_status: 'FINALIZED', isppvevent: true, corner_audio_available: false, corner_audio_blue_stream_url: null, corner_audio_red_stream_url: null, last_modified: '2018-04-24T09:26:12Z', url_name: 'Ufc-226', created: '2018-01-26T17:27:40Z', trailer_url: null, arena: 'T-Mobile Arena', location: 'Las Vegas, Nevada', fm_fnt_feed_url: 'http://liveapi.fightmetric.com/V1/864/Fnt.json', main_event_fighter1_id: 205676, main_event_fighter2_id: 241888, latitude: 36.1699412, longitude: -115.1398296,
    },
  }];
  res.send(temp);
  next();
}

// function getEvents(req, res, next) {
//   // const url = `https://jsonodds.com/api/odds/MMA -H "x-api-key: ${keys.JsonOdds}" -L`;
//   const url = 'https://jsonodds.com/api/odds/mma';
//   return axios({
//     method: 'get',
//     url,
//     headers: { 'x-api-key': keys.JsonOdds },
//   }).then((response) => {
//     console.log(response.data, 'response');
//     const hasDetails = response.data.filter(fight => Object.hasOwnProperty.call(fight, 'Details'));
//     const ufcFights = hasDetails.filter(fight => fight.Details.includes('UFC'));
//     const ppv = ufcFights.filter(fight => fight.Details.includes('PPV'));

//     const temp = ppv.map((obj) => {
//       const details = obj.Details.split('-');
//       const event = details[0];
//       const weightRound = details[1].split(' ');
//       const weight = weightRound[1];
//       const rounds = weightRound[2];

//       return {
//         ID: obj.ID,
//         HomeTeam: obj.HomeTeam,
//         AwayTeam: obj.AwayTeam,
//         Event: event,
//         Weight: weight,
//         Rounds: rounds,
//         Odds: obj.Odds,
//       };
//     });


//     res.send(temp);
//     next();
//   }).catch((err) => {
//     console.log(err, 'rejected');
//   });
// }

// function parseFights(fights) {

// }


async function getFighterStats(req, res, next) {
  const fighter = req.params.id;
  let data;
  async function retrieve(query) {
    let sherdogUrl;
    let ufcUrl;
    let fighter = {
      name: '',
      nickname: '',
      fullname: '',
      record: '',
      association: '',
      age: '',
      birthday: '',
      hometown: '',
      nationality: '',
      location: '',
      height: '',
      height_cm: '',
      weight: '',
      weight_kg: '',
      weight_class: '',
      college: '',
      degree: '',
      summary: [],
      wins: {
        total: 0,
        knockouts: 0,
        submissions: 0,
        decisions: 0,
        others: 0,
      },
      losses: {
        total: 0,
        knockouts: 0,
        submissions: 0,
        decisions: 0,
        others: 0,
      },
      strikes: {
        attempted: 0,
        successful: 0,
        standing: 0,
        clinch: 0,
        ground: 0,
      },
      takedowns: {
        attempted: 0,
        successful: 0,
        submissions: 0,
        passes: 0,
        sweeps: 0,
      },
      fights: [],
    };

    const sherDogOpt = {
      query: `${query} site:www.sherdog.com/fighter/`,
      solver: dbc,
      limit: 10,
    };

    const ufcOptions = {
      query: `${query} site:www.ufc.com/fighter`,
      solver: dbc,
      limit: 10,
    };
    const searchSherdog = () => new Promise((resolve, reject) => {
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

    const searchUfc = () => new Promise((resolve, reject) => {
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

    const parseSherdog = ($) => {
      $('h1[itemprop="name"]').filter(function () {
        const el = $(this);
        name = el.find('span.fn').text();
        nickname = el.find('span.nickname').text();
        fighter.name = name;
        fighter.nickname = nickname.replace(/['"]+/g, '');
      });
      // Fighter image
      fighter.image_url = $('.profile_image.photo').attr('src');
      // Fighter bio
      $('.bio').filter(function () {
        const el = $(this);
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
      $('.record .count_history').filter(function () {
        const el = $(this);
        const wins = el.find('.left_side .bio_graph').first();
        const winsByKnockout = wins.find('.graph_tag:nth-child(3)');
        const winsBySubmission = wins.find('.graph_tag:nth-child(5)');
        const winsByDecision = wins.find('.graph_tag:nth-child(7)');
        const winsByOther = wins.find('.graph_tag:nth-child(9)');
        const losses = el.find('.left_side .bio_graph.loser');
        const lossesByKnockout = losses.find('.graph_tag:nth-child(3)');
        const lossesBySubmission = losses.find('.graph_tag:nth-child(5)');
        const lossesByDecision = losses.find('.graph_tag:nth-child(7)');
        const lossesByOther = losses.find('.graph_tag:nth-child(9)');
        const noContests = el.find('.right_side .bio_graph');
        const getTotal = function (el) { return parseInt(el.text().split(' ')[0] || 0); };
        const getPercent = function (el) { return el.find('em').text().split('%')[0]; };
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
      $('.module.fight_history tr:not(.table_head)').each(function () {
        const el = $(this);
        result = el.find('td:nth-child(1) .final_result').text();
        opponent_name = el.find('td:nth-child(2) a').text();
        opponent_url = el.find('td:nth-child(2) a').attr('href');
        event_name = el.find('td:nth-child(3) a').text();
        event_url = el.find('td:nth-child(3) a').attr('href');
        event_date = el.find('td:nth-child(3) .sub_line').text();
        method = `${el.find('td:nth-child(4)').text().split(/\)(.*)/)[0]})`;
        referee = el.find('td:nth-child(4) .sub_line').text();
        round = el.find('td:nth-child(5)').text();
        time = el.find('td:nth-child(6)').text();
        // ----------------------------------+
        //  JSON object for Fight
        // ----------------------------------+
        const fight = {
          name: event_name,
          date: event_date,
          url: event_url,
          result,
          method,
          referee,
          round,
          time,
          opponent: opponent_name,
        };

        if (result !== '') {
          fighter.fights.push(fight);
        }
      });
      return fighter;
    };

    const parseUfc = ($) => {
      $('#fighter-details h1').filter(function () {
        const el = $(this);
        name = el.text();
        fighter.name = name;
      });
      // Nickname
      $('td#fighter-nickname').filter(function () {
        const el = $(this);
        nickname = el.text();
        fighter.nickname = nickname;
      });
      // Fullname
      $('head title').filter(function () {
        const el = $(this);
        fullname = el.text().split(' -')[0];
        fighter.fullname = fullname;
      });
      // Hometown
      $('td#fighter-from').filter(function () {
        const el = $(this);
        hometown = el.text().replace(/[\n\t]/g, '');
        fighter.hometown = hometown;
      });
      // Location
      $('td#fighter-lives-in').filter(function () {
        const el = $(this);
        location = el.text().replace(/[\n\t]/g, '');
        fighter.location = location;
      });
      // Age
      $('td#fighter-age').filter(function () {
        const el = $(this);
        age = el.text();
        fighter.age = age;
      });
      // Height
      $('td#fighter-height').filter(function () {
        const el = $(this);
        height = el.text().split(' (')[0];
        height_cm = el.text().split('( ')[1].split(' cm )')[0];
        fighter.height = height;
        fighter.height_cm = height_cm;
      });
      // Weight
      $('td#fighter-weight').filter(function () {
        const el = $(this);
        weight = el.text().split(' lb (')[0];
        weight_kg = el.text().split('( ')[1].split(' kg )')[0];
        fighter.weight = weight;
        fighter.weight_kg = weight_kg;
      });
      // Record
      $('td#fighter-skill-record').filter(function () {
        const el = $(this);
        record = el.text();
        fighter.record = record;
      });
      // College
      $('td#fighter-college').filter(function () {
        const el = $(this);
        college = el.text();
        fighter.college = college;
      });

      // Degree
      $('td#fighter-degree').filter(function () {
        const el = $(this);
        degree = el.text();
        fighter.degree = degree;
      });
      // Summary
      $('td#fighter-skill-summary').filter(function () {
        const el = $(this);
        summary = el.text().split(', ');
        fighter.summary = summary;
      });
      // Striking Metrics
      $('#fight-history .overall-stats').first().filter(function () {
        const el = $(this);
        const stAttempted = el.find('.graph').first();
        const stSuccessful = el.find('.graph#types-of-successful-strikes-graph');
        strikes_attempted = parseInt(stAttempted.find('.max-number').text());
        strikes_successful = parseInt(stAttempted.find('#total-takedowns-number').text());
        strikes_standing = parseInt(stSuccessful.find('.text-bar').first().text());
        strikes_clinch = parseInt(stSuccessful.find('.text-bar').first().next().text());
        strikes_ground = parseInt(stSuccessful.find('.text-bar').first().next().next()
          .text());
        fighter.strikes.attempted = strikes_attempted;
        fighter.strikes.successful = strikes_successful;
        fighter.strikes.standing = strikes_standing;
        fighter.strikes.clinch = strikes_clinch;
        fighter.strikes.ground = strikes_ground;
      });
      // Grappling Metrics
      $('#fight-history .overall-stats').first().next().filter(function () {
        const el = $(this);
        const tdAttempted = el.find('.graph').first();
        const tdSuccessful = el.find('.graph#grappling-totals-by-type-graph');
        takedowns_attempted = parseInt(tdAttempted.find('.max-number').text());
        takedowns_successful = parseInt(tdAttempted.find('#total-takedowns-number').text());
        takedowns_submissions = parseInt(tdSuccessful.find('.text-bar').first().text());
        takedowns_passes = parseInt(tdSuccessful.find('.text-bar').first().next().text());
        takedowns_sweeps = parseInt(tdSuccessful.find('.text-bar').first().next().next()
          .text());
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
    fighter = parseUfc(ufcDom);

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

