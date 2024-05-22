import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
import { MultiSelect } from "primeng/primeng";
import { UpperCasePipe } from "../../../../../../../../node_modules/@angular/common";
import { CommonsService } from "../../../../../../_services/commons.service";
import { NotificationService } from "../../../../../../_services/notification.service";
import { PersistenceService } from "../../../../../../_services/persistence.service";
import { SigaServices } from "../../../../../../_services/siga.service";
import { TranslateService } from "../../../../../../commons/translate/translation.service";
import { AcreditacionesItem } from "../../../../../../models/sjcs/AcreditacionesItem";
import { AcreditacionesObject } from "../../../../../../models/sjcs/AcreditacionesObject";

@Component({
  selector: "app-tabla-acreditaciones",
  templateUrl: "./tabla-acreditaciones.component.html",
  styleUrls: ["./tabla-acreditaciones.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class TablaAcreditacionesComponent implements OnInit {
  textSelected: String = "{label}";
  id;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  cols;
  rowsPerPage;
  buscadores = [];
  datos: any[];
  listaTabla: AcreditacionesItem[] = [];
  idAcreditacion;
  disableAll: boolean = false;

  progressSpinner: boolean = false;
  body;
  nuevo: boolean = false;
  datosInicial = [];
  updateAcreditaciones = [];
  comboAcreditaciones: any[] = [];
  comboAcreditacionesNew: any[] = [];
  // selectedBefore;
  overlayVisible: boolean = false;
  selectionMode: string = "single";
  showTarjeta: boolean = true;
  maximaLong: any = 5;
  @ViewChild("porcentaje") porcentajeAct;

  //Resultados de la busqueda
  @Input() idProcedimiento;
  //Resultados de la busqueda
  @Input() modoEdicion: boolean = false;

  @ViewChild("table") table;
  @ViewChild("multiSelectPJ") multiSelect: MultiSelect;

  constructor(private changeDetectorRef: ChangeDetectorRef, private sigaServices: SigaServices, private translateService: TranslateService, private upperCasePipe: UpperCasePipe, private persistenceService: PersistenceService, private commonsService: CommonsService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.getCols();

    if (this.idProcedimiento != undefined) {
      this.modoEdicion = true;
      this.getAcreditaciones();
      this.getComboAcreditaciones();
    } else {
      this.modoEdicion = false;
    }

    let datos = this.persistenceService.getDatos();
    if (datos != undefined) {
      if (datos.fechabaja != undefined) {
        this.disableAll = true;
      }
    }

    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getCols();

    if (this.idProcedimiento != undefined) {
      this.modoEdicion = true;
      this.getAcreditaciones();
      this.getComboAcreditaciones();
    } else {
      this.modoEdicion = false;
    }

    let datos = this.persistenceService.getDatos();
    if (this.datos != undefined) {
      if (datos.fechabaja != undefined) {
        this.disableAll = true;
      }
    }
    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true;
    }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  getId() {
    let seleccionados = [];
    seleccionados.push(this.selectedDatos);
    this.id = this.datos.findIndex((item) => item.idAcreditacion === seleccionados[0].idAcreditacion);
  }

  getAcreditaciones() {
    this.sigaServices.getParam("modulosybasesdecompensacion_searchAcreditaciones", "?idProcedimiento=" + this.idProcedimiento).subscribe((res) => {
      this.datos = res.acreditacionItem;
      this.listaTabla = JSON.parse(JSON.stringify(this.datos));
      this.datos.forEach((element) => {
        if (element.nig_numprocedimiento == 1) {
          element.nigProcedimiento = true;
        } else {
          element.nigProcedimiento = false;
        }
        element.porcentaje = +element.porcentaje;
        element.editable = false;
        element.overlayVisible = false;
        element.idprocedimiento = this.idProcedimiento;
      });
      this.datosInicial = JSON.parse(JSON.stringify(this.datos));
      this.progressSpinner = false;
    });
  }

  getComboAcreditaciones() {
    this.sigaServices.getParam("modulosybasesdecompensacion_comboAcreditacionesDisponibles", "?idProcedimiento=" + this.idProcedimiento).subscribe((res) => {
      this.comboAcreditacionesNew = res.combooItems;
    });

    this.sigaServices.get("modulosybasesdecompensacion_comboAcreditaciones").subscribe((res) => {
      this.comboAcreditaciones = res.combooItems;
    });
  }

  checkPermisosSave() {
    if (this.commonsService.checkPermisosService(!this.disableAll, this.disableAll)) {
      if (this.disabledSave()) {
        this.commonsService.checkPermisoAccionService();
      } else {
        this.save();
      }
    }
  }

  save() {
    this.progressSpinner = true;
    if (this.nuevo) {
      this.validatenewAcreditacion("modulosybasesdecompensacion_createAcreditacion");
    } else {
      this.body = new AcreditacionesObject();
      this.body.acreditacionItem = this.updateAcreditaciones;
      this.callSaveService("modulosybasesdecompensacion_updateAcreditacion");
    }
  }

  callSaveService(url) {
    if (this.body.acreditacionItem != undefined) {
      this.body.acreditacionItem.forEach((element) => {
        element.porcentajeReal = +element.porcentaje;
        element.porcentaje = element.porcentaje.replace(",", ".");
      });
    } else {
      this.body.porcentaje = +this.body.porcentaje.replace(",", ".");
    }

    this.sigaServices.post(url, this.body).subscribe(
      (data) => {
        if (this.nuevo) {
          this.nuevo = false;
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        }
        this.getComboAcreditaciones();
        this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      (err) => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.selectedDatos = [];
        this.updateAcreditaciones = [];
        this.progressSpinner = false;
        this.getAcreditaciones();
      },
    );
  }

  checkPermisosNewAcreditacion() {
    if (this.commonsService.checkPermisosService(!this.disableAll, this.disableAll)) {
      if (this.disabledSave()) {
        this.commonsService.checkPermisoAccionService();
      } else {
        this.newAcreditacion();
      }
    }
  }

  newAcreditacion() {
    this.nuevo = true;
    this.seleccion = false;

    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let acreditacion = {
      idAcreditacion: "",
      porcentaje: "",
      nig_numprocedimiento: "",
      nigProcedimiento: false,
      codigoext: "",
      codSubTarifa: "",
      idprocedimiento: this.idProcedimiento,
      acreditacionNueva: true,
    };

    if (this.datos.length == 0) {
      this.datos.push(acreditacion);
    } else {
      this.datos = [acreditacion, ...this.datos];
    }

    this.table.sortOrder = 0;
    this.table.sortField = "";
    this.table.reset();
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || charCode == 44) {
      return true;
    } else {
      return false;
    }
  }

  // validateAcreditacion(e) {
  //   if (this.selectedDatos == null) {
  //     this.selectedDatos = [];
  //     this.selectedDatos.push(this.datos.find(item => item.editable == true));
  //   }
  //   if (!this.nuevo) {
  //     let datoId = this.datos.findIndex(item => item.idAcreditacion === this.selectedDatos[0].idAcreditacion);
  //     let dato = this.datos[datoId];
  //     dato.porcentaje = "" + dato.porcentaje;
  //     if (dato.porcentaje.split(",").length - 1 > 1) {
  //       let partePrimera = dato.porcentaje.split(",");
  //       dato.porcentaje = partePrimera[0];
  //     }
  //     if (dato.porcentaje.includes(",")) {
  //       let partes = dato.porcentaje.split(",");
  //       let numero = + partes[0];
  //       if (partes[1].length > 2) {
  //         let segundaParte = partes[1].substring(0, 2);
  //         dato.porcentaje = partes[0] + "," + segundaParte;
  //       }
  //       if (numero >= 100) {
  //         dato.porcentaje = 100;
  //       } else if (numero < 0) {
  //         dato.porcentaje = 0;
  //       }
  //     } else {
  //       if (dato.porcentaje.length > 3) {
  //         dato.porcentaje = 100;
  //       } else {
  //         let numero = + dato.porcentaje;
  //         if (numero >= 100) {
  //           dato.porcentaje = 100;
  //         }
  //         else if (numero < 0) {
  //           dato.porcentaje = 0;
  //         }
  //       }
  //     }
  //     this.porcentajeAct.nativeElement.value = dato.porcentaje;

  //     this.editarAcreditacion(dato);

  //   } else {
  //     this.datos[0].porcentaje = "" + this.datos[0].porcentaje;
  //     if (this.datos[0].porcentaje.includes(",")) {
  //       let partes = this.datos[0].porcentaje.split(",");
  //       if (partes[1].length > 2) {
  //         let segundaParte = partes[1].substring(0, 2);
  //         this.datos[0].porcentaje = partes[0] + "," + segundaParte;
  //         // this.importe.nativeElement.value = this.modulosItem.importe;
  //       }
  //       let numero = + partes[0];
  //       if (partes[1].length > 2) {
  //         let segundaParte = partes[1].substring(0, 2);
  //         this.datos[0].porcentaje = partes[0] + "," + segundaParte;
  //       }
  //     }
  //     if (+this.datos[0].porcentaje > 100) this.datos[0].porcentaje = 100;
  //     this.porcentajeAct.nativeElement.value = this.datos[0].porcentaje;

  //   }
  // }

  validatenewAcreditacion(url) {
    let acreditacion = this.datos[0];

    this.body = acreditacion;
    this.callSaveService(url);
  }

  disabledSave() {
    if (this.nuevo) {
      if (this.datos[0].idAcreditacion != undefined && this.datos[0].idAcreditacion != "") {
        return false;
      } else {
        return true;
      }
    } else {
      if (this.updateAcreditaciones != undefined && this.updateAcreditaciones.length > 0) {
        return false;
      } else {
        return true;
      }
    }
  }

  editAreas(evento) {
    if (this.nuevo) {
      this.seleccion = false;
    } else {
      if (!this.selectAll && !this.selectMultiple) {
        this.datos.forEach((element) => {
          element.editable = false;
          element.overlayVisible = false;
        });

        evento.data.editable = true;

        this.selectedDatos = [];
        this.selectedDatos.push(evento.data);

        this.seleccion = true;
      }
    }
  }

  changeAcreditacion(dato) {
    let findDato = this.datosInicial.find((item) => item.idAcreditacion === dato.idAcreditacion);

    if (findDato != undefined) {
      if (dato.idAcreditacion != findDato.idAcreditacion) {
        let findUpdate = this.updateAcreditaciones.find((item) => item.idAcreditacion === dato.idAcreditacion);

        if (findUpdate == undefined) {
          this.updateAcreditaciones.push(dato);
        }
      }
    }
  }
  changeCodigoExt(dato) {
    let findDato = this.datosInicial.find((item) => item.idAcreditacion === dato.idAcreditacion);

    if (findDato != undefined) {
      if (dato.codigoext != findDato.codigoext) {
        let findUpdate = this.updateAcreditaciones.find((item) => item.idAcreditacion == dato.idAcreditacion);

        if (findUpdate == undefined) {
          this.updateAcreditaciones.push(dato);
        }
      }
    }
  }
  changeCodSubTarifa(dato) {
    let findDato = this.datosInicial.find((item) => item.idAcreditacion === dato.idAcreditacion);

    if (findDato != undefined) {
      if (dato.codSubTarifa != findDato.codSubTarifa) {
        let findUpdate = this.updateAcreditaciones.find((item) => item.idAcreditacion === dato.idAcreditacion);

        if (findUpdate == undefined) {
          this.updateAcreditaciones.push(dato);
        }
      }
    }
  }
  changePorcentaje(dato) {
    dato.porcentaje = dato.valorNum;

    let findDato = this.datosInicial.find((item) => item.idAcreditacion === dato.idAcreditacion);

    if (findDato != undefined) {
      if (dato.porcentaje != findDato.porcentaje) {
        let findUpdate = this.updateAcreditaciones.find((item) => item.idAcreditacion === dato.idAcreditacion);

        if (findUpdate == undefined) {
          this.updateAcreditaciones.push(dato);
        }
      }
    }
  }
  changeNigNumprocedimiento(dato) {
    let findDato = this.datosInicial.find((item) => item.idAcreditacion === dato.idAcreditacion);

    if (findDato != undefined) {
      if (dato.nigProcedimiento != findDato.nigProcedimiento) {
        let findUpdate = this.updateAcreditaciones.find((item) => item.idAcreditacion === dato.idAcreditacion);

        if (findUpdate == undefined) {
          this.updateAcreditaciones.push(dato);
        }
      }
    }
  }

  checkPermisosDelete() {
    if (this.commonsService.checkPermisosService(!this.disableAll, this.disableAll)) {
      if (this.disabledSave()) {
        this.commonsService.checkPermisoAccionService();
      } else {
        this.delete();
      }
    }
  }

  delete() {
    this.progressSpinner = true;

    this.body = new AcreditacionesObject();
    this.body.acreditacionItem = this.selectedDatos;
    this.sigaServices.post("modulosybasesdecompensacion_deleteAcreditacion", this.body).subscribe(
      (data) => {
        this.nuevo = false;
        this.selectedDatos = [];
        this.getAcreditaciones();
        this.notificationService.showSuccess(this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      (err) => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.getComboAcreditaciones();
      },
    );
  }

  checkPermisosRest() {
    if (this.commonsService.checkPermisosService(!this.disableAll, this.disableAll)) {
      this.rest();
    }
  }

  rest() {
    this.notificationService.showError(this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));

    if (this.datosInicial != undefined) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }
    this.datos.forEach((element) => {
      element.editable = false;
      element.overlayVisible = false;
    });
    this.selectedDatos = [];
    this.updateAcreditaciones = [];
    this.nuevo = false;
    this.table.sortOrder = 0;
    this.table.sortField = "";
    this.table.reset();
    this.buscadores = this.buscadores.map((it) => (it = ""));
  }

  getCols() {
    this.cols = [
      { field: "descripcion", header: "menu.justiciaGratuita.maestros.Acreditacion" },
      { field: "porcentaje", header: "menu.justiciaGratuita.maestros.porcentaje" },
      { field: "nig_numprocedimiento", header: "menu.justiciaGratuita.maestros.numProcedimiento" },
      { field: "codigoext", header: "general.codeext" },
      { field: "codSubTarifa", header: "menu.justiciaGratuita.maestros.codSubtarifa" },
    ];

    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 },
    ];
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (!this.disableAll) {
      this.selectMultiple = false;
      if (this.selectAll) {
        if (this.nuevo) this.datos.shift();
        this.nuevo = false;
        this.editElementDisabled();
        this.selectMultiple = false;
        this.selectedDatos = this.datos;
        this.numSelected = this.datos.length;
        this.selectionMode = "multiple";
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectMultiple = false;
        this.selectionMode = "single";
      }
    } else {
      this.selectionMode = undefined;
    }
  }
  editElementDisabled() {
    this.datos.forEach((element) => {
      element.editable = false;
      element.overlayVisible = false;
    });
  }
  isSelectMultiple() {
    if (!this.disableAll) {
      this.selectAll = false;
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "single";
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "multiple";
      }
    } else {
      this.selectionMode = undefined;
    }
    // this.volver();
  }

  actualizaSeleccionados(selectedDatos) {
    if (selectedDatos != undefined) this.numSelected = selectedDatos.length;
    // this.seleccion = false;
  }
}
