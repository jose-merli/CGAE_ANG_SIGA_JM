import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TreeNode } from '../../../../../../../utils/treenode';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { TranslateService } from '../../../../../../../commons/translate';

@Component({
  selector: 'app-datos-baremos',
  templateUrl: './datos-baremos.component.html',
  styleUrls: ['./datos-baremos.component.scss']
})
export class DatosBaremosComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  colsPartidoJudicial;
  msgs;
  @Input() modoEdicion: boolean = false;
  selectedFile
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  message;
  permisos: boolean = false;
  datos = [];
  nuevo: boolean = false;
  progressSpinner: boolean = false;
  //Resultados de la busqueda

  @Input() tarjetaBaremos;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService) { }

  ngOnInit() {

    this.sigaServices.datosRedy$.subscribe(
      data => {
        this.modoEdicion = true;
        this.getBaremos();

      });
  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getBaremos() {
    //let idGuardiaProvisional =362; //borrar
    this.sigaServices.post(
      //"busquedaGuardias_getBaremos", idGuardiaProvisional).subscribe(
      "busquedaGuardias_getBaremos", this.persistenceService.getDatos().idGuardia).subscribe(
        data => {
          let comboItems = JSON.parse(data.body).combooItems;
          comboItems.forEach(it => {
             it.value = it.value + "€";
          });
          this.datos = comboItems;

        },
        err => {
          //console.log(err);
        },
    )
  }
  goToFichaBaremos(){
    this.showMessage({ severity: 'info', summary: this.translateService.instant("general.message.informacion"), detail: "Este modulo se encuentra en desarrollo." });
  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }

  clear() {
    this.msgs = [];
  }

}
