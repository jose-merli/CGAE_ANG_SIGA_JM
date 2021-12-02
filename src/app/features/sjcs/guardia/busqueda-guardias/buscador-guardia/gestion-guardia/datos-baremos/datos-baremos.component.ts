import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { TranslateService } from '../../../../../../../commons/translate';
import { BaremosGuardiaItem } from '../../../../../../../models/sjcs/BaremosGuardiaItem';
import { Router } from '@angular/router';

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

  @Input() openFicha: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<string>();
  datosTabla;

  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private router: Router) { }

  ngOnInit() {

    this.sigaServices.datosRedy$.subscribe(
      data => {
        this.modoEdicion = true;
        this.getBaremos();
        this.getBaremosGuardias();
      });
  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getBaremos() {

    this.sigaServices.post("busquedaGuardias_getBaremos", this.persistenceService.getDatos().idGuardia).subscribe(
      data => {
        let comboItems = JSON.parse(data.body).combooItems;
        comboItems.forEach(it => {
          it.value = it.value + "€";
        });
        this.datos = comboItems;

      },
      err => {
        console.log(err);
      },
    )
  }

  goToFichaBaremos() {
    this.persistenceService.clearFiltros();
    this.persistenceService.clearFiltrosAux();
    sessionStorage.setItem("tarjetaBaremosFichaGuardia", JSON.stringify(this.persistenceService.getDatos()));
    this.router.navigate(["/baremosDeGuardia"]);
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

  onHideTarjeta(key: string) {
    this.openFicha = !this.openFicha;

    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  getBaremosGuardias() {

    let filtros: BaremosGuardiaItem = new BaremosGuardiaItem();
    filtros.historico = false;
    filtros.idGuardias = [this.persistenceService.getDatos().idGuardia];
    filtros.idTurnos = [this.persistenceService.getDatos().idTurno];

    this.progressSpinner = true;

    this.sigaServices.post("baremosGuardia_buscar", filtros).subscribe(
      data => {
        this.datosTabla = JSON.parse(data.body).baremosRequestItems;
        let error = JSON.parse(data.body).error;
        this.progressSpinner = false;

        if (error != undefined && error != null && error.description != null) {
          if (error.code == '200') {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }
      },
      err => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      }
    )
  }

}
