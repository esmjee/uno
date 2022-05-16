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
}
