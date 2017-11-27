import axios from 'axios';
import * as actionTypes from '../constants/actionTypes';

function setFight(fight) {
  return {
    type: actionTypes.FIGHT_SET,
    fight,
  };
}

export function selectFight(fight) {
  return function (dispatch) {
    const { home, visitor } = fight;

    function getHome() {
      const request1 = axios({
        method: 'GET',
        url: 'http://localhost:8080/api/getFighterStats/' + home,
      });

      return request1;
    }
    function getVisitor() {
      const request2 = axios({
        method: 'GET',
        url: 'http://localhost:8080/api/getFighterStats/' + visitor
      });
      return request2;
    }
    axios.all([getHome(), getVisitor()])
      .then(axios.spread((homeStats, visitorStats) => {
        const data = fight;
        data.homeFightStats = homeStats.data;
        data.visitorFightStats = visitorStats.data;
        dispatch({ type: 'FIGHTER_RESET' });
        dispatch(setFight(data));
      }));
  };
}

//check if fighter stat data is available.
//if it's not 
	//make get request to server. 
	//server will make api calls to pull fighter info
	//server will pass back fighter stat info. 
//reducer will update fighter stats data.
//reducer will pass back new state w/ fighter stat data.