import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../commons/translate';
import { ComboItem } from '../../../models/ComboItem';
import { FacFacturacionprogramadaItem } from '../../../models/FacFacturacionprogramadaItem';
import { CommonsService } from '../../../_services/commons.service';
import { SigaServices } from '../../../_services/siga.service';
import { FiltrosFactProgramadasComponent } from './filtros-fact-programadas/filtros-fact-programadas.component';
import { TablaFactProgramadasComponent } from './tabla-fact-programadas/tabla-fact-programadas.component';

@Component({
  selector: 'app-fact-programadas',
  templateUrl: './fact-programadas.component.html',
  styleUrls: ['./fact-programadas.component.scss']
})
export class FactProgramadasComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  buscar: boolean = false;
  datos: FacFacturacionprogramadaItem[] = [];

  controlEmisionFacturasSII: boolean = false;

  @ViewChild(FiltrosFactProgramadasComponent) filtros;
  @ViewChild(TablaFactProgramadasComponent) tabla;

  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
    this.getParametrosCONTROL();
  }

  // Obtener parametros de CONTROL
  getParametrosCONTROL(): void {
    this.progressSpinner = true;
    this.sigaServices.get("facturacionPyS_parametrosCONTROL").subscribe(
      n => {
        let items: ComboItem[] = n.combooItems;
        
        let controlEmisionItem: ComboItem = items.find(item => item.label == "CONTROL_EMISION_FACTURAS_SII");

        if (controlEmisionItem) {
          this.controlEmisionFacturasSII = controlEmisionItem.value == "1";
        }

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  searchFacturacionProgramada() {
    let filtros = JSON.parse(JSON.stringify(this.filtros.body));
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_getFacturacionesProgramadas", filtros).subscribe(
      n => {
        this.datos = JSON.parse(n.body).facturacionprogramadaItems;
        let error = JSON.parse(n.body).error;

        this.datos.forEach(d => {
          d.compraSuscripcion = this.calcCompraSuscripcion(d);
          d.fechaCompraSuscripcionDesde = this.minDate(d.fechaInicioServicios, d.fechaInicioProductos);
          d.fechaCompraSuscripcionHasta = this.maxDate(d.fechaFinServicios, d.fechaFinProductos);
        });

        this.buscar = true;
        
        if (this.tabla != undefined) {
          this.tabla.table.sortOrder = 0;
          this.tabla.table.sortField = '';
          this.tabla.table.reset();
          this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
        }

        // Comprobamos el mensaje de info de resultados
        if (error != undefined  && error.message != undefined) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.message));
        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaFoco');
          this.commonsService.scrollTop();
        }, 5);
      }
    );
  }

  calcCompraSuscripcion(dato: FacFacturacionprogramadaItem): string {
    let isServicio: boolean = dato.fechaInicioServicios != undefined && dato.fechaFinServicios != undefined;
    let isProducto: boolean = dato.fechaInicioProductos != undefined && dato.fechaFinProductos != undefined;

    if (isServicio && isProducto) {
      return this.translateService.instant("facturacion.productos.CompraSuscripcion");
    } else if (isProducto) {
      return this.translateService.instant("facturacion.factProgramadas.literal.compra");
    } else {
      return this.translateService.instant("facturacion.factProgramadas.literal.suscripcion");
    }
  }

  // Fecha mínima para la columna 'desde'
  minDate(d1: Date, d2: Date) {
    if (d1 == undefined)
      return d2;
    if (d2 == undefined)
      return d1;

    if (d1 < d2) {
      return d1;
    } else {
      return d2;
    }
  }

  // Fecha máxima para la columna 'hasta'
  maxDate(d1: Date, d2: Date) {
    if (d1 == undefined)
      return d2;
    if (d2 == undefined)
      return d1;

    if (d1 > d2) {
      return d1;
    } else {
      return d2;
    }
  }

  // Funciones de utilidad

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

  clear() {
    this.msgs = [];
  }

}
