import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { BusquedaRetencionesRequestDTO } from '../../../../../models/sjcs/BusquedaRetencionesRequestDTO';
import { CertificacionesItem } from '../../../../../models/sjcs/CertificacionesItem';

@Component({
  selector: 'app-tabla-certificacion-fac',
  templateUrl: './tabla-certificacion-fac.component.html',
  styleUrls: ['./tabla-certificacion-fac.component.scss']
})
export class TablaCertificacionFacComponent implements OnInit {

  selectedDatos: CertificacionesItem[] = [];
  selectedItem: number = 10;
  rowsPerPage: any = [];
  cols: any[];
  msgs: any[];
  selectionMode: string = "multiple";
  numSelected: number = 0;
  selectMultiple: boolean = false;
  selectAll: boolean = false;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private confirmationService: ConfirmationService) { }

  @Input() datos: CertificacionesItem[] = [];
  @Input() permisoEscritura: boolean = false;
  @Input() filtrosDeBusqueda: BusquedaRetencionesRequestDTO = undefined;

  @Output() delete = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;
  @ViewChild("tablaFoco") tablaFoco: ElementRef;

  ngOnInit() {
    this.getCols();
  }

  getCols() {

    this.cols = [
      { field: "periodo", header: "justiciaGratuita.guardia.gestion.periodo", width: "12,14%" },
      { field: "nombre", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre", width: "15%" },
      { field: "turno", header: "justiciaGratuita.sjcs.designas.DatosIden.turno", width: "12,14%" },
      { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu", width: "12,14%" },
      { field: "ejg", header: "justiciaGratuita.ejg.datosGenerales.EJG", width: "12,14%" },
      { field: "soj", header: "justiciaGratuita.ejg.busquedaAsuntos.SOJ", width: "12,14%" },
      { field: "total", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.total", width: "12,14%" },
      { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "12,14%" }
    ];

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  delCert() {
    if (!this.disabledEliminar() && this.permisoEscritura) {

      let mess = this.translateService.instant("messages.deleteConfirmation");
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.delete.emit(true);
        },
        reject: () => {
          this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
        }
      });

    }
  }

  openFicha(dato: CertificacionesItem) {
    if (this.filtrosDeBusqueda) {
      sessionStorage.setItem("filtrosBusquedaCerti", JSON.stringify(this.filtrosDeBusqueda));
    }
    sessionStorage.setItem("edicionDesdeTablaCerti", JSON.stringify(dato));
    this.router.navigate(['/fichaCertificacionFac']);
  }

  actuDesSeleccionados() {
    this.numSelected = this.selectedDatos.length;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  onChangeSelectAll() {

    if (this.selectAll === true) {
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;

    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  disabledEliminar() {
    if (this.selectedDatos == undefined || this.selectedDatos == null || this.selectedDatos.length == 0) {
      return true;
    } else {
      return false;
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
