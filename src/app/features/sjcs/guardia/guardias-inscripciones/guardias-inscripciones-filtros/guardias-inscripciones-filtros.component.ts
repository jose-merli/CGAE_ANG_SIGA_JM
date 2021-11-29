import { Component, OnInit, Input, HostListener, Output, EventEmitter, SimpleChanges, AfterViewInit } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { InscripcionesItems } from '../../../../../models/guardia/InscripcionesItems';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../app/_services/commons.service';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { SigaStorageService } from '../../../../../siga-storage.service';

@Component({
  selector: 'app-guardias-inscripciones-filtros',
  templateUrl: './guardias-inscripciones-filtros.component.html',
  styleUrls: ['./guardias-inscripciones-filtros.component.scss']
})

export class GuardiasInscripcionesFiltrosComponent implements OnInit, AfterViewInit {

  progressSpinner: boolean = false;
  showDatosGenerales: boolean = true;
  filtroAux: InscripcionesItems = new InscripcionesItems();
  guardias: any[] = [];
  disabledFechaHasta: boolean = true;
  disabledguardia: boolean = true;
  disabledestado: boolean = false;
  resultadosTurnos: any;
  msgs: any[] = [];
  filtros: InscripcionesItems = new InscripcionesItems();
  turnos: any[] = [];
  comboEstados = [
    { label: "Pendiente de Alta", value: 0 },
    { label: "Alta", value: 1 },
    { label: "Pendiente de Baja", value: 2 },
    { label: "Baja", value: 3 },
    { label: "Denegada", value: 4 }
  ];
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  usuarioLogado;
  isLetrado: boolean = false;

