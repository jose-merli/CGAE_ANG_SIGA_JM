import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-datos-generacion-adeudos',
  templateUrl: './datos-generacion-adeudos.component.html',
  styleUrls: ['./datos-generacion-adeudos.component.scss']
})
export class DatosGeneracionAdeudosComponent implements OnInit {

  @Input() datos;
  @Input() modoEdicion;
  @Input() openTarjetaDatosGeneracion;
  // @Input() permisoEscritura;
  @Input() tarjetaDatosGeneracion: string;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  // @Output() guardadoSend = new EventEmitter<any>();

  openFicha: boolean = false;
  progressSpinner: boolean = false;
  resaltadoDatos: boolean = false;
  activacionTarjeta: boolean = false;
  nuevo: boolean = false;

  body: FicherosAdeudosItem;
  bodyInicial: FicherosAdeudosItem;

  msgs = [];

  fichaPosible = {
    key: "datosGeneracion",
    activa: false
  }

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsServices: CommonsService, private translateService: TranslateService,
    private router: Router) { }

  ngOnInit() {

    if (this.datos()) {
      this.modoEdicion = true;
      this.nuevo = false;
      this.body = this.persistenceService.getDatos();
      this.bodyInicial = this.body;
    } else {
      this.nuevo = true;
      this.modoEdicion = false;
      this.body = new FicherosAdeudosItem();
      this.bodyInicial = new FicherosAdeudosItem();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaDatosGeneracion == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
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

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsServices.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatos = true;
  }

  esFichaActiva(key) {
    return this.fichaPosible.activa;
  }

  abreCierraFicha(key) {
    if (key == "datosGeneracion" && !this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }

    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }
}
