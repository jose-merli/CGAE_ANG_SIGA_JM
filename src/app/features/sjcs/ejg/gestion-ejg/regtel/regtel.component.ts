import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-regtel',
  templateUrl: './regtel.component.html',
  styleUrls: ['./regtel.component.scss']
})
export class RegtelComponent implements OnInit {
  @Input() modoEdicion;
  constructor() { }

  ngOnInit() {
  }

}
