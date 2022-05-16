import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Socket } from 'ngx-socket-io';

import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

	public user;

	constructor(
		public usersService: UsersService,
		private route: ActivatedRoute,
		private socket: Socket,
		private router: Router,
	) { }

	ngOnInit() {
		this.socket.on('fetchedProfile', (user) => {
			this.user = user;
		});

		this.socket.on('profile/notFound', (username) => {
			if (Object.keys(this.usersService.user).length === 0) {
				this.router.navigate(['/login']);
			} else {
				this.router.navigate(['/profile']);
			}
		});

		this.route.paramMap.subscribe((params: ParamMap) => {
			let urlUser = params.get('user');
			if (urlUser == null) {
				if (Object.keys(this.usersService.user).length === 0) {
					this.router.navigate(['/login']);
					return;
				}
				this.user = this.usersService.user;
			} else {
				this.usersService.getUser(urlUser);
			}
		});

	}

}
