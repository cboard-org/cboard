import { createTheme } from '@material-ui/core/styles';

import { getJoyrideStyles } from './joyrideStyles';

describe('getJoyrideStyles', () => {
  it('keeps the light tour colors', () => {
    const styles = getJoyrideStyles(createTheme());

    expect(styles.options).toMatchObject({
      arrowColor: '#eee',
      backgroundColor: '#eee',
      overlayColor: 'rgba(0, 0, 0, 0.5)',
      primaryColor: '#aa00ff',
      textColor: '#333',
      width: 500,
      zIndex: 10000
    });
    expect(styles.tooltip).toEqual({
      backgroundColor: '#eee',
      color: '#333'
    });
    expect(styles.tooltipTitle.color).toBe('#333');
    expect(styles.tooltipContent.color).toBe('#333');
    expect(styles.buttonNext).toEqual({
      backgroundColor: '#aa00ff',
      color: '#fff'
    });
    expect(styles.buttonBack.color).toBe('#aa00ff');
    expect(styles.buttonSkip.color).toBe('#333');
    expect(styles.buttonClose.color).toBe('#333');
  });

  it('uses a dark surface, light text and a stronger overlay', () => {
    const theme = createTheme({ palette: { type: 'dark' } });
    const styles = getJoyrideStyles(theme);
    const paper = theme.palette.background.paper;
    const text = theme.palette.text.primary;

    expect(styles.options.backgroundColor).toBe(paper);
    expect(styles.options.arrowColor).toBe(paper);
    expect(styles.options.textColor).toBe(text);
    expect(styles.options.overlayColor).toBe('rgba(0, 0, 0, 0.75)');
    expect(styles.options.primaryColor).toBe('#aa00ff');
    expect(styles.tooltip).toEqual({
      backgroundColor: paper,
      color: text
    });
    expect(styles.tooltipTitle.color).toBe(text);
    expect(styles.tooltipContent.color).toBe(text);
    expect(styles.buttonNext.color).toBe('#fff');
    expect(styles.buttonBack.color).toBe('#e1bee7');
    expect(styles.buttonSkip.color).toBe(text);
    expect(styles.buttonClose.color).toBe(text);
    expect(paper).not.toBe('#eee');
    expect(text).not.toBe('#333');
  });

  it('preserves layout overrides from each tour', () => {
    const styles = getJoyrideStyles(createTheme(), {
      tooltipContent: { padding: '5px 5px' },
      options: { zIndex: 1000 }
    });

    expect(styles.tooltipContent).toEqual({
      color: '#333',
      padding: '5px 5px'
    });
    expect(styles.options.zIndex).toBe(1000);
    expect(styles.options.backgroundColor).toBe('#eee');
    expect(styles.tooltip.backgroundColor).toBe('#eee');
  });

  it('does not let a layout override paint the light tooltip back on', () => {
    const theme = createTheme({ palette: { type: 'dark' } });
    const styles = getJoyrideStyles(theme, {
      options: {
        zIndex: 1000,
        backgroundColor: '#eee',
        textColor: '#333',
        overlayColor: 'rgba(0, 0, 0, 0.5)'
      }
    });

    expect(styles.options.zIndex).toBe(1000);
    expect(styles.options.backgroundColor).toBe(theme.palette.background.paper);
    expect(styles.options.textColor).toBe(theme.palette.text.primary);
    expect(styles.options.overlayColor).toBe('rgba(0, 0, 0, 0.75)');
    expect(styles.tooltip.backgroundColor).toBe(theme.palette.background.paper);
    expect(styles.tooltip.color).toBe(theme.palette.text.primary);
  });
});
