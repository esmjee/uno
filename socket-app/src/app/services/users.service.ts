import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

	public oldUrl = '';
	public user = {};

  	constructor(
		private socket: Socket,
	  ) { }

	public isLoggedIn() {
		// !! to return a boolean
		return !!this.user;
	}

	public getUser(username) {
		this.socket.emit('getProfile', username);
	}

	public setUser(user) {
		this.user = user;
	}
}
