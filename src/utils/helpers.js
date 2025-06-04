export const buildBullet = (pattern, level) => {
  return Array(level).fill(pattern).join('');
};

export const getFontSize = (level) => {
  let size = '1.2rem';
  let color = 'black';
  switch (level) {
    case 1:
      size = '1.2rem';
      color = 'black';
      break;
    case 2:
      size = '1rem';
      color = 'grey';
      break;
    case 3:
    case 4:
    case 5:
    case 6:
      size = '0.8rem';
      color = 'red';
      break;
    default:
      size = '0.8rem';
      color = 'red';
      break;
  }
  return { size, color };
};
