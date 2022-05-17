import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Socket } from 'ngx-socket-io'; 
import { MatDialog } from '@angular/material/dialog';

import { GameService } from 'src/app/services/game.service';
import { UsersService } from 'src/app/services/users.service';
import { ColordialogComponent } from 'src/app/dialogs/colordialog/colordialog.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

	public gameCode;
	public game = {};

	public screenWidth = window.innerWidth;

	public viewAllPlayers = false;
	public showChat = false;

	private availableCards = [
		// Yellow
		{ color: 'yellow', value: '1' }, { color: 'yellow', value: '2' }, { color: 'yellow', value: '3' }, { color: 'yellow', value: '4' }, 
		{ color: 'yellow', value: '5' }, { color: 'yellow', value: '6' }, { color: 'yellow', value: '7' }, { color: 'yellow', value: '8' }, 
		{ color: 'yellow', value: '9' }, { color: 'yellow', value: '0' },
		{ color: 'yellow', value: 'reverse' }, { color: 'yellow', value: 'take2' }, { color: 'yellow', value: 'skip' },

		// Red
		{ color: 'red', value: '1' }, { color: 'red', value: '2' }, { color: 'red', value: '3' }, { color: 'red', value: '4' },
		{ color: 'red', value: '5' }, { color: 'red', value: '6' }, { color: 'red', value: '7' }, { color: 'red', value: '8' },
		{ color: 'red', value: '9' }, { color: 'red', value: '0' },
		{ color: 'red', value: 'reverse' }, { color: 'red', value: 'take2' }, { color: 'red', value: 'skip' },

		// Blue
		{ color: 'blue', value: '1' }, { color: 'blue', value: '2' }, { color: 'blue', value: '3' }, { color: 'blue', value: '4' },
		{ color: 'blue', value: '5' }, { color: 'blue', value: '6' }, { color: 'blue', value: '7' }, { color: 'blue', value: '8' },
		{ color: 'blue', value: '9' }, { color: 'blue', value: '0' },
		{ color: 'blue', value: 'reverse' }, { color: 'blue', value: 'take2' }, { color: 'blue', value: 'skip' },

		// Green
		{ color: 'green', value: '1' }, { color: 'green', value: '2' }, { color: 'green', value: '3' }, { color: 'green', value: '4' },
		{ color: 'green', value: '5' }, { color: 'green', value: '6' }, { color: 'green', value: '7' }, { color: 'green', value: '8' },
		{ color: 'green', value: '9' }, { color: 'green', value: '0' },
		{ color: 'green', value: 'reverse' }, { color: 'green', value: 'take2' }, { color: 'green', value: 'skip' },

		// Special
		{ color: 'black', value: 'wild' }, { color: 'black', value: 'wild' }, { color: 'black', value: 'wildDrawFour' }, { color: 'black', value: 'wildDrawFour' },
	];
	
	contextmenu = false;
	contextmenuX = 0;
	contextmenuY = 0;

	constructor(
		private usersService: UsersService,
		private router: Router,
		private socket: Socket,
		private gameService: GameService,
		private route: ActivatedRoute,
		public matDialog: MatDialog,
	) { }

	ngOnInit() {
		this.game = {};

		setTimeout(() => {
			let msgInput = document.getElementById('chat-holder');
			if (msgInput) {
				msgInput.scrollTop = msgInput.scrollHeight;
			}
		}, 50);

		//
		// lobby
		//
		if (Object.keys(this.usersService.user).length === 0) {
			this.usersService.oldUrl = this.router.url;
			this.router.navigate(['/login']);
			return;
		}

		// game errors
		this.socket.on('game/code/found', (game) => {
			this.game = game;
			// console.log('game/code/found', this.game);

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

		this.socket.on('game/won', (game) => {
			this.game = game;
		});

		// game owner
		this.socket.on('game/created', (game) => {
			this.game = game;
			this.router.navigate(['/game/' + game.code]);
			// console.log(this.game);
		});

		this.socket.on('game/started', (game) => {
			if (this.gameCode === game.code) {
				this.game = game;
				// console.log('game/started', this.game);
				this.launchGame();
			}
		});

		this.socket.on('game/joined', (game) => {
			// console.log('user joined a game', this.game['code'], game.code);
			// console.log(game.players);
			if (this.game['code'] == game.code) {
				this.game = game;
			}
		});

		this.socket.on('game/kicked', (game) => {
			this.game = game;

			if (this.game['players'].find(p => p.username === this.usersService.user['username']) == undefined) {
				this.game = {};
				this.router.navigate(['/game/']);
			}
		});

		// others
		this.route.paramMap.subscribe((params: ParamMap) => {
			this.gameCode = params.get('code')
		});

		if (this.game) {
			this.gameService.findGame({ code: this.gameCode, username: this.usersService.user['username'] });
		} else {
			if (this.gameCode) {
				this.gameService.findGame({ code: this.gameCode, username: this.usersService.user['username'] });
				this.gameService.error = '';
			}
		}

		//
		// game
		//
		this.socket.on('game/card/taken', (game) => {
			if (this.gameCode === game.code) {
				this.game = game;
				// console.log('game/card/taken', this.game);

				let user = this.game['players'].filter(player => player.username == this.usersService.user['username']);
				if (user[0].hand.length == 0) {
					this.gameOver(this.usersService.user['username']);
				}
			}
		});

		this.socket.on('game/message/new', (game) => {
			if (this.gameCode === game.code) {
				this.game = game;
				// console.log('game/message/new', this.game);

				setTimeout(() => {
					let msgInput = document.getElementById('chat-holder');
					if (msgInput) {
						msgInput.scrollTop = msgInput.scrollHeight;
					}
				}, 50);
			}
		});

		this.socket.on('game/code/ok', (code) => {
			this.gameService.createGame({ 
				created_by: this.usersService.user, 
				code: code,
				takeOnPlay: 0,
				chat_allowed: true,
				chat_messages: [],
				players: [{ username: this.usersService.user['username'], hand: [] }] ,
			});
		});

		this.socket.on('game/code/notok', (code) => {
			this.createGame();
		});
	}

	// lobby
	public copyUrl() {
		window.navigator['clipboard'].writeText(window.location.href);
	}

	public createGame() {
		if (!this.usersService.user['username']) {
			this.usersService.oldUrl = this.router.url;
			this.router.navigate(['/login']);
			return;
		}

		this.gameService.error = '';
		this.gameService.checkCode(this.Id());
	}

	public kickPlayer(player) {
		this.gameService.kickPlayer(this.game, player);
	}
		
	private Id() {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < 6; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	}

	public toggleViewAllPlayers() {
		this.viewAllPlayers = !this.viewAllPlayers;
	}

	public toggleChat() {
		this.showChat = !this.showChat;
	}

	public startGame() {
		const input = document.getElementById('chat-allowed') as HTMLInputElement | null;

		this.game['chat_allowed'] = input.checked;
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
				player['hand'].push(card);
				this.gameService.takeCard(this.game);
			}
		}
	}

	public chooseColor(card): void {
		const dialogRef = this.matDialog.open(ColordialogComponent, {
			width: '340px',
			height: '185px'
		});

		dialogRef.afterClosed().subscribe(color => {
			if (color) {
				card.color = color;
				console.log(card);
				this.playCard(card);
			}
		});
	}

	public takeCardFromPile() {
		for (let player of this.game['players']) {
			if (player['username'] === this.usersService.user['username']) {
				// checking if player needs to pick cards
				if (this.game['takeOnPlay'] != 0) {
					for (let i = 0; i < this.game['takeOnPlay']; i++) {
						this.takeCard();
					}
				}

				var card = this.randomCard();
				player['hand'].push(card);

				let canPlayCard = false;
				for (let crd of player['hand']) {
					if (this.isPlayableCard(crd)) {
						canPlayCard = true;
					}
				}

				if (!canPlayCard) {
					this.game['turns'].shift();
					this.game['turns'].push(player['username']);
				}
				this.gameService.takeCard(this.game);
			}
		}
	}

	public sortPlayers() {
		let players = this.game['players'];

		for (let i = 1; i < players.length; i++) {
			for (let j = 0; j < i; j++) {
				if (players[i] < players[j]) {
					let x = players[i];
					players[i] = players[j];
					players[j] = x;
				}
			}
		}

		return players;
	}

	public isPlayableCard(card) {
		console.log(card, this.game['topOfPile']);
		// same color
		if (this.game['topOfPile']['color'] === card['color']) {
			return true;
		}
		// same number/value
		if (this.game['topOfPile']['value'] === card['value']) {
			return true;
		}
		// Wild card
		if (this.game['topOfPile']['color'] == "black") {
			return true;
		}
		if (card['color'] == "black") {
			return true;
		}
		// special card
		if (card['value'] == "wild" || card['value'] == "wildDrawFour") {
			return true;
		}

		return false;
	}

	public gameOver(winner) {
		this.gameService.wonGame({ game: this.game, winner: winner });
	}

	public playCard(card) {
		if (this.game['turns'][0] != this.usersService.user['username']) return;
		if (!this.isPlayableCard(card)) return;

		for (let player of this.game['players']) {
			if (player['username'] === this.usersService.user['username']) {

				// checking if player needs to pick cards
				if (this.game['takeOnPlay'] != 0) {
					// Draw 2
					if (this.game['topOfPile']['value'] == "take2" && card.value != "take2") {
						for (let i = 0; i < this.game['takeOnPlay']; i++) {
							this.takeCard();
						}
						this.game['takeOnPlay'] = 0;
					}
					// Draw 4
					if (this.game['topOfPile']['value'] == "wildDrawFour" && card.value != "wildDrawFour") {
						for (let i = 0; i < this.game['takeOnPlay']; i++) {
							this.takeCard();
						}
						this.game['takeOnPlay'] = 0;
					}
				}

				// remove card from hand
				if (card.value == "reverse") {
					this.game['turns'].reverse();
				} else {
					this.game['turns'].shift();
					this.game['turns'].push(player['username']);

					if (card.value == "skip") {
						let shiftedPlayer = this.game['turns'].shift();
						this.game['turns'].push(shiftedPlayer);
					}

					if (card.value == "take2") {
						this.game['takeOnPlay'] += 2;
					}

					if (card.value == "wildDrawFour") {
						this.game['takeOnPlay'] += 4;
					}
				}

				player['hand'] = player['hand'].filter(c => c !== card);
				this.game['topOfPile'] = card;

				this.gameService.takeCard(this.game);
				break;
			}
		}
	}

	randomCard() {
		return this.availableCards[Math.floor(Math.random() * this.availableCards.length)];
	}

}
