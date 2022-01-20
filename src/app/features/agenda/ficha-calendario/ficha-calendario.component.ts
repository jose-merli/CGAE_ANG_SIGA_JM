import { SigaServices } from "../../../_services/siga.service";
import { TreeNode } from "../../../utils/treenode";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "../../../../../node_modules/@angular/router";
import { DataTable } from "../../../../../node_modules/primeng/primeng";
import { ConfirmationService } from "primeng/api";
import { CalendarItem } from "../../../models/CalendarItem";
import { TranslateService } from "../../../commons/translate/translation.service";
import { PermisosCalendarioItem } from "../../../models/PermisosCalendarioItem";
import { PermisosCalendarioObject } from "../../../models/PermisosCalendarioObject";
import { NotificacionEventoObject } from "../../../models/NotificacionEventoObject";
import { NotificacionEventoItem } from "../../../models/NotificacionEventoItem";
import { Location } from "@angular/common";

@Component({
  selector: "app-ficha-calendario",
  templateUrl: "./ficha-calendario.component.html",
  styleUrls: ["./ficha-calendario.component.scss"]
})
export class FichaCalendarioComponent implements OnInit {
  colorSelect: string = "#1976D2";
  defaultColor = "#1976D2";
  propagateDown: boolean = true;

  treeInicial: any = [];
  profilesTree: any;
  selectedProfiles = [];
  selectProfile: boolean = false;
  selectAll: any;
  selectAllNotifications: any;

  progressSpinner: boolean = false;

  numSeleccionados: number;
  numCambios: number;
  totalProfiles: number;

  fichasPosibles = [];

  //accesos totales
  accesoTotal: number;
  accesoLectura: number;
  sinAsignar: number;

  formValido: boolean = false;
  isWidthChange: boolean = false;

  msgs = [];
  modoEdicion: boolean;

  saveCalendarFlag: boolean = false;
  calendar: CalendarItem = new CalendarItem();

  comboCalendarType;
  // map con los permisos {data, ObjectoPermisosBack}
  permisosChange: PermisosCalendarioItem[] = [];

  @ViewChild("tableNotifications")
  tableNotifications: DataTable;
  selectedDatosNotifications;
  selectMultipleNotifications: boolean = false;
  rowsPerPage: any = [];
  colsNotifications: any = [];
  datosNotificaciones = [];
  selectedNotification: number = 10;
  sortO: number = 1;
  numSelectedNotifications: number = 0;
  comboTemplates;
  comboMeasureUnit;
  comboAfterBefore;
  comboNotifyType;
  comboNotifyTypeTraining;
  pressNewNotificacion: boolean = false;
  newNotificacion: NotificacionEventoItem;
  editNotificacion: boolean = false;
  updateNotificationList: NotificacionEventoItem[] = [];
  deleteNotificacion: boolean = false;
  valorTipoCalendarioGeneral = "1";
  valorTipoCalendarioLaboral = "2";
  valorTipoCalendarioFormacion = "3";

  historico: boolean = false;
  openFicha: boolean = false;
  closeFicha: boolean = true;

