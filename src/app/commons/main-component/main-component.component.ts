import { Component, OnInit } from '@angular/core';
import { Globals} from '../../_services/globals.service'

@Component({
  template: '',
  selector: 'app-maincomponent'
})
export class MainComponent implements OnInit {

  constructor(public _globals: Globals) { }

  ngOnInit() {
  }

}
