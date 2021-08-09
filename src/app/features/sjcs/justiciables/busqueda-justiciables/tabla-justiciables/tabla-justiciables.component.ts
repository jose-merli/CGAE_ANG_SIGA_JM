import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { JusticiableObject } from '../../../../../models/sjcs/JusticiableObject';
import { DataTable } from 'primeng/primeng';
import { Router } from '@angular/router';
import { JusticiableBusquedaObject } from '../../../../../models/sjcs/JusticiableBusquedaObject';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';

@Component({
  selector: 'app-tabla-justiciables',
  templateUrl: './tabla-justiciables.component.html',
  styleUrls: ['./tabla-justiciables.component.scss']
})
export class TablaJusticiablesComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  msgs;

  selectedItem: number = 10;
  selectedDatos = [];
  numSelected = 0;
  historico: boolean = false;

  initDatos;
  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;

  buscadores = [];
  first = 0;

  //Resultados de la busqueda
  @Input() datos;
  @Input() modoRepresentante;
  @Input() nuevoInteresado;
  @Input() nuevoContrario;
  @Input() nuevoAsistido;
  @Input() nuevoContrarioAsistencia;

  @ViewChild("table") tabla: DataTable;

  @Output() searchHistoricalSend = new EventEmitter<boolean>();


  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService
  ) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.first = paginacion.paginacion;
      this.selectedItem = paginacion.selectedItem;
    }

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));

  }


  openTab(evento) {

    let paginacion = {
      paginacion: this.tabla.first,
      selectedItem: this.selectedItem
    };

    this.persistenceService.setPaginacion(paginacion);

    if(this.nuevoInteresado){
      if(this.checkInteresado(evento))      this.insertInteresado(evento);
      else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.interesados.existente"))
      
    } else if(this.nuevoContrario){
      if(this.checkContrario(evento))  this.insertContrario(evento);
      else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.existente"))

    } else if(this.nuevoAsistido){
      this.asociarAsistido(evento);
    }else if(this.nuevoContrarioAsistencia){

      if(this.checkContrario(evento)){
        this.asociarContrarioAsistencia(evento);
      }else{
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.existente"))
      }
    
    } else{
      let filtros: JusticiableBusquedaItem = new JusticiableBusquedaItem();
      /* if(filtros.idRol=="2"){
        let fichasPosibles = this.persistenceService.getFichasPosibles();
        fichasPosibles[6].activa=true;
        fichasPosibles[7].activa=true;
        this.persistenceService.setFichasPosibles(fichasPosibles);
      } */
      if (!this.modoRepresentante) {
        this.persistenceService.clearDatos();
        this.persistenceService.setDatos(evento);
        this.persistenceService.clearBody();
        this.router.navigate(["/gestionJusticiables"]);
      } else {
        this.persistenceService.clearBody();
        this.persistenceService.setBody(evento);
        this.router.navigate(["/gestionJusticiables"]);
      }
    }
  }

  checkInteresado(justiciable){

    
    let interesados : any = sessionStorage.getItem("interesados");
    if(interesados!="") interesados = JSON.parse(interesados);
    let exist = false;

    let filtros: JusticiableBusquedaItem = new JusticiableBusquedaItem();

    if(this.persistenceService.getFiltrosAux() !=undefined){
      filtros = this.persistenceService.getFiltrosAux();
    }
    else filtros = this.persistenceService.getFiltros();

    if(interesados=="" || filtros.idRol=="1") exist = false;
    else{
      //Comprobamos que el justiciable no esta ya en la designacion
      interesados.forEach(element => {
        if(element.idPersona == justiciable.idpersona) exist = true;
      });
    }

    return !exist;
  }

  insertInteresado(justiciable){
    this.progressSpinner = true;

      let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));

      let request = [ designa.idInstitucion,  justiciable.idpersona, designa.ano,  designa.idTurno, designa.numero]
    this.sigaServices.post("designaciones_insertInteresado", request).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.router.navigate(["/fichaDesignaciones"]);
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
    }
  );
  }

  checkContrario(justiciable){

    let contrarios : any = sessionStorage.getItem("contrarios");
    let exist = false;
    if(contrarios!="") contrarios = JSON.parse(contrarios);

    if(contrarios=="") exist = false;
    else{
      //Comprobamos que el justiciable no esta ya en la designacion
      contrarios.forEach(element => {
        if(element.idPersona == justiciable.idpersona) exist = true;
      });
    }

    return !exist;
  }

  insertContrario(justiciable){
    this.progressSpinner = true;

      let designa: any = JSON.parse(sessionStorage.getItem("designaItemLink"));

      let request = [ designa.idInstitucion,  justiciable.idpersona, designa.ano, designa.idTurno, designa.numero]
    this.sigaServices.post("designaciones_insertContrario", request).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.router.navigate(["/fichaDesignaciones"]);
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
    }
  );
  }

  asociarAsistido(justiciable : JusticiableItem){

    let idAsistencia = sessionStorage.getItem("asistenciaAsistido");
    if(idAsistencia){

      this.sigaServices
      .postPaginado("busquedaGuardias_asociarAsistido", "?anioNumero="+idAsistencia+"&actualizaDatos='S'", justiciable)
      .subscribe(
        data => {
          let result = JSON.parse(data["body"]);
          if(result.error){
            this.showMessage('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          }else{
            this.showMessage('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.router.navigate(["/fichaAsistencia"]);
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

  }

  asociarContrarioAsistencia(justiciable : JusticiableItem){

    let idAsistencia = sessionStorage.getItem("idAsistencia");
    let justiciables : JusticiableItem [] = []
    justiciables.push(justiciable);
    if(idAsistencia){

      this.sigaServices
      .postPaginado("busquedaGuardias_asociarContrario", "?anioNumero="+idAsistencia, justiciables)
      .subscribe(
        data => {
          let result = JSON.parse(data["body"]);
          if(result.error){
            this.showMessage('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          }else{
            this.showMessage('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.router.navigate(["/fichaAsistencia"]);
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

  }

  getCols() {

    this.cols = [
      { field: "nif", header: "censo.fichaCliente.literal.identificacion", width: "10%" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre.apellidos", width: "20%" },
      { field: "fechaModificacion", header: "censo.datosDireccion.literal.fechaModificacion", width: "10%" },
      { field: "asuntos", header: "justiciaGratuita.justiciables.literal.asuntos", width: "30%" },
    ];

    this.cols.forEach(element => {
      this.buscadores.push("");
    });

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

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
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
