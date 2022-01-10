import { HostListener, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MultiSelect } from 'primeng/multiselect';
import { TranslateService } from '../../../../commons/translate';
import { ComboItem } from '../../../../models/ComboItem';
import { SerieFacturacionItem } from '../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { KEY_CODE } from '../../../administracion/auditoria/usuarios/auditoria-usuarios.component';

@Component({
  selector: 'app-filtros-series-factura',
  templateUrl: './filtros-series-factura.component.html',
  styleUrls: ['./filtros-series-factura.component.scss']
})
export class FiltrosSeriesFacturaComponent implements OnInit {

  msgs;

  @Input() permisos;
  @Input() permisoEscritura;
  @Output() busqueda = new EventEmitter<boolean>();
  
  progressSpinner: boolean = false;
  historico: boolean = false;

  // Combos

  comboCuentaBancaria: ComboItem[] = [];
  comboSufijo: ComboItem[] = [];
  comboTiposProductos: ComboItem[] = [];
  comboTiposServicios: ComboItem[] = [];
  comboEtiquetas: ComboItem[] = [];
  comboConsultasDestinatarios: ComboItem[] = [];
  comboContadorFacturas: ComboItem[] = [];
  comboContadorFacturasRectificativas: ComboItem[] = [];

  showDatosGenerales: boolean = true;
  
  body: SerieFacturacionItem = new SerieFacturacionItem();

  constructor(
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService,
    private sigaServices: SigaServices,
    private router: Router
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getCombos();
    if (this.persistenceService.getPermisos()) {
      this.permisos = this.persistenceService.getPermisos();
    }

    if (this.persistenceService.getFiltros() && sessionStorage.getItem("volver")) {
      this.body = this.persistenceService.getFiltros();
      this.persistenceService.clearFiltros();
      sessionStorage.removeItem("volver");

      this.busqueda.emit();
    }

    this.progressSpinner = false;
  }


  // Get combos

  getCombos() {
    this.getComboCuentaBancaria();
    this.getComboSufijo();
    this.getComboTiposProductos();
    this.getComboTiposServicios();
    this.getComboEtiquetas();
    this.getComboConsultasDestinatarios();
    this.getComboContadorFacturas();
    this.getComboContadorFacturasRectificativas();
  }

  // Combos

  getComboCuentaBancaria() {
    this.sigaServices.get("facturacionPyS_comboCuentaBancaria").subscribe(
      n => {
        this.comboCuentaBancaria = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboCuentaBancaria);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboSufijo() {
    this.sigaServices.get("facturacionPyS_comboSufijo").subscribe(
      n => {
        this.comboSufijo = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboSufijo);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTiposProductos() {
    this.sigaServices.get("facturacionPyS_comboProductos").subscribe(
      n => {
        this.comboTiposProductos = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTiposProductos);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTiposServicios() {
    this.sigaServices.get("facturacionPyS_comboServicios").subscribe(
      n => {
        this.comboTiposServicios = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTiposServicios);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboEtiquetas() {
    this.sigaServices.get("facturacionPyS_comboEtiquetas").subscribe(
      n => {
        this.comboEtiquetas = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboEtiquetas);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboConsultasDestinatarios() {
    this.sigaServices.get("facturacionPyS_comboDestinatarios").subscribe(
      n => {
        this.comboConsultasDestinatarios = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboConsultasDestinatarios);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboContadorFacturas() {
    this.sigaServices.get("facturacionPyS_comboContadores").subscribe(
      n => {
        this.comboContadorFacturas = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboContadorFacturas);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboContadorFacturasRectificativas() {
    this.sigaServices.get("facturacionPyS_comboContadoresRectificativas").subscribe(
      n => {
        this.comboContadorFacturasRectificativas = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboContadorFacturasRectificativas);
      },
      err => {
        console.log(err);
      }
    );
  }

  // Mostrar u ocultar filtros de datos generales
  onHideDatosGenerales(): void {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  // Buttons

  focusInputField(someMultiselect: MultiSelect) {
    setTimeout(() => {
      someMultiselect.filterInputChild.nativeElement.focus();
    }, 300);
  }

  checkPermisosIsNuevo() { }

  isNuevo() {
    if (sessionStorage.getItem("serieFacturacionItem")) {
      sessionStorage.removeItem("serieFacturacionItem");
    }

    this.persistenceService.clearDatos();
    sessionStorage.setItem("Nuevo", "true");
    this.router.navigate(["/datosSeriesFactura"]);
  }

  clear() { 
    this.msgs = [];
  }

  clearFilters() {
    this.body = new SerieFacturacionItem();
    this.persistenceService.clearFiltros();

    this.goTop();
  }

  checkFilters(): boolean {
    if (this.body.abreviatura != undefined)
      this.body.abreviatura = this.body.abreviatura.trim();
    if (this.body.descripcion != undefined)
      this.body.descripcion = this.body.descripcion.trim();
    if (this.body.idCuentaBancaria != undefined)
      this.body.idCuentaBancaria = this.body.idCuentaBancaria.trim();

    //this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));

    return true;
  }

  // Botón de busqueda

  isBuscar() {
    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.body);
      
      this.busqueda.emit();
    }
  }

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
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
  
  // Búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }
}
