import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { JusticiableBusquedaItem } from '../../../../../../../models/sjcs/JusticiableBusquedaItem';
import { EJGItem } from '../../../../../../../models/sjcs/EJGItem';
import { Message } from 'primeng/components/common/api';



@Component({
  selector: 'app-contrarios-pre-designacion',
  templateUrl: './contrarios-pre-designacion.component.html',
  styleUrls: ['./contrarios-pre-designacion.component.scss']
})
export class ContrariosPreDesignacionComponent implements OnInit {
  msgs: Message[];
  openCon:boolean = false;

  @Output() searchContrarios = new EventEmitter<boolean>();

  contrariosEJG;
  historicoContrario:boolean = false;

  ejg : EJGItem;

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
      activa: false
    },
    {
      key: "generales",
      activa: true
    },
    {
      key: "personales",
      activa: true
    },
    {
      key: "solicitud",
      activa: true
    },
    {
      key: "representante",
      activa: true
    },
    {
      key: "asuntos",
      activa: true
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
    this.ejg = this.persistenceService.getDatos();
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.datos=this.contrariosEJG;
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
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
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

  searchContrariosEJG(){
    this.progressSpinner = true;
    let data = sessionStorage.getItem("designaItemLink");
    let designaItem = JSON.parse(data);

    let item = [this.ejg.numero.toString(), this.ejg.annio, this.ejg.tipoEJG, this.historicoContrario];

    this.sigaServices.post("gestionejg_busquedaListaContrariosEJG", item).subscribe(n => {

      //Contrarios segun el valor de historico
      this.contrariosEJG = JSON.parse(n.body);
      //Primer contrario para la cabecera
      let primero = this.contrariosEJG[0];
      //Datos para la tabla
      this.datos = this.contrariosEJG;

      let error = JSON.parse(n.body).error;
      // if(sessionStorage.getItem("contrarios" &&)!=null)this.router.navigate(["/justiciables"]);
      if (error != null && error.description != null) {
        this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
      }
      this.progressSpinner = false;
    },
    err => {
      this.progressSpinner = false;
    });
  }

  NewContrario(){
    sessionStorage.setItem("origin","newContrario");
    sessionStorage.setItem("contrarios",JSON.stringify(this.contrariosEJG));
    //this.searchContrarios.emit(true);
    this.router.navigate(["/justiciables"]);
  }

  openTab(evento) {
    let contrario = new JusticiableBusquedaItem();
    let datos;
    contrario.idpersona=evento.idPersona;
    sessionStorage.setItem("personaDesigna",evento.idPersona);
    this.progressSpinner = true;
    this.sigaServices.post("busquedaJusticiables_searchJusticiables", contrario).subscribe(
      n => {
        datos = JSON.parse(n.body).justiciableBusquedaItems;
        let error = JSON.parse(n.body).error;
        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }
        this.persistenceService.setDatos(datos[0]);
        this.persistenceService.setFichasPosibles(this.fichasPosibles);
        sessionStorage.setItem("origin","Contrario");
        this.persistenceService.clearBody();

        if(evento.abogado!="" && evento.abogado!=null){
          sessionStorage.setItem("idabogadoFicha",evento.idabogadocontrario);
        }
        if(evento.procurador!="" && evento.procurador!=null){
          sessionStorage.setItem("procuradorFicha",evento.procurador);
        }
        if(evento.representante!="" && evento.representante!=null){
          let representante = new JusticiableBusquedaItem();
          representante.idpersona=evento.representante;
          this.sigaServices.post("busquedaJusticiables_searchJusticiables", representante).subscribe(
            j =>{
              this.persistenceService.setBody(JSON.parse(j.body).justiciableBusquedaItems[0]);
              this.router.navigate(["/gestionJusticiables"]);
            })
        }
        else{
          this.router.navigate(["/gestionJusticiables"]);
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      });
  }

  abreCierra(){
    this.openCon = !this.openCon;
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
