import { Component, OnInit } from '@angular/core';

import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(
		private usersService: UsersService,
	) { }

	ngOnInit() { 

		if (Object.keys(this.usersService.user).length === 0) {
			let user = localStorage.getItem('user');
			if (user) {
				this.usersService.setUser(JSON.parse(user));
			}
		}

	}

}