  acceso: boolean = false;
  accesoHistorico: boolean = false;
  accesoSeleccionDatos: boolean = false;
  accesoCalendario: boolean = false;
  idCalendario;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private location: Location
  ) {
    this.numSeleccionados = 0;
    this.numCambios = 0;
    this.totalProfiles = 0;

    this.sigaServices.menuToggled$.subscribe(() => {
      this.isWidthChange = !this.isWidthChange;
    });
  }

  ngOnInit() {
    this.progressSpinner = true;
    sessionStorage.removeItem("modoEdicionEventoByAgenda");
    sessionStorage.removeItem("eventoEdit");

    if (sessionStorage.getItem("fichaAbierta") == "true") {
      this.getFichasEdit();
    } else {
      this.getFichas();
    }

    this.getComboCalendarType();
    this.getColsResults();

    //Comprobamos si estamos en modoEdición o en modo Nuevo
    if (sessionStorage.getItem("modoEdicion") == "true") {
      this.modoEdicion = true;
      this.idCalendario = sessionStorage.getItem("idCalendario");
      this.getCalendar(this.idCalendario);
      this.saveCalendarFlag = true;
      this.getProfiles();
      this.getCalendarNotifications();
      this.getComboNotificaciones();
    } else {
      this.modoEdicion = false;
      sessionStorage.removeItem("idCalendario");
      this.progressSpinner = false;
    }
  }

  cargarPermisos() {
    this.checkAcceso();
    this.checkAccesoHistorico();
    this.checkAccesoValidaCalendario();
    this.checkAccesoSeleccionDatos();
  }

  //FUNCIONES FICHA DATOS GENERALES

  //Función obtiene los tipos de calendarios que hay
  getComboCalendarType() {
    this.sigaServices.get("fichaCalendario_getCalendarType").subscribe(
      n => {
        this.comboCalendarType = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  //Función guarda los datos generales del calendario
  saveCalendar() {
    this.progressSpinner = true;
    let url = "";
    this.calendar.color = this.colorSelect;

    if (!this.modoEdicion) {
      url = "fichaCalendario_saveCalendar";
    } else {
      this.calendar.idCalendario = this.idCalendario;
      url = "fichaCalendario_updateCalendar";
    }

    this.sigaServices.post(url, this.calendar).subscribe(
      data => {
        this.progressSpinner = false;
        this.showSuccess();

        if (!this.modoEdicion) {
          let body = JSON.parse(data["body"]);
          this.saveCalendarFlag = true;
          if (!this.modoEdicion) {
            this.modoEdicion = true;
          }
          sessionStorage.setItem("idCalendario", body.id);
          this.getProfiles();
          this.getCalendarNotifications();
        }
      },
      err => {
        this.progressSpinner = false;
        this.saveCalendarFlag = false;
        //console.log(err);
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  getCalendar(idCalendario) {
    this.sigaServices
      .getParam("fichaCalendario_getCalendar", "?idCalendario=" + idCalendario)
      .subscribe(
        n => {
          this.calendar = n.calendar;
          this.colorSelect = this.calendar.color.toString();
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
        },
        () => {
          this.cargarPermisos();
          this.progressSpinner = false;
        }
      );
  }

  resetCalendar() {
    if (!this.modoEdicion) {
      this.calendar = new CalendarItem();
      this.colorSelect = this.defaultColor;
    } else {
      this.getCalendar(this.idCalendario);
    }
  }

  validarCalendario(): boolean {
    if (
      this.calendar.descripcion != null &&
      this.calendar.descripcion != "" &&
      (this.calendar.idTipoCalendario != null &&
        this.calendar.idTipoCalendario != "")
    ) {
      this.formValido = true;
    } else {
      this.formValido = false;
    }

    return this.formValido;
  }

  //FICHA CONFIGURACION DE PERFILES

  //Función obtienes los perfiles junto con los permisos del calendario
  getProfiles() {
    this.progressSpinner = true;
    this.sigaServices
      .getParam(
        "fichaCalendario_getProfilesPermissions",
        "?idCalendario=" + this.idCalendario
      )
      .subscribe(
        n => {
          this.profilesTree = n.permisosPerfilesCalendar;
          this.treeInicial = JSON.parse(JSON.stringify(this.profilesTree));
          this.totalProfiles = this.profilesTree.length;
          this.progressSpinner = false;

          this.accesoTotal = 0;
          this.accesoLectura = 0;
          this.sinAsignar = 0;

          this.profilesTree.forEach(node => {
            this.totalAccesosRecursive(node);
          });
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  //Funcion guarda los permisos de cada perfil
  savePermisos() {
    this.progressSpinner = true;
    let permisosCalendarioDTO = new PermisosCalendarioObject();
    permisosCalendarioDTO.permisosCalendarioItems = this.permisosChange;

    this.sigaServices
      .post("fichaCalendario_updatePermissions", permisosCalendarioDTO)
      .subscribe(
        data => {
          this.numCambios = 0;
          this.progressSpinner = false;
          this.showSuccessPermissions();
          this.treeInicial = JSON.parse(JSON.stringify(this.profilesTree));
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          this.permisosChange = [];
          this.selectedProfiles = [];
        }
      );

    this.permisosChange = [];
  }

  //Función controla los permisos seleccionados de cada perfil
  onChangeAcceso(ref) {
    if (ref && this.selectedProfiles.length > 0) {
      for (let changed of this.selectedProfiles) {
        if (ref == "sinAsignar") {
          changed.derechoacceso = "0";
        } else if (ref == "lectura") {
          changed.derechoacceso = "2";
        } else if (ref == "total") {
          changed.derechoacceso = "3";
        }

        let permisosUpdate = new PermisosCalendarioItem();
        permisosUpdate.derechoacceso = changed.derechoacceso;
        permisosUpdate.idPerfil = changed.idPerfil;
        permisosUpdate.idCalendario = this.idCalendario;

        this.permisosChange.push(permisosUpdate);
      }

      this.numSeleccionados = 0;

      this.accesoTotal = 0;
      this.accesoLectura = 0;
      this.sinAsignar = 0;

      this.profilesTree.forEach(node => {
        this.totalAccesosRecursive(node);
      });

      this.selectedProfiles = [];
      this.selectAll = false;
      this.getNumChanges();
    }
  }

  restablecerPermisos() {
    this.permisosChange = [];
    this.selectedProfiles = [];
    this.profilesTree = JSON.parse(JSON.stringify(this.treeInicial));
    this.numCambios = 0;
    this.selectProfile = false;
    this.selectAll = false;

    this.accesoTotal = 0;
    this.accesoLectura = 0;
    this.sinAsignar = 0;

    this.profilesTree.forEach(node => {
      this.totalAccesosRecursive(node);
    });
  }

  getNumChanges() {
    if (this.permisosChange.length > 0) {
      this.numCambios = this.permisosChange.length;
    } else {
      this.numCambios = 0;
    }
  }

  onNodeSelect() {
    this.propagateDown = true;
    this.selectProfile = true;
    this.getNumSelected();
  }

  onNodeUnselect() {
    this.propagateDown = true;
    this.getNumSelected();
  }

  //Función que realiza la cuenta de procesos seleccionados
  totalAccesosRecursive(node: TreeNode) {
    if (node.derechoacceso === "3") {
      this.accesoTotal++;
    } else if (node.derechoacceso === "2") {
      this.accesoLectura++;
    } else if (node.derechoacceso === "0") {
      this.sinAsignar++;
    }

    if (node.children) {
      node.children.forEach(childNode => {
        this.totalAccesosRecursive(childNode);
      });
    }
  }

  onChangeSelectAllProfiles() {
    if (this.selectAll === true) {
      this.profilesTree.forEach(node => {
        this.selectAllRecursive(node);
      });

      this.selectProfile = true;
      this.getNumSelected();
    } else {
      this.selectedProfiles = [];
      this.numSeleccionados = 0;
    }
  }

  getNumSelected() {
    this.numSeleccionados = this.selectedProfiles.length;
  }

  selectAllRecursive(node: TreeNode) {
    this.selectedProfiles.push(node);
    if (node.children) {
      node.children.forEach(childNode => {
        this.selectAllRecursive(childNode);
      });
    }
  }

  //FUNCIONES FICHA NOTIFICACIONES

  getColsResults() {
    this.colsNotifications = [
      {
        value: "nombreTipoNotificacion",
        field: "idTipoNotificacion",
        header: "formacion.datosNotificaciones.tipoNotificacion.cabecera"
      },
      {
        field: "idPlantilla",
        header: "menu.facturacion.plantillas",
        value: "nombrePlantilla"
      },
      {
        field: "tipoEnvio",
        header: "envios.plantillas.literal.tipoenvio"
      },
      {
        field: "cuando",
        header: "formacion.datosNotificaciones.cuando.cabecera"
      },
      {
        field: "idUnidadMedida",
        header: "formacion.datosNotificaciones.unidadMedida.literal",
        value: "descripcionMedida"
      },
      {
        field: "idTipoCuando",
        header: "formacion.datosNotificaciones.antesDespues.literal",
        value: "descripcionAntes"
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
    this.getCalendarNotifications();
  }

  getCalendarNotifications() {
    this.progressSpinner = true;
    this.historico = false;
    let idCalendario = sessionStorage.getItem("idCalendario");
    this.sigaServices
      .getParam(
        "fichaCalendario_getCalendarNotifications",
        "?idCalendario=" + idCalendario
      )
      .subscribe(
        n => {
          this.datosNotificaciones = n.eventNotificationItems;
          this.progressSpinner = false;

          this.datosNotificaciones.forEach(noti => {
            noti.isMod = false;
          });

          sessionStorage.setItem("datosNotificacionesInit", JSON.stringify(this.datosNotificaciones));
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }

  irEditarNotificacion(id) {
    if (id.length >= 1 && this.selectMultipleNotifications == false) {
      sessionStorage.setItem("modoEdicionNotify", "true");
      sessionStorage.removeItem("notifySelected");
      sessionStorage.setItem("notifySelected", JSON.stringify(id));
      this.router.navigate(["/editarNotificacion"]);
      sessionStorage.setItem("fichaAbierta", "true");
    } else {
      this.numSelectedNotifications = this.selectedDatosNotifications.length;
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelectedNotifications = selectedDatos.length;
  }

  onChangeRowsPerPagesNotifications(event) {
    this.selectedNotification = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableNotifications.reset();
  }

  newNotification() {
    // sessionStorage.setItem("modoEdicionNotify", "false");
    // sessionStorage.setItem("fichaAbierta", "true");
    // this.router.navigate(["/editarNotificacion"]);
    this.pressNewNotificacion = true;
    this.newNotificacion = new NotificacionEventoItem();
    this.newNotificacion.idCalendario = this.idCalendario;

    let tipoEvento;
    if (this.calendar.idTipoCalendario == this.valorTipoCalendarioGeneral) {
      tipoEvento = "General";
    } else if (this.calendar.idTipoCalendario == this.valorTipoCalendarioLaboral) {
      tipoEvento = "Laboral";
    }

    let notificacion = {
      idNotificacion: "",
      nombreTipoNotificacion: "",
      idPlantilla: "",
      idTipoNotificacion: "",
      tipoEnvio: "",
      cuando: "",
      idUnidadMedida: "",
      idTipoCuando: ""
    };

    if (tipoEvento != undefined) {
      let findTipoNotificacion = this.comboNotifyType.find(x => x.label === tipoEvento);
      this.newNotificacion.idTipoNotificacion = findTipoNotificacion.value;
      notificacion.nombreTipoNotificacion = tipoEvento;
    }

    if (this.datosNotificaciones.length == 0) {
      this.datosNotificaciones.push(notificacion);
    } else {
      this.datosNotificaciones = [notificacion, ...this.datosNotificaciones];
    }

  }

  onChangeSelectAllNotifications() {
    if (this.selectAllNotifications === true) {
      this.selectMultipleNotifications = false;
      this.selectedDatosNotifications = this.datosNotificaciones;
      this.numSelectedNotifications = this.datosNotificaciones.length;
      this.deleteNotificacion = true;

    } else {
      this.selectedDatosNotifications = [];
      this.numSelectedNotifications = 0;
      this.deleteNotificacion = false;

    }
  }

  isSelectMultipleNotifications() {
    this.selectMultipleNotifications = !this.selectMultipleNotifications;
    if (!this.selectMultipleNotifications) {
      this.selectedDatosNotifications = [];
      this.numSelectedNotifications = 0;
      this.deleteNotificacion = false;
    } else {
      this.selectAllNotifications = false;
      this.selectedDatosNotifications = [];
      this.numSelectedNotifications = 0;
    }
  }

  deleteNotification(selectedDatos) {
    this.progressSpinner = true;
    let deleteNotifications = new NotificacionEventoObject();

    selectedDatos.forEach(e => {
      let noti = new NotificacionEventoItem();
      noti = e;
      deleteNotifications.eventNotificationItems.push(noti);
    });

    this.sigaServices
      .post("fichaCalendario_deleteNotification", deleteNotifications)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.showSuccessDelete();
          this.getCalendarNotifications();
          this.selectMultipleNotifications = false;
          this.deleteNotificacion = false;
          this.numSelectedNotifications = 0;
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  confirmarBorrar(selectedDatos) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";

    if (selectedDatos.length > 1) {
      mess =
        this.translateService.instant("messages.deleteConfirmation.much") +
        selectedDatos.length +
        " " +
        this.translateService.instant("messages.deleteConfirmation.register") +
        "?";
    }
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.deleteNotification(selectedDatos);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }
  getHistoricCalendarNotifications() {
    this.progressSpinner = true;
    this.historico = true;
    let idCalendario = sessionStorage.getItem("idCalendario");
    this.sigaServices
      .getParam(
        "fichaCalendario_getHistoricCalendarNotifications",
        "?idCalendario=" + idCalendario
      )
      .subscribe(
        n => {
          this.datosNotificaciones = n.eventNotificationItems;
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  disabledNotifications() {
    if (this.selectMultipleNotifications || this.selectAllNotifications) return false;
    else return true;
  }

  getComboNotificaciones() {
    this.getComboNotifyType();
    this.getComboTemplate();
    this.getComboMeasureUnit();
    this.getComboAfterBefore();
    this.getComboNotifyTypeTraining();
  }

  getComboNotifyTypeTraining() {
    this.sigaServices.get("fichaCalendario_getNotificationTypeCalendarTraining").subscribe(
      n => {
        this.comboNotifyTypeTraining = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboNotifyType() {
    this.sigaServices.get("datosNotificaciones_getTypeNotifications").subscribe(
      n => {
        this.comboNotifyType = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboTemplate() {
    this.progressSpinner = true;
    this.sigaServices.get("datosNotificaciones_getPlantillas").subscribe(
      n => {
        this.comboTemplates = n.comboPlantillasItems;
        this.arregloTildesCombo(this.comboTemplates);
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  getComboMeasureUnit() {
    this.sigaServices.get("datosNotificaciones_getMeasuredUnit").subscribe(
      n => {
        this.comboMeasureUnit = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboAfterBefore() {
    this.sigaServices.get("datosNotificaciones_getTypeWhere").subscribe(
      n => {
        this.comboAfterBefore = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  onChangeTemplates(event, dato) {

    if (!this.pressNewNotificacion) {
      this.editNotificacion = true;
    }

    let plantilla = this.comboTemplates.find(
      x => x.value === event.value
    );

    let idPlantillaEnvio = event.value;
    let idTipoEnvio = plantilla.subValue;

    this.getTypeSend(idPlantillaEnvio, idTipoEnvio, dato);
  }

  getTypeSend(idPlantillaEnvio, idTipoEnvio, dato) {
    this.progressSpinner = true;
    let typeSend = [];
    this.sigaServices
      .getParam(
        "datosNotificaciones_getTypeSend",
        "?idPlantillaEnvio=" + idPlantillaEnvio + "&idTipoEnvio=" + idTipoEnvio
      )
      .subscribe(
        n => {
          typeSend = n.combooItems;

          if (typeSend.length != 0) {

            if (this.newNotificacion != undefined) {
              this.newNotificacion.idTipoEnvio = typeSend[0].value;
              this.newNotificacion.tipoEnvio = typeSend[0].label;
            } else {
              dato.tipoEnvio = typeSend[0].label;
              dato.idTipoEnvio = typeSend[0].value;
            }

          } else {
            dato.tipoEnvio = undefined;
            dato.idTipoEnvio = undefined;
          }

          if (!this.pressNewNotificacion) {
            this.editNotificaciones(dato);
          }

          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  validateNotification() {
    if (this.newNotificacion != undefined) {
      if (
        this.newNotificacion.idPlantilla == undefined ||
        this.newNotificacion.idTipoCuando == undefined ||
        this.newNotificacion.idUnidadMedida == undefined ||
        this.newNotificacion.idTipoCuando == undefined ||
        this.newNotificacion.cuando == undefined ||
        this.newNotificacion.idTipoNotificacion == undefined
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  actualizaSeleccionadosNotifications(selectedDatosNotifications) {
    this.deleteNotificacion = true;
    this.numSelectedNotifications = selectedDatosNotifications.length;
  }

  actualizaSeleccionadosNotificationsEdit(selectedDatosNotifications) {

    this.datosNotificaciones.forEach(element => {
      element.isMod = false;
    });

    if (selectedDatosNotifications.length == 1) {
      let id = this.datosNotificaciones.findIndex(x => x.idNotificacion == this.selectedDatosNotifications[0].idNotificacion);
      this.datosNotificaciones[id].isMod = true;
    }

    this.numSelectedNotifications = selectedDatosNotifications.length;
    this.tableNotifications.reset();
  }

  restNotifications() {
    this.datosNotificaciones = JSON.parse(sessionStorage.getItem("datosNotificacionesInit"));
    this.pressNewNotificacion = false;
    this.editNotificacion = false;
    this.newNotificacion = undefined;
    this.numSelectedNotifications = 0;
    this.tableNotifications.reset();
    this.updateNotificationList = [];
  }

  saveNotification() {
    this.progressSpinner = true;
    let url = "";
    let notification;

    if (this.pressNewNotificacion) {
      url = "datosNotificaciones_saveNotification";
      notification = this.newNotificacion;
    } else {
      url = "datosNotificaciones_updateNotification";

      notification = new NotificacionEventoObject();
      notification.eventNotificationItems = this.updateNotificationList;
    }

    this.sigaServices.post(url, notification).subscribe(
      data => {
        this.progressSpinner = false;
        this.pressNewNotificacion = false;
        this.editNotificacion = false;
        this.selectedDatosNotifications = [];
        this.numSelectedNotifications = 0;
        this.showSuccess();
        this.updateNotificationList = [];
        this.newNotificacion = undefined;
        this.getCalendarNotifications();
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  editNotificaciones(dato) {
    this.editNotificacion = true;
    let datoFind = this.updateNotificationList.find(x => x.idNotificacion == dato.idNotificacion);

    if (datoFind == undefined) {
      let datoFindOriginal = this.datosNotificaciones.find(x => x.idNotificacion == dato.idNotificacion);
      this.updateNotificationList.push(datoFindOriginal);
    } else {
      let idDatoFind = this.updateNotificationList.findIndex(x => x.idNotificacion == dato.idNotificacion);
      this.updateNotificationList[idDatoFind] = dato;
    }
  }

  //FUNCIONES GENERALES DE LA PANTALLA
  //Funciones controlan las fichas
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.saveCalendarFlag) {
      fichaPosible.activa = !fichaPosible.activa;
    }

    if (key == "confi" && this.openFicha) {
      this.openFicha = false;
      this.closeFicha = true;
    } else if (key == "confi" && !this.openFicha) {
      this.openFicha = true;
      this.closeFicha = false;
    }
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
    this.selectProfile = false;
  }

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.saveCalendarFlag) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
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

  showSuccessPermissions() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: "Árbol de permisos actualizado correctamente"
    });
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: "Acción realizada correctamente"
    });
  }

  showSuccessDelete() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: "Se ha eliminado la notificacion correctamente"
    });
  }

  getFichas() {
    this.fichasPosibles = [
      {
        key: "generales",
        activa: true
      },
      {
        key: "confi",
        activa: false
      },
      {
        key: "notify",
        activa: false
      }
    ];
  }

  getFichasEdit() {
    this.fichasPosibles = [
      {
        key: "generales",
        activa: true
      },
      {
        key: "confi",
        activa: false
      },
      {
        key: "notify",
        activa: true
      }
    ];
  }

  clear() {
    this.msgs = [];
  }

  backTo() {
    this.location.back();
  }

  checkAcceso() {
    if (this.calendar.tipoAcceso == 2) {
      this.acceso = true;
    } else {
      this.acceso = false;
    }
  }

  checkAccesoHistorico() {
    if (this.calendar.tipoAcceso == 3 && !this.historico) {
      this.accesoHistorico = false;
    } else {
      this.accesoHistorico = true;
    }
  }

  checkAccesoValidaCalendario() {
    if (this.calendar.tipoAcceso == 3 && this.validarCalendario()) {
      this.accesoCalendario = false;
    } else {
      this.accesoCalendario = true;
    }
  }

  checkAccesoSeleccionDatos() {
    if (
      this.selectedDatosNotifications &&
      this.selectedDatosNotifications != "" &&
      this.calendar.tipoAcceso == 3
    ) {
      this.accesoSeleccionDatos = false;
    } else {
      this.accesoSeleccionDatos = true;
    }
  }

  arregloTildesCombo(combo) {
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
}
