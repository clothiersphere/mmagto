const keys = require('../keys.js');
const axios = require('axios');
const { parseString } = require('xml2js');
const scraper = require('google-search-scraper');
const DeathByCaptcha = require('deathbycaptcha');

const JsonOddsAPI = require('json-odds-api');

// const jsonOdds = new JsonOddsAPI(keys.JsonOdds);


const dbc = new DeathByCaptcha('xchrislee', '');
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
//         parsedData[i].fights[j].homeInfo = searchFighterDB(homeFirst, homeLast, hasNick, ufcFightersApiQuery);
//         parsedData[i].fights[j].visitorInfo = searchFighterDB(visitorFirst, visitorLast, hasNick, ufcFightersApiQuery);
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
  // const url = `https://jsonodds.com/api/odds/MMA -H "x-api-key: ${keys.JsonOdds}" -L`;
  const url = 'https://jsonodds.com/api/odds/mma';
  return axios({
    method: 'get',
    url,
    headers: { 'x-api-key': keys.JsonOdds },
  }).then((response) => {
    const hasDetails = response.data.filter(fight => Object.hasOwnProperty.call(fight, 'Details'));
    const ufcFights = hasDetails.filter(fight => fight.Details.includes('UFC'));
    const ppv = ufcFights.filter(fight => fight.Details.includes('PPV'));

    const temp = ppv.map((obj) => {
      const details = obj.Details.split('-');
      const event = details[0];
      const weightRound = details[1].split(' ');
      const weight = weightRound[1];
      const rounds = weightRound[2];

      return {
        ID: obj.ID,
        HomeTeam: obj.HomeTeam,
        AwayTeam: obj.AwayTeam,
        Event: event,
        Weight: weight,
        Rounds: rounds,
        Odds: obj.Odds,
      };
    });


    res.send(temp);
    next();
  }).catch((err) => {
    console.log(err, 'rejected');
  });
}

function parseFights(fights) {

}


// async function getFighterStats(req, res, next) {
//   const fighter = req.params.id;
//   let data;
//   async function retrieve(query) {
//     let sherdogUrl;
//     let ufcUrl;
//     let fighter = {
//       name: '',
//       nickname: '',
//       fullname: '',
//       record: '',
//       association: '',
//       age: '',
//       birthday: '',
//       hometown: '',
//       nationality: '',
//       location: '',
//       height: '',
//       height_cm: '',
//       weight: '',
//       weight_kg: '',
//       weight_class: '',
//       college: '',
//       degree: '',
//       summary: [],
//       wins: {
//         total: 0,
//         knockouts: 0,
//         submissions: 0,
//         decisions: 0,
//         others: 0,
//       },
//       losses: {
//         total: 0,
//         knockouts: 0,
//         submissions: 0,
//         decisions: 0,
//         others: 0,
//       },
//       strikes: {
//         attempted: 0,
//         successful: 0,
//         standing: 0,
//         clinch: 0,
//         ground: 0,
//       },
//       takedowns: {
//         attempted: 0,
//         successful: 0,
//         submissions: 0,
//         passes: 0,
//         sweeps: 0,
//       },
//       fights: [],
//     };

//     const sherDogOpt = {
//       query: `${query} site:www.sherdog.com/fighter/`,
//       solver: dbc,
//       limit: 10,
//     };

//     const ufcOptions = {
//       query: `${query} site:www.ufc.com/fighter`,
//       solver: dbc,
//       limit: 10,
//     };
//     const searchSherdog = () => new Promise((resolve, reject) => {
//       const results = [];
//       scraper.search(sherDogOpt, (err, url) => {
//         if (err) {
//           reject(err);
//         } else {
//           results.push(url);
//           if (results.length === 10) {
//             resolve(results);
//           }
//         }
//       });
//     });

//     const searchUfc = () => new Promise((resolve, reject) => {
//       const results = [];
//       scraper.search(ufcOptions, (err, url) => {
//         if (err) {
//           reject(err);
//         } else {
//           results.push(url);
//           if (results.length === 10) {
//             resolve(results);
//           }
//         }
//       });
//     });

