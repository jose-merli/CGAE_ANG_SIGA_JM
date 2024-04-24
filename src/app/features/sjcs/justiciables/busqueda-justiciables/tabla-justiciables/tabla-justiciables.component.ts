import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataTable } from "primeng/primeng";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { EJGItem } from "../../../../../models/sjcs/EJGItem";
import { FichaSojItem } from "../../../../../models/sjcs/FichaSojItem";
import { JusticiableBusquedaItem } from "../../../../../models/sjcs/JusticiableBusquedaItem";
import { JusticiableItem } from "../../../../../models/sjcs/JusticiableItem";

@Component({
  selector: "app-tabla-justiciables",
  templateUrl: "./tabla-justiciables.component.html",
  styleUrls: ["./tabla-justiciables.component.scss"],
})
export class TablaJusticiablesComponent implements OnInit {
  rowsPerPage: any = [];
  cols;
  msgs;
  initDatos;

  selectedItem: number = 10;
  selectedDatos = [];
  numSelected = 0;
  historico: boolean = false;
  nuevoRepresentante: boolean = false;
  seleccion: boolean = false;
  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;
  showLink: boolean = true;

  buscadores = [];
  first = 0;

  //Resultados de la busqueda
  @Input() datos;
  @Input() modoRepresentante;
  @Input() nuevoInteresado;
  @Input() nuevoContrario;
  @Input() nuevoAsistido;
  @Input() nuevoContrarioAsistencia;
  @Input() nuevaUniFamiliar;
  @Input() nuevoContrarioEJG;
  @Input() nuevoSOJ;
  //searchServiciosTransaccion: boolean = false;

  @ViewChild("table") tabla: DataTable;

  @Output() searchHistoricalSend = new EventEmitter<boolean>();

  constructor(private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef, private router: Router, private sigaServices: SigaServices, private persistenceService: PersistenceService, private location: Location) {}

