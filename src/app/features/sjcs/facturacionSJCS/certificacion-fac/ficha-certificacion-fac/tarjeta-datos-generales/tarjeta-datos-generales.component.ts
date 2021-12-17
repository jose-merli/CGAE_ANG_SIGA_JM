import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { CertificacionesItem } from '../../../../../../models/sjcs/CertificacionesItem';

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
  estadosCertificacionList: any[] = [];

  @Input() modoEdicion: boolean = false;
  @Input() certificacion: CertificacionesItem = undefined;

  @Output() changeModoEdicion = new EventEmitter<boolean>();
  @Output() guardarEvent = new EventEmitter<boolean>();

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
      { field: "proceso", header: "facturacionSJCS.fichaCertificacion.proceso", width: "20%" },
      { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "20%" },

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
