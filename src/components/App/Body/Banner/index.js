import React from 'react';

export default function Banner(selectedEvent, selectedFight) {
  let text = null;
  if (selectedEvent[0]) {
    const { base_title, title_tag_line } = selectedEvent[0].eventInfo;
    text = <div> {base_title}: {title_tag_line} </div>;
  }

  if (selectedFight[0]) {
  }

  return (
    <div className="banner">
      {text}
    </div>
  );
}
