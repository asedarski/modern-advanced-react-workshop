import React from "react";
import createMediaListener from "./lib/createMediaListener";
import { Galaxy, Trees, Earth } from "./lib/screens";

class Media extends React.Component {
  media = createMediaListener(this.props.sizes);

  state = {
    media: this.media.getState()
  };

  componentDidMount() {
    this.media.listen(media => this.setState({ media }));
  }

  componentDidUpdate(prevProps) {
    if (this.props.sizes !== prevProps.sizes) {
      this.media.dispose();
      this.media = createMediaListener(
        this.props.sizes
      );
      this.media.listen(media => this.setState({ media }));
    }
  }

  componentWillUnmount() {
    this.media.dispose();
  }

  render() {
    return this.props.children(this.state.media);
  }
}

class App extends React.Component {
  state = {
    sizes: {
      big: "(min-width : 1000px)",
      tiny: "(max-width: 600px)"
    }
  };

  render() {
    return (
      <Media sizes={this.state.sizes}>
        {media => (
          <div>
            {media.big ? (
              <Galaxy key="galaxy" />
            ) : media.tiny ? (
              <Trees key="trees" />
            ) : (
              <Earth key="earth" />
            )}
          </div>
        )}
      </Media>
    );
  }
}

export default App;