//     const parseSherdog = ($) => {
//       $('h1[itemprop="name"]').filter(function () {
//         const el = $(this);
//         name = el.find('span.fn').text();
//         nickname = el.find('span.nickname').text();
//         fighter.name = name;
//         fighter.nickname = nickname.replace(/['"]+/g, '');
//       });
//       // Fighter image
//       fighter.image_url = $('.profile_image.photo').attr('src');
//       // Fighter bio
//       $('.bio').filter(function () {
//         const el = $(this);
//         age = el.find('.item.birthday strong').text();
//         birthday = el.find('span[itemprop="birthDate"]').text();
//         locality = el.find('span[itemprop="addressLocality"]').text();
//         nationality = el.find('strong[itemprop="nationality"]').text();
//         association = el.find('.item.association span[itemprop="name"]').text();
//         height = el.find('.item.height strong').text();
//         weight = el.find('.item.weight strong').text();
//         weight_class = el.find('.item.wclass strong').text();
//         fighter.age = age.slice(5);
//         fighter.birthday = birthday;
//         fighter.locality = locality;
//         fighter.nationality = nationality;
//         fighter.association = association;
//         fighter.height = height;
//         fighter.weight = weight;
//         fighter.weight_class = weight_class;
//       });
//       // Fighter record
//       $('.record .count_history').filter(function () {
//         const el = $(this);
//         const wins = el.find('.left_side .bio_graph').first();
//         const winsByKnockout = wins.find('.graph_tag:nth-child(3)');
//         const winsBySubmission = wins.find('.graph_tag:nth-child(5)');
//         const winsByDecision = wins.find('.graph_tag:nth-child(7)');
//         const winsByOther = wins.find('.graph_tag:nth-child(9)');
//         const losses = el.find('.left_side .bio_graph.loser');
//         const lossesByKnockout = losses.find('.graph_tag:nth-child(3)');
//         const lossesBySubmission = losses.find('.graph_tag:nth-child(5)');
//         const lossesByDecision = losses.find('.graph_tag:nth-child(7)');
//         const lossesByOther = losses.find('.graph_tag:nth-child(9)');
//         const noContests = el.find('.right_side .bio_graph');
//         const getTotal = function (el) { return parseInt(el.text().split(' ')[0] || 0); };
//         const getPercent = function (el) { return el.find('em').text().split('%')[0]; };
//         wins_total = parseInt(wins.find('.card .counter').text());
//         losses_total = parseInt(losses.find('.counter').text());
//         no_contests_total = parseInt(noContests.find('.counter').text());
//         fighter.wins.total = wins_total;
//         fighter.losses.total = losses_total;
//         fighter.no_contests = no_contests_total;
//         fighter.wins.knockouts = getTotal(winsByKnockout);
//         fighter.wins.submissions = getTotal(winsBySubmission);
//         fighter.wins.decisions = getTotal(winsByDecision);
//         fighter.wins.others = getTotal(winsByOther);
//         fighter.losses.knockouts = getTotal(lossesByKnockout);
//         fighter.losses.submissions = getTotal(lossesBySubmission);
//         fighter.losses.decisions = getTotal(lossesByDecision);
//       });
//       // Fighter Fight History
//       $('.module.fight_history tr:not(.table_head)').each(function () {
//         const el = $(this);
//         result = el.find('td:nth-child(1) .final_result').text();
//         opponent_name = el.find('td:nth-child(2) a').text();
//         opponent_url = el.find('td:nth-child(2) a').attr('href');
//         event_name = el.find('td:nth-child(3) a').text();
//         event_url = el.find('td:nth-child(3) a').attr('href');
//         event_date = el.find('td:nth-child(3) .sub_line').text();
//         method = `${el.find('td:nth-child(4)').text().split(/\)(.*)/)[0]})`;
//         referee = el.find('td:nth-child(4) .sub_line').text();
//         round = el.find('td:nth-child(5)').text();
//         time = el.find('td:nth-child(6)').text();
//         // ----------------------------------+
//         //  JSON object for Fight
//         // ----------------------------------+
//         const fight = {
//           name: event_name,
//           date: event_date,
//           url: event_url,
//           result,
//           method,
//           referee,
//           round,
//           time,
//           opponent: opponent_name,
//         };

//         if (result !== '') {
//           fighter.fights.push(fight);
//         }
//       });
//       return fighter;
//     };