  textSelected: String = 'general.boton.seleccionar';
  @Input() permisoEscritura;
  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() filtrosValues = new EventEmitter<InscripcionesItems>();
  permisos: any;

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private sigaStorageService : SigaStorageService) { }
  
  ngAfterViewInit(): void {
    if(sessionStorage.getItem("filtroFromFichaGuardia")){
      let filtrosFromGuardia = {
        idTurno: '',
        idGuardia: ''
      }
      filtrosFromGuardia = JSON.parse(sessionStorage.getItem("filtroFromFichaGuardia"));
      this.filtros.idturno = [filtrosFromGuardia.idTurno];
      this.onChangeTurno();
      this.filtros.idguardia = [filtrosFromGuardia.idGuardia];
      this.filtrosValues.emit(this.filtros);
      sessionStorage.removeItem("filtroFromFichaGuardia");
    }
  }

  ngOnInit() {

    this.getComboTurno();

    this.isLetrado = this.sigaStorageService.isLetrado && this.sigaStorageService.idPersona;

    if (this.persistenceService.getHistorico() != undefined) {
      this.filtros.historico = this.persistenceService.getHistorico();
      // this.isBuscar();
    }
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisos = this.persistenceService.getPermisos();
    }
    console.log('this.permisos: ', this.permisos)
    if (this.persistenceService.getFiltros() != undefined && sessionStorage.getItem("FichaInscripciones")!= undefined) {
      this.filtros = this.persistenceService.getFiltros();
      if(this.filtros.afechade!=null && this.filtros.afechade != undefined){
        this.filtros.afechade = this.transformaFecha(this.filtros.afechade);
      }
      if(this.filtros.fechadesde!=null && this.filtros.fechadesde != undefined){
        this.filtros.fechadesde = this.transformaFecha(this.filtros.fechadesde);
      }
      if(this.filtros.fechahasta!=null && this.filtros.fechahasta != undefined){
        this.filtros.fechahasta = this.transformaFecha(this.filtros.fechahasta);
      }
      this.persistenceService.clearFiltros();
      sessionStorage.removeItem("FichaInscripciones");
      this.isBuscar();
    }else{
      sessionStorage.removeItem("FichaInscripciones");
      this.persistenceService.clearFiltros();
    }

    if (this.isLetrado) {
      this.getDataLoggedUser();
    }

    if (sessionStorage.getItem("colegiadoRelleno")) {
      const { numColegiado, nombre } = JSON.parse(sessionStorage.getItem("datosColegiado"));
      this.usuarioBusquedaExpress.numColegiado = numColegiado;
      this.usuarioBusquedaExpress.nombreAp = nombre.replace(/,/g, "");
      this.filtros.ncolegiado = this.usuarioBusquedaExpress.numColegiado;
      //this.isBuscar();

      sessionStorage.removeItem("colegiadoRelleno");
      sessionStorage.removeItem("datosColegiado");
    }

    //this.clearFilters();

    if (sessionStorage.getItem("buscadorColegiados")) {

      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));

      this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.nombre + " " + busquedaColegiado.apellidos;

      this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.nColegiado;

      this.filtros.ncolegiado = this.usuarioBusquedaExpress.numColegiado;

      sessionStorage.removeItem("buscadorColegiados");
    }
  }

  getDataLoggedUser() {
    this.progressSpinner = true;

    this.sigaServices.get("usuario_logeado").subscribe(n => {

      const usuario = n.usuarioLogeadoItem;
      const colegiadoItem = new ColegiadoItem();
      colegiadoItem.nif = usuario[0].dni;

      this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
        usr => {
          const { numColegiado, nombre } = JSON.parse(usr.body).colegiadoItem[0];
          this.usuarioBusquedaExpress.numColegiado = numColegiado;
          this.usuarioBusquedaExpress.nombreAp = nombre.replace(/,/g, "");

          this.usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
          this.progressSpinner = false;
        }, err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          setTimeout(() => {
            this.isBuscar();
          }, 5);
        });
    });
  }


  newInscripcion() {
    this.persistenceService.setFiltros(this.filtros);
    let isLetrado: boolean = false;
    if (
      sessionStorage.getItem("isLetrado") != null &&
      sessionStorage.getItem("isLetrado") != undefined
    ) {
      isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
    this.progressSpinner = true;
    if (isLetrado) {
      let colegiadoConectado = new ColegiadoItem();
      this.sigaServices.get("usuario_logeado").subscribe(n => {
        colegiadoConectado.nif = n.usuarioLogeadoItem[0].dni;
        this.sigaServices
          .post("busquedaColegiados_searchColegiado", colegiadoConectado)
          .subscribe(
            data => {
              colegiadoConectado = JSON.parse(data.body).colegiadoItem[0];
              this.persistenceService.setDatos(colegiadoConectado);
              sessionStorage.setItem("sesion", "nuevaInscripcion");
              this.router.navigate(["/fichaInscripcionesGuardia"]);
            })
      });
    }
    else {
      sessionStorage.setItem("sesion", "nuevaInscripcion");
      this.router.navigate(["/buscadorColegiados"]);
    }
    this.progressSpinner = false;
  }

  onChangeTurno() {

    this.filtros.idguardia = "";
    this.guardias = [];
    if (this.filtros.idturno != "") {
      //this.disabledguardia = true;
      this.getComboGuardia();
    } else {
      this.disabledguardia = true;
    }
  }

  getComboTurno() {
    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.turnos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.turnos);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboGuardia() {
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + this.filtros.idturno).subscribe(
        data => {
          this.disabledguardia = false;
          this.guardias = data.combooItems;
          this.commonsService.arregloTildesCombo(this.guardias);

        },
        err => {
          console.log(err);
        }
      );
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  checkFilters() {
    if ((this.filtros.estado == null ||
      this.filtros.estado == undefined ||
      this.filtros.estado.length == 0) &&
      (this.filtros.idturno == null ||
        this.filtros.idturno == undefined ||
        this.filtros.idturno.length == 0) &&
      (this.filtros.fechadesde == null ||
        this.filtros.fechadesde == undefined) &&
      (this.filtros.afechade == null ||
        this.filtros.afechade == undefined) &&
      ((<HTMLInputElement>document.querySelector("input[formControlName='nombreAp']")) != null) &&
      ((<HTMLInputElement>document.querySelector("input[formControlName='nombreAp']")).value == null ||
        (<HTMLInputElement>document.querySelector("input[formControlName='nombreAp']")).value == undefined ||
        (<HTMLInputElement>document.querySelector("input[formControlName='nombreAp']")).value == "") &&
      ((<HTMLInputElement>document.querySelector("input[formControlName='numColegiado']")).value == null ||
        (<HTMLInputElement>document.querySelector("input[formControlName='numColegiado']")).value == undefined ||
        (<HTMLInputElement>document.querySelector("input[formControlName='numColegiado']")).value == "")) {
      this.showSearchIncorrect();
      return false;
    }
    else {
      return true;
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

  isBuscar() {
    if (this.checkFilters()) {
      /* this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux(); */
      this.filtrosValues.emit(this.filtros);

    }
  }

  transformaFecha(fecha) {
    if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(fecha);
      }
    } else {
      fecha = undefined;
    }

    return fecha;
  }

  fillFechaDesdeCalendar(event) {
    if (event != null) {
      this.filtros.fechadesde = this.transformaFecha(event);
      this.disabledFechaHasta = false;
    } else {
      this.filtros.fechadesde = undefined;
      this.filtros.fechahasta = undefined;
      this.disabledFechaHasta = true;
    }

  }

  fillAfechaDeCalendar(event) {
    if (event != null && event != "" && event != undefined) {
      this.filtros.afechade = this.transformaFecha(event);
      // Ignora el error provocado por la estructura de datos de InscripcionesItem
      //@ts-ignore
       this.filtros.estado = ["1","2"];
       this.disabledestado = true;
    } else {
      this.filtros.estado = null;
      this.filtros.afechade = undefined;
      this.disabledestado = false;
    }
  }

  fillFechaHastaCalendar(event) {
    this.filtros.fechahasta = this.transformaFecha(event);
  }

  showSearchIncorrect() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "oficio.busqueda.error.busquedageneral"
      )
    });
  }

  clearFilters() {
    this.filtros = new InscripcionesItems();
    this.disabledestado = false;
    this.disabledFechaHasta = true;
    this.disabledguardia = true;
    if (sessionStorage.getItem("isLetrado") == "false") {
      this.usuarioBusquedaExpress = {
        numColegiado: "",
        nombreAp: ""
      };
    }

  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }

  clear() {
    this.msgs = [];
  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    this.filtros.ncolegiado = event.nColegiado;
  }

}