import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-tabla-generar-impreso190',
  templateUrl: './tabla-generar-impreso190.component.html',
  styleUrls: ['./tabla-generar-impreso190.component.scss']
})
export class TablaGenerarImpreso190Component implements OnInit {

  selectedDatos = [];
  selectedItem: number = 10;
  rowsPerPage: any = [];
  cols;
  msgs;
  selectionMode: String = "multiple";
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  selectAll: boolean = false;
  first: any;
  initDatos: any;
  buscadores = [];
  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService) { }

  @Input() datos;
  @Input() permisoEscritura;
  @Output() delete = new EventEmitter();
  @ViewChild("tabla") tabla;
  @ViewChild("tablaFoco") tablaFoco: ElementRef;

  ngOnInit() {

    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.persistenceService.clearPaginacion();

      this.first = paginacion.paginacion;
      this.selectedItem = paginacion.selectedItem;
    }

    this.getCols();
    if(this.datos != null || this.datos != undefined){
      this.initDatos = JSON.parse(JSON.stringify((this.datos)));
    }
  }

  getCols(){
    
    this.cols = [
      { field: "anio", header: "justiciaGratuita.sjcs.designas.DatosIden.ano", width: "5%" },
      { field: "nombre_fichero", header: "censo.cargaMasivaDatosCurriculares.literal.nombreFichero", width: "15%" },
      { field: "telefonoContacto", header: "censo.ws.literal.telefono", width: "10%" },
      { field: "nombreContacto", header: "censo.usuario.nombre", width: "15%" },
      { field: "apllidos1Contacto", header: "censo.busquedaClientes.literal.apellido1", width: "15%" },
      { field: "apllidos2Contacto", header: "censo.busquedaClientes.literal.apellido2", width: "15%" },
      { field: "fechaGeneracion", header: "justiciaGratuita.remesas.tabla.FechaGeneracion", width: "15%" },
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

confirmDelete(){

}

nuevoImpreso(){

}

guardarImpreso(){

}

descargarImpreso(){

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
    this.selectedDatos = this.datos;
    this.numSelected = this.datos.length;
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
