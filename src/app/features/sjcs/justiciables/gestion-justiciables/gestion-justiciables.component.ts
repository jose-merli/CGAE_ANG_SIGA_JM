import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "../../../../_services/authentication.service";
import { CommonsService } from "../../../../_services/commons.service";
import { PersistenceService } from "../../../../_services/persistence.service";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { EJGItem } from "../../../../models/sjcs/EJGItem";
import { JusticiableBusquedaItem } from "../../../../models/sjcs/JusticiableBusquedaItem";
import { JusticiableItem } from "../../../../models/sjcs/JusticiableItem";
import { procesos_ejg } from "../../../../permisos/procesos_ejg";
import { procesos_justiciables } from "../../../../permisos/procesos_justiciables";
import { DatosPersonalesComponent } from "./datos-personales/datos-personales.component";
import { DatosRepresentanteComponent } from "./datos-representante/datos-representante.component";

@Component({
  selector: "app-gestion-justiciables",
  templateUrl: "./gestion-justiciables.component.html",
  styleUrls: ["./gestion-justiciables.component.scss"],
})
export class GestionJusticiablesComponent implements OnInit {
  fichasPosibles;
  modoEdicion: boolean;
  body: JusticiableItem;
  bodyRep: JusticiableItem;
  justiciable: string = "";
  solicitante: JusticiableItem;
  justiciableBusquedaItem: JusticiableBusquedaItem;
  representanteBusquedaItem: JusticiableBusquedaItem;
  progressSpinner: boolean = false;
  msgs = [];
  navigateToJusticiable: boolean = false;
  // Variables para la tarjeta Resumen
  idEJG;
  permisoEscrituraResumen;
  permisoDatosGenerales;
  permisoDatosPersonales;
  permisoSolicitud;
  permisoRepresentantes;
  permisoAsuntos;
  permisoAbogado;
  permisoProcurador;
  permisoUnidadFamiliar;
  enlacesTarjetaResumen = [];
  datos;
  iconoTarjetaResumen = "clipboard";
  icono = "clipboard";
  openFicha: boolean = true;
  manuallyOpened: boolean;
  // Tarjetas para abrir las Tarjetas.
  tarjetaDatosGenerales: boolean = false;
  tarjetaDatosPersonales: boolean = false;
  tarjetaDatosSolicitud: boolean = false;
  tarjetaDatosRepresentante: boolean = false;
  tarjetaDatosAsuntos: boolean = false;
  tarjetaDatosAbogado: boolean = false;
  tarjetaDatosProcurador: boolean = false;
  tarjetaDatosUnidadFamiliar: boolean = false;
  updateDatosPersonale: boolean = false;

  @ViewChild("topScroll") outlet;
  @ViewChild(DatosRepresentanteComponent) datosRepresentante;
  @ViewChild(DatosPersonalesComponent) datosPersonales;
  //@ViewChild(AsuntosComponent) actualizaAsuntos;

  fromJusticiable;
  modoRepresentante: boolean = false;
  checkedViewRepresentante: boolean = false;
  nuevoRepresentante: boolean = false;
  justiciableOverwritten: boolean = false;
  justiciableCreateByUpdate: boolean = false;
  permisoEscritura;

  fromInteresado: boolean = false;
  fromContrario: boolean = false;
  fromUniFamiliar: boolean = false;
  fromContrarioEJG: boolean = false;
  fromAsistenciaAsistido: boolean = false;
  fromNuevoJusticiable: boolean = false;

