import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { DataTable } from "primeng/datatable";
import { ControlAccesoDto } from "../../../../../models/ControlAccesoDto";
import { SigaServices } from "../../../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { ModelosComunicacionesItem } from "../../../../../models/ModelosComunicacionesItem";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { Identifiers } from "@angular/compiler";

@Component({
  selector: "app-tarjeta-consultas",
  templateUrl: "./tarjeta-consultas.component.html",
  styleUrls: ["./tarjeta-consultas.component.scss"]
})
export class TarjetaConsultasComponent implements OnInit {
  openFicha: boolean = false;
  activacionEditar: boolean = true;
  derechoAcceso: any;
  permisos: any;
  permisosArray: any[];
  msgs: Message[];
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  datos: any = [];
  cols: any = [];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  formatos: any = [];
  sufijos: any = [];
  plantillas: any = [];
  body: ModelosComunicacionesItem = new ModelosComunicacionesItem();
  tiposEnvio: any = [];
  nuevaPlantilla: boolean = false;
  idPlantillaEnvios: string;
  idTipoEnvios: string;
  porDefecto: boolean = false;
  eliminarArray: any = [];
  showHistorico: boolean = false;
  datosInicial: any = [];

  soloLectura: boolean = false;
  isNuevo: boolean = false;
  isGuardar: boolean = false;
  progressSpinner: boolean = false;
  editar: boolean = true;
  
