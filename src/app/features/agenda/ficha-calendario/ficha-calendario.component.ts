import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import { SigaServices } from "../../../_services/siga.service";
import { TreeNode } from "../../../utils/treenode";
import { CalendarItem } from "../../../models/CalendarItem";
import { PermisosCalendarioItem } from "../../../models/PermisosCalendarioItem";
import { PermisosCalendarioObject } from "../../../models/PermisosCalendarioObject";
import { DataTable } from "../../../../../node_modules/primeng/primeng";
import { Router } from "../../../../../node_modules/@angular/router";
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

  @ViewChild("table")
  table: DataTable;
  selectedDatos;
  selectMultiple: boolean = false;
  rowsPerPage: any = [];
  cols: any = [];
  datos: any[];
  selectedItem: number = 10;
  sortO: number = 1;
  numSelected: number = 0;

  historico: boolean = false;
  openFicha: boolean = false;
  closeFicha: boolean = true;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private location: Location
  ) {
    this.numSeleccionados = 0;
    this.numCambios = 0;
    this.totalProfiles = 0;

    this.sigaServices.menuToggled$.subscribe(() => {
      this.isWidthChange = !this.isWidthChange;
      console.log(this.isWidthChange);
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
      this.getCalendar(sessionStorage.getItem("idCalendario"));
      this.saveCalendarFlag = true;
      this.getProfiles();
      this.getEventNotifications();
    } else {
      this.modoEdicion = false;
      sessionStorage.removeItem("idCalendario");
      this.progressSpinner = false;
    }
  }

  //FUNCIONES FICHA DATOS GENERALES

  //Función obtiene los tipos de calendarios que hay
  getComboCalendarType() {
    this.sigaServices.get("fichaCalendario_getCalendarType").subscribe(
      n => {
        this.comboCalendarType = n.combooItems;
      },
      err => {
        console.log(err);
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
      this.calendar.idCalendario = sessionStorage.getItem("idCalendario");
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
          this.getEventNotifications();
        }
      },
      err => {
        this.progressSpinner = false;
        this.saveCalendarFlag = false;
        console.log(err);
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
          console.log(err);
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  resetCalendar() {
    if (!this.modoEdicion) {
      this.calendar = new CalendarItem();
      this.colorSelect = this.defaultColor;
    } else {
      this.getCalendar(sessionStorage.getItem("idCalendario"));
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
    let idCalendario = sessionStorage.getItem("idCalendario");
    this.sigaServices
      .getParam(
        "fichaCalendario_getProfilesPermissions",
        "?idCalendario=" + idCalendario
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
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          console.log(this.datos);
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
          console.log(err);
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
        permisosUpdate.idCalendario = sessionStorage.getItem("idCalendario");

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
    this.cols = [
      {
        field: "nombreTipoNotificacion",
        header: "formacion.datosNotificaciones.tipoNotificacion.cabecera"
      },
      {
        field: "descripcionCuando",
        header: "formacion.datosNotificaciones.cuando.cabecera"
      },
      {
        field: "nombrePlantilla",
        header: "menu.facturacion.plantillas"
      },
      {
        field: "tipoEnvio",
        header: "envios.plantillas.literal.tipoenvio"
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
    this.getEventNotifications();
  }

  getEventNotifications() {
    this.progressSpinner = true;
    this.historico = false;
    let idCalendario = sessionStorage.getItem("idCalendario");
    this.sigaServices
      .getParam(
        "fichaCalendario_getEventNotifications",
        "?idCalendario=" + idCalendario
      )
      .subscribe(
        n => {
          this.datos = n.eventNotificationItems;
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

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }

  irEditarNotificacion(id) {
    if (id.length >= 1 && this.selectMultiple == false) {
      sessionStorage.setItem("modoEdicionNotify", "true");
      sessionStorage.removeItem("notifySelected");
      sessionStorage.setItem("notifySelected", JSON.stringify(id));
      this.router.navigate(["/editarNotificacion"]);
      sessionStorage.setItem("fichaAbierta", "true");
    } else {
      this.numSelected = this.selectedDatos.length;
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  newNotification() {
    sessionStorage.setItem("modoEdicionNotify", "false");
    sessionStorage.setItem("fichaAbierta", "true");
    this.router.navigate(["/editarNotificacion"]);
  }

  onChangeSelectAllNotifications() {
    if (this.selectAllNotifications === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAllNotifications = false;
      this.selectedDatos = [];
      this.numSelected = 0;
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
          this.getEventNotifications();
          this.selectMultiple = false;
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  getHistoricEventNotifications() {
    this.progressSpinner = true;
    this.historico = true;
    let idCalendario = sessionStorage.getItem("idCalendario");
    this.sigaServices
      .getParam(
        "fichaCalendario_getHistoricEventNotifications",
        "?idCalendario=" + idCalendario
      )
      .subscribe(
        n => {
          this.datos = n.eventNotificationItems;
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

  backTo() {
    this.location.back();
  }
}
