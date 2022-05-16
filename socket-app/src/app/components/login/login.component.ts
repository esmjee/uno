import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	public username: string = "";
	public password: string = "";

	constructor(
		private loginService: LoginService,
		private usersService: UsersService,
		private router: Router,
		private socket: Socket,
	) { }

	ngOnInit() {
		// if (this.usersService.isLoggedIn()) {
		// 	console.log('logged in');
		// 	this.router.navigate(['/profile']);
		// 	return;
		// }
		// console.log('not logged in');

		this.socket.on('loggedInUser', (user) => {
			this.usersService.setUser(user);
			this.router.navigate(['/profile']);

			localStorage.setItem('user', JSON.stringify(user));
		});

		this.socket.on('loggedInUser/incorrect/password', (user) => {
			document.getElementById('error-message').style.display = 'block';
		});
	}

	login() {
		let user = {
			username: this.username,
			password: this.password
		}

		this.loginService.loginUser(user);
	}

}
