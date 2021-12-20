import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { CertificacionesItem } from '../../../../../../models/sjcs/CertificacionesItem';
import { EstadoCertificacionItem } from '../../../../../../models/sjcs/EstadoCertificacionItem';

@Component({
  selector: 'app-tarjeta-datos-generales-fiFac',
  templateUrl: './tarjeta-datos-generales.component.html',
  styleUrls: ['./tarjeta-datos-generales.component.scss']
})
export class TarjetaDatosGeneralesComponent implements OnInit {

  showDatosGenerales: boolean = true;
  progressSpinner: boolean = false;
  msgs: any[];
  permisoEscritura: boolean = false;
  selectedItem: number = 10;
  rowsPerPage: any = [];
  cols: any[] = [];

  @Input() modoEdicion: boolean = false;
  @Input() certificacion: CertificacionesItem = undefined;
  @Input() estadosCertificacion: EstadoCertificacionItem[] = [];

  @Output() changeModoEdicion = new EventEmitter<boolean>();
  @Output() guardarEvent = new EventEmitter<boolean>();
  @Output() getListaEstadosEvent = new EventEmitter<string>();

  @ViewChild("tabla") tabla: Table;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

    this.getCols();

    if (this.modoEdicion && this.certificacion && this.certificacion != null) {
      this.getListEstados(this.certificacion.idCertificacion);
    }

  }

  onHideDatosGenerales() {
    // this.showDatosGenerales != this.showDatosGenerales;
  }

  getCols() {

    this.cols = [
      { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado", width: "33%" },
      { field: "proceso", header: "facturacionSJCS.fichaCertificacion.proceso", width: "33%" },
      { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "33%" },

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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  getListEstados(idCertificacion: string) {
    if (idCertificacion && idCertificacion != null && idCertificacion.trim().length > 0) {
      this.getListaEstadosEvent.emit(idCertificacion);
    }
  }

  descargar() {

  }

  subirFichero() {

  }

  reabrir() {

  }

  cerrarEnviar() {

  }

  save() {

  }

  restablecer() {

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
