import { Component, EventEmitter, Input, OnInit, Output, HostListener } from '@angular/core';
import { ConfirmationService, Message } from "primeng/components/common/api";
import { TranslateService } from '../../../../../commons/translate';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { JustificacionExpressItem } from '../../../../../models/sjcs/JustificacionExpressItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { Location } from '@angular/common';
import { ActivationEnd, Router } from '@angular/router';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { FileAlreadyExistException } from '@angular-devkit/core';
import { ParametroRequestDto } from '../../../../../models/ParametroRequestDto';
import { ParametroDto } from '../../../../../models/ParametroDto';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-filtro-designaciones',
  templateUrl: './filtro-designaciones.component.html',
  styleUrls: ['./filtro-designaciones.component.scss']
})
export class FiltroDesignacionesComponent implements OnInit {

  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  isButtonVisible = true;
  filtroJustificacion: JustificacionExpressItem = new JustificacionExpressItem();
  datos;
  closeDialog: boolean = false;
  expanded: boolean = false;
  textSelected: String = "{0} etiquetas seleccionadas";
  progressSpinner: boolean = true;
  showDesignas: boolean = false;
  showJustificacionExpress: boolean = false;
  checkMostrarPendientes: boolean = true;
  checkRestricciones: boolean = false;

  disabledBusquedaExpress: boolean = false;
  showColegiado: boolean = false;

  esColegiado: boolean = false;
  @Output() isColegJE = new EventEmitter<boolean>();
  @Output() isColegDesig = new EventEmitter<boolean>();
  radioTarjeta: string = 'designas';

  permisoDesigna: boolean = false;
  permisoJE: boolean = false;

  //Variables busqueda designas
  msgs: Message[] = [];
  body: DesignaItem = new DesignaItem();
  fechaAperturaHastaSelect: Date;
  fechaAperturaDesdeSelect: Date;
  fechaJustificacionDesdeSelect: Date;
  fechaJustificacionHastaSelect: Date;
  textFilter: String = "Seleccionar";
  comboEstados: any[];
  comboActuacionesValidadas: any[];
  comboSinEJG: any[];
  comboResoluciones: any[];
  comboEJGSinResolucion: any[];
  comboEJGnoFavorable: any[];
  disabledFechaAHasta: boolean = true;
  disabledfechaJustificacion: boolean = true;
  disableRestricciones: boolean = true;
  ocultarRestricciones: boolean = false;
  comboTipoDesigna: any[];
  comboTurno: any[];
  actuacionesV: any[];
  comboArt: any[];
  actuacionesDocu: any[];
  comboJuzgados: any[];
  comboModulos: any[];
  comboCalidad: any[];
  comboProcedimientos: any[];
  comboOrigenActuaciones: any[];
  comboRoles: any[];
  comboAcreditaciones: any[];
  permisoEscritura: boolean;
  institucionActual: any;
  @Output() busquedaJustificacionExpres = new EventEmitter<boolean>();
  @Output() showTablaDesigna = new EventEmitter<boolean>();
  @Output() showTablaJustificacionExpres = new EventEmitter<boolean>();
  @Output() busqueda = new EventEmitter<boolean>();
  @Output() permisosFichaAct = new EventEmitter<boolean>();
  @Output() checkRestriccionesasLetrado = new EventEmitter<boolean>();
  isLetrado: boolean = false;
  sinEjg;
  ejgSinResolucion;
  ejgPtecajg;
  ejgNoFavorable;
  valorParametro: AnalyserNode;
  datosBuscar: any[];
  searchParametros: ParametroDto = new ParametroDto();
  @Input() usuarioBusquedaExpressFromFicha = {
    numColegiado: '',
    nombreAp: ''
  };

  constructor(private translateService: TranslateService, private sigaServices: SigaServices, private location: Location, private router: Router,
    private localStorageService: SigaStorageService, private commonsService: CommonsService, private confirmationService: ConfirmationService,   
    private persistenceService: PersistenceService) { }

  ngOnInit(): void {
    //Si venimos de busqueda de colegiado desde justificacion expres
    // if(sessionStorage.getItem("pantalla") != null && sessionStorage.getItem("pantalla") == "ejgexpress"){ //Para usar esto quitar el remove de buscador-colegiados.component.ts
    if(sessionStorage.getItem("vieneDeJE") != null){
      this.showJustificacionExpress = true;
      this.showDesignas = false;
      // sessionStorage.setItem("vieneDeJE", "true");
    }
    if(sessionStorage.getItem("vuelveJE") != null){
      this.showDesignas = false;
      this.showJustificacionExpress = true;
    }
    
    sessionStorage.removeItem("modoBusqueda");
    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify([]));
    // let esColegiado = JSON.parse(sessionStorage.getItem("esColegiado"));
    // if(!esColegiado){   
    this.checkAccesoDesigna();
    this.checkAccesoFichaActuacion();
    this.getParamsEJG(false);
    
