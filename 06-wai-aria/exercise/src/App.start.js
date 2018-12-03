/*

Follow the WAI ARIA Radio Group example at:
https://www.w3.org/TR/wai-aria-practices-1.1/examples/radio/radio-1/radio-1.html

- Turn the span into a button to get keyboard and focus events
- Use tabIndex to allow only the active button to be tabbable
- Use left/right arrows to select the next/previous radio button
  - Tip: you can figure out the next value with React.Children.forEach(fn),
    or React.Children.toArray(children).reduce(fn)
- Move the focus in cDU to the newly selected item
  - Tip: do it in RadioOption not RadioGroup
  - Tip: you'll need a ref
- Add the aria attributes
  - radiogroup
  - radio
  - aria-checked
  - aria-label on the icons

*/
import React, { Component } from "react";
import FaPlay from "react-icons/lib/fa/play";
import FaPause from "react-icons/lib/fa/pause";
import FaForward from "react-icons/lib/fa/forward";
import FaBackward from "react-icons/lib/fa/backward";

class RadioGroup extends Component {
  state = {
    value: this.props.defaultValue
  };

  findNextValue = (children) => {
    return React.Children.toArray(children).reduce(
      (nextValue, child, index, array) => {
        if (child.props.value === this.state.value) {
          let nextIndex = index === array.length - 1 ? 0 : index + 1;
          return array[nextIndex].props.value;
        }
        return nextValue;
      },
      null
    )
  };

  findPreviousValue = (children) => {
    return React.Children.toArray(children).reduce(
      (nextValue, child, index, array) => {
        if (child.props.value === this.state.value) {
          let nextIndex = index === 0 ? array.length -1 : index - 1;
          return array[nextIndex].props.value;
        }
        return nextValue;
      },
      null
    )
  }

  handleOnKeyDown = (event, children) => {
    if (event.key === 'ArrowRight') {
      this.setState({ value: this.findNextValue(children) });
    } else if (event.key === 'ArrowLeft') {
      this.setState({ value: this.findPreviousValue(children) });
    }
  };

  render() {
    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        isActive: child.props.value === this.state.value,
        onSelect: () => this.setState({ value: child.props.value })
      });
    });
    return (
      <fieldset
        role="radiogroup"
        className="radio-group"
        onKeyDown={(event) => this.handleOnKeyDown(event, this.props.children)}
      >
        <legend>{this.props.legend}</legend>
        {children}
      </fieldset>
    );
  }
}

class RadioButton extends Component {
  node = React.createRef();
  componentDidMount() {
    if (this.props.isActive) {
      this.node.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if(!prevProps.isActive && this.props.isActive) {
      this.node.current.focus();
    }
  }

  render() {
    const { isActive, onSelect } = this.props;
    const className = "radio-button " + (isActive ? "active" : "");
    const tabIndex = isActive ? 0 : -1;
    return (
      <button
        role="radio"
        aria-checked={isActive}
        className={className}
        tabIndex={tabIndex}
        onClick={onSelect}
        ref={this.node}
      >
        {this.props.children}
      </button>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <RadioGroup defaultValue="pause" legend="Radio Group">
          <RadioButton value="back">
            <FaBackward aria-label="Back" />
          </RadioButton>
          <RadioButton value="play">
            <FaPlay aria-label="Play" />
          </RadioButton>
          <RadioButton value="pause">
            <FaPause aria-label="Pause" />
          </RadioButton>
          <RadioButton value="forward">
            <FaForward aria-label="Forward" />
          </RadioButton>
        </RadioGroup>
        <RadioGroup defaultValue="pause" legend="Radio Group">
          <RadioButton value="back">
            <FaBackward aria-label="Back" />
          </RadioButton>
          <RadioButton value="play">
            <FaPlay aria-label="Play" />
          </RadioButton>
          <RadioButton value="pause">
            <FaPause aria-label="Pause" />
          </RadioButton>
          <RadioButton value="forward">
            <FaForward aria-label="Forward" />
          </RadioButton>
        </RadioGroup>
      </div>
    );
  }
}

export default App;
