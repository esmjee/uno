import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Socket } from 'ngx-socket-io'; 

import { GameService } from 'src/app/services/game.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

	public gameCode;
	public game = {};

	private availableCards = [
		'yellow1', 'yellow2', 'yellow3', 'yellow4', 'yellow5', 'yellow6', 'yellow7', 'yellow8', 'yellow9', 'yellow10', 'yellowreverse',
		'blue1', 'blue2', 'blue3', 'blue4', 'blue5', 'blue6', 'blue7', 'blue8', 'blue9', 'blue10', 'bluereverse',
		'green1', 'green2', 'green3', 'green4', 'green5', 'green6', 'green7', 'green8', 'green9', 'green10', 'greenreverse',
		'red1', 'red2', 'red3', 'red4', 'red5', 'red6', 'red7', 'red8', 'red9', 'red10', 'redreverse',
		'wild', 'redtake2', 'bluetake2', 'greentake2', 'yellowtake2', 'take4'
	];
	public topOfPile;

	contextmenu = false;
	contextmenuX = 0;
	contextmenuY = 0;

	constructor(
		private usersService: UsersService,
		private router: Router,
		private socket: Socket,
		private gameService: GameService,
		private route: ActivatedRoute
	) { }

	ngOnInit() {
		this.game = {};

		//
		// lobby
		//
		if (Object.keys(this.usersService.user).length === 0) {
			this.router.navigate(['/login']);
			return;
		}

		// game errors
		this.socket.on('game/code/found', (game) => {
			this.game = game;
			console.log('game/code/found', this.game);

			for (let player of this.game['players']) {
				if (player['username'] === this.usersService.user['username']) {
					return;
				}
			}
			this.gameService.joinGame(game, { username: this.usersService.user['username'], hand: [] });
		});

		this.socket.on('game/code/notFound', (game) => {
			this.gameService.error = 'Game not found';
			this.router.navigate(['/game']);
		});

		this.socket.on('game/code/started', (game) => {
			this.gameService.error = 'Game already started';
			this.router.navigate(['/game']);
		});

		// game owner
		this.socket.on('game/created', (game) => {
			this.game = game;
			this.router.navigate(['/game/' + game.code]);
			console.log(this.game);
		});

		this.socket.on('game/started', (game) => {
			if (this.gameCode === game.code) {
				console.log('is code');
				this.game = game;
				console.log('game/started', this.game);
				this.launchGame();
			}
		});

		this.socket.on('game/joined', (game) => {
			console.log('user joined a game', this.game['code'], game.code);
			console.log(game.players);
			if (this.game['code'] == game.code) {
				this.game = game;
			}
		});

		// others
		this.route.paramMap.subscribe((params: ParamMap) => {
			this.gameCode = params.get('code')
		});

		if (this.game) {
			this.gameService.findGame(this.gameCode);
		} else {
			if (this.gameCode) {
				this.gameService.findGame(this.gameCode);
				this.gameService.error = '';
			}
		}

		//
		// game
		//
		this.socket.on('game/card/taken', (game) => {
			if (this.gameCode === game.code) {
				this.game = game;
				console.log('game/card/taken', this.game);
			}
		});
	}

	// lobby
	public copyUrl() {
		window.navigator['clipboard'].writeText(window.location.href);
	}

	public createGame() {
		if (!this.usersService.user['username']) {
			this.router.navigate(['/login']);
			return;
		}

		this.gameService.error = '';
		this.gameService.createGame({ created_by: this.usersService.user, code: this.Id(), players: [ { username: this.usersService.user['username'], hand: [] } ] });
	}

	private Id() {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < 6; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	}

	public startGame() {
		this.gameService.startGame(this.game);
	}

	public openTab(username) {
		window.open('/profile/' + username);
	}

	// actual game
	public launchGame() {
		if (this.game['created_by'].username === this.usersService.user['username']) {
			for (let player of this.game['players']) {
				for (let i = 0; i < 8; i++) {
					var card = this.randomCard();
					player['hand'].push(card);
				}
			}
			var card = this.randomCard();
			this.game['topOfPile'] = card;
			this.gameService.takeCard(this.game);
		}
	}

	public takeCard() {
		for (let player of this.game['players']) {
			if (player['username'] === this.usersService.user['username']) {
				var card = this.randomCard();
				console.log('took:', card);
				this.gameService.takeCard(this.game);
			}
		}
	}

	public playCard(card) {
		for (let player of this.game['players']) {
			if (player['username'] === this.usersService.user['username']) {
				console.log(card);
				player['hand'] = player['hand'].filter(c => c !== card);
				this.game['topOfPile'] = card;
				// this.gameService.playCard(this.game);
			}
		}
	}

	randomCard() {
		return this.availableCards[Math.floor(Math.random() * this.availableCards.length)];
	}

}
