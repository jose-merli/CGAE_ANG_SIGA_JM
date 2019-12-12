import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-datos-generales-ejg',
  templateUrl: './datos-generales-ejg.component.html',
  styleUrls: ['./datos-generales-ejg.component.scss']
})
export class DatosGeneralesEjgComponent implements OnInit {
  //Resultados de la busqueda
  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Output() modoEdicionSend = new EventEmitter<any>();
  permisoEscritura: boolean = true;
  openFicha: boolean = true;
  progressSpinner: boolean = false;
  body: EJGItem;
  bodyInicial: EJGItem;
  msgs = [];
  comboTipoEJG = [];
  comboTipoEJGColegio = [];
  comboPrestaciones = []; //vacio

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private translateService: TranslateService, private commonsServices: CommonsService) { }

  ngOnInit() {
    this.getComboTipoEJG();
    this.getComboTipoEJGColegio();
    if (this.persistenceService.getPermisos() != undefined)
      this.permisoEscritura = this.persistenceService.getPermisos()
    if (this.modoEdicion) {
      this.body = this.datos;
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    } else {
      this.body = new EJGItem();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }
  }

  getComboTipoEJG() {
    this.sigaServices.get("filtrosejg_comboTipoEJG").subscribe(
      n => {
        this.comboTipoEJG = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTipoEJG);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboTipoEJGColegio() {
    this.sigaServices.get("filtrosejg_comboTipoEJGColegio").subscribe(
      n => {
        this.comboTipoEJGColegio = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTipoEJGColegio);
      },
      err => {
        console.log(err);
      }
    );
  }

  fillFechaApertura(event) {
    this.body.fechaApertura = event;
  }
  fillFechaPresentacion(event) {
    //  this.body.fechaPresentacion = event;
  }
  fillFechaLimPresentacion(event) {
    // this.body.fechaPresentacion = event;
  }
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
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
