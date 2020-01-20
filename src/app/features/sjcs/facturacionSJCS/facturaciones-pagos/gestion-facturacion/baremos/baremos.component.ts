import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-baremos',
  templateUrl: './baremos.component.html',
  styleUrls: ['./baremos.component.scss']
})
export class BaremosComponent implements OnInit {
  progressSpinnerBaremos: boolean = false;

  @Input() idFacturacion;
  @Input() idEstadoFacturacion;
  
  constructor() { }

  ngOnInit() { 
    this.progressSpinnerBaremos=false;
  }

  disableEnlaceBaremos(){
    if(this.idEstadoFacturacion=='30' || this.idEstadoFacturacion=='20'){
      return false;
    }else{
      return true;
    }
  }
}
