import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tabla-simple',
  templateUrl: './tabla-simple.component.html',
  styleUrls: ['./tabla-simple.component.scss']
})
export class TablaSimpleComponent implements OnInit {
  @Input() cabeceras;
  @Input() elementos;
  @Output() anySelected = new EventEmitter<any>();
  selectedArray = [];
  constructor() { }

  ngOnInit(): void {
  }
  selectRow(rowId){
    if(this.selectedArray.includes(rowId)){
      const i = this.selectedArray.indexOf(rowId);
      this.selectedArray.splice(i, 1);
    }else{
      this.selectedArray.push(rowId);
    }
    if(this.selectedArray.length != 0){
      this.anySelected.emit(true);
    }else{
      this.anySelected.emit(false);
    }
    
  }
  isSelected(id){
    if(this.selectedArray.includes(id)){
      return true;
    } else {
      return false;
    }
  }
}