  @ViewChild("table") table: DataTable;
  selectedDatos;

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "perfiles",
      activa: false
    },
    {
      key: "informes",
      activa: false
    },
    {
      key: "comunicacion",
      activa: false
    },
    {
      key: "consultas",
      activa: false
    }
  ];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.getDatos();
    this.getPlantillas();

    this.sigaServices.deshabilitarEditar$.subscribe(() => {
      this.editar = false;
    });

    this.selectedItem = 10;

    this.cols = [
      {
        field: "idPlantillaEnvios",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      { field: "tipoEnvio", header: "enviosMasivos.literal.tipoEnvio" },
      {
        field: "porDefecto",
        header:
          "informesycomunicaciones.modelosdecomunicacion.ficha.porDefecto",
        width: "15%"
      }
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

    if (
      sessionStorage.getItem("soloLectura") != null &&
      sessionStorage.getItem("soloLectura") != undefined &&
      sessionStorage.getItem("soloLectura") == "true"
    ) {
      this.soloLectura = true;
    }
  }

  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevoModelo") == null) {
      this.openFicha = !this.openFicha;
      if (this.openFicha) {
        this.getDatos();
      }
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "110";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        //console.log(err);
      },
      () => {
        // if (this.derechoAcceso == 3) {
        //   this.activacionEditar = true;
        // } else if (this.derechoAcceso == 2) {
        //   this.activacionEditar = false;
        // } else {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        //   this.router.navigate(["/errorAcceso"]);
        // }
      }
    );
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onRowSelect(dato) {
    // if (!this.selectMultiple) {
    //   this.selectedDatos = [];
    // } else {
    //   return dato[0].selected = true;
    // }
    this.numSelected = this.selectedDatos.length;
    return (dato[0].selected = true);
  }
  onRowUnselect(dato) {
    this.numSelected = this.selectedDatos.length;

    // if (this.selectMultiple && !dato[0].nueva) {
    //   return (dato[0].selected = false);
    // }
  }

  getDatos() {
    if (sessionStorage.getItem("modelosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("modelosSearch"));
      let service = "modelos_detalle_plantillasEnvio";
      if (this.showHistorico) {
        service = "modelos_detalle_plantillasHist";
      }

      this.sigaServices.post(service, this.body.idModeloComunicacion).subscribe(
        result => {
          let data = JSON.parse(result.body);
          this.datos = data.plantillas;
          this.datos.map(e => {
            if (e.porDefecto == "Si") {
              e.porDefecto = true;
            } else {
              e.porDefecto = false;
            }
            return (
              (e.nueva = false),
              (e.idAntiguaPlantillaEnvios = e.idPlantillaEnvios),
              (e.idAntiguaTipoEnvios = e.idTipoEnvios)
            );
          });
          if (!this.showHistorico) {
            this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          }
        },
        error => {},
        () => {}
      );
    }
  }

  guardar(dato) {
    this.progressSpinner = true;
    let datosAux = JSON.parse(JSON.stringify(this.datos));

    datosAux.forEach(element => {
      if (element.porDefecto == true) {
        element.porDefecto = "Si";
      } else {
        element.porDefecto = "No";
      }

      if (element.nueva) {
        element.idModeloComunicacion = this.body.idModeloComunicacion;
      }
    });

    this.sigaServices
      .post("modelos_detalle_guardarPlantilla", datosAux)
      .subscribe(
        result => {
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          this.nuevaPlantilla = false;
          this.showSuccess(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.correctPlantillaGuardada"
            )
          );
          this.selectedDatos = [];
          this.progressSpinner = false;
        },
        error => {
          this.progressSpinner = false;
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.errorPlantillaGuardada"
            )
          );
          //console.log(error);
        },
        () => {
          this.getDatos();
          this.progressSpinner = false;
        }
      );

    this.isNuevo = false;
    this.selectMultiple = false;
  }

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }

  eliminar(dato) {
    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message:
        this.translateService.instant(
          "informesycomunicaciones.modelosdecomunicacion.ficha.mensajeEliminar"
        ) +
        " " +
        dato.length +
        " " +
        this.translateService.instant(
          "informesycomunicaciones.modelosdecomunicacion.ficha.informesSeleccionados"
        ),
      icon: "fa fa-trash-alt",
      accept: () => {
        this.confirmarEliminar(dato);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  confirmarEliminar(dato) {
    this.progressSpinner = true;
    this.eliminarArray = [];
    dato.forEach(element => {
      if (element.porDefecto == true) {
        element.porDefecto = "Si";
      } else {
        element.porDefecto = "No";
      }
      let objEliminar = {
        idModeloComunicacion: this.body.idModeloComunicacion,
        idPlantillaEnvios: element.idPlantillaEnvios,
        idInstitucion: this.body.idInstitucion,
        idTipoEnvios: element.idTipoEnvios,
        idAntiguaPlantillaEnvios: element.idAntiguaPlantillaEnvios,
        idAntiguaTipoEnvios: element.idAntiguaTipoEnvios,
        porDefecto: element.porDefecto
      };
      this.eliminarArray.push(objEliminar);
    });
    this.sigaServices
      .post("modelos_detalle_borrarPlantilla", this.eliminarArray)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.showSuccess(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.correctPlantillaEliminado"
            )
          );
          this.selectedDatos = [];
        },
        err => {
          this.progressSpinner = false;
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.errorPlantillaEliminado"
            )
          );
          //console.log(err);
        },
        () => {
          this.getDatos();
          this.progressSpinner = false;
        }
      );

    this.selectMultiple = false;
  }

  getTipoEnvios(idPlantillaEnvios) {
    this.sigaServices
      .post("modelos_detalle_tipoEnvioPlantilla", idPlantillaEnvios)
      .subscribe(
        data => {
          for (let dato of this.datos) {
            if (dato.idPlantillaEnvios == idPlantillaEnvios) {
              dato.tipoEnvio = JSON.parse(data["body"]).tipoEnvio;
              dato.idTipoEnvios = JSON.parse(data["body"]).idTipoEnvios;
            }
          }
        },
        err => {
          //console.log(err);
        }
      );
  }

  getHistorico(key) {
    if (key == "visible") {
      this.showHistorico = true;
    } else if (key == "hidden") {
      this.showHistorico = false;
    }
    this.getDatos();
  }

  onChangeTipoEnvio(e) {}

  getPlantillas() {
    this.sigaServices.get("modelos_detalle_plantillasComunicacion").subscribe(
      data => {
        this.plantillas = data.combooItems;
        // this.plantillas.unshift({ label: "Seleccionar", value: "" });
      },
      err => {
        //console.log(err);
      },
      () => {}
    );
  }

  addPlantilla() {
    let newPlantilla = {
      idPlantillaEnvios: "",
      tipoEnvio: "",
      idTipoEnvios: "",
      porDefecto: false,
      nueva: true
    };
    this.idPlantillaEnvios = "";
    this.nuevaPlantilla = true;
    this.datos.push(newPlantilla);
    this.datos = [...this.datos];

    // Controlamos que solo se puedan añadir filas de una en una, una vez guardada la anterior
    this.isNuevo = !this.isNuevo;
    this.isGuardar = true;

    this.selectedDatos = [];
    this.selectMultiple = false;
  }

  onChangePlantilla(e) {
    let idPlantillaEnvios = e.value;
    if (idPlantillaEnvios == "") {
      for (let dato of this.datos) {
        if (
          !dato.idPlantillaEnvios &&
          dato.idPlantillaEnvios == idPlantillaEnvios
        ) {
          dato.idPlantillaEnvios = idPlantillaEnvios;
          dato.tipoEnvio = "";
        }
      }

      this.isGuardar = true;
    } else {
      this.getTipoEnvios(idPlantillaEnvios);
      this.isGuardar = false;
    }

    this.selectedDatos = [];
  }

  // onChangePorDefecto(e) {

  //   //console.log(e)
  //   if (e == true) {
  //     this.porDefecto = 'Si';
  //   } else {
  //     this.porDefecto = 'No';
  //   }
  // }
  onChangePorDefecto(e, dato) {
    if (dato.fechaBaja == null || dato.fechaBaja == "") {
      if (e == true) {
        this.datos.forEach(element => {
          if (element.fechaBaja == null || element.fechaBaja == "") {
            if (element != dato) {
              element.porDefecto = false;
            } else {
              element.porDefecto = true;
            }
          }
        });
      }
    } else {
      dato.porDefecto = false;
      e = false;
    }

    this.selectedDatos = [];
  }

  restablecer() {
    this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    this.nuevaPlantilla = false;
    this.isNuevo = false;
    this.selectMultiple = false;
    this.selectedDatos = [];
    this.numSelected = 0;
    this.showHistorico = false;
  }
}
