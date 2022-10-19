import React from 'react';

const captured = event => {
  console.log('elem captured ');
  event.stopPropagation();
};
function PremiumFeature(props) {
  console.log(props.children);
  return <div onClickCapture={captured}>{props.children}</div>;
}

export default PremiumFeature;