  ngOnInit() {
    if (sessionStorage.getItem("origin") == "newRepresentante") {
      this.nuevoRepresentante = true;
    }

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    if (this.nuevoInteresado || this.nuevoContrario || this.nuevoSOJ || this.nuevoAsistido || this.nuevoContrarioAsistencia || this.nuevoContrarioEJG || this.nuevaUniFamiliar || this.nuevoRepresentante) {
      this.showLink = false;
    }

    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.first = paginacion.paginacion;
      this.selectedItem = paginacion.selectedItem;
    }

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify(this.datos));
  }

  openTab(evento) {
    //Si hemos accedido desde algún asunto no accedemos a la ficha del justiciable
    if (!this.nuevoInteresado && !this.nuevoContrario && !this.nuevoSOJ && !this.nuevoAsistido && !this.nuevoContrarioAsistencia && !this.nuevoContrarioEJG && !this.nuevaUniFamiliar && !this.nuevoRepresentante) {
      //Si hemos accedido desde el menú de justiciables accedemos a la ficha
      if (!this.modoRepresentante) {
        this.persistenceService.clearDatos();
        this.persistenceService.setDatos(evento);
        this.persistenceService.clearBody();
      } else {
        this.persistenceService.clearBody();
        this.persistenceService.setBody(evento);
      }
      sessionStorage.setItem("vieneDeFichaJusticiable", "true");
      this.router.navigate(["/gestionJusticiables"]);
    }
  }

  checkInteresado(justiciable) {
    let interesados: any = sessionStorage.getItem("interesados");
    if (interesados != "" && interesados != "undefined") interesados = JSON.parse(interesados);
    let exist = false;

    let filtros: JusticiableBusquedaItem = new JusticiableBusquedaItem();

    if (this.persistenceService.getFiltrosAux() != undefined) {
      filtros = this.persistenceService.getFiltrosAux();
    } else filtros = this.persistenceService.getFiltros();

    if (interesados == "" || filtros.idRol == "1" || interesados == "undefined") exist = false;
    else {
      //Comprobamos que el justiciable no esta ya en la designacion
      interesados.forEach((element) => {
        if (element.idPersona == justiciable.idpersona) exist = true;
      });
    }

    return !exist;
  }

  insertInteresado(justiciable) {
    this.progressSpinner = true;

    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));

    let request = [designa.idInstitucion, justiciable.idpersona, designa.ano, designa.idTurno, designa.numero];
    this.sigaServices.post("designaciones_insertInteresado", request).subscribe(
      (data) => {
        sessionStorage.removeItem("origin");
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        //this.router.navigate(["/fichaDesignaciones"]);
        this.location.back();
      },
      (err) => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      },
    );
  }

  checkUniFamiliar(justiciable) {
    let datosFamiliares: any = sessionStorage.getItem("datosFamiliares");
    let exist = false;
    if (datosFamiliares != null && datosFamiliares != undefined && datosFamiliares != "" && datosFamiliares != "undefined") {
      datosFamiliares = JSON.parse(datosFamiliares);
      //Comprobamos que el justiciable no esta ya en la designacion
      datosFamiliares.forEach((element) => {
        if (element.uf_idPersona == justiciable.idpersona && element.fechaBaja == null) {
          exist = true;
        }
      });
    }

    return !exist;
  }

  insertUniFamiliar(justiciable) {
    this.progressSpinner = true;
    let ejg: EJGItem = this.persistenceService.getDatosEJG();
    let request = [ejg.idInstitucion, justiciable.idpersona, ejg.annio, ejg.tipoEJG, ejg.numero];
    this.sigaServices.post("gestionejg_insertFamiliarEJG", request).subscribe(
      (data) => {
        sessionStorage.removeItem("origin");
        //Para que se abra la tarjeta de unidad familiar y se haga scroll a ella
        sessionStorage.setItem("tarjeta", "unidadFamiliar");
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.router.navigate(["/gestionEjg"]);
      },
      (err) => {
        if (err != undefined && JSON.parse(err.error).error != null) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      },
    );
  }

  checkContrario(justiciable) {
    let contrarios: any = sessionStorage.getItem("contrarios");
    let exist = false;
    if (contrarios != "") contrarios = JSON.parse(contrarios);

    if (contrarios == "") exist = false;
    else {
      //Comprobamos que el justiciable no esta ya en la designacion
      contrarios.forEach((element) => {
        if (element.idPersona == justiciable.idpersona) exist = true;
      });
    }

    return !exist;
  }

  insertContrario(justiciable) {
    this.progressSpinner = true;

    let designa: any = JSON.parse(sessionStorage.getItem("designaItemLink"));

    let request = [designa.idInstitucion, justiciable.idpersona, designa.ano, designa.idTurno, designa.numero];
    this.sigaServices.post("designaciones_insertContrario", request).subscribe(
      (data) => {
        sessionStorage.removeItem("origin");
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        //this.router.navigate(["/fichaDesignaciones"]);
        this.location.back();
      },
      (err) => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      },
    );
  }

  asociarSOJ(justiciable: JusticiableItem) {
    let itemSojJusticiable = new FichaSojItem();
    if (sessionStorage.getItem("sojAsistido")) {
      let itemSoj = JSON.parse(sessionStorage.getItem("sojAsistido"));
      itemSojJusticiable.anio = itemSoj.anio;
      itemSojJusticiable.idTipoSoj = itemSoj.idTipoSoj;
      itemSojJusticiable.numero = itemSoj.numero;
      itemSojJusticiable.actualizaDatos = "S"; // Ya viene creado.
      itemSojJusticiable.justiciable = justiciable; // Justiciable Para Asociar.
      //sessionStorage.removeItem("sojAsistido");
    }
    if (itemSojJusticiable != undefined || itemSojJusticiable != null) {
      this.sigaServices.post("gestionSoj_asociarSOJ", itemSojJusticiable).subscribe(
        (data) => {
          let result = JSON.parse(data["body"]);
          if (result.error) {
            this.showMessage("error", this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.showMessage("success", this.translateService.instant("general.message.accion.realizada"), "");
            //this.router.navigate(["/fichaAsistencia"]);
            this.location.back();
          }
        },
        (err) => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        },
      );
    }
  }

  asociarAsistido(justiciable: JusticiableItem) {
    let idAsistencia = sessionStorage.getItem("asistenciaAsistido");
    if (idAsistencia) {
      this.sigaServices.postPaginado("busquedaGuardias_asociarAsistido", "?anioNumero=" + idAsistencia + "&actualizaDatos='S'", justiciable).subscribe(
        (data) => {
          let result = JSON.parse(data["body"]);
          if (result.error) {
            this.showMessage("error", this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.showMessage("success", this.translateService.instant("general.message.accion.realizada"), "");
            //this.router.navigate(["/fichaAsistencia"]);
            this.location.back();
          }
        },
        (err) => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        },
      );
    }
  }

  asociarContrarioAsistencia(justiciable: JusticiableItem) {
    let idAsistencia = sessionStorage.getItem("idAsistencia");
    let justiciables: JusticiableItem[] = [];
    justiciables.push(justiciable);
    if (idAsistencia) {
      this.sigaServices.postPaginado("busquedaGuardias_asociarContrario", "?anioNumero=" + idAsistencia, justiciables).subscribe(
        (data) => {
          let result = JSON.parse(data["body"]);
          if (result.error) {
            this.showMessage("error", this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.showMessage("success", this.translateService.instant("general.message.accion.realizada"), "");
            this.location.back();
            //this.router.navigate(["/fichaAsistencia"]);
          }
        },
        (err) => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        },
      );
    }
  }

  checkContrarioEJG(justiciable) {
    let contrarios: any = sessionStorage.getItem("contrariosEJG");
    let exist = false;
    if (contrarios != "") contrarios = JSON.parse(contrarios);

    if (contrarios == "") exist = false;
    else {
      //Comprobamos que el justiciable no esta ya en la designacion
      contrarios.forEach((element) => {
        if (element.idPersona == justiciable.idpersona) exist = true;
      });
    }

    return !exist;
  }

  insertContrarioEJG(justiciable) {
    this.progressSpinner = true;

    let ejg: EJGItem = JSON.parse(sessionStorage.getItem("EJGItem"));

    let request = [justiciable.idpersona, ejg.annio, ejg.tipoEJG, ejg.numero];
    this.sigaServices.post("gestionejg_insertContrarioEJG", request).subscribe(
      (data) => {
        sessionStorage.removeItem("origin");
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        //this.router.navigate(["/fichaDesignaciones"]);
        this.location.back();
      },
      (err) => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      },
    );
  }

  getCols() {
    this.cols = [
      { field: "nif", header: "censo.fichaCliente.literal.identificacion", width: "10%" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre.apellidos", width: "20%" },
      { field: "fechaModificacion", header: "censo.datosDireccion.literal.fechaModificacion", width: "10%" },
      { field: "asuntos", header: "justiciaGratuita.justiciables.literal.asuntos", width: "30%" },
    ];

    this.cols.forEach((element) => {
      this.buscadores.push("");
    });

    this.rowsPerPage = [
      {
        label: 10,
        value: 10,
      },
      {
        label: 20,
        value: 20,
      },
      {
        label: 30,
        value: 30,
      },
      {
        label: 40,
        value: 40,
      },
    ];
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }

  clear() {
    this.msgs = [];
  }

  // Quitar seleccion de Fila.
  actualizaSeleccionados(selectedDatos) {
    if (selectedDatos != null && selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
    }
    this.seleccion = false;
  }

  // Seleccionar Fila para Asociar a Designas, EJG o Asistencias.
  asociarJusticiable(selectedDatos) {
    let paginacion = {
      paginacion: this.tabla.first,
      selectedItem: this.selectedItem,
    };
    this.persistenceService.setPaginacion(paginacion);
    // Asociar para Interesados.
    if (this.nuevoInteresado) {
      if (this.checkInteresado(selectedDatos)) {
        this.insertInteresado(selectedDatos);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.interesados.existente"));
      }
      // Asociar para Contrarios.
    } else if (this.nuevoContrario) {
      if (this.checkContrario(selectedDatos)) {
        this.insertContrario(selectedDatos);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.existente"));
      }
      // Asociar para SOJ
    } else if (this.nuevoSOJ) {
      this.asociarSOJ(selectedDatos);
      // Asociar para Asistido
    } else if (this.nuevoAsistido) {
      this.asociarAsistido(selectedDatos);
      // Asociar para Nuevo Contrario Asistencia
    } else if (this.nuevoContrarioAsistencia) {
      if (this.checkContrario(selectedDatos)) {
        this.asociarContrarioAsistencia(selectedDatos);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.existente"));
      }
      // Asociar para Nuevo Contrario EJG
    } else if (this.nuevoContrarioEJG) {
      if (this.checkContrarioEJG(selectedDatos)) {
        this.insertContrarioEJG(selectedDatos);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.existente"));
      }
    }
    // Asociar para Nueva Unidad Familiar
    else if (this.nuevaUniFamiliar) {
      if (this.checkUniFamiliar(selectedDatos)) {
        this.insertUniFamiliar(selectedDatos);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.uniFamiliar.existente"));
      }
    }
    // Asociar para Nuevo Representante
    else if (this.nuevoRepresentante) {
      this.persistenceService.clearBody();
      this.persistenceService.setBody(selectedDatos);
      //sessionStorage.setItem("newRepresentante",JSON.stringify(evento));
      //this.router.navigate(["/gestionJusticiables"]);
      if (sessionStorage.getItem("fichaJust") != null) {
        sessionStorage.setItem("origin", sessionStorage.getItem("fichaJust"));
        sessionStorage.removeItem("fichaJust");
      }
      this.location.back();
    } else {
      let filtros: JusticiableBusquedaItem = new JusticiableBusquedaItem();
      if (filtros.idRol == "2") {
        let fichasPosibles = this.persistenceService.getFichasPosibles();
        fichasPosibles[6].activa = true;
        fichasPosibles[7].activa = true;
        this.persistenceService.setFichasPosibles(fichasPosibles);
      }
    }
  }
}