  showDatosGenerales;
  showDatosSolicitudes;
  showDatosPersonales;
  showDatosUF;
  showDatosRepresentantes;
  showAsuntos;
  showProcuradorContrario;
  showAbogadoContrario;
  datosAsuntos = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private translateService: TranslateService, private sigaServices: SigaServices, private persistenceService: PersistenceService, private commonsService: CommonsService, private authenticationService: AuthenticationService, private location: Location) {}

  async ngOnInit() {
    if (sessionStorage.getItem("deJusticiableANuevaDesigna")) {
      sessionStorage.removeItem("deJusticiableANuevaDesigna");
    }
    this.progressSpinner = true;

    // Comprobar si esta en Creación.
    if (!sessionStorage.getItem("nuevoJusticiable")) {
      if (sessionStorage.getItem("origen") == "Nuevo") {
        this.fromNuevoJusticiable = true;
      }
      if (sessionStorage.getItem("origin") == "Interesado") {
        //sessionStorage.removeItem('origin');
        this.fromInteresado = true;

        let fichasPosiblesInteresados = [
          { origen: "justiciables", activa: false },
          { key: "generales", activa: false },
          { key: "personales", activa: false },
          { key: "solicitud", activa: false },
          { key: "representante", activa: false },
          { key: "asuntos", activa: false },
          { key: "abogado", activa: false },
          { key: "procurador", activa: false },
          { key: "unidadFamiliar", activa: false },
        ];

        this.persistenceService.setFichasPosibles(fichasPosiblesInteresados);
      } else if (sessionStorage.getItem("origin") == "Contrario") {
        //sessionStorage.removeItem('origin');
        this.fromContrario = true;

        let fichasPosiblesContrarios = [
          { origen: "justiciables", activa: false },
          { key: "generales", activa: false },
          { key: "personales", activa: false },
          { key: "solicitud", activa: false },
          { key: "representante", activa: false },
          { key: "asuntos", activa: false },
          { key: "abogado", activa: false },
          { key: "procurador", activa: false },
          { key: "unidadFamiliar", activa: false },
        ];

        this.persistenceService.setFichasPosibles(fichasPosiblesContrarios);
      } else if (sessionStorage.getItem("origin") == "ContrarioEJG") {
        //sessionStorage.removeItem('origin');
        this.fromContrarioEJG = true;
        let fichasPosiblesContrariosEJG = [
          { origen: "justiciables", activa: false },
          { key: "generales", activa: false },
          { key: "personales", activa: false },
          { key: "solicitud", activa: false },
          { key: "representante", activa: false },
          { key: "asuntos", activa: false },
          { key: "abogado", activa: false },
          { key: "procurador", activa: false },
          { key: "unidadFamiliar", activa: false },
        ];
        this.persistenceService.setFichasPosibles(fichasPosiblesContrariosEJG);
      } else if (sessionStorage.getItem("origin") == "UnidadFamiliar") {
        //sessionStorage.removeItem('origin');
        this.fromUniFamiliar = true;
        let fichasPosiblesUniFami = [
          { origen: "justiciables", activa: false },
          { key: "generales", activa: false },
          { key: "personales", activa: false },
          { key: "solicitud", activa: false },
          { key: "representante", activa: false },
          { key: "asuntos", activa: false },
          { key: "abogado", activa: false },
          { key: "procurador", activa: false },
          { key: "unidadFamiliar", activa: false },
        ];
        this.persistenceService.setFichasPosibles(fichasPosiblesUniFami);
      } else if (sessionStorage.getItem("origin") == "newAsistido") {
        this.fromAsistenciaAsistido = true;
        let fichasPosiblesNewAsistido = [
          { origen: "justiciables", activa: false },
          { key: "generales", activa: false },
          { key: "personales", activa: false },
          { key: "solicitud", activa: false },
          { key: "representante", activa: false },
          { key: "asuntos", activa: false },
          { key: "abogado", activa: false },
          { key: "procurador", activa: false },
        ];
        this.persistenceService.setFichasPosibles(fichasPosiblesNewAsistido);
      } else if (sessionStorage.getItem("origin") == "Nuevo") {
        sessionStorage.removeItem("origin");
        this.fromNuevoJusticiable = true;
        let fichasPosiblesNewJusticiable = [
          { origen: "justiciables", activa: false },
          { key: "generales", activa: true },
          { key: "personales", activa: false },
          { key: "solicitud", activa: false },
          { key: "representante", activa: false },
          { key: "asuntos", activa: false },
          { key: "abogado", activa: false },
          { key: "procurador", activa: false },
        ];
        this.persistenceService.setFichasPosibles(fichasPosiblesNewJusticiable);
      } else {
        // En caso de que no venga de ninguno de los orígenes anteriores, se muestran todas las tarjetas cerradas.
        let fichasAux = this.persistenceService.getFichasPosibles();
        fichasAux = fichasAux.map(obj => {
          if('key' in obj) return {...obj, activa: false}
          return obj;
        });
        this.persistenceService.setFichasPosibles(fichasAux);
      }
    }

    await this.checkAcceso();

    //El padre de todas las tarjetas se encarga de enviar a sus hijos el objeto nuevo del justiciable que se quiere mostrar

    //Para indicar que estamos en modo de creacion de representante
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.rp == "1") {
        this.modoRepresentante = true;
        this.body = new JusticiableItem();
        this.nuevo();
      } else if (params.fr == "u") {
        this.permisoEscritura = false;
      } else if (params.fr == "2") {
        this.modoRepresentante = false;
      }
    });

    this.commonsService.scrollTop();
    //Carga configuracion de las tarjetas
    if (this.persistenceService.getFichasPosibles() != null && this.persistenceService.getFichasPosibles() != undefined) {
      this.fichasPosibles = this.persistenceService.getFichasPosibles();
      this.fromJusticiable = this.fichasPosibles[0].activa;

    }

    if (sessionStorage.getItem("solicitanteSOJ")) {
      this.justiciableBusquedaItem = JSON.parse(sessionStorage.getItem("solicitanteSOJ"));
      sessionStorage.removeItem("solicitanteSOJ");
      this.callServiceSearch(this.justiciableBusquedaItem);
    } else if (sessionStorage.getItem("representante")) {
      let representante = JSON.parse(sessionStorage.getItem("representante"));
      sessionStorage.removeItem("representante");
      this.justiciable = sessionStorage.getItem("justiciable");
      sessionStorage.removeItem("justiciable");
      this.callServiceSearch(representante);
    } else {
      //Creacion de una nueva unidad familiar
      if (this.fromUniFamiliar && sessionStorage.getItem("Nuevo")) {
        this.modoEdicion = true;
        this.searchSolicitante();
        //Proviene de la tarjeta de unidad familiar directamente
      } else if (this.fromUniFamiliar) {
        this.modoEdicion = true;
        this.fillJusticiableBuesquedaItemToUnidadFamiliarEJG();
      } else if (this.fromContrarioEJG && !this.modoRepresentante) {
        this.modoEdicion = true;
        this.justiciableBusquedaItem = JSON.parse(sessionStorage.getItem("itemJusticiable"));
        sessionStorage.removeItem("itemJusticiable");
        sessionStorage.setItem("fichaJusticiable", JSON.stringify(this.justiciableBusquedaItem));
        this.search();
      } else if (this.persistenceService.getDatos() != null && !this.modoRepresentante) {
        this.modoEdicion = true;
        this.justiciableBusquedaItem = this.persistenceService.getDatos();
        sessionStorage.setItem("fichaJusticiable", JSON.stringify(this.justiciableBusquedaItem));
        this.search();
      } else if (this.fromAsistenciaAsistido && sessionStorage.getItem("Nuevo")) {
        this.modoEdicion = false;
        this.body = new JusticiableItem();
        sessionStorage.removeItem("Nuevo");
      } else if (sessionStorage.getItem("fichaJusticiable") && this.persistenceService.getDatos() == null && !this.modoRepresentante) {
        this.modoEdicion = true;
        this.justiciableBusquedaItem = JSON.parse(sessionStorage.getItem("fichaJusticiable"));
        this.search();
      } else {
        sessionStorage.removeItem("Nuevo");
        this.modoEdicion = false;
        this.progressSpinner = false;
      }
    }

    //Indicar que se han guardado los datos generales de un Representante y hay que mostrar de nuevo al justiciable que tiene asociado el representante creado
    this.sigaServices.guardarDatosGeneralesRepresentante$.subscribe((data) => {
      this.progressSpinner = true;
      this.commonsService.scrollTop();
      this.persistenceService.setBody(data);
      this.modoRepresentante = false;
      this.modoEdicion = true;
      this.progressSpinner = false;

      if (!this.navigateToJusticiable) {
        this.checkedViewRepresentante = false;
        this.justiciableBusquedaItem = this.persistenceService.getDatos();
        this.search();
      }
    });
    this.progressSpinner = false;
  }

  //Haria falta añadir una comprobacion para los contrarios de designa "fromContrario"y para los interesados de designa "fromInteresado"
  async checkAcceso() {
    if (this.fromUniFamiliar) {
      this.commonsService
        .checkAcceso(procesos_ejg.detalleUF)
        .then((respuesta) => {
          this.permisoEscritura = respuesta;

          //hay que comprobar permisos para las tarjetas
          if (this.permisoEscritura != undefined) {
            this.checkAccesoTarjetasUF();
          } else {
            sessionStorage.setItem("codError", "403");
            sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
            this.progressSpinner = false;
            this.router.navigate(["/errorAcceso"]);
          }
        })
        .catch((error) => console.error(error));
    } else if (this.fromContrarioEJG) {
      this.commonsService
        .checkAcceso(procesos_ejg.detalleContrarios)
        .then((respuesta) => {
          this.permisoEscritura = respuesta;

          //hay que comprobar permisos para las tarjetas
          if (this.permisoEscritura != undefined) {
            this.checkAccesoTarjetasDetalleContrarios();
          } else {
            sessionStorage.setItem("codError", "403");
            sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
            this.progressSpinner = false;
            this.router.navigate(["/errorAcceso"]);
          }
        })
        .catch((error) => console.error(error));
    } else {
      this.commonsService
        .checkAcceso(procesos_justiciables.gestionJusticiables)
        .then((respuesta) => {
          this.permisoEscritura = respuesta;

          if (this.permisoEscritura != undefined) {
            this.checkAccesoTarjetas();
          } else {
            sessionStorage.setItem("codError", "403");
            sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
            this.progressSpinner = false;
            this.router.navigate(["/errorAcceso"]);
          }
        })
        .catch((error) => console.error(error));
    }
  }

  checkAccesoTarjetasDetalleContrarios() {
    let recibidos = 0; //Determina cuantos servicios de los permisos se han terminado
    this.commonsService
      .checkAcceso(procesos_ejg.datosGeneralesContrarios)
      .then((respuesta) => {
        this.showDatosGenerales = respuesta;
        recibidos++;
        if (recibidos == 7) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_ejg.datosSolicitudesContrarios)
      .then((respuesta) => {
        this.showDatosSolicitudes = respuesta;
        recibidos++;
        if (recibidos == 7) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_ejg.datosDireccionContactoContrarios)
      .then((respuesta) => {
        this.showDatosPersonales = respuesta;
        recibidos++;
        if (recibidos == 7) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_ejg.datosRepresentantesLegal)
      .then((respuesta) => {
        this.showDatosRepresentantes = respuesta;
        recibidos++;
        if (recibidos == 7) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_ejg.asuntosContrarios)
      .then((respuesta) => {
        this.showAsuntos = respuesta;
        recibidos++;
        if (recibidos == 7) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_ejg.datosAbogadoContrario)
      .then((respuesta) => {
        this.showAbogadoContrario = respuesta;
        recibidos++;
        if (recibidos == 7) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_ejg.datosProcuradorContrario)
      .then((respuesta) => {
        this.showProcuradorContrario = respuesta;
        recibidos++;
        if (recibidos == 7) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));
  }

  checkAccesoTarjetasUF() {
    let recibidos = 0; //Determina cuantos servicios de los permisos se han terminado
    this.commonsService
      .checkAcceso(procesos_ejg.datosGeneralesUF)
      .then((respuesta) => {
        this.showDatosGenerales = respuesta;
        recibidos++;
        if (recibidos == 6) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_ejg.datosSolicitudesUF)
      .then((respuesta) => {
        this.showDatosSolicitudes = respuesta;
        recibidos++;
        if (recibidos == 6) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_ejg.datosDireccionContactoUF)
      .then((respuesta) => {
        this.showDatosPersonales = respuesta;
        recibidos++;
        if (recibidos == 6) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_ejg.datosAdicionalesUF)
      .then((respuesta) => {
        this.showDatosUF = respuesta;
        recibidos++;
        if (recibidos == 6) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_ejg.datosRepresentanteLegalUF)
      .then((respuesta) => {
        this.showDatosRepresentantes = respuesta;
        recibidos++;
        if (recibidos == 6) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_ejg.asuntosUF)
      .then((respuesta) => {
        this.showAsuntos = respuesta;
        recibidos++;
        if (recibidos == 6) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));
  }

  checkAccesoTarjetas() {
    let recibidos = 0; //Determina cuantos servicios de los permisos se han terminado
    this.commonsService
      .checkAcceso(procesos_justiciables.tarjetaDatosGenerales)
      .then((respuesta) => {
        this.showDatosGenerales = respuesta;
        this.showDatosPersonales = respuesta;
        recibidos++;
        if (recibidos == 4) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_justiciables.tarjetaDatosSolicitud)
      .then((respuesta) => {
        this.showDatosSolicitudes = respuesta;
        recibidos++;
        if (recibidos == 4) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_justiciables.tarjetaDatosRepresentante)
      .then((respuesta) => {
        this.showDatosRepresentantes = respuesta;
        recibidos++;
        if (recibidos == 4) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_justiciables.tarjetaAsuntos)
      .then((respuesta) => {
        this.showAsuntos = respuesta;
        recibidos++;
        if (recibidos == 4) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));
  }

  fillJusticiableBuesquedaItemToUnidadFamiliarEJG() {
    if (this.body == undefined || this.body == null) {
      this.body = new JusticiableItem();
      this.body = this.persistenceService.getDatos();
    }

    let justiciableUnidadFamiliar = JSON.parse(sessionStorage.getItem("Familiar"));
    this.justiciableBusquedaItem = new JusticiableBusquedaItem();

    if (justiciableUnidadFamiliar == null || justiciableUnidadFamiliar == undefined) {
      this.justiciableBusquedaItem = this.persistenceService.getDatos();
    } else {
      this.justiciableBusquedaItem.idpersona = justiciableUnidadFamiliar.uf_idPersona;
      this.justiciableBusquedaItem.idinstitucion = justiciableUnidadFamiliar.uf_idInstitucion;
      //this.body.idrepresentantejg = justiciableUnidadFamiliar.nifRepresentante;
      // this.body.nombre = justiciableUnidadFamiliar.representante;
    }

    this.searchByIdPersona(this.justiciableBusquedaItem);
  }
  //Servicio para extraer el solicitante principal de esa unidad familiar
  searchSolicitante() {
    let ejg: EJGItem = this.persistenceService.getDatosEJG();
    this.sigaServices.post("gestionJusticiables_getSolicitante", ejg).subscribe((n) => {
      let solicitante = JSON.parse(n.body).unidadFamiliarItems;
      if (solicitante.length > 0) {
        let bodyBusqueda = new JusticiableBusquedaItem();
        bodyBusqueda.idpersona = solicitante[0].idpersona;
        bodyBusqueda.idinstitucion = this.authenticationService.getInstitucionSession();
        this.getSolicitante(bodyBusqueda);
      }
    });
  }

  getSolicitante(bodyBusqueda) {
    this.sigaServices.post("gestionJusticiables_getJusticiableByIdPersona", bodyBusqueda).subscribe(
      (n) => {
        this.solicitante = JSON.parse(n.body).justiciable;

        //Se rellenan los campos de direccion y contacto con los del solicitante principal de una unidad familiar
        //si se crea una nueva unidad familiar

        this.body = new JusticiableItem();

        //datos de contacto
        this.body.correoelectronico = this.solicitante.correoelectronico;
        this.body.fax = this.solicitante.fax;
        this.body.telefonos = this.solicitante.telefonos;

        //Direccion
        this.body.direccion = this.solicitante.direccion;
        this.body.idtipovia = this.solicitante.idtipovia;
        this.body.numerodir = this.solicitante.numerodir;
        this.body.escaleradir = this.solicitante.escaleradir;
        this.body.pisodir = this.solicitante.pisodir;
        this.body.puertadir = this.solicitante.puertadir;
        this.body.idpaisdir1 = this.solicitante.idpaisdir1;
        this.body.codigopostal = this.solicitante.codigopostal;
        this.body.idprovincia = this.solicitante.idprovincia;
        this.body.idpoblacion = this.solicitante.idpoblacion;

        this.progressSpinner = false;
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  actualizaAsunto(event) {
    this.body = event;
    this.updateTarjResumen();
  }

  newJusticiable(event) {
    if (!this.modoRepresentante) {
      this.justiciableBusquedaItem = new JusticiableBusquedaItem();
      this.justiciableBusquedaItem.idpersona = event.idpersona;
      this.justiciableBusquedaItem.idinstitucion = this.authenticationService.getInstitucionSession();

      if (this.fromUniFamiliar) {
        sessionStorage.setItem("datos", JSON.stringify(this.persistenceService.getDatos()));
      } else if (this.fromAsistenciaAsistido && sessionStorage.getItem("idAsistencia")) {
        let idAsistencia = sessionStorage.getItem("idAsistencia");
        if (idAsistencia) {
          this.sigaServices.postPaginado("busquedaGuardias_asociarAsistido", "?anioNumero=" + idAsistencia + "&actualizaDatos='S'", event).subscribe(
            (data) => {
              let result = JSON.parse(data["body"]);
              if (result.error) {
                this.showMessage("error", this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
              } else {
                this.showMessage("success", this.translateService.instant("general.message.accion.realizada"), "");
                sessionStorage.removeItem("Nuevo");
                this.router.navigate(["/fichaAsistencia"]);
              }
            },
            (err) => {
              this.progressSpinner = false;
            },
            () => {
              this.progressSpinner = false;
            },
          );
        }
      }

      this.persistenceService.setDatos(this.justiciableBusquedaItem);
      this.body = event;
      this.modoEdicion = true;
    }
  }

  //BUSQUEDA JUSTICIABLE
  search() {
    this.progressSpinner = true;

    //VISTA JUSTICIABLE
    if (!this.checkedViewRepresentante) {
      let justiciableBusqueda;
      if (sessionStorage.getItem("ejgJusticiableView")) {
        justiciableBusqueda = JSON.parse(sessionStorage.getItem("ejgJusticiableView"));
        this.callServiceSearch(justiciableBusqueda);
        sessionStorage.removeItem("ejgJusticiableView");
      } else {
        if (this.persistenceService.getBody()) {
          justiciableBusqueda = this.persistenceService.getBody();
        } else {
          justiciableBusqueda = this.justiciableBusquedaItem;
        }
        this.callServiceSearch(justiciableBusqueda);
      }

      //VISTA REPRESENTANTE
    } else {
      let representanteBusqueda = this.representanteBusquedaItem;
      this.callServiceSearch(representanteBusqueda);
      this.modoRepresentante = true;
    }
    this.progressSpinner = false;
  }

  async callServiceSearch(justiciableBusqueda1) {
    this.progressSpinner = true;
    let justiciableBusqueda: JusticiableBusquedaItem = new JusticiableBusquedaItem();
    if (justiciableBusqueda1[0]) {
      justiciableBusqueda.idinstitucion = justiciableBusqueda1[0].idInstitucion;
      justiciableBusqueda.idpersona = justiciableBusqueda1[0].idpersonajg;
    } else {
      justiciableBusqueda.idinstitucion = justiciableBusqueda1.idinstitucion;
      justiciableBusqueda.idpersona = justiciableBusqueda1.idpersona;
    }

    sessionStorage.setItem("justiciableDatosPersonalesSearch", JSON.stringify(justiciableBusqueda));

    await this.sigaServices.post("gestionJusticiables_searchJusticiable", justiciableBusqueda).subscribe(
      (n) => {
        if (sessionStorage.getItem("origin") == "newRepresentante") {
          this.bodyRep = JSON.parse(n.body).justiciable;
          sessionStorage.setItem("bodyRepresentante", JSON.stringify(this.bodyRep));
          this.body = JSON.parse(sessionStorage.getItem("fichaJusticiable"));
        } else {
          this.body = JSON.parse(n.body).justiciable;

          if (!this.modoRepresentante && !this.justiciableOverwritten && !this.justiciableCreateByUpdate) {
            this.body.numeroAsuntos = justiciableBusqueda.numeroAsuntos;
            this.body.ultimoAsunto = justiciableBusqueda.ultimoAsunto;
          } else if (this.justiciableOverwritten) {
            this.justiciableOverwritten = false;
            this.modoEdicion = true;
            this.getAsuntos();
          } else if (this.justiciableCreateByUpdate) {
            this.justiciableCreateByUpdate = false;
            this.modoEdicion = true;
            //Al crearse uno nuevo desde justiciables no se le asocia ningun asunto por eso se resetean los valores
            this.body.numeroAsuntos = "0";
            this.body.ultimoAsunto = undefined;
          } else {
            this.body.numeroAsuntos = undefined;
            this.body.ultimoAsunto = undefined;
            this.getAsuntos();
          }

          // Actualizar Nº Asunto en tarjeta resumen.
          this.updateTarjResumen();
        }
        this.progressSpinner = false;
      },
      (err) => {
        this.progressSpinner = false;
        //console.log(err);
      },
    );
  }

  async getAsuntos() {
    let busquedaJusticiable = new JusticiableBusquedaItem();
    busquedaJusticiable.idpersona = this.body.idpersona;

    if (this.body.idpersona != undefined) {
      await this.sigaServices.post("gestionJusticiables_searchAsuntosJusticiable", this.body.idpersona).subscribe(
        (n) => {
          this.datosAsuntos = JSON.parse(n.body).asuntosJusticiableItems;

          if (this.datosAsuntos != undefined && this.datosAsuntos != null && this.datosAsuntos.length > 0) {
            this.body.numeroAsuntos = this.datosAsuntos.length.toString();
            this.body.ultimoAsunto = this.datosAsuntos[0].asunto;
          }

          this.progressSpinner = false;
        },
        (err) => {
          this.progressSpinner = false;
        },
      );
    }
  }

  newRepresentante(event) {
    this.commonsService.scrollTop();
    this.nuevoRepresentante = true;
    this.body = new JusticiableItem();
    this.body.nif = event.nif;
    this.nuevo();
  }

  nuevo() {
    this.modoEdicion = false;
    this.modoRepresentante = true;
  }

  //BUSQUEDA POR NIF DESDE LA TARJETA DATOS GENERALES
  searchJusticiableByNif(bodyBusqueda) {
    this.progressSpinner = true;

    this.sigaServices.post("gestionJusticiables_getJusticiableByNif", bodyBusqueda).subscribe(
      (n) => {
        let justiciable = JSON.parse(n.body).justiciable;

        this.progressSpinner = false;

        if (justiciable != undefined && (justiciable.idpersona == null || justiciable.idpersona == undefined)) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.justiciables.message.noExisteNifSistema"));
        } else {
          if (justiciable != undefined && this.body != undefined && justiciable.idpersona != this.body.idpersona) {
            this.body = JSON.parse(n.body).justiciable;
            this.body.numeroAsuntos = undefined;
            this.body.ultimoAsunto = undefined;
            this.getAsuntos();
          } else {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("gratuita.personaJG.literal.esMismaPersona"));
          }
        }
      },
      (err) => {
        this.progressSpinner = false;
        //console.log(err);
      },
    );
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }

  backTo() {
    if (this.justiciable != "") {
      sessionStorage.setItem("fichaJusticiable", this.justiciable);
      this.router.navigate(["/gestionJusticiables"]);
    } else if (sessionStorage.getItem("sojItemLink") != null) {
      this.router.navigate(["/detalle-soj"]);
    } else if (this.persistenceService.getDatosEJG() && !sessionStorage.getItem("nuevoJusticiable")) {
      let ejg: EJGItem = this.persistenceService.getDatosEJG();
      ejg.nombreApeSolicitante = this.body.apellido1 + " " + this.body.apellido2 + ", " + this.body.nombre;
      this.persistenceService.setDatosEJG(ejg);
      this.router.navigate(["/gestionEjg"]);
    } else if (sessionStorage.getItem("asistenciaAsistido") != null || sessionStorage.getItem("idAsistencia") != null) {
      this.router.navigate(["/fichaAsistencia"]);
    } else if (sessionStorage.getItem("designaItemLink") != null) {
      this.router.navigate(["/fichaDesignaciones"]);
    } else if (sessionStorage.getItem("vieneDeFichaJusticiable") == "true" || sessionStorage.getItem("nuevoJusticiable") == "true") {
      this.router.navigate(["/justiciables"]);
      sessionStorage.removeItem("nuevoJusticiable");
    } else {
      //Revisar. Actualmente se produce un bucle si se accede a la ficha para la creacion de un justiciable desde la pantalla de busqueda.
      //Para solucionarlo se recomienda que se eliminen los else if.
      this.persistenceService.clearFiltrosAux();
      //Se elimina aqui para evitar que afecte el comportamiento de las tarjetas despues devolver de una pantalla de busqueda.
      //sessionStorage.removeItem('origin');
      sessionStorage.removeItem("Familiar");
      //Si estamos en vista representante o en la creacion de nuevo representante, al volver buscamos el justiciable asociado a ese representante
      if (this.navigateToJusticiable || this.checkedViewRepresentante || this.nuevoRepresentante) {
        this.checkedViewRepresentante = false;
        this.nuevoRepresentante = false;
        this.modoEdicion = true;
        this.commonsService.scrollTop();
        this.navigateToJusticiable = false;
        this.search(); //Seria recomendable estandarizar y poner todo router.navigate o location.back
        //ya que si no se producen bucles.
      } /* else if(this.fromJusticiable){
        this.router.navigate(["/justiciables"]);
      } else if(this.fromContrario || this.fromInteresado) {
        this.router.navigate(['/fichaDesignaciones']);
      }  else if(this.fromAsistencia){
        this.router.navigate(['/fichaAsistencia']);
      }
      } else if(this.fromUniFamiliar){ */
      //Para que se abra la tarjeta de unidad familiar y se haga scroll a su posicion
      //if(this.fromUniFamiliar)sessionStorage.setItem('tarjeta','unidadFamiliar');    //this.router.navigate(["/gestionEjg"]);
      //}
      else {
        //Para que se abra la tarjeta de unidad familiar y se haga scroll a su posicion
        if (this.fromUniFamiliar) {
          sessionStorage.setItem("tarjeta", "unidadFamiliar");
          sessionStorage.setItem("origin", "UnidadFamiliar");
        }

        if (this.fromNuevoJusticiable) {
          this.router.navigate(["/justiciables"]);
        } else {
          this.location.back();
        }
      }
    }
  }

  searchJusticiableOverwritten(justiciable) {
    this.justiciableOverwritten = true;
    let justiciableBusqueda = new JusticiableBusquedaItem();
    justiciableBusqueda.idpersona = justiciable.idpersona;
    justiciableBusqueda.idinstitucion = this.authenticationService.getInstitucionSession();
    this.callServiceSearch(justiciableBusqueda);
  }

  createJusticiableByUpdateSolicitud(justiciable) {
    this.justiciableCreateByUpdate = true;
    let justiciableBusqueda = new JusticiableBusquedaItem();
    justiciableBusqueda.idpersona = justiciable.idpersona;
    justiciableBusqueda.idinstitucion = this.authenticationService.getInstitucionSession();
    this.callServiceSearch(justiciableBusqueda);
  }

  createJusticiableByUpdateRepresentante(justiciable) {
    this.justiciableCreateByUpdate = true;
    let justiciableBusqueda = new JusticiableBusquedaItem();
    justiciableBusqueda.idpersona = justiciable.idpersona;
    justiciableBusqueda.idinstitucion = this.authenticationService.getInstitucionSession();
    this.callServiceSearch(justiciableBusqueda);
  }

  searchByIdPersona(bodyBusqueda) {
    sessionStorage.setItem("justiciableDatosPersonalesSearch", JSON.stringify(bodyBusqueda));

    this.sigaServices.post("gestionJusticiables_getJusticiableByIdPersona", bodyBusqueda).subscribe(
      (n) => {
        this.body = JSON.parse(n.body).justiciable;

        if (this.body != undefined) {
          this.body.numeroAsuntos = undefined;
          this.body.ultimoAsunto = undefined;
          this.getAsuntos();
          // Actualizar Nombre, Apellidos y Identificador en tarjeta resumen.
          this.updateTarjResumen();
        }

        this.progressSpinner = false;
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  contrario(event) {
    this.fromContrario = true;
  }

  contrarioEJG(event) {
    this.fromContrarioEJG = true;
  }

  // Metódo para enviar Edición
  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.idEJG = event.idEJG;
  }

  // Método para abrir las Tarjetas al pulsar en el enlace.
  isOpenReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "datosGenerales":
          this.tarjetaDatosGenerales = true;
          this.fichasPosibles
          break;
        case "unidadFamiliar":
          this.tarjetaDatosUnidadFamiliar = true;
          break;
        case "Personales":
          this.tarjetaDatosPersonales = true;
          break;
        case "Solicitud":
          this.tarjetaDatosSolicitud = true;
          break;
        case "Representantes":
          this.tarjetaDatosRepresentante = true;
          break;
        case "Asuntos":
          this.tarjetaDatosAsuntos = true;
          break;
        case "Abogados":
          this.tarjetaDatosAbogado = true;
          break;
        case "Procuradores":
          this.tarjetaDatosProcurador = true;
          break;
      }
    }
  }

  // Método para cerrar las Tarjetas al pulsar en el enlace.
  isCloseReceive(event) {
    if (event != undefined) {
      switch (event) {
        case "datosGenerales":
          this.tarjetaDatosGenerales = this.manuallyOpened;
          break;
        case "unidadFamiliar":
          this.tarjetaDatosUnidadFamiliar = this.manuallyOpened;
          break;
        case "Personales":
          this.tarjetaDatosPersonales = this.manuallyOpened;
          break;
        case "Solicitud":
          this.tarjetaDatosSolicitud = this.manuallyOpened;
          break;
        case "Representantes":
          this.tarjetaDatosRepresentante = this.manuallyOpened;
          break;
        case "Asuntos":
          this.tarjetaDatosAsuntos = this.manuallyOpened;
          break;
        case "Abogados":
          this.tarjetaDatosAbogado = this.manuallyOpened;
          break;
        case "Procuradores":
          this.tarjetaDatosProcurador = this.manuallyOpened;
          break;
      }
    }
  }

  // Actualizar los Datos de la Tarjeta Resumen.
  updateTarjResumen() {
    if (this.body != null && this.body != undefined) {
      let movil: string = "";
      if (this.body.telefonos != null && this.body.telefonos.length > 0) {
        movil = this.body.telefonos[0].numeroTelefono;
      }

      let direccionCompleta: String = "";

      if (this.body.direccion != null) {
        if (this.body.codigopostal != null) {
          direccionCompleta = this.body.direccion + ", " + this.body.codigopostal;
        } else {
          direccionCompleta = this.body.direccion;
        }
      } else {
        if (this.body.codigopostal != null) {
          direccionCompleta = this.body.codigopostal;
        }
      }

      this.datos = [
        {
          label: this.translateService.instant("censo.usuario.DNI"),
          value: this.body.nif,
        },
        {
          label: this.translateService.instant("facturacionSJCS.retenciones.nombre"),
          value: this.body.apellido1 + " " + this.body.apellido2 + ", " + this.body.nombre,
        },
        {
          label: this.translateService.instant("censo.datosDireccion.literal.correo"),
          value: this.body.correoelectronico,
        },
        {
          label: this.translateService.instant("censo.datosDireccion.literal.telefonoMovil"),
          value: movil,
        },
        {
          label: this.translateService.instant("censo.consultaDirecciones.literal.direccion"),
          value: direccionCompleta,
        },
      ];
    }
  }

  // Metódo para enviar los datos de enlaces que hacen referencia a las tarjetas.
  // Controlamos que tengan el permiso y la tarjeta este visible.
  enviarEnlacesTarjeta() {
    this.enlacesTarjetaResumen = [];

    let pruebaTarjeta;

    setTimeout(() => {
      // Creacion Mostrar solo Datos Generales.
      if (sessionStorage.getItem("nuevoJusticiableTarjetas")) {
        sessionStorage.removeItem("nuevoJusticiableTarjetas");
        pruebaTarjeta = {
          label: "general.message.datos.generales",
          value: document.getElementById("datosGenerales"),
          nombre: "datosGenerales",
        };
        this.enlacesTarjetaResumen.push(pruebaTarjeta);

        // Visualizar Mostrar las tarjetas Disponibles.
      } else {
        if (this.showDatosGenerales == true) {
          // Comprobar si esta activada la Tarjeta
          pruebaTarjeta = {
            label: "general.message.datos.generales",
            value: document.getElementById("datosGenerales"),
            nombre: "datosGenerales",
          };

          this.enlacesTarjetaResumen.push(pruebaTarjeta);
        }

        if (this.showDatosUF == true) {
          // Comprobar si esta activada la Tarjeta
          pruebaTarjeta = {
            label: "justiciaGratuita.justiciables.rol.unidadFamiliar",
            value: document.getElementById("unidadFamiliar"),
            nombre: "unidadFamiliar",
          };

          this.enlacesTarjetaResumen.push(pruebaTarjeta);
        }

        if (this.showDatosPersonales == true) {
          // Comprobar si esta activada la Tarjeta
          pruebaTarjeta = {
            label: "formacion.fichaInscripcion.datosContacto.cabecera",
            value: document.getElementById("DivDatosPersonales"),
            nombre: "Personales",
          };

          this.enlacesTarjetaResumen.push(pruebaTarjeta);
        }

        if (this.showDatosSolicitudes == true) {
          // Comprobar si esta activada la Tarjeta
          pruebaTarjeta = {
            label: "censo.nuevaSolicitud.headerSolicitud",
            value: document.getElementById("DivSolicitud"),
            nombre: "Solicitud",
          };

          this.enlacesTarjetaResumen.push(pruebaTarjeta);
        }

        if (this.showDatosRepresentantes == true) {
          // Comprobar si esta activada la Tarjeta
          pruebaTarjeta = {
            label: "justiciaGratuita.oficio.designas.interesados.abogado",
            value: document.getElementById("DivRepresentantes"),
            nombre: "Representantes",
          };

          this.enlacesTarjetaResumen.push(pruebaTarjeta);
        }

        if (this.showAsuntos == true) {
          // Comprobar si esta activada la Tarjeta
          pruebaTarjeta = {
            label: "justiciaGratuita.justiciables.literal.asuntos",
            value: document.getElementById("DivAsuntos"),
            nombre: "Asuntos",
          };

          this.enlacesTarjetaResumen.push(pruebaTarjeta);
        }

        if (this.showAbogadoContrario == true) {
          // Comprobar si esta activada la Tarjeta
          pruebaTarjeta = {
            label: "justiciaGratuita.oficio.designas.contrarios.abogado",
            value: document.getElementById("DivIdAbogado"),
            nombre: "Abogados",
          };

          this.enlacesTarjetaResumen.push(pruebaTarjeta);
        }

        if (this.showProcuradorContrario == true) {
          // Comprobar si esta activada la Tarjeta
          pruebaTarjeta = {
            label: "justiciaGratuita.oficio.designas.contrarios.procurador",
            value: document.getElementById("procuradorJusticiable"),
            nombre: "Procuradores",
          };

          this.enlacesTarjetaResumen.push(pruebaTarjeta);
        }
      }
    }, 5);
    this.progressSpinner = false;
  }

  datosGeneralesChange(body: JusticiableItem) {
    this.body = { ...body };
  }

  datosPersonalesChange(body: JusticiableItem) {
    this.body.idtipovia = body.idtipovia;
    this.body.direccion = body.direccion;
    this.body.numerodir = body.numerodir;
    this.body.escaleradir = body.escaleradir;
    this.body.pisodir = body.pisodir;
    this.body.puertadir = body.puertadir;
    this.body.idpaisdir1 = body.idpaisdir1;
    this.body.codigopostal = body.codigopostal;
    this.body.idprovincia = body.idprovincia;
    this.body.idpoblacion = body.idpoblacion;
    this.body.correoelectronico = body.correoelectronico;
    this.body.fax = body.fax;
    if (this.body.telefonos != null && this.body.telefonos.length > 0) {
      this.body.telefonos = [...body.telefonos];
    }
  }
}
