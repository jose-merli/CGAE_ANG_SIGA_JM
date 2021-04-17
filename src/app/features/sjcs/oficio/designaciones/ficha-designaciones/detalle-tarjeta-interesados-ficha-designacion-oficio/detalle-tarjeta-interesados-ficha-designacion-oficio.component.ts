import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';

@Component({
  selector: 'app-detalle-tarjeta-interesados-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-interesados-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-interesados-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaInteresadosFichaDesignacionOficioComponent implements OnInit {
  
  msgs;

  @Output() searchInteresados = new EventEmitter<boolean>();

  @Input() interesados;

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
    this.datos=this.interesados;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.datos=this.interesados;
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
      { field: "nif", header: "justiciaGratuita.oficio.designas.interesados.identificador" },
      { field: "apellidosnombre", header: "justiciaGratuita.oficio.designas.interesados.apellidosnombre" },
      { field: "direccion", header: "justiciaGratuita.oficio.designas.interesados.direccion" },
      { field: "representante", header: "justiciaGratuita.oficio.designas.interesados.representante" }
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

  Eliminar(){
    this.progressSpinner = true;
    let request = [ this.selectedDatos.idInstitucion,  this.selectedDatos.idPersona, this.selectedDatos.anio,  this.selectedDatos.idTurno, this.selectedDatos.numero]
    this.sigaServices.post("designaciones_deleteInteresado", request).subscribe(
      data => {
        this.selectedDatos = [];
        this.searchInteresados.emit();
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.selectMultiple = false;
        this.selectAll = false;
      }
    );
  }
  

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  NewInteresado(){
    sessionStorage.setItem("origin","newInteresado");
    sessionStorage.setItem("interesados",JSON.stringify(this.interesados));
    this.router.navigate(["/justiciables"]);
  }

  openTab(evento) {
    this.persistenceService.setBody(evento);
    this.router.navigate(["/gestionJusticiables"]);
  }
  
  onChangeSelectAll() {
    if (this.selectAll === true) {
      /* if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
        this.selectMultiple = true;
        this.selectionMode = "single";
      } else { */
        this.selectedDatos = this.datos;
        /* this.selectMultiple = false;
        this.selectionMode = "single";
      }
      this.selectionMode = "multiple"; */
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
     /*  if (this.historico)
        this.selectMultiple = true;
      this.selectionMode = "multiple"; */
    }
  }
}
