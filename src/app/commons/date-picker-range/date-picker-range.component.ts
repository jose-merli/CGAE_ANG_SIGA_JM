import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-picker-range',
  templateUrl: './date-picker-range.component.html',
  styleUrls: ['./date-picker-range.component.scss']
})
export class DatePickerRangeComponent implements OnInit {
@Input() datePickerTitle;
  constructor() { }

  ngOnInit(): void {
  }

}
