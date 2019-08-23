var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

http.listen(3001, () => {
  console.log('listening on *:3001');
});


io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });


  // Chat Logic
  socket.on('server.chatMessage', (msg) => {
    io.emit('client.chatMessage', msg);
  });

  // Game Logic
  socket.on('server.inputLeft', () => {
    incLeft();
  });

  socket.on('server.inputRight', () => {
    incRight();
  });
  
});



function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}


const DRAG_FORCE = 1;
const INC_FORCE = 20



let L_FORCE = 0;
let R_FORCE = 0;
let WIN_NUMBER = 0;
let GAME_STATE = 'PLAYING';

function reset() {
  L_FORCE = 0;
  R_FORCE = 0;
  WIN_NUMBER = 0;

  setTimeout(tick, 10 * 1000);
}


function incLeft() {
  if (GAME_STATE === 'PLAYING') {
    L_FORCE += INC_FORCE;
  }
  
}

function incRight() {
  if (GAME_STATE === 'PLAYING') {
    R_FORCE += INC_FORCE;
  }
}

function tick() {
  L_FORCE -= DRAG_FORCE + (L_FORCE * 0.01);
  R_FORCE -= DRAG_FORCE + (R_FORCE * 0.01);

  L_FORCE = clamp(L_FORCE, 0, 10000000);
  R_FORCE = clamp(R_FORCE, 0, 10000000);
  let delta = R_FORCE - L_FORCE;
  WIN_NUMBER += delta / 30000;
  WIN_NUMBER = clamp(WIN_NUMBER, -1, 1);

  if (WIN_NUMBER === -1) {
    GAME_STATE = 'LEFT_WIN';
    reset();
  }
  else if (WIN_NUMBER === 1) {
    GAME_STATE = 'RIGHT_WIN';
    reset();
  }
  else {
    GAME_STATE = 'PLAYING';
    
    // tick again
    setTimeout(tick, 1 / 60 * 1000);
  }
  
  io.emit('client.tick', {
    leftForce: L_FORCE,
    rightForce: R_FORCE,
    winNumber: WIN_NUMBER,
    state: GAME_STATE,
  });
}
tick();