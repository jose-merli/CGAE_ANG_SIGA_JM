import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-datos-colegiales',
  templateUrl: './datos-colegiales.component.html',
  styleUrls: ['./datos-colegiales.component.scss']
})
export class DatosColegialesComponent implements OnInit {

  @Input()
  fichasPosibles: any = []


  constructor() { }

  ngOnInit() {
  }




}
