import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-accordion',
  templateUrl: './empty-accordion.component.html',
  styleUrls: ['./empty-accordion.component.scss']
})
export class EmptyAccordionComponent implements OnInit {
@Input() titulo;
  constructor() { }

  ngOnInit(): void {
  }

}
