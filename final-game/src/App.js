import React from 'react';
import PropTypes from 'prop-types'
import './App.css';
import ChatWindow from './ChatWindow';
import io from 'socket.io-client';
let socket = io('localhost:3001');

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leftForce: 0,
      rightForce: 0,
      winNumber: 0,
      isLeft: Math.random() <= 0.5,
    };

  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
    socket.on('client.tick', this.handleTick);
  }

  componentWillUnmount() {
    document.addEventListener('click', this.handleClick);
  }

  handleClick = (e) => {
    if (this.state.isLeft) {
      socket.emit('server.inputLeft');
    } else {
      socket.emit('server.inputRight');
    }
  };

  /** Client Side Update */ 
  // update = (timestamp) => {
  //   window.requestAnimationFrame(this.update);

  //   let newLeftForce = this.state.leftForce - (this.props.dragForce + (this.state.leftForce * 0.01));
  //   let newRightForce = this.state.rightForce - (this.props.dragForce + (this.state.rightForce * 0.01));
    
    
  //   newLeftForce = clamp(newLeftForce, 0, 10000000);
  //   newRightForce = clamp(newRightForce, 0, 10000000);


  //   let delta = this.state.rightForce - this.state.leftForce;
  //   this.setState({
  //     leftForce: newLeftForce,
  //     rightForce: newRightForce,
  //     lineTranslate: clamp(this.state.lineTranslate + delta, -30000, 30000),
  //   });
  // };

  handleTick = (forces) => {
    this.setState({
      leftForce: forces.leftForce,
      rightForce: forces.rightForce,
      winNumber: forces.winNumber,
    });
  };

  render() {
    let lineStyle = {
      transform: `translate(${this.state.winNumber * 300}px, 0)`
    };

    return (
      <div className="App">
        <label htmlFor="debug_left_force">
          Left Force:
        </label>
        <input type="text" readOnly id="debug_left_force"  value={this.state.leftForce} />
        <label htmlFor="debug_right_force">
          Right Force:
        </label>
        <input type="text" readOnly id="debug_right_force" value={this.state.rightForce} />

        <label htmlFor="debug_delta_force">
          Delta Force:
        </label>
        <input type="text" readOnly id="debug_delta_force"  value={this.state.rightForce - this.state.leftForce} />
        <div className="LineBox">
          <div style={lineStyle} className="Line" />
        </div>
        <ChatWindow />
      </div>
    );
  }
}


App.propTypes = {
  incrementForce: PropTypes.number,
  dragForce: PropTypes.number,
};

App.defaultProps = {
  incrementForce: 40,
  dragForce: 1,
};

export default App;
