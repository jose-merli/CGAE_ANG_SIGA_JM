import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';

@Component({
  selector: 'app-detalle-tarjeta-relaciones-designa',
  templateUrl: './detalle-tarjeta-relaciones-designa.component.html',
  styleUrls: ['./detalle-tarjeta-relaciones-designa.component.scss']
})
export class DetalleTarjetaRelacionesDesignaComponent implements OnInit {
  
  msgs;

  @Output() searchRelaciones = new EventEmitter<boolean>();

  @Input() relaciones;

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
    this.datos=this.relaciones;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.datos=this.relaciones;
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
      { field: "sjcs", header: "justiciaGratuita.oficio.designas.interesados.identificador" },
      { field: "anio", header: "dato.jgr.guardia.saltcomp.fecha" },
      { field: "numero", header: "justiciaGratuita.justiciables.literal.turnoGuardia" },
      { field: "destipo", header: "justiciaGratuita.sjcs.designas.colegiado" },
      { field: "desturno", header: "justiciaGratuita.sjcs.designas.datosInteresados" },
      { field: "idletrado", header: "justiciaGratuita.justiciables.literal.datosInteres" }
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

  
  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  eliminarRelacion(){
    this.progressSpinner = true;

    console.log(this.selectedDatos);

  this.sigaServices.post("designaciones_eliminarRelacion", this.selectedDatos).subscribe(
    data => {
        this.showMessage("succes", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
  },
  err => {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
      this.progressSpinner = false;
    }
  );
  }
}
