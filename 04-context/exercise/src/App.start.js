/*
- Make the Play button work
- Make the Pause button work
- Disable the play button if it's playing
- Disable the pause button if it's not playing
- Make the PlayPause button work
- Make the JumpForward button work
- Make the JumpBack button work
- Make the progress bar work
  - change the width of the inner element to the percentage of the played track
  - add a click handler on the progress bar to jump to the clicked spot

Here is the audio API you'll need to use, `audio` is the <audio/> dom nod
instance, you can access it as `this.audio` in `AudioPlayer`

```js
// play/pause
audio.play()
audio.pause()

// change the current time
audio.currentTime = audio.currentTime + 10
audio.currentTime = audio.currentTime - 30

// know the duration
audio.duration

// values to calculate relative mouse click position
// on the progress bar
event.clientX // left position *from window* of mouse click
let rect = node.getBoundingClientRect()
rect.left // left position *of node from window*
rect.width // width of node
```

Other notes about the `<audio/>` tag:

- You can't know the duration until `onLoadedData`
- `onTimeUpdate` is fired when the currentTime changes
- `onEnded` is called when the track plays through to the end and is no
  longer playing

Good luck!
*/

import React, { createContext } from "react";
import podcast from "./lib/podcast.mp4";
import mario from "./lib/mariobros.mp3";
import FaPause from "react-icons/lib/fa/pause";
import FaPlay from "react-icons/lib/fa/play";
import FaRepeat from "react-icons/lib/fa/repeat";
import FaRotateLeft from "react-icons/lib/fa/rotate-left";

let PlayerContext = createContext();

class AudioPlayer extends React.Component {
  state = {
    isPlaying: false,
    loaded: false,
    duration: 0,
    currentTime: 0,
    play: () => {
      this.audio.play();
      this.setState({ isPlaying: true });
    },
    pause: () => {
      this.audio.pause();
      this.setState({ isPlaying: false });
    },
    jumpForward: () => {
      this.audio.currentTime += 10;
    },
    jumpBack: () => {
      this.audio.currentTime -= 30;
    },
    setTime: (time) => {
      this.audio.currentTime = time;
    }
  };

  render() {
    return (
      <PlayerContext.Provider value={this.state}>
        <div className="audio-player">
          <audio
            src={this.props.source}
            onTimeUpdate={() => {
              this.setState({
                currentTime: this.audio.currentTime,
                duration: this.audio.duration
              })
            }}
            onLoadedData={() => {
              this.setState({
                duration: this.audio.duration,
                loaded: true
              })
            }}
            onEnded={() => {
              this.setState({
                isPlaying: false
              })
            }}
            ref={n => (this.audio = n)}
          />
          {this.props.children}
        </div>
      </PlayerContext.Provider>
    );
  }
}

class Play extends React.Component {
  render() {
    return (
      <PlayerContext.Consumer>
        {context => (
          <button
            className="icon-button"
            onClick={context.play}
            disabled={context.isPlaying}
            title="play"
          >
            <FaPlay />
          </button>
        )}
      </PlayerContext.Consumer>
    );
  }
}

class Pause extends React.Component {
  render() {
    return (
      <PlayerContext.Consumer>
        {context => (
          <button
            className="icon-button"
            onClick={context.pause}
            disabled={!context.isPlaying}
            title="pause"
          >
            <FaPause />
          </button>
        )}
      </PlayerContext.Consumer>
    );
  }
}

class PlayPause extends React.Component {
  render() {
    return (
      <PlayerContext.Consumer>
        {context => (context.isPlaying ? <Pause /> : <Play />)}
      </PlayerContext.Consumer>
    );
  }
}

class JumpForward extends React.Component {
  render() {
    return (
      <PlayerContext.Consumer>
        {context => (
          <button
            className="icon-button"
            onClick={context.jumpForward}
            disabled={null}
            title="Forward 10 Seconds"
          >
            <FaRepeat />
          </button>
        )}
      </PlayerContext.Consumer>
    );
  }
}

class JumpBack extends React.Component {
  render() {
    return (
      <PlayerContext.Consumer>
        {context => (
          <button
            className="icon-button"
            onClick={context.jumpBack}
            disabled={null}
            title="Back 10 Seconds"
          >
            <FaRotateLeft />
          </button>
        )}
      </PlayerContext.Consumer>

    );
  }
}

class Progress extends React.Component {
  calculateClick = (event) => {
    let xPos = event.clientX;
    let rect = this.node.getBoundingClientRect();
    let length = rect.right - rect.left;
    return (xPos - rect.left) / length;
  };

  render() {
    return (
      <PlayerContext.Consumer>
        {context => (
          <div
            className="progress"
            ref={n => this.node = n}
            onClick={event => {
              let click = this.calculateClick(event);
              context.setTime(click * context.duration);
            }}
          >
            <div
              className="progress-bar"
              style={{
                width: (context.loaded) ? `${(context.currentTime / context.duration) * 100}%` : '0%'
              }}
            />
          </div>
        )}
      </PlayerContext.Consumer>
    );
  }
}

let Exercise = () => (
  <div className="exercise">
    <AudioPlayer source={mario}>
      <Play /> <Pause /> <span className="player-text">Mario Bros. Remix</span>
      <Progress />
    </AudioPlayer>

    <AudioPlayer source={podcast}>
      <PlayPause /> <JumpBack /> <JumpForward />{" "}
      <span className="player-text">Workshop.me Podcast Episode 02</span>
      <Progress />
    </AudioPlayer>
  </div>
);

export default Exercise;
