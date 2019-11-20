import { Component, OnInit, Input, EventEmitter, ViewChild, Output, HostListener } from '@angular/core';
import { PersistenceService } from '../../../_services/persistence.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../commons/translate';
import { SigaServices } from '../../../_services/siga.service';
import { CommonsService } from '../../../_services/commons.service';
import { KEY_CODE } from '../../../features/administracion/auditoria/usuarios/auditoria-usuarios.component';
import { BusquedaGeneralSJCSItem } from '../../../models/sjcs/BusquedaGeneralSJCSItem';
import { Location } from "@angular/common";

@Component({
  selector: 'app-filtros-generalSJCS',
  templateUrl: './filtros-generalSJCS.component.html',
  styleUrls: ['./filtros-generalSJCS.component.scss']
})
export class FiltrosGeneralSJCSComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtroAux: any;
  historico: boolean = false;
  textSelected: String = "{0} perfiles seleccionados";

  filtros: BusquedaGeneralSJCSItem = new BusquedaGeneralSJCSItem();
  isDisabledPoblacion: boolean = true;
  resultadosPoblaciones: any;
  comboTurno: any[];
  comboGuardia: any[];
  comboEstadoColegial: any[];

  permisoEscritura: boolean = true;
  @ViewChild("prueba") prueba;
  textFilter = "Elegir";

  comboProvincias = [];
  comboPoblacion = [];

  @Output() isOpen = new EventEmitter<boolean>();
  institucionActual: any;
  comboColegios: any;
  progressSpinner: boolean;
  deshabilitarCombCol: boolean;
  colegioSelected: any[];

  constructor(private router: Router, private translateService: TranslateService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private commonServices: CommonsService,
    private location: Location) { }

  ngOnInit() {
    this.filtros = new BusquedaGeneralSJCSItem();

    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      this.filtros = new BusquedaGeneralSJCSItem();
    }
    this.getCombos();

  }

  getCombos() {
    this.sigaServices.get("combo_turnos").subscribe(
      n => {
        this.comboTurno = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.comboTurno.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        console.log(err);
      }
    );
    this.sigaServices.get("busquedaColegiados_situacion").subscribe(
      n => {
        this.comboEstadoColegial = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.comboEstadoColegial.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        console.log(err);
      }
    );

    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;

      this.sigaServices.getParam(
        "busquedaCol_colegio",
        "?idInstitucion=" + this.institucionActual
      )
        .subscribe(
          col => {
            this.comboColegios = col.combooItems;
            // this.arregloTildesCombo(this.comboColegios);

          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          }
        );
    });
    if (this.filtros.idTurno != undefined) this.onChangeTurno();
    this.getInstitucion();
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  search() {

    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux();
      this.isOpen.emit(false)
    }

  }


  onChangeTurno() {
    if (this.filtros.idTurno != undefined) {
      this.sigaServices.getParam(
        "combo_guardiaPorTurno",
        "?idTurno=" + this.filtros.idTurno
      )
        .subscribe(
          col => {
            this.comboGuardia = col.combooItems;
            /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
        para poder filtrar el dato con o sin estos caracteres*/
            this.comboGuardia.map(e => {
              let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
              let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
              let i;
              let x;
              for (i = 0; i < e.label.length; i++) {
                if ((x = accents.indexOf(e.label[i])) != -1) {
                  e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
                  return e.labelSinTilde;
                }
              }
            });
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          }
        );
    } else {
      this.comboGuardia = [];
      this.filtros.idGuardia = undefined;
    }
  }

  nuevo() {
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionGeneralSJCS"]);
  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;

      if (this.institucionActual != "2000") {
        this.filtros.colegios = [
          {
            label: n.label,
            value: this.institucionActual
          }
        ];
        this.colegioSelected = this.filtros.colegios;
        this.deshabilitarCombCol = true;
      }
    });
  }

  checkFilters() {
    if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
      this.filtros.nombre = this.filtros.nombre.trim();
    }
    if (this.filtros.apellidos != undefined && this.filtros.apellidos != null) {
      this.filtros.apellidos = this.filtros.apellidos.trim();
    }
    return true;
  }

  clearFilters() {
    this.filtros = new BusquedaGeneralSJCSItem();
    this.filtros.colegios = this.colegioSelected;
  }

  fillFecha(event) {
    this.filtros.fechaEstadoColegial = event;
  }

  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.search();
    }
  }

}
