import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-baremos',
  templateUrl: './baremos.component.html',
  styleUrls: ['./baremos.component.scss']
})
export class BaremosComponent implements OnInit {
  progressSpinnerBaremos: boolean = false;

  constructor() { }

  ngOnInit() { 
    this.progressSpinnerBaremos=false;
  }

}
