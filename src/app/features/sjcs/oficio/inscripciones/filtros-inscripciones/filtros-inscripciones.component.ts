import { Component, OnInit, Input, HostListener, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { KEY_CODE } from '../../../../censo/busqueda-no-colegiados/busqueda-no-colegiados.component';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { TurnosItems } from '../../../../../models/sjcs/TurnosItems';
import { InscripcionesItems } from '../../../../../models/sjcs/InscripcionesItems';
import { CommonsService } from '../../../../../../app/_services/commons.service';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
import { SigaStorageService } from '../../../../../siga-storage.service';

@Component({
  selector: 'app-filtrosinscripciones',
  templateUrl: './filtros-inscripciones.component.html',
  styleUrls: ['./filtros-inscripciones.component.scss']
})
export class FiltrosInscripciones implements OnInit, OnChanges {

  progressSpinner: boolean = false;
  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  filtroAux: InscripcionesItems = new InscripcionesItems();
  isDisabledMateria: boolean = true;
  isDisabledSubZona: boolean = true;
  disableNuevo: boolean = false;
  turnos: any[] = [];
  disabledFechaHasta: boolean = true;
  partidoJudicial: string;
  resultadosPoblaciones: any;
  disabledestado: boolean = false;
  msgs: any[] = [];
  filtros: InscripcionesItems = new InscripcionesItems();
  jurisdicciones: any[] = [];
  areas: any[] = [];
  tiposturno: any[] = [];
  zonas: any[] = [];
  subzonas: any[] = [];
  materias: any[] = [];
  partidas: any[] = [];
  partidasJudiciales: any[] = [];
  grupofacturacion: any[] = [];
  comboPJ;
  comboEstados = [
    { label: "Pendiente de Alta", value: "0" },
    { label: "Alta", value: "1" },
    { label: "Pendiente de Baja", value: "2" },
    { label: "Baja", value: "3" },
    { label: "Denegada", value: "4" }
  ];
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  usuarioLogado;
  isLetrado: boolean = false;

  textSelected: String = 'general.boton.seleccionar';
  @Input() permisos;
  permisosTarjeta: boolean = true;
  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private localStorageService: SigaStorageService) { }

  ngOnInit() {
    sessionStorage.removeItem("volver");
    sessionStorage.removeItem("modoBusqueda");

    this.isLetrado = this.localStorageService.isLetrado;

    if (this.persistenceService.getHistorico() != undefined) {
      this.filtros.historico = this.persistenceService.getHistorico();
      // this.isBuscar();
    }
    this.commonsService.checkAcceso(procesos_oficio.inscripciones)
      .then(respuesta => {
        this.permisosTarjeta = respuesta;
        this.persistenceService.setPermisos(this.permisosTarjeta);
        if (this.permisosTarjeta == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);

        }/*else if(this.persistenceService.getPermisos() != true){
        this.permisos = true;
      }*/
        this.permisos = this.permisosTarjeta;
      }
      ).catch(error => console.error(error));

    if (
      sessionStorage.getItem("filtrosInscripciones") != null && sessionStorage.getItem("volver") == "true"
    ) {
      this.filtros = JSON.parse(
        sessionStorage.getItem("filtrosInscripciones")
      );
      this.usuarioBusquedaExpress.numColegiado = sessionStorage.getItem("numColegiado");

      sessionStorage.removeItem("volver");
      sessionStorage.removeItem("numColegiado");

      if (this.filtros.fechadesde != undefined && this.filtros.fechadesde != null) {
        this.filtros.fechadesde = new Date(this.filtros.fechadesde);
      }
      if (this.filtros.fechahasta != undefined && this.filtros.fechahasta != null) {
        this.filtros.fechahasta = new Date(this.filtros.fechahasta);
        this.disabledFechaHasta = false;
      }
      if (this.filtros.afechade != undefined && this.filtros.afechade != null) {
        this.filtros.afechade = new Date(this.filtros.afechade);
      }
      if (sessionStorage.getItem("colegiadoRelleno")) {
        const { numColegiado, nombre } = JSON.parse(sessionStorage.getItem("datosColegiado"));
        this.usuarioBusquedaExpress.numColegiado = numColegiado;
        this.usuarioBusquedaExpress.nombreAp = nombre.replace(/,/g, "");

        this.isBuscar();

        sessionStorage.removeItem("colegiadoRelleno");
        sessionStorage.removeItem("datosColegiado");
      }
      this.isBuscar();
    }
    if (this.isLetrado) {
      this.getDataLoggedUser();
    }



    this.sigaServices.get("inscripciones_comboTurnos").subscribe(
      n => {
        this.turnos = n.combooItems;
        let turnoInscripcion = JSON.parse(sessionStorage.getItem("idTurno"));
        if (turnoInscripcion != null && turnoInscripcion != undefined) {
          this.turnos.forEach(turnoCombo => {
            if (turnoCombo.value == turnoInscripcion.toString()) {
              this.filtros.idturno = turnoCombo.value;
            }
          });
        }
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
      },
      err => {
        //console.log(err);
      }, () => {
        if (sessionStorage.getItem("idTurno") != undefined) {
          this.filtros.idturno = [JSON.parse(
            sessionStorage.getItem("idTurno")
          ).toString()];
          this.isBuscar();
          sessionStorage.setItem("idTurno", undefined);
        }
      }
    );

    if (sessionStorage.getItem("buscadorColegiados")) {

      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));

      this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.nombre + " " + busquedaColegiado.apellidos;

      this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.nColegiado;

      sessionStorage.removeItem("buscadorColegiados");
    }
  }

  ngOnChanges() {
    if (this.isLetrado && (this.usuarioBusquedaExpress.numColegiado == '' || this.usuarioBusquedaExpress.numColegiado == null || this.usuarioBusquedaExpress.numColegiado == undefined)) {
      this.disableNuevo = true;
    } else {
      this.disableNuevo = false;
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
    let isLetrado = this.localStorageService.isLetrado;
    this.progressSpinner = true;
    this.persistenceService.setFiltros(this.filtros);
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
              sessionStorage.setItem("origin", "newInscrip");
              this.router.navigate(["/gestionInscripciones"]);
            })
      });
    }
    else {
      sessionStorage.setItem("origin", "newInscrip");
      this.router.navigate(["/buscadorColegiados"]);
    }


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
      (this.filtros.abreviatura == null ||
        this.filtros.abreviatura == undefined) &&
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
      // quita espacios vacios antes de buscar
      if (this.filtros.abreviatura != undefined && this.filtros.abreviatura != null) {
        this.filtros.abreviatura = this.filtros.abreviatura.trim();
      }
      if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
        this.filtros.nombre = this.filtros.nombre.trim();
      }

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
      this.buscar = true;
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      sessionStorage.setItem("numColegiado", this.usuarioBusquedaExpress.numColegiado);
      this.filtroAux = this.persistenceService.getFiltrosAux();
      sessionStorage.setItem(
        "filtrosInscripciones",
        JSON.stringify(this.filtros));
      this.busqueda.emit(false);
      this.commonsService.scrollTablaFoco("tablaFoco");
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
    if (event != null) {
      this.filtros.afechade = this.transformaFecha(event);
      // Ignora el error provocado por la estructura de datos de InscripcionesItem
      // @ts-ignore
      // this.filtros.estado = ["1","2"];
      // this.disabledestado = true;
    } else {
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
        "cen.busqueda.error.busquedageneral"
      )
    });
  }

  clearFilters() {
    this.filtros = new InscripcionesItems();
    this.filtros.estado = undefined;
    this.filtros.idturno = undefined;
    this.filtros.fechadesde = undefined;
    this.filtros.fechahasta = undefined;
    this.filtros.afechade = undefined;
    this.disabledestado = false;
    this.disabledFechaHasta = true;
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
  }

}
