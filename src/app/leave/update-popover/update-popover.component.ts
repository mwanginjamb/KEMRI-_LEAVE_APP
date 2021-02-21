import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-popover',
  templateUrl: './update-popover.component.html',
  styleUrls: ['./update-popover.component.scss'],
})
export class UpdatePopoverComponent implements OnInit {

  @Input() No;

  constructor() { }

  ngOnInit() {
    console.log(`Leave No: ${this.No}`);
  }

}