    //console.log('this.usuarioBusquedaExpressFromFicha*********', this.usuarioBusquedaExpressFromFicha)
    if (sessionStorage.getItem("buscadorColegiados")) {
      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));
      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
      this.showColegiado = true;
      this.buscar();
    } else if (this.usuarioBusquedaExpressFromFicha != undefined) {
      this.usuarioBusquedaExpress.nombreAp = this.usuarioBusquedaExpressFromFicha.nombreAp;
      this.usuarioBusquedaExpress.numColegiado = this.usuarioBusquedaExpressFromFicha.numColegiado;

    }

    

  }

  getParamsEJG(restricted: boolean) {
    //PARAMETRO JUSTIFICACION_INCLUIR_SIN_EJG
    this.getConfComboRestriccionJustificacion(restricted, "JUSTIFICACION_INCLUIR_SIN_EJG");

    //PARAMETRO JUSTIFICACION_INCLUIR_EJG_SIN_RESOLUCION
    this.getConfComboRestriccionJustificacion(restricted, "JUSTIFICACION_INCLUIR_EJG_SIN_RESOLUCION");

    //PARAMETRO JUSTIFICACION_INCLUIR_EJG_PTECAJG
    this.getConfComboRestriccionJustificacion(restricted, "JUSTIFICACION_INCLUIR_EJG_PTECAJG");

    //PARAMETRO JUSTIFICACION_INCLUIR_EJG_NOFAVORABLE
    this.getConfComboRestriccionJustificacion(restricted, "JUSTIFICACION_INCLUIR_EJG_NOFAVORABLE");
  }

  getConfComboRestriccionJustificacion(restricted : boolean, parametroBusqueda : string){
    let parametro = {
      valor: parametroBusqueda
    };
    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          this.valorParametro = JSON.parse(data.body).parametro;
          switch (parametroBusqueda) {
            
            case "JUSTIFICACION_INCLUIR_SIN_EJG": {
              this.sinEjg = this.valorParametro;
              if (restricted) {
                this.filtroJustificacion.sinEJG = this.valorParametro.toString();
              }        
              break;
            }

            case "JUSTIFICACION_INCLUIR_EJG_SIN_RESOLUCION": {
              this.ejgSinResolucion = this.valorParametro;
              if (restricted) {
                this.filtroJustificacion.ejgSinResolucion = this.valorParametro.toString(); 
              }
              break;
            }

            case "JUSTIFICACION_INCLUIR_EJG_PTECAJG": {
              this.ejgPtecajg = this.valorParametro;
              if (restricted) {
                this.filtroJustificacion.resolucionPTECAJG = this.valorParametro.toString();
              }
              break;
            }

            case "JUSTIFICACION_INCLUIR_EJG_NOFAVORABLE": {
              this.ejgNoFavorable = this.valorParametro;
              if (restricted) {
                this.filtroJustificacion.conEJGNoFavorables = this.valorParametro.toString();
              }
              break;
            }
          }

      });
  }

  cargaInicial() {
    this.isLetrado = this.localStorageService.isLetrado;
    if(this.isLetrado == undefined){
        this.commonsService.getLetrado()
        .then(respuesta => {
          this.isLetrado = respuesta;
          if (this.isLetrado) {
            this.getDataLoggedUser();
            this.disableRestricciones = true;
            this.ocultarRestricciones = true;
            this.disabledBusquedaExpress = true;
          } else {
            this.disableRestricciones = false;
          }
        });
    }

    if (!this.esColegiado) {
      this.isButtonVisible = true;
    } else {
      this.isButtonVisible = true;// DEBE SER FALSE
    }

    if (this.localStorageService.institucionActual == "2003") {
      this.isButtonVisible = false;
    }
    
    this.filtroJustificacion = new JustificacionExpressItem();
    this.showDesignas = true;
    this.showJustificacionExpress = false;
    this.esColegiado = false;
    this.progressSpinner = true;
    this.checkRestricciones = false;

    //justificacion expres
    this.cargaCombosJustificacion();

    //Inicializamos buscador designas
    this.getBuscadorDesignas();

    if (this.isLetrado) {
      this.getDataLoggedUser();
    }

    if (this.esColegiado) {
      this.disabledBusquedaExpress = true;
      this.getDataLoggedUser();
      this.disableRestricciones = true;
    } else {
      if (this.isLetrado) {
        this.disableRestricciones = true;
        this.ocultarRestricciones = true;
        this.disabledBusquedaExpress = true;
      } else {
        this.disableRestricciones = false;
      }

      this.disabledBusquedaExpress = false;
      this.filtroJustificacion.ejgSinResolucion = "2";
      this.filtroJustificacion.sinEJG = "2";
      this.filtroJustificacion.resolucionPTECAJG = "2";
      this.filtroJustificacion.conEJGNoFavorables = "2";
    }

    //viene de buscador express
    if (sessionStorage.getItem('buscadorColegiados')) {
      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      sessionStorage.removeItem("buscadorColegiados");

      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
      this.showColegiado = true;
    }

    //combo comun
    this.getComboEstados();
    this.progressSpinner = false;
  }

  cargaInicialJE() {
    this.isLetrado = this.localStorageService.isLetrado;
    if(this.isLetrado == undefined){
        this.commonsService.getLetrado()
        .then(respuesta => {
          this.isLetrado = respuesta;
        });
      setTimeout(() => {
        //esperando isLetrado
        console.log("Se ha refrescado la pantalla");
      }, 500);
    }

    if (!this.esColegiado) {
      this.isButtonVisible = false;
    } else {
      this.isButtonVisible = false;// DEBE SER FALSE
    }
    if (this.localStorageService.institucionActual == "2003") {
      this.isButtonVisible = false;
    }

    if (sessionStorage.getItem("filtroJustificacionExpres") && sessionStorage.getItem("volver")) {
      this.filtroJustificacion = JSON.parse(sessionStorage.getItem("filtroJustificacionExpres"));
      this.cargarFiltrosJustificacionExpres();
    } else {
      this.filtroJustificacion = new JustificacionExpressItem();
    }

    this.showDesignas = false;
    this.showJustificacionExpress = true;
    this.esColegiado = false;
    this.progressSpinner = true;
    this.checkRestricciones = false;

    //justificacion expres
    this.cargaCombosJustificacion();

    if (this.isLetrado) {
      this.getDataLoggedUser();
    }

    if (this.esColegiado) {
      this.disabledBusquedaExpress = true;
      this.getDataLoggedUser();
      this.disableRestricciones = true;
    } else /*if(!sessionStorage.getItem("volver"))*/ {
      this.disableRestricciones = false;
      this.disabledBusquedaExpress = false;
      this.filtroJustificacion.ejgSinResolucion = "2";
      this.filtroJustificacion.sinEJG = "2";
      this.filtroJustificacion.resolucionPTECAJG = "2";
      this.filtroJustificacion.conEJGNoFavorables = "2";
    }

    //viene de buscador express
    if (sessionStorage.getItem('buscadorColegiados')) {
      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      // sessionStorage.removeItem("buscadorColegiados");

      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
      this.showColegiado = true;
    }

    if (sessionStorage.getItem("filtroJustificacionExpres")) {
      this.filtroJustificacion = JSON.parse(sessionStorage.getItem("filtroJustificacionExpres"));
      this.cargarFiltrosJustificacionExpres();
    }

    sessionStorage.removeItem("filtroJustificacionExpres");
    sessionStorage.removeItem("volver");

    //combo comun
    this.getComboEstados();
    this.progressSpinner = false;
  }

  guardarFiltrosJustificacion() {
    if (this.usuarioBusquedaExpress.numColegiado != undefined && this.usuarioBusquedaExpress.numColegiado != null
      && this.usuarioBusquedaExpress.numColegiado.trim().length != 0) {
      this.filtroJustificacion.nColegiado = this.usuarioBusquedaExpress.numColegiado;
      this.filtroJustificacion.nombreAp = this.usuarioBusquedaExpress.nombreAp;
    }

    this.filtroJustificacion.muestraPendiente = this.checkMostrarPendientes;
    this.filtroJustificacion.restriccionesVisualizacion = this.checkRestricciones;
    
    //Recuperamos los filtros de antes de la busqueda de colegiado
    if(sessionStorage.getItem("filtroJustificacionExpres") != null){
      let filtroJustExpAux = JSON.parse(sessionStorage.getItem("filtroJustificacionExpres"));

      if(this.filtroJustificacion.ejgSinResolucion == null){
        this.filtroJustificacion.ejgSinResolucion = filtroJustExpAux.ejgSinResolucion;
      }

      if(this.filtroJustificacion.sinEJG == null){
        this.filtroJustificacion.sinEJG = filtroJustExpAux.sinEJG;
      }

      if(this.filtroJustificacion.resolucionPTECAJG == null){
        this.filtroJustificacion.resolucionPTECAJG = filtroJustExpAux.resolucionPTECAJG;
      }

      if(this.filtroJustificacion.conEJGNoFavorables == null){
        this.filtroJustificacion.conEJGNoFavorables = filtroJustExpAux.conEJGNoFavorables;
      }

      if(this.filtroJustificacion.anioDesignacion == null){
        this.filtroJustificacion.anioDesignacion = filtroJustExpAux.anioDesignacion;
      }
    }

    sessionStorage.removeItem("filtroDesignas");
    sessionStorage.setItem("filtroJustificacionExpres", JSON.stringify(this.filtroJustificacion));
  }

  cargarFiltrosJustificacionExpres() {

    if (this.filtroJustificacion.justificacionDesde != undefined && this.filtroJustificacion.justificacionDesde != null) {
      this.filtroJustificacion.justificacionDesde = new Date(this.filtroJustificacion.justificacionDesde);
    }

    if (this.filtroJustificacion.justificacionHasta != undefined && this.filtroJustificacion.justificacionHasta != null) {
      this.filtroJustificacion.justificacionHasta = new Date(this.filtroJustificacion.justificacionHasta);
    }

    if (this.filtroJustificacion.designacionDesde != undefined && this.filtroJustificacion.designacionDesde != null) {
      this.filtroJustificacion.designacionDesde = new Date(this.filtroJustificacion.designacionDesde);
    }

    if (this.filtroJustificacion.designacionHasta != undefined && this.filtroJustificacion.designacionHasta != null) {
      this.filtroJustificacion.designacionHasta = new Date(this.filtroJustificacion.designacionHasta);
    }

    if (this.filtroJustificacion.nColegiado != undefined && this.filtroJustificacion.nColegiado != null) {
      this.usuarioBusquedaExpress.numColegiado = this.filtroJustificacion.nColegiado.toString();
    }

    if (this.filtroJustificacion.nombreAp != undefined && this.filtroJustificacion.nombreAp != null) {
      this.usuarioBusquedaExpress.nombreAp = this.filtroJustificacion.nombreAp.toString();
    }

    if (this.filtroJustificacion.muestraPendiente != undefined && this.filtroJustificacion.muestraPendiente != null){
      this.checkMostrarPendientes = this.filtroJustificacion.muestraPendiente;
    }

    if (this.filtroJustificacion.restriccionesVisualizacion != undefined && this.filtroJustificacion.restriccionesVisualizacion != null){
      this.checkRestricciones = this.filtroJustificacion.restriccionesVisualizacion;
    }

  }

  checkAccesoFichaActuacion() {
    this.commonsService.checkAcceso(procesos_oficio.designasActuaciones)
      .then(respuesta => {
        if (respuesta == undefined || respuesta == false) {
          this.permisoEscritura = false;
        }else{
          this.permisoEscritura = respuesta;
        }
        this.permisosFichaAct.emit(this.permisoEscritura);
      }
      ).catch(error => console.error(error));

  }
  checkAccesoDesigna() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = procesos_oficio.designa;

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      async data => {
        const permisos = JSON.parse(data.body);
        const permisosArray = permisos.permisoItems;
        const derechoAcceso = permisosArray[0].derechoacceso;

        this.esColegiado = true;

        this.checkAccesoJEinicial();
        
        if (derechoAcceso == 3) { //es colegio y escritura
          this.permisoDesigna = true;
          this.esColegiado = false;
          this.isColegDesig.emit(false);

          if (sessionStorage.getItem("vieneDeJE") != null || sessionStorage.getItem("vuelveJE") != null) {
            this.cargaInicialJE();

            await this.changeFilters('justificacion');
            this.radioTarjeta = 'justificacion';
            this.buscar();

            sessionStorage.removeItem("vieneDeJE");
            sessionStorage.removeItem("vuelveJE");
          } else {
            this.cargaInicial();
          }

          if (
            sessionStorage.getItem("filtroDesignas") != null
          ) {
            if (sessionStorage.getItem("volver") != null && sessionStorage.getItem("volver") != undefined) {
              this.cargarFiltros();
              this.buscar();
              sessionStorage.removeItem("volver");
            } //else {
              //this.body = new DesignaItem();
            //}
          } else if (
            sessionStorage.getItem("filtroJustificacionExpres") != null
          ) {
            if (sessionStorage.getItem("volver") != null && sessionStorage.getItem("volver") != undefined && sessionStorage.getItem("cargaDesignas")==null) {
              await this.changeFilters('justificacion');
              this.radioTarjeta = 'justificacion';
              this.buscar();
              
            }else if(sessionStorage.getItem("cargaJE")==null){
              this.buscar();
            }
          }
        } else if (derechoAcceso == 2) {//es colegiado y solo lectura
          this.permisoDesigna = true;
          this.esColegiado = true;
          this.isColegDesig.emit(true);

          if (sessionStorage.getItem("vieneDeJE") != null) {
            this.cargaInicialJE();

            await this.changeFilters('justificacion');
            this.radioTarjeta = 'justificacion';
            this.buscar();

            sessionStorage.removeItem("vieneDeJE");
          } else {
            this.cargaInicial();
          }

          if (
            sessionStorage.getItem("filtroDesignas") != null
          ) {
            if (sessionStorage.getItem("volver") != null && sessionStorage.getItem("volver") != undefined) {
              this.cargarFiltros();
              this.buscar();
              sessionStorage.removeItem("volver");
            } //else {
              //this.body = new DesignaItem();
            //}
          } else if (
            sessionStorage.getItem("filtroJustificacionExpres") != null
          ) {
            if (sessionStorage.getItem("volver") != null && sessionStorage.getItem("volver") != undefined) {
              await this.changeFilters('justificacion');
              this.radioTarjeta = 'justificacion';
              this.buscar();
              
            }
          }
        } else {
          this.checkAccesoJE();
        }
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  checkAccesoJE() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = procesos_oficio.je;

    return this.sigaServices.post("acces_control", controlAcceso).toPromise().then(
      data => {
        const permisos = JSON.parse(data.body);
        const permisosArray = permisos.permisoItems;
        const derechoAcceso = permisosArray[0].derechoacceso;

        this.esColegiado = true;
        if (derechoAcceso == 3) { //es colegio y escritura
          this.permisoJE = true;
          this.radioTarjeta = 'justificacion';
          this.esColegiado = false;
          this.isColegJE.emit(false);
        } else if (derechoAcceso == 2) {//es colegiado y solo lectura
          this.permisoJE = true;
          this.radioTarjeta = 'justificacion';
          this.esColegiado = true;
          this.isColegJE.emit(true);
        } else {
          this.permisoJE = false;

          if (this.permisoDesigna == false && this.permisoJE == false) {
            sessionStorage.setItem("codError", "403");
            sessionStorage.setItem(
              "descError",
              this.translateService.instant("generico.error.permiso.denegado")
            );
            this.router.navigate(["/errorAcceso"]);
          }
        }
        this.cargaInicialJE();
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  checkAccesoJEinicial() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = procesos_oficio.je;

    return this.sigaServices.post("acces_control", controlAcceso).toPromise().then(
      data => {
        const permisos = JSON.parse(data.body);
        const permisosArray = permisos.permisoItems;
        const derechoAcceso = permisosArray[0].derechoacceso;

        if (derechoAcceso == 3) { //es colegio y escritura
          this.permisoJE = true;
        } else if (derechoAcceso == 2) {//es colegiado y solo lectura
          this.permisoJE = true;
        } else {
          this.permisoJE = false;
        }
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  async changeFilters(event) {

    if (event == 'designas' && this.permisoDesigna == true) {
      if (event == 'designas' && this.permisoDesigna == true) {
        if(sessionStorage.getItem("cargaJE")!=null){
          sessionStorage.removeItem("cargaJE");
        }
        if(sessionStorage.getItem("cargaDesignas")==null){
          sessionStorage.setItem("cargaDesignas","true");
        }
      }
      this.radioTarjeta = 'justificacion';
      
      let keyConfirmation = "confirmacionGuardarJustificacionExpress";
      if (sessionStorage.getItem('rowIdsToUpdate') != null && sessionStorage.getItem('rowIdsToUpdate') != 'null' && sessionStorage.getItem('rowIdsToUpdate') != '[]') {
        this.confirmationService.confirm({
          key: keyConfirmation,
          message: this.translateService.instant('justiciaGratuita.oficio.justificacion.reestablecer'),
          icon: "fa fa-trash-alt",
          accept: () => {
            this.checkAccesoDesigna();
            this.radioTarjeta = 'designas';
            this.showDesignas = true;
            this.showJustificacionExpress = false;
            this.isButtonVisible = true;
            this.showTablaJustificacionExpres.emit(false);
          },
          reject: () => {
          }
        });
      } else {
        if (!sessionStorage.getItem("volver")) {
          if (this.filtroJustificacion.numDesignacion && this.filtroJustificacion.numDesignacion.trim().length != 0)
            this.body.codigo = this.filtroJustificacion.numDesignacion;
          if (this.filtroJustificacion.anioDesignacion)
            this.body.ano = parseInt(this.filtroJustificacion.anioDesignacion.toString());
          if (this.filtroJustificacion.nombre && this.filtroJustificacion.nombre.trim().length != 0)
            this.body.nombreInteresado = this.filtroJustificacion.nombre;
          if (this.filtroJustificacion.apellidos && this.filtroJustificacion.apellidos.trim().length != 0)
            this.body.apellidosInteresado = this.filtroJustificacion.apellidos;
          if (this.filtroJustificacion.actuacionesValidadas && this.filtroJustificacion.actuacionesValidadas.trim().length != 0)
            this.body.idActuacionesV = this.filtroJustificacion.actuacionesValidadas;
          if (this.filtroJustificacion.estado && this.filtroJustificacion.estado.trim().length != 0)
            this.body.estados = [this.filtroJustificacion.estado];

          if (this.filtroJustificacion.designacionDesde != undefined)
            this.fechaAperturaDesdeSelect = new Date(this.filtroJustificacion.designacionDesde);
          if (this.filtroJustificacion.designacionHasta != undefined)
            this.fechaAperturaHastaSelect = new Date(this.filtroJustificacion.designacionHasta);
          if (this.filtroJustificacion.justificacionDesde != undefined)
            this.fechaJustificacionDesdeSelect = new Date(this.filtroJustificacion.justificacionDesde);
          if (this.filtroJustificacion.justificacionHasta != undefined)
            this.fechaJustificacionHastaSelect = new Date(this.filtroJustificacion.justificacionHasta);
        }

        this.checkAccesoDesigna();
        this.radioTarjeta = 'designas';
        this.showDesignas = true;
        this.showJustificacionExpress = false;
        this.isButtonVisible = true;
        this.showTablaJustificacionExpres.emit(false);
      }
    }

    if (event == 'justificacion' && this.permisoJE == true) {

      if(sessionStorage.getItem("cargaDesignas")!=null){
        sessionStorage.removeItem("cargaDesignas");
      }
      if(sessionStorage.getItem("cargaJE")==null){
        sessionStorage.setItem("cargaJE","true");
      }
      if (!sessionStorage.getItem("volver")) {
        if (this.body.codigo && this.body.codigo.trim().length != 0)
          this.filtroJustificacion.numDesignacion = this.body.codigo;
        if (this.body.ano && this.body.ano.toString().trim().length != 0)
          this.filtroJustificacion.anioDesignacion = new String(this.body.ano).toString();
        if (this.body.nombreInteresado && this.body.nombreInteresado.trim().length != 0)
          this.filtroJustificacion.nombre = this.body.nombreInteresado;
        if (this.body.apellidosInteresado && this.body.apellidosInteresado.trim().length != 0)
          this.filtroJustificacion.apellidos = this.body.apellidosInteresado;
        if (this.body.idActuacionesV && this.body.idActuacionesV.trim().length != 0)
          this.filtroJustificacion.actuacionesValidadas = this.body.idActuacionesV;
        if (this.body.estados && this.body.estados.length != 0)
          this.filtroJustificacion.estado = this.body.estados[0];

        if (this.fechaAperturaDesdeSelect != undefined)
          this.filtroJustificacion.designacionDesde = this.fechaAperturaDesdeSelect;
        if (this.fechaAperturaHastaSelect != undefined)
          this.filtroJustificacion.designacionHasta = this.fechaAperturaHastaSelect;

        if (!this.checkMostrarPendientes) {
          if (this.fechaJustificacionDesdeSelect != undefined)
            this.filtroJustificacion.justificacionDesde = this.fechaJustificacionDesdeSelect;
          if (this.fechaJustificacionHastaSelect != undefined)
            this.filtroJustificacion.justificacionHasta = this.fechaJustificacionHastaSelect;
        }

        sessionStorage.setItem("filtroJustificacionExpres", JSON.stringify(this.filtroJustificacion));
        sessionStorage.setItem("volver", "true");
      }

      await this.checkAccesoJE();
      sessionStorage.setItem("rowIdsToUpdate", JSON.stringify([]));
      this.showDesignas = false;
      this.showJustificacionExpress = true;
      this.expanded = false;
      this.isButtonVisible = false;
      this.showTablaDesigna.emit(false);
     
    }
  }

  fillFechasJustificacion(event, campo) {
    if (campo == 'justificacionDesde') {
      this.filtroJustificacion.justificacionDesde = event;
    }

    if (campo == 'justificacionHasta') {
      this.filtroJustificacion.justificacionHasta = event;
    }

    if (campo == 'designacionHasta') {
      this.filtroJustificacion.designacionHasta = event;
    }

    if (campo == 'designacionDesde') {
      this.filtroJustificacion.designacionDesde = event;
    }
  }

  getBuscadorDesignas() {
    if (this.body.ano == undefined) {
      var today = new Date();
      var year = today.getFullYear().valueOf();
      this.body.ano = year;
    }
    
    this.getComboEstados();
    this.getComboTipoDesignas();
    this.getComboTurno();
    this.getActuacionesV();
    this.getDocuActuaciones();
    this.getComboArticulo();
    this.getComboJuzgados();
    this.getComboModulos();
    this.getComboCalidad();
    this.getComboProcedimientos();
    this.getOrigenActuaciones();
    this.getComboRoles();
    this.getComboAcreditaciones();
  }

  fillFechaAperturaDesde(event) {
    // this.fechaAperturaDesdeSelect = event;
    // if((this.fechaAperturaHastaSelect != null && this.fechaAperturaHastaSelect != undefined) && (this.fechaAperturaDesdeSelect > this.fechaAperturaHastaSelect)){
    //   this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.sjcs.designas.mensaje.Fechas')}];
    // }
  }

  fillFechaAperturaHasta(event) {
    // this.fechaAperturaHastaSelect = event;
    // if(this.fechaAperturaDesdeSelect > this.fechaAperturaHastaSelect ){
    //   this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.sjcs.designas.mensaje.Fechas')}];
    // }
  }

  fillFechaADesdeCalendar(event) {
    if (event != null) {
      this.fechaAperturaDesdeSelect = this.transformaFecha(event);
      this.disabledFechaAHasta = false;
    } else {
      this.fechaAperturaDesdeSelect = undefined;
      this.disabledFechaAHasta = true;
    }

  }

  fillFechaAHastaCalendar(event) {
    if (event != null) {
      this.fechaAperturaHastaSelect = this.transformaFecha(event);
    } else {
      this.fechaAperturaHastaSelect = undefined;
    }

  }

  fillFechaJustificacionDesdeCalendar(event) {
    if (event != null) {
      this.fechaJustificacionDesdeSelect = this.transformaFecha(event);
      this.disabledfechaJustificacion = false;
    } else {
      this.fechaJustificacionDesdeSelect = undefined;
      this.disabledfechaJustificacion = true;
    }

  }

  fillFechaJustificacionHastaCalendar(event) {
    if (event != null) {
      this.fechaJustificacionHastaSelect = this.transformaFecha(event);
    } else {
      this.fechaJustificacionHastaSelect = undefined;
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

  getComboEstados() {
    this.comboEstados = [
      { label: 'Activo', value: 'V' },
      { label: 'Finalizada', value: 'F' },
      { label: 'Anulada', value: 'A' }
    ]
  }

  getComboTurno() {
    this.progressSpinner = true;

    this.sigaServices.get("combo_turnos_designas").subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;

      }, () => {
        this.arregloTildesCombo(this.comboTurno);
      }
    );
  }

  getComboTipoDesignas() {
    this.progressSpinner = true;

    this.sigaServices.get("designas_tipoDesignas").subscribe(
      n => {
        this.comboTipoDesigna = n.combooItems;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.arregloTildesCombo(this.comboTipoDesigna);
      }
    );
  }

  getActuacionesV() {
    this.actuacionesV = [
      { label: 'No', value: 'NO' },
      { label: 'Si', value: 'SI' },
      { label: 'Sin Actuaciones', value: 'SINACTUACIONES' }
    ]
  }

  getDocuActuaciones() {
    this.actuacionesDocu = [
      { label: 'Todas', value: 'TODAS' },
      { label: 'Algunas', value: 'ALGUNAS' },
      { label: 'Ninguna', value: 'NINGUNA' }
    ]
  }

  getComboCalidad() {
    this.comboCalidad = [
      { label: 'Demandante', value: '1' },
      { label: 'Demandado', value: '0' }
    ]
  }

  getOrigenActuaciones() {
    this.comboOrigenActuaciones = [
      { label: 'Colegio', value: 'COLEGIO' },
      { label: 'Colegiado', value: 'COLEGIADO' }
    ]
  }

  getComboJuzgados() {
    this.progressSpinner = true;
    if (this.body.idJuzgado == null || this.body.idJuzgado == undefined) {
      this.body.idJuzgado = '0';
    }

    this.sigaServices.post("combo_comboJuzgadoDesignaciones",this.body.idJuzgado).subscribe(
      n => {
        this.comboJuzgados = JSON.parse(n.body).combooItems;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.arregloTildesCombo(this.comboTurno);
        this.comboJuzgados.sort( (a, b) => {
          return a.label.localeCompare(b.label);
        });
      }
    );
  }

  getComboModulos() {
    this.progressSpinner = true;

    this.sigaServices.get("combo_comboModulosDesignaciones").subscribe(
      n => {
        this.comboModulos = n.combooItems;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.arregloTildesCombo(this.comboTurno);
      }
    );
  }

  getComboProcedimientos() {
    this.progressSpinner = true;

    this.sigaServices.get("combo_comboProcedimientosDesignaciones").subscribe(
      n => {
        this.comboProcedimientos = n.combooItems;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.arregloTildesCombo(this.comboProcedimientos);
      }
    );
  }

  getComboRoles() {
    this.progressSpinner = true;

    this.comboRoles = [
      { label: 'Solicitante', value: 'SOLICITANTE' },
      { label: 'Contrario', value: 'CONTRARIO' },
      { label: 'Representante del solicitante', value: 'REPRESENTANTE' },
      { label: 'Unidad familiar', value: 'UNIDAD' }
    ]
  }

  getComboAcreditaciones() {
    this.progressSpinner = true;

    this.sigaServices.get("modulosybasesdecompensacion_comboAcreditaciones").subscribe(
      n => {
        this.comboAcreditaciones = n.combooItems;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.arregloTildesCombo(this.comboAcreditaciones);
      }
    );
  }

  cargaCombosJustificacion() {
    this.cargaComboActuacionesValidadas();
    this.cargaComboSinEJG();
    this.cargaComboEJGnoFavorable();
    this.cargaComboEJGSinResolucion();
    this.cargaComboResoluciones();
  }

  cargaComboSinEJG() {
    this.comboSinEJG = [
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboSinEJG.conejgrelacionado'), value: '0' },
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboSinEJG.sinejgrelacionadolectura'), value: '1' },
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboSinEJG.sinejgrelacionado'), value: '2' }
    ];
  }

  cargaComboEJGnoFavorable() {
    this.comboEJGnoFavorable = [
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboEJGnofavorable.noincluye'), value: '0' },
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboEJGnofavorable.incluyelectura'), value: '1' },
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboEJGnofavorable.incluyejustificar'), value: '2' }
    ];
  }

  cargaComboEJGSinResolucion() {
    this.comboEJGSinResolucion = [
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboEJGresolucion.ejgconresolucion'), value: '0' },
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboEJGresolucion.ejgsinresolucionlectura'), value: '1' },
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboEJGresolucion.ejgsinresolucionjustificar'), value: '2' }
    ];
  }

  cargaComboResoluciones() {
    this.comboResoluciones = [
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboresoluciones.noincluye'), value: '0' },
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboresoluciones.incluyelectura'), value: '1' },
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboresoluciones.incluyejustificar'), value: '2' }
    ];
  }

  cargaComboActuacionesValidadas() {
    this.comboActuacionesValidadas = [
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboactuacionvalidada.si'), value: 'SI' },
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboactuacionvalidada.no'), value: 'NO' },
      { label: this.translateService.instant('justiciaGratuita.oficio.justificacion.comboactuacionvalidada.sinactuaciones'), value: 'SINACTUACIONES' }
    ];
  }

  guardarFiltros(){
    let designa = new DesignaItem();
    designa.ano = this.body.ano;
    designa.codigo = this.body.codigo;
    designa.fechaEntradaInicio = this.fechaAperturaDesdeSelect;
    designa.fechaEntradaFin = this.fechaAperturaHastaSelect;
    designa.estados = this.body.estados;
    designa.idTipoDesignaColegios = (this.body.idTipoDesignaColegios);
    designa.idTurnos = this.body.idTurnos;
    if (designa.idTurno != null) {
      designa.nombreTurno = this.comboTurno.find(
        item => item.value == designa.idTurno
      ).label;
    }
    designa.documentacionActuacion = this.body.documentacionActuacion;
    designa.idActuacionesV = this.body.idActuacionesV;
    designa.idArt27 = this.body.idArt27;
    designa.numColegiado = this.usuarioBusquedaExpress.numColegiado;

    designa.idJuzgados = this.body.idJuzgados;
    designa.idModulos = this.body.idModulos;
    designa.idCalidad = this.body.idCalidad;
    if (this.body.anoProcedimiento != null && this.body.anoProcedimiento != undefined) {
      designa.numProcedimiento = this.body.anoProcedimiento.toString();
    }
    designa.idProcedimientos = this.body.idProcedimientos;
    designa.nig = this.body.nig;
    designa.asunto = this.body.asunto;

    designa.idJuzgadoActu = this.body.idJuzgadoActu;
    // if (designa.idJuzgadoActu != null) {
    //   designa.nombreJuzgadoActu = this.comboJuzgados.find(
    //     item => item.value == designa.idJuzgadoActu
    //   ).label;
    // }
    if (this.body.idAcreditacion != undefined) {
      designa.idAcreditacion = this.body.idAcreditacion;
    }
    designa.idOrigen = this.body.idOrigen;
    designa.fechaJustificacionDesde = this.fechaJustificacionDesdeSelect;
    designa.fechaJustificacionHasta = this.fechaJustificacionHastaSelect;
    designa.idModuloActuaciones = this.body.idModuloActuaciones;
    designa.idProcedimientoActuaciones = this.body.idProcedimientoActuaciones;
    designa.nif = this.body.nif;
    designa.apellidosInteresado = this.body.apellidosInteresado;
    designa.nombreInteresado = this.body.nombreInteresado;
    designa.rol = this.body.rol;

    sessionStorage.setItem("filtroDesignas", JSON.stringify(designa));
  }

  cargarFiltros(){
    
    this.body = JSON.parse(
      sessionStorage.getItem("filtroDesignas")
    );
    if (this.body.fechaEntradaInicio != undefined && this.body.fechaEntradaInicio != null) {
      this.fechaAperturaDesdeSelect = new Date(this.body.fechaEntradaInicio);
    }
    if (this.body.fechaEntradaFin != undefined && this.body.fechaEntradaFin != null) {
      this.fechaAperturaHastaSelect = new Date(this.body.fechaEntradaFin);
    }
    if (this.body.fechaJustificacionDesde != undefined && this.body.fechaJustificacionDesde != null) {
      this.body.fechaJustificacionDesde = new Date(this.body.fechaJustificacionDesde);
    }
    if (this.body.fechaJustificacionHasta != undefined && this.body.fechaJustificacionHasta != null) {
      this.body.fechaJustificacionHasta = new Date(this.body.fechaJustificacionHasta);
    }


      /*  designa.idTurnos = this.body.idTurnos;
        if (designa.idTurno != null) {
          designa.nombreTurno = this.comboTurno.find(
            item => item.value == designa.idTurno
          ).label;
        }
        */
        if(this.body.numColegiado != undefined && this.body.numColegiado != null){
        this.usuarioBusquedaExpress.numColegiado = this.body.numColegiado.toString();
        }
        
        if (this.body.numProcedimiento != null && this.body.numProcedimiento != undefined) {
          this.body.anoProcedimiento = +this.body.numProcedimiento;
        }
        
        // if (designa.idJuzgadoActu != null) {
        //   designa.nombreJuzgadoActu = this.comboJuzgados.find(
        //     item => item.value == designa.idJuzgadoActu
        //   ).label;
        // }    
    
    sessionStorage.removeItem("filtroDesignas");
  }

  buscar() {
    let keyConfirmation = "confirmacionGuardarJustificacionExpress";
    if (sessionStorage.getItem('rowIdsToUpdate') != null && sessionStorage.getItem('rowIdsToUpdate') != 'null' && sessionStorage.getItem('rowIdsToUpdate') != '[]') {
      this.confirmationService.confirm({
        key: keyConfirmation,
        message: this.translateService.instant('justiciaGratuita.oficio.justificacion.reestablecer'),
        icon: "fa fa-trash-alt",
        accept: () => {
          this.showTablaJustificacionExpres.emit(false);
          this.busquedaJustificacionExpres.emit(true);
        },
        reject: () => {
        }
      });
    } else {
      //es la busqueda de justificacion
      if (this.showJustificacionExpress) {

      if (!this.filtroJustificacion.anioDesignacion) {
        // Si el campo del año está vacío, asegúrate de limpiar cualquier valor guardado en sessionStorage
        let filtros = sessionStorage.getItem("filtroJustificacionExpres") ? JSON.parse(sessionStorage.getItem("filtroJustificacionExpres")) : {};
        delete filtros.anioDesignacion; // Eliminar el valor del año o establecer a null o ''
        sessionStorage.setItem("filtroJustificacionExpres", JSON.stringify(filtros));
        this.filtroJustificacion.anioDesignacion = null; // O establecer a una cadena vacía si eso funciona mejor con tu lógica
      }
      this.guardarFiltrosJustificacion();

      if (this.compruebaFiltroJustificacion()) {
          this.showTablaJustificacionExpres.emit(false); //Si se marca como true llama a tabla-justificacion-express.component.ts pero no lleva datosJustificacion relleno y falla
          this.busquedaJustificacionExpres.emit(true);
        }

      } else {
        if (this.usuarioBusquedaExpress.numColegiado != undefined && this.usuarioBusquedaExpress.numColegiado != null) {
          this.filtroJustificacion.nColegiado = this.usuarioBusquedaExpress.numColegiado;
          this.filtroJustificacion.nombreAp = this.usuarioBusquedaExpress.nombreAp;
        }

        this.progressSpinner = true;
        let designa = new DesignaItem();
        designa.ano = this.body.ano;
        designa.codigo = this.body.codigo;
        designa.fechaEntradaInicio = this.fechaAperturaDesdeSelect;
        designa.fechaEntradaFin = this.fechaAperturaHastaSelect;
        designa.estados = this.body.estados;
        designa.idTipoDesignaColegios = (this.body.idTipoDesignaColegios);
        designa.idTurnos = this.body.idTurnos;
        if (designa.idTurno != null) {
          designa.nombreTurno = this.comboTurno.find(
            item => item.value == designa.idTurno
          ).label;
        }
        designa.documentacionActuacion = this.body.documentacionActuacion;
        designa.idActuacionesV = this.body.idActuacionesV;
        designa.idArt27 = this.body.idArt27;
        designa.numColegiado = this.usuarioBusquedaExpress.numColegiado;

        designa.idJuzgados = this.body.idJuzgados;
        designa.idModulos = this.body.idModulos;
        designa.idCalidad = this.body.idCalidad;
        if (this.body.anoProcedimiento != null && this.body.anoProcedimiento != undefined) {
          designa.numProcedimiento = this.body.anoProcedimiento.toString();
        }
        designa.idProcedimientos = this.body.idProcedimientos;
        designa.nig = this.body.nig;
        designa.asunto = this.body.asunto;

        designa.idJuzgadoActu = this.body.idJuzgadoActu;
        // if (designa.idJuzgadoActu != null) {
        //   designa.nombreJuzgadoActu = this.comboJuzgados.find(
        //     item => item.value == designa.idJuzgadoActu
        //   ).label;
        // }
        if (this.body.idAcreditacion != undefined) {
          designa.idAcreditacion = this.body.idAcreditacion;
        }
        designa.idOrigen = this.body.idOrigen;
        designa.fechaJustificacionDesde = this.fechaJustificacionDesdeSelect;
        designa.fechaJustificacionHasta = this.fechaJustificacionHastaSelect;
        designa.idModuloActuaciones = this.body.idModuloActuaciones;
        designa.idProcedimientoActuaciones = this.body.idProcedimientoActuaciones;
        designa.nif = this.body.nif;
        designa.apellidosInteresado = this.body.apellidosInteresado;
        designa.nombreInteresado = this.body.nombreInteresado;
        designa.rol = this.body.rol;

        sessionStorage.setItem("designaItem", JSON.stringify(designa));

        this.guardarFiltros();
        this.progressSpinner = false;
        this.busqueda.emit(false);
      }
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

  compruebaFiltroJustificacion() {
    if (this.filtroJustificacion.nColegiado != undefined && this.filtroJustificacion.nColegiado != null
      && this.usuarioBusquedaExpress.numColegiado.trim().length != 0) {
      return true;
    } else {
      this.showMessage("error", "Error",
        this.translateService.instant("general.message.camposObligatorios"));
      return false;
    }
  }

  limpiar() {
    this.filtroJustificacion = new JustificacionExpressItem();
    this.checkMostrarPendientes = true;
    this.checkRestricciones = false;
    this.disableRestricciones = false;

    if (!this.esColegiado) {
      this.usuarioBusquedaExpress = {
        numColegiado: "",
        nombreAp: ""
      };
      if (sessionStorage.getItem("datosColegiado")) {
        sessionStorage.removeItem("datosColegiado");
      }
    }

    //justificacion expres
    this.getDataLoggedUser();

    this.body = new DesignaItem();
    this.fechaAperturaDesdeSelect = undefined;
    this.fechaAperturaHastaSelect = undefined;
    this.fechaJustificacionDesdeSelect = undefined;
    this.fechaJustificacionHastaSelect = undefined;
    this.getBuscadorDesignas();
    sessionStorage.removeItem("filtroDesignas");
    this.showTablaJustificacionExpres.emit(false);
  }

  onChangeCheckMostrarPendientes(event) {
    this.checkMostrarPendientes = event;

    if (event) {
      this.filtroJustificacion.justificacionDesde = undefined;
      this.filtroJustificacion.justificacionHasta = undefined;
      this.filtroJustificacion.estado = undefined;
      this.filtroJustificacion.actuacionesValidadas = undefined;
    }
  }

  onChangeCheckRestricciones(event) {
    this.checkRestricciones = event;

    if (!event) {
      this.disableRestricciones = false;
    } else {
      this.getParamsEJG(true);
      this.disableRestricciones = true;
    }
  }

  getComboArticulo() {
    this.comboArt = [
      { label: 'Si', value: 'S' },
      { label: 'No', value: 'N' }
    ]
  }

  arregloTildesCombo(combo) {
    if (combo != undefined)
      combo.map(e => {
        let accents =
          "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
        let accentsOut =
          "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        let i;
        let x;
        for (i = 0; i < e.label.length; i++) {
          if ((x = accents.indexOf(e.label[i])) != -1) {
            e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
            return e.labelSinTilde;
          }
        }
      });
  }

  getDataLoggedUser() {

    this.progressSpinner = true;
    this.esColegiado = false;
    //si es colegio, valor por defecto para justificacion
    this.filtroJustificacion.ejgSinResolucion = "2";
    this.filtroJustificacion.sinEJG = "2";
    this.filtroJustificacion.resolucionPTECAJG = "2";
    this.filtroJustificacion.conEJGNoFavorables = "2";
    this.sigaServices.get("usuario_logeado").subscribe(n => {

      const usuario = n.usuarioLogeadoItem;
      const colegiadoItem = new ColegiadoItem();
      colegiadoItem.nif = usuario[0].dni;

      if (this.isLetrado) {
        this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(usr => {
          const { numColegiado, nombre } = JSON.parse(usr.body).colegiadoItem[0];
          this.usuarioBusquedaExpress.numColegiado = numColegiado;
          this.usuarioBusquedaExpress.nombreAp = nombre.replace(/,/g, "");
          this.showColegiado = true;

          //es colegiado, filtro por defecto para justificacion
          this.filtroJustificacion.ejgSinResolucion = this.ejgSinResolucion;
          this.filtroJustificacion.sinEJG = this.sinEjg;
          this.filtroJustificacion.resolucionPTECAJG = this.ejgPtecajg;
          this.filtroJustificacion.conEJGNoFavorables = this.ejgNoFavorable;

          this.esColegiado = true;
          this.checkRestricciones = true;
        },
          err => {
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
            this.buscar();
          });
      }

    },
      error => {
        this.progressSpinner = false;
      });
  }

  clear() {
    this.msgs = [];
  }

  nuevo() {
    this.progressSpinner = true
    this.persistenceService.clearRelacionesEjgDesignaAsistencia();
    sessionStorage.setItem("nuevaDesigna", "true");
    this.router.navigate(["/fichaDesignaciones"]);
    this.progressSpinner = false;
  }

  changeColegiado(event) {
    if(event != null){
      this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
      this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.buscar();
    }
  }


  changeNumAno(numAnio){
    var objRegExp = /^\d+\/\d+$/;
    var ret = objRegExp.test(numAnio);
    if (!ret){
      this.body.anoProcedimiento = null;
    }
  }

  onAnioDesignacionChange(value: string): void {
    if (!value) { // Si el valor es una cadena vacía o null
      this.filtroJustificacion.anioDesignacion = null; // Asegúrate de que el modelo se actualice a null
    }
  }

}