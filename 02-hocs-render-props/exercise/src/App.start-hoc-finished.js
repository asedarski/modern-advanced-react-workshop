import React from "react";
import createMediaListener from "./lib/createMediaListener";
import { Galaxy, Trees, Earth } from "./lib/screens";

function withMedia(mediaSizes, Comp) {
  const media = createMediaListener(mediaSizes);

  return class extends React.Component {
    state = {
      media: media.getState()
    };

    componentDidMount() {
      media.listen(media => this.setState({ media }));
    }

    componentWillUnmount() {
      media.dispose();
    }

    render() {
      return <Comp {...this.state} />;
    }
  }
}

class App extends React.Component {
  render() {
    const { media } = this.props;

    return (
      <div>
        {media.big ? (
          <Galaxy />
        ) : media.tiny ? (
          <Trees />
        ) : (
          <Earth />
        )}
      </div>
    );
  }
}

export default withMedia({
  big: "(min-width : 1000px)",
  tiny: "(max-width: 600px)"
}, App);
