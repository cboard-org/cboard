import { React, PureComponent } from 'react';
import { MDCRipple, MDCRippleFoundation } from '@material/ripple/dist/mdc.ripple';

function getMatchesProperty(HTMLElementPrototype) {
  return [
    'webkitMatchesSelector', 'msMatchesSelector', 'matches',
  ].filter((p) => p in HTMLElementPrototype).pop();
}

const MATCHES = getMatchesProperty(HTMLElement.prototype);

class Ripple extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { classes: '' };
    debugger;
  }

  // For browser compatibility we extend the default adapter which checks for css variable support.
  rippleFoundation = new MDCRippleFoundation(Object.assign(MDCRipple.createAdapter(this), {
    isUnbounded: () => true,
    isSurfaceActive: () => this.refs.nativeCb[MATCHES](':active'),
    addClass: className => {
      this.setState(prevState => {
        debugger;
        return ({
          classes: prevState.classes.add(className)
        })
      });
    },
    removeClass: className => {
      debugger;
      this.setState(prevState => {
        return ({
          classes: prevState.classes.remove(className)
        })
      });
    },
    registerInteractionHandler: (evtType, handler) => {
      debugger;
      this.refs.nativeCb.addEventListener(evtType, handler);
    },
    deregisterInteractionHandler: (evtType, handler) => {
      debugger;
      this.refs.nativeCb.removeEventListener(evtType, handler);
    },
    updateCssVariable: (varName, value) => {
      debugger;
      this.setState(prevState => ({
        rippleCss: prevState.rippleCss.set(varName, value)
      }));
    },
    computeBoundingRect: () => {
      const {left, top} = this.refs.root.getBoundingClientRect();
      const DIM = 40;
      return {
        top,
        left,
        right: left + DIM,
        bottom: top + DIM,
        width: DIM,
        height: DIM,
      };
    },
  }));

  render() {
    return (
      <div className={`mdc-ripple-surface ${this.state.classes}`} ref={ref => { this.root = ref }}>
        {this.props.children}
      </div>
    );
  }
}

export default Ripple;