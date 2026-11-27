import { createTheme } from '@material-ui/core/styles';

import { getJoyrideStyles } from './joyrideStyles';

const darkTheme = createTheme({ palette: { type: 'dark' } });

describe('getJoyrideStyles', () => {
  it('keeps the light tour colors', () => {
    const styles = getJoyrideStyles(createTheme());

    expect(styles.options).toEqual({
      arrowColor: '#eee',
      backgroundColor: '#eee',
      primaryColor: '#aa00ff',
      textColor: '#333',
      width: 500,
      zIndex: 10000
    });
    expect(styles.buttonBack).toBeUndefined();
  });

  it('uses the dark paper, light text, a stronger overlay and a readable Back', () => {
    const styles = getJoyrideStyles(darkTheme);
    const { paper } = darkTheme.palette.background;

    expect(styles.options).toMatchObject({
      arrowColor: paper,
      backgroundColor: paper,
      textColor: darkTheme.palette.text.primary,
      overlayColor: 'rgba(0, 0, 0, 0.75)',
      primaryColor: '#aa00ff'
    });
    expect(styles.buttonBack.color).toBe('#e1bee7');
  });

  it('keeps layout overrides from each tour', () => {
    const styles = getJoyrideStyles(createTheme(), {
      tooltipContent: { padding: '5px 5px' },
      options: { zIndex: 1000 }
    });

    expect(styles.tooltipContent).toEqual({ padding: '5px 5px' });
    expect(styles.options.zIndex).toBe(1000);
  });

  it('does not let a tour override the theme colors', () => {
    const styles = getJoyrideStyles(darkTheme, {
      options: { backgroundColor: '#eee', textColor: '#333' }
    });

    expect(styles.options.backgroundColor).toBe(
      darkTheme.palette.background.paper
    );
    expect(styles.options.textColor).toBe(darkTheme.palette.text.primary);
  });
});
