import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CartasFacturacionPagosItem } from '../../../../../models/sjcs/CartasFacturacionPagosItem';
import { KEY_CODE } from '../../../../../commons/login-develop/login-develop.component';
import { TranslateService } from '../../../../../commons/translate/translation.service';

@Component({
  selector: 'app-filtro-cartas-facturacion-pago',
  templateUrl: './filtro-cartas-facturacion-pago.component.html',
  styleUrls: ['./filtro-cartas-facturacion-pago.component.scss']
})
export class FiltroCartasFacturacionPagoComponent implements OnInit {

  showDatosGenerales: boolean = true;
  showDatosColegiado: boolean = true;
  filtros: CartasFacturacionPagosItem = new CartasFacturacionPagosItem();
  esColegiado: boolean = false;
  modoBusqueda: string = "f";
  modoBusquedaFacturacion: boolean = true;
  progressSpinner: boolean = false;

  msgs = [];
  comboFacturacion: any[];
  comboConceptos: any[];
  comboGrupoTurnos: any[];
  comboPartidaPresupuestaria: any[];
  comboPagos: any[];

  @Output() emitSearch = new EventEmitter<string>();

  constructor(private commonsService: CommonsService, private sigaServices: SigaServices,
    private persistenceService: PersistenceService, private translateService: TranslateService) { }

  ngOnInit() {

    this.getCombos();
    this.isColegiado();
  }

  getCombos() {
    this.getComboPartidasPresupuestarias();
    this.getComboGrupoTurnos();
    this.getComboFactConceptos();
    this.getComboFacturacion();
    this.getComboPagos();
  }

  isColegiado() {
    this.progressSpinner = true;
    this.sigaServices.get("isColegiado").subscribe(
      data => {
        let persona = data;

        if (persona != undefined && persona != null) {
          this.filtros.apellidosNombre = persona.nombre;
          this.filtros.ncolegiado = persona.numColegiado;
          this.filtros.idPersona = persona.idPersona;
          this.esColegiado = true;
        } else {
          //Comprobamos que se ha realizado una busqueda en la busqueda express
          let busquedaColegiado = this.persistenceService.getDatosBusquedaGeneralSJCS();

          if (busquedaColegiado != undefined) {
            this.filtros.ncolegiado = busquedaColegiado.nColegiado;
            this.filtros.idPersona = busquedaColegiado.idPersona;
            this.filtros.apellidosNombre = busquedaColegiado.nombre;
          }
          this.esColegiado = false;
        }

        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      }
    );

    // if (JSON.parse(JSON.parse(sessionStorage.getItem("isLetrado")))) {
    //   let persona = JSON.parse(sessionStorage.getItem("personaBody"));
    //   this.filtros.ncolegiado = persona.ncolegiado;
    //   this.filtros.apellidosNombre = persona.apellidosNombre;

    //   this.search();
    // }
  }

  search() {

    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.filtros);
      this.emitSearch.emit(this.modoBusqueda);
    }
  }

  recuperarColegiado(event) {
    if (event != undefined) {
      this.filtros.apellidosNombre = event.nombre;
      this.filtros.ncolegiado = event.nColegiado;
      this.filtros.idPersona = event.idPersona;
    }
  }

  checkFilters() {
    if (!this.esColegiado && (
      (this.filtros.idPartidaPresupuestaria == null || this.filtros.idPartidaPresupuestaria == undefined) &&
      (this.filtros.idConcepto == null || this.filtros.idConcepto == undefined) &&
      (this.filtros.idTurno == null || this.filtros.idTurno == undefined) &&
      (this.filtros.idFacturacion == null || this.filtros.idFacturacion == undefined))) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      return false;
    } else {
      return true;
    }
  }

  getComboPartidasPresupuestarias() {
    this.sigaServices.get("combo_partidasPresupuestarias").subscribe(
      data => {
        this.comboPartidaPresupuestaria = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPartidaPresupuestaria);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboGrupoTurnos() {
    this.sigaServices.get("combo_grupoFacturacion").subscribe(
      data => {
        this.comboGrupoTurnos = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboGrupoTurnos);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboFactConceptos() {
    this.sigaServices.get("combo_comboFactConceptos").subscribe(
      data => {
        this.comboConceptos = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboConceptos);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboFacturacion() {
    this.sigaServices.get("combo_comboFactColegio").subscribe(
      data => {
        this.comboFacturacion = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboFacturacion);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboPagos() {
    this.sigaServices.get("combo_comboPagosColegio").subscribe(
      data => {
        this.comboPagos = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPagos);
      },
      err => {
        console.log(err);
      }
    );
  }

  changeFilters() {
    this.clearFilters();

    if (this.modoBusqueda == "f") {
      this.modoBusquedaFacturacion = true;
    } else if (this.modoBusqueda == "p") {
      this.modoBusquedaFacturacion = false;
    }
  }

  clearFilters() {

    if (this.esColegiado) {
      this.filtros.idFacturacion = undefined;
      this.filtros.idConcepto = undefined;
      this.filtros.idPartidaPresupuestaria = undefined;
      this.filtros.idTurno = undefined;

    } else {
      this.filtros = new CartasFacturacionPagosItem();
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onHideDatosColegiado() {
    this.showDatosColegiado = !this.showDatosColegiado;

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
