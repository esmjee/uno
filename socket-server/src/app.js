const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose')
const crypto = require('crypto')

// Models
let User = require('../models/User');
let Game = require('../models/Game');

// Connecting with mongo db
mongoose
  .connect('mongodb://127.0.0.1:27017/socket-uno')
  .then((db) => {
    console.log(`Connected to Mongo! Database name: ${db.connections[0].name}`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  });

io.on('connection', socket => {

	// login
	socket.on('newUser', user => {
		console.log('newUser', user);
        User.findOne({ username: user.username }, (error, data) => {
            if (error) {
                console.log('newUser', error);
                return;
            } else {
                if (data) {
                    socket.emit('newUser/incorrect/alreadyUsed', user);
                    return;
                } else {
                    User.findOne({ email: user.email }, (error, data) => {
                        if (error) {
                            console.log('newUser', error);
                            return;
                        } else {
                            if (data) {
                                socket.emit('newUser/incorrect/alreadyUsed', user);
                                return;
                            } else {
                                User.create(user, (error, data) => {
                                    if (error) {
                                        console.log('newUser', error);
                                        return;
                                    } else {
                                        // console.log('newUser data:', data);
                                        socket.emit('loggedInUser', data);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    socket.on('loginUser', user => {
		console.log('loginUser', user);
        User.findOne({ username: user.username }, (error, data) => {
            if (error) {
                console.log('loginUser', error);
                return;
            } else {
                if (!data) {
                    socket.emit('loggedInUser/incorrect/password', user);
                    return;
                }

                if (user.password != data.password) {
                    socket.emit('loggedInUser/incorrect/password', user);
                    return;
                }

                socket.emit('loggedInUser', data);
            }
        });
    });

	// profile
	socket.on('getProfile', username => {
		User.findOne({ username: username }, (error, data) => {
            if (error) {
                console.log('getProfile', error);
                return;
            } else {
                if (!data) {
                    socket.emit('profile/notFound', username);
                    return;
                }

                // console.log('getProfile data:', data);
                socket.emit('fetchedProfile', data);
            }
        });
	});

    // game
    socket.on('game/create', game => {
        Game.create(game, (error, data) => {
            if (error) {
                console.log('game/create', error);
                return;
            } else {
                // console.log('game/create data:', data);
                socket.emit('game/created', data);
            }
        });
    });

    socket.on('game/join', info => {
        let code = info.game.code;
        let user = info.user;

        let players = info.game.players;
        players.push(user);

        Game.findOneAndUpdate({ code: code }, { $set: { players: players } }, (error, game) => {
            if (error) {
                console.log('game/join (findOneAndUpdate)', error);
                return;
            } else {
                if (!game) return;

                game.players = players;

                // console.log('game/join data 2:', game);
                io.emit('game/joined', game);
            }
        });
    });

    socket.on('game/start', game => {
        let allPlayers = [];
        for (let player of game.players) {
            allPlayers.push(player.username);
        }
        Game.findOneAndUpdate({ game }, { $set: { status: 'playing', turns: allPlayers } }, (error, data) => {
            if (error) {
                console.log('game/start', error);
                return;
            } else {
                if (!data) return;

                for (let player of data.players) {
                    data.turns.push(player.username);
                }
                io.emit('game/started', data);
            }
        });
    });

    socket.on('game/takeCard', game => {
        Game.findOneAndUpdate({ code: game.code }, { $set: { players: game.players, topOfPile: game.topOfPile, turns: game.turns } }, (error, data) => {
            if (error) {
                console.log('game/takeCard', error);
                return;
            } else {
                if (!data) return;

                data.players = game.players;
                data.topOfPile = game.topOfPile;
                data.turns = game.turns;

                // console.log('game/card/taken data:', data);
                io.emit('game/card/taken', data);
            }
        });
    });

    socket.on('game/find', req => {
        console.log(req);
        Game.findOne({ code: req.code }, (error, data) => {
            if (error) {
                console.log('game/find', error);
                return;
            } else {
                if (!data) {
                    socket.emit('game/code/notFound', req.code);
                    return;
                }

                let isInGame = false;
                if (data.players.length > 0) {
                    for (let i = 0; i < data.players.length; i++) {
                        if (data.players[i].username == req.username) {
                            isInGame = true;
                            break;
                        }
                    }
                }

                if (!isInGame) { 
                    if (data.status != "pending") {
                        socket.emit('game/code/started', req.code);
                        return;
                    }
                }

                // console.log('game/find data:', data);
                socket.emit('game/code/found', data);
            }
        });
    });

    console.log(`Socket ${socket.id} has connected`);
});

http.listen(4444, () => {
    console.log('Listening on port 4444');
});
