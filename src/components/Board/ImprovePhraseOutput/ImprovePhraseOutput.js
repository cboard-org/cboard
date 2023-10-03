import React from 'react';
import PropTypes from 'prop-types';

import styles from './ImprovePhraseOutput.module.css';

import { Typography } from '@material-ui/core';
import { PlayArrow } from '@material-ui/icons';

const propTypes = {
  improvedPhrase: PropTypes.string,
  speak: PropTypes.func
};

function ImprovePhraseOutput({ improvedPhrase, speak }) {
  const handlePlay = async () => {
    if (!improvedPhrase || improvedPhrase.length === 0) return;
    speak(improvedPhrase);
  };
  const enabledControllsClassname = improvedPhrase
    ? `${styles.text_and_controls} ${styles.enabled}`
    : styles.text_and_controls;

  return (
    <div
      tabIndex="0"
      className={enabledControllsClassname}
      onClick={handlePlay}
    >
      <Typography className={styles.text} variant="h5">
        {improvedPhrase}
      </Typography>
      {improvedPhrase && (
        <PlayArrow className={styles.playArrow} fontSize="large" />
      )}
    </div>
  );
}

ImprovePhraseOutput.propTypes = propTypes;

export default ImprovePhraseOutput;
