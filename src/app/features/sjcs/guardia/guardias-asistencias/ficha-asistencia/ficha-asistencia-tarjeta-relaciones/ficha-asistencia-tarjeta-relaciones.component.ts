import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { TarjetaAsistenciaItem } from '../../../../../../models/guardia/TarjetaAsistenciaItem';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { EJGItem } from '../../../../../../models/sjcs/EJGItem';
import { RelacionesItem } from '../../../../../../models/sjcs/RelacionesItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-asistencia-tarjeta-relaciones',
  templateUrl: './ficha-asistencia-tarjeta-relaciones.component.html',
  styleUrls: ['./ficha-asistencia-tarjeta-relaciones.component.scss']
})
export class FichaAsistenciaTarjetaRelacionesComponent implements OnInit {

  msgs : Message [] = [];
  @Input() asistencia : TarjetaAsistenciaItem;
  @Input() editable : boolean;
  @Output() refreshTarjetas = new EventEmitter<string>();
  rows : number = 10;
  rowsPerPage = [
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
  columnas = [];
  seleccionMultiple : boolean = false;
  seleccionarTodo : boolean = false;
  progressSpinner : boolean = false;
  numSeleccionado : number = 0;
  selectedDatos : RelacionesItem [] = [];
  relaciones : RelacionesItem [] = [];
  disableDelete : boolean = true;
  disableDesigna : boolean = false;
  disableEJG : boolean = false;
  @ViewChild("table") table: DataTable;
  constructor(private changeDetectorRef : ChangeDetectorRef,
    private sigaServices : SigaServices,
    private router : Router,
    private confirmationService : ConfirmationService,
    private translateService : TranslateService,
    private datePipe : DatePipe,
    private persistenceService : PersistenceService,
    private commonsService : CommonsService) { }

  ngOnInit() {

    this.getRelaciones();

  }

  getRelaciones(){

    if(this.asistencia){

      this.progressSpinner = true;
      this.sigaServices.getParam("busquedaGuardias_searchRelaciones","?anioNumero="+this.asistencia.anioNumero).subscribe(
        n => {
          this.relaciones = n.relacionesItem;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
          this.checkRelaciones();
        }
      );

    }

  }
  checkRelaciones(){

    if(this.relaciones){
      if(this.relaciones.find(relacion => relacion.sjcs.charAt(0)=='E')){ //Si hay algun EJG asociado no permitimos que se asocien mas
        this.disableEJG = true;
      }else{
        this.disableEJG = false;
      }
      if(this.relaciones.find(relacion => relacion.sjcs.charAt(0)=='D')){ //Si hay alguna Designa asociada no permitimos que se asocien mas
        this.disableDesigna = true;
      }else{
        this.disableDesigna = false;
      }
    }else{
      this.disableEJG = false;
      this.disableDesigna = false;
    }

  }

  onClickEnlace(relacion : RelacionesItem){

    let tipoAsunto = relacion.sjcs.charAt(0);

    if('D' == tipoAsunto){ //Si empieza por D es una Designacion, redirigimos a la ficha

      let desItem : any = new DesignaItem(); 
      let ape = relacion.letrado.split(',')[0].split(' - ')[1];
      desItem.ano = relacion.anio;
      desItem.numero = relacion.numero;
      desItem.idInstitucion = relacion.idinstitucion;
      desItem.idTurno = relacion.idturno;
      desItem.codigo = relacion.codigo;
      desItem.descripcionTipoDesigna = relacion.destipo
      desItem.fechaEntradaInicio = this.datePipe.transform(relacion.fechaasunto,'dd/MM/yyyy');
      desItem.nombreTurno = relacion.descturno;
      desItem.nombreProcedimiento = relacion.dilnigproc.split(' / ')[2];
      desItem.nombreColegiado = relacion.letrado;
      desItem.apellido1Colegiado =ape.split(' ')[0];
      desItem.apellido2Colegiado =ape.split(' ')[1];
      //Se cambia el valor del campo ano para que se procese de forma adecuada 
      //En la ficha en las distintas tarjetas para obtener sus valores
      desItem.ano = 'D' + desItem.ano + '/' + desItem.codigo;

      sessionStorage.setItem('designaItemLink',JSON.stringify(desItem));
      sessionStorage.setItem("nuevaDesigna", "false");
      sessionStorage.setItem("idAsistencia", this.asistencia.anioNumero);
      this.router.navigate(['/fichaDesignaciones']);

    }else if('E' == tipoAsunto){ //Si empieza por E es un EJG, redirigimos a la ficha
      let ejgItem = new EJGItem();
      ejgItem.annio = relacion.anio;
      ejgItem.numero = relacion.numero; //ID ejg junto al anio
      ejgItem.tipoEJG = relacion.idtipo;
      this.progressSpinner = true;
    
      this.sigaServices.post("gestionejg_datosEJG", ejgItem).subscribe(
        n => {
          let ejgObject : any []= JSON.parse(n.body).ejgItems;
          let datosItem : EJGItem = ejgObject[0];
          this.persistenceService.setDatos(datosItem);
          this.consultaUnidadFamiliar(ejgItem);
          this.commonsService.scrollTop();
          this.progressSpinner = false;
        },
        err => {
          console.error(err);
          this.showMsg('error', 'Error al consultar el EJG','');
          this.progressSpinner = false;
        },
        ()=>{
          this.progressSpinner = false;
        }
      );
      
    }

  }

  consultaUnidadFamiliar(selected) {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_unidadFamiliarEJG", selected).subscribe(
      n => {
        let datosFamiliares : any[] = JSON.parse(n.body).unidadFamiliarEJGItems;
        this.persistenceService.setBodyAux(datosFamiliares);

        if(sessionStorage.getItem("EJGItem")){
          sessionStorage.removeItem("EJGItem");
        }

        sessionStorage.setItem("idAsistencia", this.asistencia.anioNumero);
        this.router.navigate(['/gestionEjg']);
        this.progressSpinner = false;
        this.commonsService.scrollTop();
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () =>{
        this.progressSpinner = false;
      }
    );
  }

  asociarDesignacion(){
    sessionStorage.setItem("radioTajertaValue", 'des');
    sessionStorage.setItem("Asistencia", JSON.stringify(this.asistencia));
    sessionStorage.setItem("idAsistencia", this.asistencia.anioNumero);
    this.router.navigate(["/busquedaAsuntos"]);
  }

  asociarEJG(){
    sessionStorage.setItem("radioTajertaValue", 'ejg');
    sessionStorage.setItem("Asistencia", JSON.stringify(this.asistencia));
    sessionStorage.setItem("idAsistencia", this.asistencia.anioNumero);
    this.router.navigate(["/busquedaAsuntos"]);
  }

  crearEJG(){
    sessionStorage.setItem("asistencia", JSON.stringify(this.asistencia));
    sessionStorage.setItem("idAsistencia", this.asistencia.anioNumero);
    sessionStorage.setItem("Nuevo","true");
    this.router.navigate(["/gestionEjg"]);
  }

  crearDesignacion(){
    sessionStorage.setItem("asistencia", JSON.stringify(this.asistencia));
    sessionStorage.setItem("nuevaDesigna", "true");
    sessionStorage.setItem("idAsistencia", this.asistencia.anioNumero);
    this.router.navigate(["/fichaDesignaciones"]);
  }

  eliminarRelacion(){
    this.confirmationService.confirm({
      key: "confirmEliminar",
      message: this.translateService.instant("messages.deleteConfirmation"),
      icon: "fa fa-question-circle",
      accept: () => {this.executeEliminarRelacion();},
      reject: () =>{this.showMsg('info',"Cancel",this.translateService.instant("general.message.accion.cancelada"));}
    });
  }

  executeEliminarRelacion(){
    this.progressSpinner = true;
    let relaciones : RelacionesItem[] = [];
    if(Array.isArray(this.selectedDatos)){
      relaciones = this.selectedDatos;
    }else{
      relaciones.push(this.selectedDatos);
    }

    this.sigaServices
    .postPaginado("busquedaGuardias_eliminarRelacion", "?anioNumero="+this.asistencia.anioNumero, relaciones)
    .subscribe(
      n => {
        let result = JSON.parse(n["body"]);
        if(result.error){
          this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
        }else{
          this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
          this.getRelaciones();
          this.refreshTarjetas.emit(result.id);
        }
        
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
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
    this.disableDelete = true;
  }

  onChangeSeleccionarTodo(){
    if(this.seleccionarTodo){
      this.selectedDatos = this.relaciones;
      this.numSeleccionado = this.selectedDatos.length;
      this.disableDelete = true;
    }else{
      this.selectedDatos = [];
      this.numSeleccionado = 0;
      this.disableDelete = true;
    }
  }

  onSelectRow(relacion : RelacionesItem){

    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 1;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
    }
    this.disableDelete = false;
  }

  actualizaSeleccionados(){
    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 0;
      this.disableDelete = true;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
      if(this.numSeleccionado <= 0){
        this.disableDelete = true;
      }
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

}
