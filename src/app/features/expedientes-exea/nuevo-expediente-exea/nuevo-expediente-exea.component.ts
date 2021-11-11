import { Component, OnInit } from '@angular/core';
import { SigaStorageService } from '../../../siga-storage.service';
import { SigaServices } from '../../../_services/siga.service';

@Component({
  selector: 'app-nuevo-expediente-exea',
  templateUrl: './nuevo-expediente-exea.component.html',
  styleUrls: ['./nuevo-expediente-exea.component.scss']
})
export class NuevoExpedienteExeaComponent implements OnInit {

  idProcedimiento : string;
  url : string;
  showFrame : boolean = false;
  comboProcedimientos = [];
  rutas = ["Expedientes EXEA", "Nuevo Expediente"];

  constructor(private sigaStorageService : SigaStorageService,
    private sigaServices : SigaServices){ }

  ngOnInit() {
    this.getComboProcedimientos();
  }

  getComboProcedimientos(){
    this.comboProcedimientos = [
      {label:"Prueba 1", value: "1"}
    ];
  }

  onChangeProcedimiento(){
    
    this.showFrame = false;

    if(this.idProcedimiento){

      this.url = this.sigaServices.getEXEAUrl() + "createProcess.do?procedureId=" + this.idProcedimiento;
      this.showFrame = true;

    }
  }
}
