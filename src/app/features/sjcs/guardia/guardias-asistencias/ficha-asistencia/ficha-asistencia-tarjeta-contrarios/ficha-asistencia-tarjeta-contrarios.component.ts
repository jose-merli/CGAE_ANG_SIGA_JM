import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { ContrarioItem } from '../../../../../../models/guardia/ContrarioItem';
import { JusticiableBusquedaItem } from '../../../../../../models/sjcs/JusticiableBusquedaItem';
import { JusticiableItem } from '../../../../../../models/sjcs/JusticiableItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { AsistenciasItem } from '../../../../../../models/sjcs/AsistenciasItem';


@Component({
  selector: 'app-ficha-asistencia-tarjeta-contrarios',
  templateUrl: './ficha-asistencia-tarjeta-contrarios.component.html',
  styleUrls: ['./ficha-asistencia-tarjeta-contrarios.component.scss']
})
export class FichaAsistenciaTarjetaContrariosComponent implements OnInit {

  msgs : Message [] = [];
  @Input() modoLectura: boolean;
  @Input() idAsistencia : string;
  @Input() editable : boolean;
  @Output() refreshTarjetas = new EventEmitter<string>();
  selectedDatos : ContrarioItem [] = [];
  rows : number = 10;
  rowsPerPage = [];
  columnas = [];
  seleccionMultiple : boolean = false;
  seleccionarTodo : boolean = false;
  progressSpinner : boolean = false;
  numSeleccionado : number = 0;
  contrarios : ContrarioItem [] = [];
  deleteDisabled : boolean = true;
  reactivarDisabled : boolean = true;
  mostrarHistorico : boolean = false;
  asistencia: AsistenciasItem;

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
    }
  ];

  @ViewChild("table") table: DataTable;
  constructor(private translateService : TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices : SigaServices,
    private router : Router,
    private persistenceService : PersistenceService) { }

  ngOnInit() {

    this.columnas =[
      {field: 'nif', header: this.translateService.instant("administracion.usuarios.literal.NIF")},
      {field: 'apellidosnombre', header: this.translateService.instant("justiciaGratuita.oficio.designas.interesados.apellidosnombre")},
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

    if(this.idAsistencia){
      this.getListaContrarios();
    }
  }

  getListaContrarios(){
    //this.progressSpinner = true;
    this.sigaServices.getParam("busquedaGuardias_searchListaContrarios","?anioNumero="+this.idAsistencia+"&mostrarHistorico="+this.mostrarHistorico).subscribe(
      n => {
        this.contrarios = n;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      }
    );

  }

  onSelectRow(contrario : ContrarioItem){

    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 1;
      if(this.mostrarHistorico
          && contrario.fechaBaja
          && this.numSeleccionado > 0){
        this.reactivarDisabled = false;
      } else {
        this.reactivarDisabled = true;
      }
      this.deleteDisabled = false;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
      if(this.numSeleccionado > 0){
       this.deleteDisabled = false;
      }else{
        this.deleteDisabled = true;
      }

      if(this.mostrarHistorico
          && contrario.fechaBaja
          && this.numSeleccionado > 0){
        this.reactivarDisabled = false;
      }else{
        this.reactivarDisabled = true;
      }
    }
  }

  onClickEnlace(contrario : ContrarioItem){ //Redirigimos a ficha de justiciables
    let datos;
    let asistidoBusqueda = new JusticiableBusquedaItem();
    asistidoBusqueda.idpersona = contrario.idPersona;
    this.progressSpinner = true;
    this.sigaServices.post("busquedaJusticiables_searchJusticiables", asistidoBusqueda).subscribe(
      n => {
        datos = JSON.parse(n.body).justiciableBusquedaItems;
        // this.asistencia = this.persistenceService.getDatosAsistencia();
        // sessionStorage.setItem("AsistenciaItem", JSON.stringify(this.asistencia));
        sessionStorage.setItem("itemAsistencia", JSON.stringify(true));
        let error = JSON.parse(n.body).error;
        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMsg("info", this.translateService.instant("general.message.informacion"), error.description);
        } else {
          this.persistenceService.setDatos(datos[0]);
          this.persistenceService.setFichasPosibles(this.fichasPosibles);
          sessionStorage.setItem("origin","Asistencia");
          sessionStorage.setItem("idAsistencia",this.idAsistencia);
          this.persistenceService.clearBody();   
          this.router.navigate(["/gestionJusticiables"]);
        }
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }
    );
  }

  newContrario(){
    sessionStorage.setItem("origin","newContrarioAsistencia");
    sessionStorage.setItem("contrarios", JSON.stringify(this.contrarios));
    sessionStorage.setItem("itemDesignas", JSON.stringify(true));
    sessionStorage.setItem("idAsistencia",this.idAsistencia);
    this.router.navigate(["/justiciables"]);
  }

  deleteContrarios(){

    this.progressSpinner = true;
    let contrarios : ContrarioItem [] = [];
    if(Array.isArray(this.selectedDatos)){ //Si hemos seleccionado varios registros o hemos seleccionado al menos uno
      contrarios = this.selectedDatos;
    }else{
      contrarios.push(this.selectedDatos);
    }

    this.sigaServices
    .postPaginado("busquedaGuardias_desasociarContrario", "?anioNumero="+this.idAsistencia, contrarios)
    .subscribe(
      data => {
        let result = JSON.parse(data["body"]);
        if(result.error){
          this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
        }else{
          this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
          this.refreshTarjetas.emit(this.idAsistencia);
          this.getListaContrarios();
          this.deleteDisabled = true;
          this.numSeleccionado = 0;
        }
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {
          this.progressSpinner = false;
        }
      );

  }

  reactivarContrario(){

    this.progressSpinner = true;
    let justiciablesContrarios : JusticiableItem [] = [];
    if(Array.isArray(this.selectedDatos)){ //Si hemos seleccionado varios registros o hemos seleccionado al menos uno
      this.selectedDatos.forEach(contrario =>{

        let justiciableItem = new JusticiableItem();
        justiciableItem.idpersona = contrario.idPersona;
        justiciablesContrarios.push(justiciableItem);
      })
    }else{
      let justiciableItem = new JusticiableItem();
      justiciableItem.idpersona = Object.assign(this.selectedDatos).idPersona;
      justiciablesContrarios.push(justiciableItem);
    }
    this.sigaServices
      .postPaginado("busquedaGuardias_asociarContrario", "?anioNumero="+this.idAsistencia, justiciablesContrarios)
      .subscribe(
        data => {
          let result = JSON.parse(data["body"]);
          if(result.error){
            this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          }else{
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.refreshTarjetas.emit(this.idAsistencia);
            this.getListaContrarios();
          }

        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
            this.progressSpinner = false;
        }
      )
  }

  onClickHistorico(value : boolean){
    this.mostrarHistorico = value;
    this.getListaContrarios();
  }

  onChangeRowsPerPages(event) {
    this.rows = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSeleccionMultiple(){
    if(this.table.selectionMode == 'single'){
      this.table.selectionMode = 'multiple';
      this.seleccionMultiple = true;
    }else{
      this.table.selectionMode = 'single';
      this.seleccionMultiple = false;
    }
    this.selectedDatos = [];
    this.numSeleccionado = 0;
  }

  onChangeSeleccionarTodo(){
    if(this.seleccionarTodo){
      this.selectedDatos = this.contrarios;
      this.numSeleccionado = this.selectedDatos.length;
      this.deleteDisabled = false;
      if(this.contrarios.every(contrario => contrario.fechaBaja != null)){
        this.reactivarDisabled = false;
      }
    }else{
      this.selectedDatos = [];
      this.numSeleccionado = 0;
      this.reactivarDisabled = true;
      this.deleteDisabled = true;
    }
  }

  clear() {
    this.msgs = [];
  }

  showMsg(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }

  actualizaSeleccionados(){
    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 0;
      if(this.mostrarHistorico){
        this.reactivarDisabled = true;
      }
      this.deleteDisabled = true;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
      if(this.mostrarHistorico
          && this.numSeleccionado <= 0){
            this.reactivarDisabled = true;
      }
      if(this.numSeleccionado <= 0){
        this.deleteDisabled = true;
      }
    }
  }

  isEliminado(dato){
    return dato.fechaBaja!=null;
  }
}
