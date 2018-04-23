import React from 'react';

export default function Banner(selectedEvent, selectedFight) {
  let text = null;
  // if (selectedEvent[0]) {
  //   if (selectedEvent[0].eventInfo) {
  //     const { base_title, title_tag_line } = selectedEvent[0].eventInfo;
  //     text = <div> {base_title}: {title_tag_line} </div>;
  //   }
  // }
  if (selectedFight[0]) {
    const { home, visitor } = selectedFight[0];
    text = <div> {home} vs {visitor} </div>;
  }

  return (
    <div className="banner">
      {text}
    </div>
  );
}
