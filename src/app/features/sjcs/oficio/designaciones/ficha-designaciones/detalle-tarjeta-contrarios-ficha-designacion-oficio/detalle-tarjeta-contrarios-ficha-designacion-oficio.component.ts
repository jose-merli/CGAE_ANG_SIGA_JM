import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';

@Component({
  selector: 'app-detalle-tarjeta-contrarios-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-contrarios-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-contrarios-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaContrariosFichaDesignacionOficioComponent implements OnInit {

  msgs;

  @Output() searchContrarios = new EventEmitter<boolean>();

  @Input() contrarios;
  historicoContrario:boolean;

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
  
  fichasPosibles = [
    {
      origen: "justiciables",
      activa: true
    },
    {
      key: "generales",
      activa: true
    },
    {
      key: "solicitud",
      activa: false
    },
    {
      key: "representante",
      activa: false
    },
    {
      key: "asuntos",
      activa: false
    },
    {
      key: "abogado",
      activa: true
    },
    {
      key: "procurador",
      activa: true
    }

  ];

  @ViewChild("table") tabla;

  constructor(private sigaServices: SigaServices, 
    private  translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.getCols(); 
    this.datos=this.contrarios;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.datos=this.contrarios;
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
      { field: "nif", header: "justiciaGratuita.oficio.designas.contrarios.identificador" },
      { field: "apellidosnombre", header: "administracion.parametrosGenerales.literal.nombre.apellidos" },
      { field: "abogado", header: "justiciaGratuita.oficio.designas.contrarios.abogado" },
      { field: "procurador", header: "justiciaGratuita.oficio.designas.contrarios.procurador" }
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
    this.sigaServices.post("designaciones_deleteContrario", request).subscribe(
      data => {
        this.selectedDatos = [];
        this.searchContrarios.emit(false);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.historicoContrario = false;
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

  NewContrario(){
    sessionStorage.setItem("origin","newContrario");
    sessionStorage.setItem("contrarios",JSON.stringify(this.contrarios));
    this.router.navigate(["/justiciables"]);
  }

  openTab(evento) {
    this.persistenceService.setBody(evento);
    //sessionStorage.setItem("origin","contrario");
    this.persistenceService.setFichasPosibles(this.fichasPosibles);
    this.router.navigate(["/gestionJusticiables"]);
  }

  searchHistorical() {

    this.historicoContrario = !this.historicoContrario;
    this.searchContrarios.emit(this.historicoContrario);
    this.selectAll = false;
    this.selectedDatos=[];
  }

  isEliminado(dato){
    return dato.fechaBaja!=null;
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
