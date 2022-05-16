import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

	public username: string = "";
	public email: string = "";
	public password: string = "";

	constructor(
		private loginService: LoginService,
		private usersService: UsersService,
		private router: Router,
		private socket: Socket,
	) { }

	ngOnInit() {
		this.socket.on('loggedInUser', (user) => {
			this.usersService.setUser(user);
			this.router.navigate(['/profile']);
			localStorage.setItem('user', JSON.stringify(user));
		});

		this.socket.on('newUser/incorrect/alreadyUsed', (user) => {
			console.log('newUser/incorrect/alreadyUsed', user);
			document.getElementById('error-message').style.display = 'block';
		});
	}

	register() {
		let user = {
			username: this.username,
			email: this.email,
			password: this.password
		}

		this.loginService.registerUser(user);
	}

}
