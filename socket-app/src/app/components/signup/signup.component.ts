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

	private oldUrl = '';

	constructor(
		private loginService: LoginService,
		private usersService: UsersService,
		private router: Router,
		private socket: Socket,
	) { }

	ngOnInit() {
		if (this.usersService.oldUrl != '') {
			this.oldUrl = this.usersService.oldUrl;
		}

		this.socket.on('loggedInUser', (user) => {
			this.usersService.setUser(user);
			localStorage.setItem('user', JSON.stringify(user));

			console.log(this.oldUrl);
			if (this.oldUrl != '') {
				this.router.navigate([this.oldUrl]);
				this.oldUrl == '';
				return;
			}

			this.router.navigate(['/profile']);
		});

		this.socket.on('newUser/incorrect/alreadyUsed', (user) => {
			console.log('newUser/incorrect/alreadyUsed', user);
			document.getElementById('error-message').style.display = 'block';
		});
	}

	register() {
		if (this.checkInput()) {
			return;
		}

		let user = {
			username: this.username,
			email: this.email,
			password: this.password
		}

		this.loginService.registerUser(user);
	}

	checkInput() {
		let errorMessage = document.getElementById('wrong-input');

		let numbers = "0123456789";
		let allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" + numbers;
		if (this.username.length < 3) {
			errorMessage.innerHTML = 'Username must be at least 3 characters long';
			return true;
		}

		if (!this.email.includes('@') || !this.email.includes('.')) {
			errorMessage.innerHTML = 'Email is not valid';
			return true;
		}

		if (this.password.length < 6) {
			errorMessage.innerHTML = 'Password must be at least 6 characters long';
			return true;
		}

		for (let ltr of this.username) {
			if (!allowedChars.includes(ltr)) {
				errorMessage.innerHTML = 'Username must contain only letters and numbers';
				return true;
			}
		}

		for (let ltr of this.password) {
			if (!allowedChars.includes(ltr)) {
				errorMessage.innerHTML = 'Password must contain only letters and numbers';
				return true;
			}
		}
		
		return false;
	}

}
