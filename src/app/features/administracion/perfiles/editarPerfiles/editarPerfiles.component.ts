import { Location } from "@angular/common";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { ComboItem } from "../../../../../app/models/ComboItem";
import { PerfilItem } from "../../../../../app/models/PerfilItem";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../../properties/val-properties";
import { SigaWrapper } from "../../../../wrapper/wrapper.class";
import { PerfilesResponseDto } from "./../../../../../app/models/PerfilesResponseDto";
import { SigaServices } from "./../../../../_services/siga.service";

@Component({
  selector: "app-editarPerfiles",
  templateUrl: "./editarPerfiles.component.html",
  styleUrls: ["./editarPerfiles.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class EditarPerfilesComponent extends SigaWrapper implements OnInit {
  usuarios_rol: any[];
  select: any[];
  msgs: Message[] = [];
  body: PerfilItem = new PerfilItem();
  rolesAsignados: any[];
  rolesNoAsignados: any[];
  saveRolesAsignados: any[];
  saveRolesNoAsignados: any[];
  pButton;
  textSelected: String = "{0} registros seleccionados";
  textFilter: String;
  editar: boolean = true;
  enabled: boolean;
  enabledid: boolean = false;
  activo: boolean = false;
  correcto: boolean = false;
  dniCorrecto: boolean;
  showDatosGenerales: boolean = true;
  responsePerfiles: PerfilesResponseDto = new PerfilesResponseDto();
  checkBody: PerfilItem = new PerfilItem();
  crear: boolean;
  constructor(
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private location: Location
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("table") table;
  ngOnInit() {
    this.crear = JSON.parse(sessionStorage.getItem("crear"));
    this.rolesAsignados = [];
    this.rolesNoAsignados = [];
    this.saveRolesAsignados = [];
    this.saveRolesNoAsignados = [];
    this.textFilter = "Elegir";
    this.correcto = false;
    this.body = new PerfilItem();

    if (sessionStorage.getItem("perfil") != null) {
      this.enabled = JSON.parse(sessionStorage.getItem("privilegios"));
      this.checkBody = JSON.parse(sessionStorage.getItem("perfil"))[0];
      this.body = JSON.parse(sessionStorage.getItem("perfil"))[0];
      this.editar = false;
      this.fillRol();
    } else {
      this.editar = true;
      this.enabled = JSON.parse(sessionStorage.getItem("privilegios"));
      this.body = new PerfilItem();
      this.sigaServices.get("usuarios_rol").subscribe(
        n => {
          this.usuarios_rol = n.combooItems;
        },
        err => {
          //console.log(err);
        }
      );
    }
    if (this.enabled == true) {
      this.enabledid = this.crear;
    }
    sessionStorage.removeItem("perfil");
    sessionStorage.removeItem("privilegios");
  }

  fillRol() {
    if (this.body.rolesAsignados != null) {
      this.body.rolesAsignados.forEach((value: ComboItem, key: number) => {
        this.rolesAsignados.push(value);
        this.saveRolesAsignados.push(value);
      });
    }
    if (this.body.rolesNoAsignados != null) {
      this.body.rolesNoAsignados.forEach((value: ComboItem, key: number) => {
        this.rolesNoAsignados.push(value);
        this.saveRolesNoAsignados.push(value);
      });
    }
  }
  pInputText;

  onlySpaces(str) {
    let i = 0;
    var ret;
    ret = true;
    while (i < str.length) {
      if (str[i] != " ") {
        ret = false;
      }
      i++;
    }
    return ret;
  }

  isNew() {
    this.body.rolesAsignados = this.rolesAsignados;
    this.body.rolesNoAsignados = this.rolesNoAsignados;
    this.sigaServices.post("perfiles_insert", this.body).subscribe(
      data => {
        this.responsePerfiles = JSON.parse(data["body"]);
        this.volver();
      },
      error => {
        this.responsePerfiles = JSON.parse(error["error"]);
        this.showduplicateFail(this.responsePerfiles.error.message.toString());
        //console.log(error);
      },
      () => {
        this.showSuccess();
      }
    );
  }

  confirmEdit() {
    let mess = "";
    if (this.crear == true) {
      mess = this.translateService.instant(
        "general.message.create.aceptar.y.volver"
      );
    } else {
      mess = this.translateService.instant("general.message.aceptar.y.volver");
    }
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        if (this.crear == true) {
          this.isNew();
        } else {
          this.isEditar();
        }
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

  checkIgual() {
    if (
      this.body.idGrupo == undefined ||
      this.body.descripcionGrupo == undefined ||
      this.onlySpaces(this.body.idGrupo) ||
      this.onlySpaces(this.body.descripcionGrupo)
    ) {
      return true;
    } else {
      if (
        this.enabled != true &&
        this.body.idGrupo == this.checkBody.idGrupo &&
        this.body.descripcionGrupo == this.checkBody.descripcionGrupo &&
        JSON.stringify(this.rolesAsignados) ===
        JSON.stringify(this.saveRolesAsignados) &&
        JSON.stringify(this.rolesNoAsignados) ===
        JSON.stringify(this.saveRolesNoAsignados)
      ) {
        return true;
      } else if (
        this.body.idGrupo == this.checkBody.idGrupo &&
        this.body.descripcionGrupo == this.checkBody.descripcionGrupo &&
        JSON.stringify(this.rolesAsignados) ===
        JSON.stringify(this.saveRolesAsignados) &&
        JSON.stringify(this.rolesNoAsignados) ===
        JSON.stringify(this.saveRolesNoAsignados)
      ) {
        return true;
      } else {
        return false;
      }
    }
    // }
  }

  isEditar() {
    this.body.rolesAsignados = this.rolesAsignados;
    this.body.rolesNoAsignados = this.rolesNoAsignados;
    this.body.descripcionGrupo = this.body.descripcionGrupo.trim();
    this.sigaServices.post("perfiles_update", this.body).subscribe(
      data => {
        this.responsePerfiles = JSON.parse(data["body"]);
      },
      err => {
        this.showFail();
        //console.log(err);
      },
      () => {
        this.showSuccess();
        this.volver();
      }
    );
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  showSuccess() {
    sessionStorage.setItem("registroActualizado", JSON.stringify(true));
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  showduplicateFail(message: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: this.translateService.instant(message)
    });
  }

  volver() {
    sessionStorage.removeItem("perfil");
    this.location.back();
  }

  clear() {
    this.msgs = [];
  }
}
