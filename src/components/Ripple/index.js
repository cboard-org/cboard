import '@material/button/dist/mdc.button.css'

import React, { PureComponent, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { clone } from 'lodash';

// import ReactDOM from 'react-dom';
import { MDCRipple, MDCRippleFoundation } from '@material/ripple/dist/mdc.ripple';
import classnames from 'classnames';

function getMatchesProperty(HTMLElementPrototype) {
  return [
    'webkitMatchesSelector', 'msMatchesSelector', 'matches',
  ].filter((p) => p in HTMLElementPrototype).pop();
}

const MATCHES = getMatchesProperty(HTMLElement.prototype);

const baseClasses = 'mdc-ripple-surfce',
  EMPTY_READONLY_ARRAY = [];

class Ripple extends PureComponent {
  
  state = { 
    classes: EMPTY_READONLY_ARRAY, 
    rippleCss: EMPTY_READONLY_ARRAY, 
  };

  addClass(className) {
    this.setState(prevState => {
      const classes = clone(prevState.classes);
      classes.push(className);
      return { classes };
    });
  }

  removeClass(className) {
    this.setState(prevState => {
      const classes = clone(prevState.classes);
      classes.indexOf(className);
      return { classes };
    });
  }

  registerInteractionHandler(evtType, handler) {
    const child = React.Children.only(this.props.children);
    const ref = ReactDOM.findDOMNode(child._self);
    ref.addEventListener(evtType, handler);
  }

  deregisterInteractionHandler(evtType, handler) {
    const child = React.Children.only(this.props.children);
    const ref = ReactDOM.findDOMNode(child);
    ref.removeEventListener(evtType, handler);
  }

  updateCssVariable(varName, value) {
    this.setState(prevState => {
      const rippleCss = [varName, value];
      return { rippleCss };
    });
  }

  computeBoundingRect() {
    const {left, top} = this.root.getBoundingClientRect();
    const DIM = 40;

    return {
      top,
      left,
      right: left + DIM,
      bottom: top + DIM,
      width: DIM,
      height: DIM,
    };
  }

  // For browser compatibility we extend the default adapter which checks for css variable support.
  rippleFoundation = new MDCRippleFoundation(Object.assign(MDCRipple.createAdapter(this), {
    isUnbounded: () => true,
    isSurfaceActive: () => this.props.children[0][MATCHES](':active'),
    addClass: this.addClass.bind(this),
    removeClass: this.removeClass.bind(this),
    registerInteractionHandler: this.registerInteractionHandler.bind(this),
    deregisterInteractionHandler: this.deregisterInteractionHandler.bind(this),
    updateCssVariable: this.updateCssVariable.bind(this),
    computeBoundingRect: this.computeBoundingRect.bind(this),
  }));

  componentDidMount() {
    this.rippleFoundation.init();
  }

  componentWillUnmount() {
    this.rippleFoundation.destroy();
  }

  componentDidUpdate() {

    // To make the ripple animation work we update the css properties after React finished building the DOM.
    if (this.root) {
      this.state.rippleCss.forEach((v, k) => {
        this.root.style.setProperty(k, v);
      });
    }
  }

  render() {


    return (
      <div className="mdc-surface-ripple" ref={ref => { this.root = ref }}>{this.props.children}</div>
    )
  }
}

Ripple.PropTypes = {
  className: PropTypes.string,
  compact: PropTypes.bool,
  primary: PropTypes.bool,
  accent: PropTypes.bool,
  raised: PropTypes.bool,
  dense: PropTypes.bool
}

export default Ripple