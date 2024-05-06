import { DatePipe, Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { CommonsService } from "../../../../_services/commons.service";
import { PersistenceService } from "../../../../_services/persistence.service";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { FichaSojItem } from "../../../../models/sjcs/FichaSojItem";
import { procesos_soj } from "../../../../permisos/procesos_soj";

@Component({
  selector: "app-detalle-soj",
  templateUrl: "./detalle-soj.component.html",
  styleUrls: ["./detalle-soj.component.scss"],
})
export class DetalleSOJComponent implements OnInit {
  progressSpinner: boolean = false;
  msgs: any[];

  permisoDatosGenerales: boolean;
  permisoServiciosTramitacion: boolean;
  permisoSolicitante: boolean;
  permisoDocumentacion: boolean;
  modoEdicion: boolean;

  // Datos tarjeta resumen
  iconoTarjetaResumen = "clipboard";
  datosTarjetaResumen = [];
  enlacesTarjetaResumen = [];

  // Apertura y cierre de tarjetas
  manuallyOpened: boolean;
  openTarjetaDatosGenerales: boolean = true;
  openTarjetaComision: boolean = false;
  openTarjetaConfiguracion: boolean = false;
  openTarjetaUsoFicheros: boolean = false;
  openTarjetaUsosSufijos: boolean = false;

  // Parametros de entrada a la ficha
  paramsSoj;

  // Datos de la ficha
  body: FichaSojItem = new FichaSojItem();
  datosJusticiables;
  showTargetDatosGenerales;
  showTargetServiciosTramitacion;
  showTargetSolicitante;
  showTargetDocumentacion;
  permisoEscritura;
  nuevoSOJ: boolean = false;

  camposResumen = [
    {
      label: "Año/Número",
      value: "",
      key: "1",
    },
    {
      label: "Tipo SOJ",
      value: "",
      key: "2",
    },
    {
      label: "Fecha Apertura",
      value: "",
      key: "3",
    },
    {
      label: "Tipo SOJ Colegio",
      value: "",
      key: "4",
    },
  ];

  constructor(private location: Location, private route: ActivatedRoute, private router: Router, private sigaServices: SigaServices, private translateService: TranslateService, private commonsService: CommonsService, private datepipe: DatePipe, private persistenceService: PersistenceService) {}

  /**
   * Query params: ?idInstitucion=1&anio=2&numero=3&idTipoSoj=4
   */
  ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("nuevoSOJ")) {
      this.nuevoSOJ = true;
    }

    // Comprobar Permiso SOJ (IDPROCESO....)
    this.commonsService
      .checkAcceso(procesos_soj.detalleSOJ)
      .then((respuesta) => {
        this.permisoEscritura = respuesta;

        // Permisos Escritura
        if (this.permisoEscritura != undefined) {
          this.checkAccesoTarjetasSOJ();
          // Obtener Datos SOJ
          if (!sessionStorage.getItem("nuevoSOJ")) {
            if (sessionStorage.getItem("sojItemLink")) {
              this.paramsSoj = JSON.parse(sessionStorage.getItem("sojItemLink"));
            }
            if (sessionStorage.getItem("numeroNuevoSOJ")) {
              this.body.numSoj = sessionStorage.getItem("numeroNuevoSOJ");
            }
            if (this.paramsSoj) {
              this.getDatosDetalleSoj(this.paramsSoj);
            } else {
              this.progressSpinner = false;
              this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            }
          } else {
          }
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
          this.progressSpinner = false;
          this.router.navigate(["/errorAcceso"]);
        }
      })
      .catch((error) => console.error(error));

    this.testPermisos();

    if (sessionStorage.getItem("justiciable") || sessionStorage.getItem("justiciableSOJ")) {
      this.body = new FichaSojItem();
      if (sessionStorage.getItem("justiciable")) {
        this.datosJusticiables = JSON.parse(sessionStorage.getItem("justiciable"));
        this.body.idPersonaJG = this.datosJusticiables.idpersona;
        sessionStorage.removeItem("justiciable");
      } else if (sessionStorage.getItem("justiciableSOJ")) {
        let justiciable = JSON.parse(sessionStorage.getItem("justiciableSOJ"));
        this.body.idPersonaJG = justiciable.idpersona;
        sessionStorage.removeItem("justiciableSOJ");
      }
    }
    this.progressSpinner = false;
  }

  checkAccesoTarjetasSOJ() {
    let recibidos = 0; //Determina cuantos servicios de los permisos se han terminado
    this.commonsService
      .checkAcceso(procesos_soj.datosGenerales)
      .then((respuesta) => {
        this.showTargetDatosGenerales = respuesta;
        recibidos++;
        if (recibidos == 4) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_soj.datosTramitacion)
      .then((respuesta) => {
        this.showTargetServiciosTramitacion = respuesta;
        recibidos++;
        if (recibidos == 4) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_soj.datosSolicitante)
      .then((respuesta) => {
        this.showTargetSolicitante = respuesta;
        recibidos++;
        if (recibidos == 4) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));

    this.commonsService
      .checkAcceso(procesos_soj.datosDocumentacion)
      .then((respuesta) => {
        this.showTargetDocumentacion = respuesta;
        recibidos++;
        if (recibidos == 4) this.enviarEnlacesTarjeta(); // Permiso para añadir enlaces Tarjetas Resumen
      })
      .catch((error) => console.error(error));
  }

  eventRestablecerFicha(event): void {
    this.nuevoSOJ = false;
    if (event) {
      // Guardar Cambios del SOJ Datos Generales
      this.paramsSoj = event;
      // Recargar Datos Iniciales de BD
      this.getDatosDetalleSoj(this.paramsSoj);
    }
  }

  eventGuardarFicha(event): void {
    if (event.descripcionTipoSoj != undefined || event.descripcionTipoSojColegio != undefined) {
      // Rellenar Campos para Tarjeta Resumen
      if (event.descripcionTipoSoj != undefined) {
        for (let index = 0; index < this.camposResumen.length; index++) {
          // Tipo SOJ
          if (this.camposResumen[index].key === "2") {
            this.camposResumen[index].value = event.descripcionTipoSoj;
          }
        }
      }
      if (event.descripcionTipoSojColegio != undefined) {
        for (let index = 0; index < this.camposResumen.length; index++) {
          // Tipo SOJ
          if (this.camposResumen[index].key === "4") {
            this.camposResumen[index].value = event.descripcionTipoSojColegio;
          }
        }
      }
    } else {
      if (event) {
        // Guardar Cambios del SOJ Datos Generales
        let newDatosSoj = new FichaSojItem();
        newDatosSoj.anio = event.anio;
        newDatosSoj.numero = event.numero;
        newDatosSoj.idTipoSoj = event.idTipoSoj;
        newDatosSoj.fechaApertura = event.fechaApertura;
        newDatosSoj.idTipoSojColegio = event.idTipoSojColegio;
        newDatosSoj.idTipoConsulta = event.idTipoConsulta;
        newDatosSoj.idTipoRespuesta = event.idTipoRespuesta;
        newDatosSoj.descripcionConsulta = event.descripcionConsulta;
        newDatosSoj.respuestaLetrado = event.respuestaLetrado;

        // Insertar Cambios de Datos SOJ.
        this.sigaServices.post("detalleSoj_guardarDatosGenerales", newDatosSoj).subscribe(
          (n) => {
            if (n.statusText == "OK") {
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            }
            this.progressSpinner = false;
          },
          (err) => {
            this.progressSpinner = false;
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          },
          () => {
            this.progressSpinner = false;
          },
        );
      }
    }

    /*this.progressSpinner = true;
    this.guardarDatosDetalleSoj(event)
       .switchMap(result => this.getDatosDetalleSoj(this.paramsSoj))
       .subscribe(n => {
         this.progressSpinner = false;
         this.showMsg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
       }, err => {
         this.progressSpinner = false;
         this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
       });*/
  }

  getDatosDetalleSoj(params) {
    /*return this.sigaServices.post("gestionJusticiables_getDetallesSoj", params).pipe(tap(n => {
      console.log(n);
      let responseBody = JSON.parse(n.body);
      if (responseBody != undefined && responseBody.fichaSojItems != undefined && responseBody.fichaSojItems.length != 0) {
        this.body = responseBody.fichaSojItems[0];
      } else {
        throw "Error al recuperar los datos";
      }
    }));*/
    if (params.numero == null && sessionStorage.getItem("numeroNuevoSOJ")) {
      params.numero = sessionStorage.getItem("numeroNuevoSOJ");
      sessionStorage.removeItem("numeroNuevoSOJ");
    }
    this.sigaServices.post("gestionJusticiables_getDetallesSoj", params).subscribe(
      (data) => {
        let responseBody = JSON.parse(data.body);
        if (responseBody != undefined && responseBody.fichaSojItems != undefined && responseBody.fichaSojItems.length != 0) {
          this.body = responseBody.fichaSojItems[0];
          // Rellenar Campos para Tarjeta Resumen
          if (this.camposResumen != undefined) {
            this.rellenarTarjetaResumen();
          }
        }
        this.progressSpinner = false;
      },
      (err) => {
        //console.log(err);
        this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      },
      () => {
        this.progressSpinner = false;
      },
    );
  }

  asociarEJG() {
    //this.persistenceService.clearDatos();
    sessionStorage.setItem("justiciableSOJ", this.datosJusticiables);
    sessionStorage.setItem("radioTajertaValue", "ejg");
    if (sessionStorage.getItem("datosEJG")) {
      sessionStorage.removeItem("datosEJG");
    }
    if (sessionStorage.getItem("numeroNuevoSOJ")) {
      this.body.numSoj = sessionStorage.getItem("numeroNuevoSOJ");
    }
    let sojItem = JSON.stringify(this.body);
    sessionStorage.setItem("SOJ", sojItem);
    this.router.navigate(["/busquedaAsuntos"]);
  }

  crearEJG() {
    if (sessionStorage.getItem("EJGItem")) {
      sessionStorage.removeItem("EJGItem");
    }
    if (sessionStorage.getItem("datosEJG")) {
      sessionStorage.removeItem("datosEJG");
    }
    sessionStorage.setItem("justiciableSOJ", this.datosJusticiables);
    sessionStorage.setItem("Nuevo", "true");
    this.body.numSoj = sessionStorage.getItem("numeroNuevoSOJ");
    let sojItem = JSON.stringify(this.body);
    sessionStorage.setItem("SOJ", sojItem);
    this.router.navigate(["/gestionEjg"]);
  }

  rellenarTarjetaResumen() {
    // Rellenar Campos para Tarjeta Resumen
    for (let index = 0; index < this.camposResumen.length; index++) {
      // Anio/numero
      if (this.camposResumen[index].key === "1") {
        this.camposResumen[index].value = this.body.anio.toUpperCase() + "/" + this.body.numSoj.toUpperCase();
      }

      // Fecha Apertura
      if (this.camposResumen[index].key === "3") {
        this.camposResumen[index].value = this.datepipe.transform(new Date(this.body.fechaApertura), "dd/MM/yyyy");
      }
    }
  }

  guardarDatosDetalleSoj(data): Observable<any> {
    return Observable.empty().startWith(5);
  }

  showMsg(severityParam: string, summaryParam: string, detailParam: string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam,
    });
  }

  clear() {
    this.msgs = [];
  }

  backTo() {
    if (this.datosJusticiables != undefined) {
      this.persistenceService.setDatos(this.datosJusticiables);
      this.router.navigate(["/gestionJusticiables"]);
    } else {
      //this.router.navigate(['/gestion-ejg']);
      this.location.back();
    }
  }

  testPermisos() {
    this.modoEdicion = true;
    this.permisoDatosGenerales = true;
    this.permisoServiciosTramitacion = true;
    this.permisoSolicitante = true;
    this.permisoDocumentacion = true;
  }

  isOpenReceive(dato) {}
  showMessage(severityParam: string, summaryParam: string, detailParam: string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam,
    });
  }

  // Metódo para enviar los datos de enlaces que hacen referencia a las tarjetas.
  // Controlamos que tengan el permiso y la tarjeta este visible.
  enviarEnlacesTarjeta() {
    this.enlacesTarjetaResumen = [];

    let pruebaTarjeta;

    setTimeout(() => {
      if (this.showTargetDatosGenerales != undefined) {
        // Comprobar si esta activada la Tarjeta
        pruebaTarjeta = {
          label: "general.message.datos.generales",
          value: document.getElementById("datosGenerales"),
          nombre: "datosGenerales",
        };
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
      if (this.showTargetServiciosTramitacion != undefined) {
        // Comprobar si esta activada la Tarjeta
        pruebaTarjeta = {
          label: "justiciaGratuita.ejg.datosGenerales.ServiciosTramit",
          value: document.getElementById("serviciosTramitacion"),
          nombre: "serviciosdeTramitacion",
        };
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
      if (this.showTargetSolicitante != undefined) {
        // Comprobar si esta activada la Tarjeta
        pruebaTarjeta = {
          label: "justiciaGratuita.justiciables.rol.solicitante",
          value: document.getElementById("solicitante"),
          nombre: "solicitante",
        };
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
      if (this.showTargetDocumentacion != undefined) {
        // Comprobar si esta activada la Tarjeta
        pruebaTarjeta = {
          label: "justiciaGratuita.ejg.documentacion.doc",
          value: document.getElementById("documentacion"),
          nombre: "documentacion",
        };
        this.enlacesTarjetaResumen.push(pruebaTarjeta);
      }
    }, 5);
    this.progressSpinner = false;
  }
}
