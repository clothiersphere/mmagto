import React from 'react';

export default function Banner({text, img}) {
  return (
    <div className="banner">
      {img}
      {text}
    </div>
  );
}