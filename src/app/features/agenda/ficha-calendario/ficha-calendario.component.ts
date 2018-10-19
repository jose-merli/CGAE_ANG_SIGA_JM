import { Component, OnInit } from "@angular/core";
import { SigaServices } from "../../../_services/siga.service";
import { TreeNode } from "../../../utils/treenode";
import { CalendarItem } from "../../../models/CalendarItem";
import { PermisosCalendarioItem } from "../../../models/PermisosCalendarioItem";
import { PermisosCalendarioObject } from "../../../models/PermisosCalendarioObject";

@Component({
  selector: "app-ficha-calendario",
  templateUrl: "./ficha-calendario.component.html",
  styleUrls: ["./ficha-calendario.component.scss"]
})
export class FichaCalendarioComponent implements OnInit {
  colorSelect = "#1976D2";
  defaultColor = "#1976D2";
  propagateDown: boolean = true;

  treeInicial: any = [];
  profilesTree: any;
  selectedProfiles = [];
  selectProfile: boolean = false;

  progressSpinner: boolean = false;

  numSeleccionados: number;
  numCambios: number;
  totalPermisos: number;

  //accesos totales
  accesoTotal: number = 0;
  accesoLectura: number = 0;
  sinAsignar: number = 0;

  formValido: boolean = false;

  msgs = [];

  saveCalendarFlag: boolean = false;
  calendar: CalendarItem = new CalendarItem();

  fichasPosibles = [
    {
      key: "generales",
      activa: true
    },
    {
      key: "confi",
      activa: false
    }
  ];

  comboCalendarType;
  // map con los permisos {data, ObjectoPermisosBack}
  permisosChange: PermisosCalendarioItem[] = [];

  constructor(private sigaServices: SigaServices) {}

  ngOnInit() {
    this.getComboCalendarType();
    sessionStorage.removeItem("idCalendario");
  }

  saveCalendar() {
    this.progressSpinner = true;
    this.calendar.color = this.colorSelect;

    this.sigaServices
      .post("fichaCalendario_saveCalendar", this.calendar)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.saveCalendarFlag = true;
          let body = JSON.parse(data["body"]);
          sessionStorage.setItem("idCalendario", body.id);
          this.getProfiles();
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

  getProfiles() {
    let idCalendario = sessionStorage.getItem("idCalendario");
    this.sigaServices
      .getParam(
        "fichaCalendario_getProfilesPermissions",
        "?idCalendario=" + idCalendario
      )
      .subscribe(
        n => {
          this.profilesTree = n.permisosPerfilesCalendar;
          this.treeInicial = n.permisosPerfilesCalendar;
        },
        err => {
          console.log(err);
        }
      );
  }

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

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.saveCalendarFlag) {
      fichaPosible.activa = !fichaPosible.activa;
    }
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
    this.selectProfile = false;
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
      this.getNumChanges();
    }
    console.log(ref);
  }

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

  getNumChanges() {
    if (this.permisosChange.length > 0) {
      this.numCambios = this.permisosChange.length;
    } else {
      this.numCambios = 0;
    }
  }

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
          this.showSuccess();
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

  restablecerPermisos() {
    this.getProfiles();
    this.permisosChange = [];
    this.numCambios = 0;
    this.accesoTotal = 0;
    this.accesoLectura = 0;
  }

  resetCalendar() {
    this.calendar = new CalendarItem();
    this.colorSelect = this.defaultColor;
  }

  onNodeSelect() {
    this.propagateDown = true;
    this.selectProfile = true;
    // this.getNumSelected();
    // this.savedPermisos = false;
    // this.getNumTotales();
  }

  onNodeUnselect() {
    this.propagateDown = true;
    // this.getNumSelected();
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

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: "Árbol de permisos actualizado correctamente"
    });
  }
}
