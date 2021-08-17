import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';

@Component({
  selector: 'app-detalle-tarjeta-comunicaciones-designa',
  templateUrl: './detalle-tarjeta-comunicaciones-designa.component.html',
  styleUrls: ['./detalle-tarjeta-comunicaciones-designa.component.scss']
})
export class DetalleTarjetaComunicacionesDesignaComponent implements OnInit {
  
  msgs;

  @Output() searchComunicaciones = new EventEmitter<boolean>();

  @Input() comunicaciones;

  selectedItem: number = 10;
  datos;
  cols;
  rowsPerPage;
  selectMultiple: boolean = false;
  selectionMode: string = "single";
  numSelected = 0;
  
  selectedDatos: any = [];

  selectAll: boolean= false;
  progressSpinner: boolean = false;

  @ViewChild("table") tabla;

  constructor(private sigaServices: SigaServices, 
    private  translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.getCols(); 
    this.datos=this.comunicaciones;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.datos=this.comunicaciones;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  actualizaSeleccionados(){
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (this.selectedDatos != undefined) {
      if(this.selectedDatos.length ==undefined) this.numSelected=1;
      else this.numSelected = this.selectedDatos.length;
    }
  }

  getCols() {
    this.cols = [
      { field: "claseComunicacion", header: "informesycomunicaciones.comunicaciones.busqueda.claseComunicacion" },
      { field: "destinatario", header: "informesycomunicaciones.comunicaciones.busqueda.destinatario" },
      { field: "fechaCreacion", header: "informesycomunicaciones.enviosMasivos.fechaCreacion" },
      { field: "fechaProgramada", header: "informesycomunicaciones.comunicaciones.busqueda.fechaProgramada" },
      { field: "tipoEnvio", header: "informesycomunicaciones.comunicaciones.busqueda.tipoEnvio" },
      { field: "estadoEnvio", header: "censo.nuevaSolicitud.estado" }
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
  
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  
  navigateTo(dato) {
      this.router.navigate(["/fichaRegistroComunicacion"]);
      sessionStorage.setItem("comunicacionesSearch", JSON.stringify(dato[0]));
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
}
