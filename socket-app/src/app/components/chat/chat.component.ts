import { Component, OnInit, Input } from '@angular/core';

import { UsersService } from 'src/app/services/users.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

	@Input() game;

	public focussed = false;
	public textMessage = '';

	constructor(
		private usersService: UsersService,
		private gameService: GameService,
	) { }

	ngOnInit() {
	}

	public focus() {
		this.focussed = true;
	}

	public blur() {
		this.focussed = false;
	}	

	public sendMessage() {
		if (this.textMessage == '') return;
		this.textMessage = this.textMessage.replace('<', '').replace('>', '');

		let msg = '';
		for (let letter of this.textMessage) {
			// for some reason the code breaks if i don't do it this way
			if (letter != '<') {
				if (letter != '>') {
					msg += letter;
				}
			}
		}
		this.textMessage = msg;

		let messageElement = document.getElementById('message-input');
		let message = {
			text: this.textMessage,
			user: this.usersService.user['username'],
			created_at: new Date()
		}

		this.textMessage = '';
		messageElement.focus();

		this.game.chat_messages.push(message);
		this.gameService.newMessage(this.game);
	}
}
