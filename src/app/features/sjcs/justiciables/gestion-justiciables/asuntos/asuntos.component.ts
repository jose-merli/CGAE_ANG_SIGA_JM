import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { CommonsService } from "../../../../../_services/commons.service";
import { OldSigaServices } from "../../../../../_services/oldSiga.service";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { EJGItem } from "../../../../../models/sjcs/EJGItem";
import { FichaSojItem } from "../../../../../models/sjcs/FichaSojItem";
import { JusticiableItem } from "../../../../../models/sjcs/JusticiableItem";
import { procesos_ejg } from "../../../../../permisos/procesos_ejg";
import { procesos_guardia } from "../../../../../permisos/procesos_guarida";
import { procesos_oficio } from "../../../../../permisos/procesos_oficio";
import { procesos_soj } from "../../../../../permisos/procesos_soj";
import { SigaStorageService } from "../../../../../siga-storage.service";

@Component({
  selector: "app-asuntos",
  templateUrl: "./asuntos.component.html",
  styleUrls: ["./asuntos.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AsuntosComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = true;
  @Input() showTarjeta: boolean = false;
  @Input() body: JusticiableItem;
  @Output() bodyChange = new EventEmitter<JusticiableItem>();
  @Output() notificacion = new EventEmitter<any>();

  selectMultiple: boolean = false;
  seleccion: boolean = false;
  progressSpinner: boolean = false;
  permisoDesigna: boolean = false;
  permisoAsistencia: boolean = false;
  permisoSOJ: boolean = false;
  permisoEJG: boolean = false;

  datos = [];
  cols = [];
  rowsPerPage: any = [];
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;

  constructor(private changeDetectorRef: ChangeDetectorRef, private sigaServices: SigaServices, private commonsService: CommonsService, private translateService: TranslateService, private sigaStorageService: SigaStorageService, private persistenceService: PersistenceService, private router: Router, private datepipe: DatePipe, public oldSigaServices: OldSigaServices) {}

  ngOnInit() {
    this.progressSpinner = true;
    this.getCols();
    this.checkPermisosAsuntos();
    this.search();
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  // Crear EJG
  crearEJG() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("justiciable", JSON.stringify(this.body));
      this.router.navigate(["/gestionEjg"]);
    }
  }

  // Crear una nueva designación.
  crearDesignacion() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("justiciable", JSON.stringify(this.body));
      sessionStorage.setItem("nombreInteresado", this.body.apellidos + " " + this.body.nombre);
      sessionStorage.setItem("deJusticiableANuevaDesigna", "true");
      sessionStorage.setItem("nuevaDesigna", "true");
      this.router.navigate(["/fichaDesignaciones"]);
    }
  }

  // Crear Asistencia
  crearAsistencia() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("justiciable", JSON.stringify(this.body));
      sessionStorage.setItem("nombreInteresado", this.body.apellidos + " " + this.body.nombre);
      sessionStorage.setItem("nuevaAsistencia", "true");
      this.router.navigate(["/fichaAsistencia"]);
    }
  }

  // Crear SOJ
  crearSOJ() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      let justiciable = JSON.stringify(this.body);
      sessionStorage.setItem("justiciable", justiciable);
      sessionStorage.setItem("nuevoSOJ", "true");
      this.router.navigate(["/detalle-soj"]);
    }
  }

  // Asociar EJG
  asociarEJG() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("justiciable", JSON.stringify(this.body));
      sessionStorage.setItem("radioTajertaValue", "ejg");
      this.router.navigate(["/busquedaAsuntos"]);
    }
  }

  // Asociar Designacion
  asociarDesignacion() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("justiciable", JSON.stringify(this.body));
      sessionStorage.setItem("radioTajertaValue", "des");
      this.router.navigate(["/busquedaAsuntos"]);
    }
  }

  // Asociar Asistencia
  asociarAsistencia() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("justiciable", JSON.stringify(this.body));
      sessionStorage.setItem("radioTajertaValue", "asi");
      this.router.navigate(["/busquedaAsuntos"]);
    }
  }

  // Asociar SOJ
  asociarSOJ() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      sessionStorage.setItem("justiciable", JSON.stringify(this.body));
      sessionStorage.setItem("radioTajertaValue", "soj");
      this.router.navigate(["/busquedaAsuntos"]);
    }
  }

  openTab(dato) {
    this.progressSpinner = true;
    let identificador = dato.tipo;
    switch (identificador) {
      case "A":
        sessionStorage.setItem("idAsistencia", dato.anio + "/" + dato.numero);
        sessionStorage.setItem("justiciable", JSON.stringify(this.body));
        this.router.navigate(["/fichaAsistencia"]);
        break;
      case "D":
        let ano = "D" + dato.anio + "/" + dato.codigo;
        let request = [ano, dato.clave, dato.numero];
        this.sigaServices.post("designaciones_busquedaDesignacionActual", request).subscribe((data) => {
          let designacion = JSON.parse(data.body);
          designacion.anio = designacion.ano;
          designacion.fechaEntradaInicio = this.datepipe.transform(new Date(designacion.fechaEntradaInicio), "dd/MM/yyyy");
          designacion.ano = "D" + designacion.anio + "/" + designacion.codigo;
          sessionStorage.setItem("justiciable", JSON.stringify(this.body));
          sessionStorage.setItem("designaItemLink", JSON.stringify(designacion));
          sessionStorage.setItem("nuevaDesigna", "false");
          this.router.navigate(["/fichaDesignaciones"]);
        });
        break;
      case "E":
        let ejgItem = new EJGItem();
        ejgItem.annio = dato.anio;
        ejgItem.numero = dato.numero;
        ejgItem.idInstitucion = dato.idinstitucion;
        ejgItem.tipoEJG = dato.clave;

        // al no poder obtener todos los datos del EJG necesarios para obtener su informacion
        //se hace una llamada a al base de datos pasando las claves primarias y obteniendo los datos necesarios
        this.sigaServices.post("gestionejg_datosEJG", ejgItem).subscribe(
          (n) => {
            this.progressSpinner = false;
            let error = JSON.parse(n.body).error;
            if (error != null && error.description != null) {
              this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
            } else {
              sessionStorage.setItem("justiciable", JSON.stringify(this.body));
              let result = JSON.parse(n.body).ejgItems;
              this.persistenceService.setDatosEJG(result[0]);
              this.router.navigate(["/gestionEjg"]);
            }
          },
          (err) => {
            this.progressSpinner = false;
          },
        );
        break;
      case "S":
        let us = this.oldSigaServices.getOldSigaUrl("detalleSOJ") + "?idInstitucion=" + dato.idinstitucion + "&anio=" + dato.anio + "&numero=" + dato.numero + "&idTipoSoj=" + dato.clave;
        sessionStorage.setItem("url", encodeURI(us));
        sessionStorage.removeItem("reload");
        sessionStorage.setItem("reload", "si");
        let detalleSOJ: any = new FichaSojItem();
        detalleSOJ.numero = dato.numero;
        detalleSOJ.idInstitucion = dato.idinstitucion;
        detalleSOJ.anio = dato.anio;
        detalleSOJ.idTipoSoj = dato.clave;
        detalleSOJ.idTurno = dato.idturno;
        detalleSOJ.idPersona = dato.idpersonajg;
        detalleSOJ.idGuardia = dato.idGuardia;
        sessionStorage.setItem("justiciable", JSON.stringify(this.body));
        sessionStorage.setItem("sojItemLink", JSON.stringify(detalleSOJ));
        this.router.navigate(["/detalle-soj"]);
        break;
      default:
        //Introducir en la BBDD
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No se puede abrir el Tipo de Asunto, es incorrecto.");
        break;
    }
  }

  private checkPermisosAsuntos() {
    //PermisoEJG
    this.commonsService
      .checkAcceso(procesos_ejg.ejg)
      .then((respuesta) => {
        this.permisoEJG = respuesta;
      })
      .catch((error) => console.error(error));

    //permisoDesigna
    this.commonsService
      .checkAcceso(procesos_oficio.designa)
      .then((respuesta) => {
        this.permisoDesigna = respuesta;
      })
      .catch((error) => console.error(error));

    //permisoAsistencia
    this.commonsService
      .checkAcceso(procesos_guardia.asistencias)
      .then((respuesta) => {
        this.permisoAsistencia = respuesta;
      })
      .catch((error) => console.error(error));

    //permisoSOJ
    this.commonsService
      .checkAcceso(procesos_soj.detalleSOJ)
      .then((respuesta) => {
        this.permisoSOJ = respuesta;
      })
      .catch((error) => console.error(error));
  }

  private search() {
    if (this.body.idpersona != undefined) {
      this.sigaServices.post("gestionJusticiables_searchAsuntosJusticiable", this.body.idpersona).subscribe(
        (n) => {
          this.datos = JSON.parse(n.body).asuntosJusticiableItems;
          //Actualiza 'ultimo asunto' y 'numero total de asuntos', mostrados en tarjeta 'Asuntos' cerrada (tanto en la carga inicial de la pantalla como al añadir asuntos)
          if (this.datos && this.datos.length) {
            this.body.ultimoAsunto = this.datos[0].asunto;
            this.body.numeroAsuntos = this.datos.length.toString();
            this.bodyChange.emit(this.body);
          }
          this.progressSpinner = false;
        },
        (err) => {
          this.progressSpinner = false;
        },
      );
    }
  }

  private showMessage(severity, summary, msg) {
    this.notificacion.emit({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }

  private getCols() {
    //if (this.fromJusticiable) fieldRol = "rol"; headerRol = "administracion.usuarios.literal.rol"; widthRol = "5%";
    //fieldRol = "interesado"; headerRol = "justiciaGratuita.justiciables.literal.interesados"; widthRol = "25%";

    this.cols = [
      { field: "asunto", header: "justiciaGratuita.justiciables.literal.asuntos", width: "6%" },
      { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "5%" },
      { field: "turnoGuardia", header: "justiciaGratuita.justiciables.literal.turnoGuardiaTarjAsuntos", width: "10%" },
      { field: "nColegiado", header: "justiciaGratuita.justiciables.literal.numColegiado", width: "4%" },
      { field: "letrado", header: "justiciaGratuita.justiciables.literal.colegiado", width: "14%" },
      { field: "interesado", header: "justiciaGratuita.justiciables.literal.interesados", width: "25%" }, //puede cambiar
      { field: "datosInteres", header: "justiciaGratuita.justiciables.literal.datosInteres", width: "20%" },
      { field: "numProcedimiento", header: "justiciaGratuita.justiciables.literal.numprocedimiento", width: "8%" },
    ];

    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 },
    ];
  }
}
