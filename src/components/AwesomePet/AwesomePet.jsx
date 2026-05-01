import React, { useState } from 'react';
import classes from './AwesomePet.module.css';

const MESSAGES = [
  'hehe :3',
  'i ❤ open source',
  'much awesome!',
  'stay curious~',
  'yeti approved',
];

export default function AwesomePet() {
  const [phase, setPhase] = useState('idle');
  const [msgIndex, setMsgIndex] = useState(0);

  const isWaving  = phase === 'waving';
  const isExcited = phase !== 'idle';

  function handleMouseEnter() {
    if (!isWaving) setPhase('excited');
  }

  function handleMouseLeave() {
    if (!isWaving) setPhase('idle');
  }

  function handleClick() {
    if (isWaving) return;
    setPhase('waving');
    setMsgIndex(i => (i + 1) % MESSAGES.length);
    setTimeout(() => setPhase('idle'), 2200);
  }

  const yetiClass = [
    classes.Yeti,
    isWaving ? classes.YetiGiggle : classes.YetiIdle,
  ].join(' ');

  return (
    <div
      className={yetiClass}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="img"
      aria-label="Cute yeti mascot — click to interact"
    >
      {isWaving && (
        <div className={classes.Bubble}>
          <span>{MESSAGES[msgIndex]}</span>
        </div>
      )}

      <div className={`${classes.Arm} ${classes.ArmLeft} ${isWaving ? classes.ArmWave : ''}`} />

      <div className={classes.Body}>
        <div className={classes.Head}>
          <div className={`${classes.EarTuft} ${classes.EarLeft}`} />
          <div className={`${classes.EarTuft} ${classes.EarRight}`} />
          <div className={classes.Face}>
            <div className={`${classes.Eye} ${isExcited ? classes.EyeWide : ''}`} />
            <div className={`${classes.Eye} ${isExcited ? classes.EyeWide : ''}`} />
            <div className={classes.Mouth} />
          </div>
        </div>
        <div className={classes.Torso} />
      </div>

      <div className={`${classes.Arm} ${classes.ArmRight}`} />

      <div className={classes.Feet}>
        <div className={classes.Foot} />
        <div className={classes.Foot} />
      </div>
    </div>
  );
}
