import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { CertificacionFacItem } from '../../../../../../models/sjcs/CertificacionFacItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-movimientos-varios-asociados',
  templateUrl: './tarjeta-movimientos-varios-asociados.component.html',
  styleUrls: ['./tarjeta-movimientos-varios-asociados.component.scss']
})
export class TarjetaMovimientosVariosAsociadosComponent implements OnInit {
  @Input() idCertificacion;
  @Input() modoEdicion;
  @Output() changeModoEdicion = new EventEmitter<boolean>();
  @ViewChild("tabla") tabla;
  progressSpinner;
  permisos;
  datosTablaMovAso:CertificacionFacItem[];
  selectedDatos;
  selectedItem: number = 10;
  rowsPerPage: any = [];
  cols;
  msgs;
  selectionMode: String = "multiple";
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  selectAll: boolean = false;
  first = 0;
  buscadores = [];
  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getCols()
  }

  getCols(){
    
    this.cols = [
      { field: "nColegiado", header: "facturacionSJCS.facturacionesYPagos.numColegiado", width: "10%" },
      { field: "apellidos", header: "facturacionSJCS.facturacionesYPagos.apellidos", width: "10%" },
      { field: "nomColeg", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre", width: "10%" },
      { field: "descripcion", header: "general.boton.description", width: "10%" },
      { field: "asunto", header: "justiciaGratuita.sjcs.designas.DatosIden.asunto", width: "10%" },
      { field: "fechaAlta", header: "administracion.usuarios.literal.fechaAlta", width: "10%" },
      { field: "importeMovVario", header: "facturacionSJCS.movimientosVarios.importeAplicado", width: "10%" },
      
    ];
   

  this.cols.forEach(it => this.buscadores.push(""));
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

  selectDesSelectFila(){
    this.numSelected = this.selectedDatos.length;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectedDatos = this.datosTablaMovAso;
      this.numSelected = this.datosTablaMovAso.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
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
