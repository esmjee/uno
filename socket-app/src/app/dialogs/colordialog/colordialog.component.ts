import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-colordialog',
  templateUrl: './colordialog.component.html',
  styleUrls: ['./colordialog.component.scss']
})
export class ColordialogComponent implements OnInit {

	constructor(
		private dialogRef: MatDialogRef<ColordialogComponent>
	) { }

	ngOnInit() {
  	}

	public close(color) {
		this.dialogRef.close(color);
	}

}
