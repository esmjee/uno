import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-player-menu',
  templateUrl: './player-menu.component.html',
  styleUrls: ['./player-menu.component.scss']
})
export class PlayerMenuComponent implements OnInit {

	@Input() x=0;
	@Input() y=0;

	constructor() { }

	ngOnInit() {
	}

}