//     const parseUfc = ($) => {
//       $('#fighter-details h1').filter(function () {
//         const el = $(this);
//         name = el.text();
//         fighter.name = name;
//       });
//       // Nickname
//       $('td#fighter-nickname').filter(function () {
//         const el = $(this);
//         nickname = el.text();
//         fighter.nickname = nickname;
//       });
//       // Fullname
//       $('head title').filter(function () {
//         const el = $(this);
//         fullname = el.text().split(' -')[0];
//         fighter.fullname = fullname;
//       });
//       // Hometown
//       $('td#fighter-from').filter(function () {
//         const el = $(this);
//         hometown = el.text().replace(/[\n\t]/g, '');
//         fighter.hometown = hometown;
//       });
//       // Location
//       $('td#fighter-lives-in').filter(function () {
//         const el = $(this);
//         location = el.text().replace(/[\n\t]/g, '');
//         fighter.location = location;
//       });
//       // Age
//       $('td#fighter-age').filter(function () {
//         const el = $(this);
//         age = el.text();
//         fighter.age = age;
//       });
//       // Height
//       $('td#fighter-height').filter(function () {
//         const el = $(this);
//         height = el.text().split(' (')[0];
//         height_cm = el.text().split('( ')[1].split(' cm )')[0];
//         fighter.height = height;
//         fighter.height_cm = height_cm;
//       });
//       // Weight
//       $('td#fighter-weight').filter(function () {
//         const el = $(this);
//         weight = el.text().split(' lb (')[0];
//         weight_kg = el.text().split('( ')[1].split(' kg )')[0];
//         fighter.weight = weight;
//         fighter.weight_kg = weight_kg;
//       });
//       // Record
//       $('td#fighter-skill-record').filter(function () {
//         const el = $(this);
//         record = el.text();
//         fighter.record = record;
//       });
//       // College
//       $('td#fighter-college').filter(function () {
//         const el = $(this);
//         college = el.text();
//         fighter.college = college;
//       });

//       // Degree
//       $('td#fighter-degree').filter(function () {
//         const el = $(this);
//         degree = el.text();
//         fighter.degree = degree;
//       });
//       // Summary
//       $('td#fighter-skill-summary').filter(function () {
//         const el = $(this);
//         summary = el.text().split(', ');
//         fighter.summary = summary;
//       });
//       // Striking Metrics
//       $('#fight-history .overall-stats').first().filter(function () {
//         const el = $(this);
//         const stAttempted = el.find('.graph').first();
//         const stSuccessful = el.find('.graph#types-of-successful-strikes-graph');
//         strikes_attempted = parseInt(stAttempted.find('.max-number').text());
//         strikes_successful = parseInt(stAttempted.find('#total-takedowns-number').text());
//         strikes_standing = parseInt(stSuccessful.find('.text-bar').first().text());
//         strikes_clinch = parseInt(stSuccessful.find('.text-bar').first().next().text());
//         strikes_ground = parseInt(stSuccessful.find('.text-bar').first().next().next()
//           .text());
//         fighter.strikes.attempted = strikes_attempted;
//         fighter.strikes.successful = strikes_successful;
//         fighter.strikes.standing = strikes_standing;
//         fighter.strikes.clinch = strikes_clinch;
//         fighter.strikes.ground = strikes_ground;
//       });
//       // Grappling Metrics
//       $('#fight-history .overall-stats').first().next().filter(function () {
//         const el = $(this);
//         const tdAttempted = el.find('.graph').first();
//         const tdSuccessful = el.find('.graph#grappling-totals-by-type-graph');
//         takedowns_attempted = parseInt(tdAttempted.find('.max-number').text());
//         takedowns_successful = parseInt(tdAttempted.find('#total-takedowns-number').text());
//         takedowns_submissions = parseInt(tdSuccessful.find('.text-bar').first().text());
//         takedowns_passes = parseInt(tdSuccessful.find('.text-bar').first().next().text());
//         takedowns_sweeps = parseInt(tdSuccessful.find('.text-bar').first().next().next()
//           .text());
//         fighter.takedowns.attempted = takedowns_attempted;
//         fighter.takedowns.successful = takedowns_successful;
//         fighter.takedowns.submissions = takedowns_submissions;
//         fighter.takedowns.passes = takedowns_passes;
//         fighter.takedowns.sweeps = takedowns_sweeps;
//       });

//       return fighter;
//     };

//     const sherdogLinks = await searchSherdog();
//     sherdogUrl = sherdogLinks[0];
//     const sherdogHtml = await axios.get(sherdogUrl).then(response => response.data);
//     const sherdogDom = cheerio.load(sherdogHtml);
//     const ufcLinks = await searchUfc();
//     ufcUrl = ufcLinks[0];
//     const ufcHtml = await axios.get(ufcUrl).then(response => response.data);
//     const ufcDom = cheerio.load(ufcHtml);

//     fighter = parseSherdog(sherdogDom);
//     fighter = parseUfc(ufcDom);

//     return fighter;
//   }
//   data = await retrieve(fighter);
//   res.send(data);
//   next();
// }

module.exports = {
  getEvents,
  // getFighterStats,
};

