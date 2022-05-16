import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  	constructor(
		private socket: Socket,
	) { }

	public registerUser(user) {
		this.socket.emit('newUser', user);
	}

	public loginUser(user) {
		this.socket.emit('loginUser', user);
	}
}
