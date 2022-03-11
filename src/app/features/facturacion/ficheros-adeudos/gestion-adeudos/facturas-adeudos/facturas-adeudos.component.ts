import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FacturasIncluidasItem } from '../../../../../models/sjcs/FacturasIncluidasItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-facturas-adeudos',
  templateUrl: './facturas-adeudos.component.html',
  styleUrls: ['./facturas-adeudos.component.scss']
})
export class FacturasAdeudosComponent implements OnInit {

  @Input() bodyInicial: any;
  @Input() tipoFichero: string;
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaFacturas: string;
  @Input() totalFacturas: string;
  @Input() totalImporte: string;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  @ViewChild("table") table: DataTable;

  progressSpinner: boolean = false;

  idFichero;
  msgs;
  cols;

  
  constructor(
    private router: Router
    ) { }

  async ngOnInit() {
    this.setIdFichero();
  }

  // set idFichero para llamada al servicio en cargaInicial() 
  setIdFichero() {
    if (this.tipoFichero=='T') {
      this.idFichero = this.bodyInicial.idDisqueteAbono;
      //sessionStorage.setItem("identificadorTransferencia", this.idFichero);
    }
    if (this.tipoFichero=='A') {
      this.idFichero = this.bodyInicial.idDisqueteCargos;
      //sessionStorage.setItem("identificadorAdeudos", this.idFichero);
    } 
    if (this.tipoFichero=='D') {
      this.idFichero = this.bodyInicial.idDisqueteDevoluciones;
      //sessionStorage.setItem("identificadorDevolucion", this.idFichero);
    }
  }

  ir(){

    //this.progressSpinner=true;
    if (this.tipoFichero == 'T' && this.bodyInicial.fcs) {
      
      sessionStorage.setItem("filtrosAbonosSJCS", JSON.stringify({
        identificadorFicheroT: this.bodyInicial.idDisqueteAbono
      }));

      this.router.navigate(["/abonosSJCS"]);
    } else {
      sessionStorage.setItem("tipoFichero", this.tipoFichero);
      sessionStorage.setItem("idFichero", this.idFichero);

      this.router.navigate(["/facturas"]);
    }
  
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

}
