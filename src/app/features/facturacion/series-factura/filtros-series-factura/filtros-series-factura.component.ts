import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { MultiSelect } from 'primeng/multiselect';
import { TranslateService } from '../../../../commons/translate';
import { SeriesFacturacionItem } from '../../../../models/SeriesFacturacionItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-filtros-series-factura',
  templateUrl: './filtros-series-factura.component.html',
  styleUrls: ['./filtros-series-factura.component.scss']
})
export class FiltrosSeriesFacturaComponent implements OnInit {

  @Input() permisos;
  @Input() permisoEscritura;
  @Output() busqueda = new EventEmitter<boolean>();
  
  progressSpinner: boolean;

  // Combos

  comboCuentaBancaria = [];
  comboSufijo = [];
  comboTiposProductos = [];
  comboTiposServicios = [];
  comboEtiquetas = [];
  comboConsultasDestinatarios = [];
  comboContadorFacturas = [];
  comboContadorFacturasRectificativas = [];

  
  body: SeriesFacturacionItem = new SeriesFacturacionItem();

  constructor(
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getCombos();
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisos = this.persistenceService.getPermisos();
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
    // this.getComboConsultasDestinatarios();
    this.getComboContadorFacturas();
    this.getComboContadorFacturasRectificativas();
  }

  // Combos

  getComboCuentaBancaria() {
    this.progressSpinner=true;

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
    this.sigaServices.get("tiposProductos_comboProducto").subscribe(
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
    this.sigaServices.get("tiposServicios_comboServicios").subscribe(
      n => {
        this.comboTiposServicios = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTiposServicios);
      
        console.log(this.comboTiposServicios);
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

  // On change

  onChangeCuentaBancaria(): void {

  }

  onChangeSufijo(): void {
    
  }

  onChangeContadorFacturas(): void {
    
  }

  onChangeContadorFacturasRectificativas(): void {
    
  }

  // Buttons

  focusInputField(someMultiselect: MultiSelect) {
    /*
    setTimeout(() => {
      someMultiselect.filterInputChild.nativeElement.focus();
    }, 300);
    */
  }

  checkPermisosIsNuevo() { }

  clear() { }

  clearFilters() { }

  isBuscar() { }
  
}
