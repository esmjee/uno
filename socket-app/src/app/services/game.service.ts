import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class GameService {
	
	public error = '';

	constructor(
		private socket: Socket,
	) { }

	public createGame(game) {
		this.socket.emit('game/create', game);
	}

	public findGame(data) {
		this.socket.emit('game/find', data);
	}

	public startGame(game) {
		console.log('service start');
		this.socket.emit('game/start', game);
	}

	public joinGame(game, user) {
		this.socket.emit('game/join', { game, user });
	}

	public takeCard(game) {
		this.socket.emit('game/takeCard', game);
	}

	public wonGame(data) {
		this.socket.emit('game/wonGame', data);
	}

	public newMessage(game) {
		this.socket.emit('game/newMessage', game);
	}

	public kickPlayer(game, player) {
		this.socket.emit('game/kickPlayer', { game: game, player: player });
	}

	public checkCode(code) {
		this.socket.emit('game/checkCode', code);
	}
}
