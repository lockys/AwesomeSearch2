import { buildBullet, getFontSize } from './helpers';

describe('helpers', () => {
  test('buildBullet repeats pattern by level', () => {
    expect(buildBullet('-', 3)).toBe('---');
    expect(buildBullet('*', 1)).toBe('*');
    expect(buildBullet('x', 0)).toBe('');
  });

  test('getFontSize returns size and color', () => {
    expect(getFontSize(1)).toEqual({ size: '1.2rem', color: 'black' });
    expect(getFontSize(2)).toEqual({ size: '1rem', color: 'grey' });
    expect(getFontSize(3)).toEqual({ size: '0.8rem', color: 'red' });
    expect(getFontSize(7)).toEqual({ size: '0.8rem', color: 'red' });
  });
});
