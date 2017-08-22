import React from 'react';

const img = 'http://www.craziestsportsfights.com/wp-content/uploads/2017/07/mmaimports.png';

function FightBanner(link) {
  if (link.img) {  
    return <div> <img src={link.img} /></div>
  } else {
    return <div> <img src={img} /></div>
  }
}

export default FightBanner;