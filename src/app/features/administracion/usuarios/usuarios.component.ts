import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import { SigaServices } from "./../../../_services/siga.service";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { DataTable } from "primeng/datatable";
import { TranslateService } from "../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { UsuarioRequestDto } from "./../../../../app/models/UsuarioRequestDto";
import { UsuarioResponseDto } from "./../../../../app/models/UsuarioResponseDto";
import { UsuarioDeleteRequestDto } from "./../../../../app/models/UsuarioDeleteRequestDto";
import { UsuarioItem } from "./../../../../app/models/UsuarioItem";
import { ComboItem } from "./../../../../app/models/ComboItem";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";
import { DialogoComunicacionesItem } from "../../../models/DialogoComunicacionItem";
import { esCalendar } from "./../../../utils/calendar";

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.scss"],
  host: {
    "(document:keypress)": "onKeyPress($event)"
  },
  encapsulation: ViewEncapsulation.None
})
export class Usuarios extends SigaWrapper implements OnInit {
  usuarios_rol: any[];
  usuarios_perfil: any[];
  usuarios_activo: any[];
  cols: any = [];
  datos: any[];
  datosActivos: any[];
  select: any[];
  msgs: Message[] = [];
  searchUser: UsuarioResponseDto = new UsuarioResponseDto();
  rowsPerPage: any = [];
  body: UsuarioRequestDto = new UsuarioRequestDto();
  usuariosDelete: UsuarioDeleteRequestDto = new UsuarioDeleteRequestDto();
  showDatosGenerales: boolean = true;
  pButton;
  historico: boolean = false;
  editar: boolean = false;
  buscar: boolean = false;
  disabledRadio: boolean = false;
  disabled: boolean = false;
  selectMultiple: boolean = false;
  blockCrear: boolean = true;
  selectedItem: number = 10;
  first: number = 0;
  activo: boolean = false;
  dniCorrecto: boolean;
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisosTree: any;
  permisosArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean;
  selectAll: boolean = false;
  progressSpinner: boolean = false;
  numSelected: number = 0;
  es: any = esCalendar;
  //Diálogo de comunicación
  showComunicar: boolean = false;
  modelosComunicacion: any[];
  bodyComunicacion: DialogoComunicacionesItem = new DialogoComunicacionesItem();
  tiposEnvio: any[];
  plantillas: any[];
  datosModelos: any[];
  colsModelos: any[];

  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("table") table: DataTable;
  selectedDatos;

  ngOnInit() {


    this.activo = true;
    this.checkAcceso();
    this.sigaServices.get("usuarios_rol").subscribe(
      n => {
        this.usuarios_rol = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.usuarios_rol.map(e => {
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
      },
      err => {
        console.log(err);
      }
    );
    this.sigaServices.get("usuarios_perfil").subscribe(
      n => {
        this.usuarios_perfil = n.combooItems;
        let first = { label: "", value: "" };

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.usuarios_perfil.map(e => {
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

        this.usuarios_perfil.unshift(first);
      },
      err => {
        console.log(err);
      }
    );

    this.cols = [
      {
        field: "nombreApellidos",
        header: "administracion.parametrosGenerales.literal.nombre.apellidos",
        width: "25%"
      },
      {
        field: "nif",
        header: "administracion.usuarios.literal.NIF",
        width: "5%"
      },
      {
        field: "roles",
        header: "administracion.usuarios.literal.roles",
        width: "25%"
      },
      {
        field: "fechaAlta",
        header: "administracion.usuarios.literal.fechaAlta",
        width: "5%"
      }
    ];

    this.colsModelos = [
      { field: 'modelo', header: 'Modelo' },
      { field: 'tipoEnvio', header: 'Tipo envío' },
      { field: 'plantillaEnvio', header: 'Plantilla Envío' },

    ]

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

    if (sessionStorage.getItem("editedUser") != null) {
      this.selectedDatos = JSON.parse(sessionStorage.getItem("editedUser"));
    }
    sessionStorage.removeItem("editedUser");
    if (sessionStorage.getItem("searchUser") != null) {
      this.body = JSON.parse(sessionStorage.getItem("searchUser"));
      this.Search();
      this.buscar = true;
      sessionStorage.removeItem("searchUser");
      sessionStorage.removeItem("usuarioBody");
    } else {
      this.body = new UsuarioRequestDto();
      this.body.activo = "S";
    }
  }
  isValidDNI(dni: string): boolean {
    let DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

    let DNI_REGEX = /^(\d{8})([A-Z])$/;
    let CIF_REGEX = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
    let NIE_REGEX = /^[XYZ]\d{7,8}[A-Z]$/;

    if (DNI_REGEX.test(dni) || CIF_REGEX.test(dni) || NIE_REGEX.test(dni)) {
      return true;
    } else {
      return false;
    }
    // return (
    //   dni &&
    //   typeof dni === "string" &&
    //   /^[0-9]{8}([A-Za-z]{1})$/.test(dni) &&
    //   dni.substr(8, 9).toUpperCase() ===
    //     DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23)
    // );
  }

  toHistorico() {
    this.progressSpinner = true;
    this.body.activo = "N";
    this.sigaServices
      .postPaginado("usuarios_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          console.log(data);
          this.searchUser = JSON.parse(data["body"]);
          this.datosActivos = this.searchUser.usuarioItem;
          this.table.paginator = true;
        },
        err => {
          console.log(err);
        },
        () => {
          this.body.activo = "S";
          this.sigaServices
            .postPaginado("usuarios_search", "?numPagina=1", this.body)
            .subscribe(
              data => {
                console.log(data);
                this.progressSpinner = false;
                this.searchUser = JSON.parse(data["body"]);
                for (let i in this.searchUser.usuarioItem) {
                  this.datosActivos.push(this.searchUser.usuarioItem[i]);
                }
                this.datos = this.datosActivos;
                this.table.paginator = true;
                this.table.reset();
              },
              err => {
                console.log(err);
                this.progressSpinner = false;
              }
            );
        }
      );

    this.historico = true;
  }

  toNotHistory() {
    this.historico = false;
    this.body.activo = "S";
    this.Search();
  }
  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "83";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisosTree = JSON.parse(data.body);
        this.permisosArray = this.permisosTree.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        if (this.derechoAcceso == 3) {
          this.activacionEditar = true;
        } else if (this.derechoAcceso == 2) {
          this.activacionEditar = false;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
          this.router.navigate(["/errorAcceso"]);
        }
      }
    );
  }

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  onChangeForm() {
    if (this.body.nif != "" || this.body.nif.length < 9) {
      this.dniCorrecto = null;
    }
    if (
      this.body.nombreApellidos != "" &&
      this.body.nombreApellidos != undefined &&
      (this.body.nif != "" && this.body.nif != undefined) &&
      (this.body.rol != "" && this.body.rol != undefined) &&
      (this.body.grupo != "" && this.body.grupo != undefined) &&
      this.body.nif != ""
    ) {
      this.blockCrear = false;
    } else {
      this.blockCrear = true;
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  pInputText;

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

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  sendEdit() {
    console.log(this.body);
    if (this.body.codigoExterno == undefined) {
      this.body.codigoExterno = "";
    }
    if (this.body.grupo == undefined) {
      this.body.grupo = "";
    }
    this.sigaServices.post("usuarios_update", this.body).subscribe(
      data => {
        this.showSuccess();
        console.log(data);
      },
      err => {
        this.showFail();
        console.log(err);
      },
      () => {
        this.cancelar();
        this.Search();
        this.table.reset();
      }
    );
  }

  Search() {
    this.buscar = true;
    this.progressSpinner = true;
    // if (this.body.nif == "" || this.body.nif == null) {
    //   this.dniCorrecto = null;
    // }
    if (this.body.nombreApellidos == undefined) {
      this.body.nombreApellidos = "";
    }
    // if (UsuarioRequestDto == undefined) {
    //   this.body.activo = "S";
    //   this.activo = true;
    // }
    if (this.body.grupo == undefined) {
      this.body.grupo = "";
    }
    if (this.body.nif == undefined) {
      this.body.nif = "";
    }
    if (this.body.rol == undefined) {
      this.body.rol = "";
    }
    this.body.idInstitucion = "2000";
    this.sigaServices
      .postPaginado("usuarios_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          console.log(data);
          this.progressSpinner = false;
          this.searchUser = JSON.parse(data["body"]);
          this.datos = this.searchUser.usuarioItem;
          this.table.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          if (sessionStorage.getItem("first") != null) {
            let first = JSON.parse(sessionStorage.getItem("first")) as number;
            this.table.first = first;
            sessionStorage.removeItem("first");
          }
        }
      );
  }
  paginate(event) {
    console.log(event);
  }

  setItalic(datoH) {
    if (datoH.activo == "S") return false;
    else return true;
  }

  editarUsuario(selectedItem) {
    // if (!this.selectMultiple) {
    if (selectedItem.length == 1) {
      this.body = new UsuarioRequestDto();
      this.body = selectedItem[0];
      this.usuarios_rol.forEach((value: ComboItem, key: number) => {
        if (value.label == selectedItem[0].roles) {
          this.body.rol = value.value;
        }
      });
      this.editar = true;
      this.disabledRadio = false;
    } else {
      this.editar = false;
      this.dniCorrecto = null;
      this.body = new UsuarioRequestDto();
      this.body.activo = selectedItem[0].activo;
    }
    if (this.body.activo == "N") {
      this.activo = true;
    } else {
      this.activo = false;
    }
  }

  cancelar() {
    this.editar = false;
    this.dniCorrecto = null;
    this.body = new UsuarioRequestDto();
    this.body.activo = "S";
    this.disabledRadio = false;
  }

  borrar(selectedItem) {
    this.usuariosDelete = new UsuarioDeleteRequestDto();
    selectedItem.forEach((value: UsuarioItem, key: number) => {
      console.log(value);
      this.usuariosDelete.idUsuario.push(value.idUsuario);
      this.usuariosDelete.activo = value.activo;
      this.usuariosDelete.idInstitucion = "2000";
    });
    this.sigaServices.post("usuarios_delete", this.usuariosDelete).subscribe(
      data => {
        this.showSuccessDelete(selectedItem.length);
      },
      err => {
        this.showFail();
        console.log(err);
      },
      () => {
        this.editar = false;
        this.dniCorrecto = null;
        this.body = new UsuarioRequestDto();
        this.body.activo = selectedItem[0].activo;
        this.disabledRadio = false;
        this.Search();
        this.table.reset();
      }
    );
  }
  showduplicateFail(message: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: this.translateService.instant(message)
    });
  }

  crear() {
    let a = this.body;
    if (this.isValidDNI("" + this.body.nif)) {
      this.sigaServices.post("usuarios_insert", this.body).subscribe(
        data => {
          this.searchUser = JSON.parse(data["body"]);

          this.showSuccess();
        },
        error => {
          this.searchUser = JSON.parse(error["error"]);
          this.showduplicateFail(this.searchUser.error.message.toString());
          console.log(error);
          this.showFail();
        },
        () => {
          this.cancelar();
          this.Search();
          this.table.reset();
        }
      );
      this.dniCorrecto = null;
    } else {
      this.dniCorrecto = false;
    }
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showSuccessDelete(number) {
    let msg = "";
    if (!this.activo) {
      if (number >= 2) {
        msg =
          number +
          " " +
          this.translateService.instant("messages.deleted.selected.success");
      } else {
        msg = this.translateService.instant("messages.deleted.success");
      }
    } else {
      if (number >= 2) {
        msg =
          this.translateService.instant(
            "general.message.registros.restaurados"
          ) +
          number +
          " " +
          this.translateService.instant(
            "cargaMasivaDatosCurriculares.numRegistros.literal"
          );
      } else {
        msg = this.translateService.instant(
          "general.message.registro.restaurado"
        );
      }
    }

    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: msg
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }
  confirmarBorrar(selectedItem) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";

    if (selectedItem.length > 1) {
      mess =
        this.translateService.instant("messages.deleteConfirmation.much") +
        selectedItem.length +
        " " +
        this.translateService.instant("messages.deleteConfirmation.register") +
        "?";
    }
    if (this.activo == true) {
      icon = "fa fa-check";
      if (selectedItem.length > 1) {
        mess =
          this.translateService.instant(
            "general.message.confirmar.rehabilitaciones"
          ) +
          selectedItem.length +
          " " +
          this.translateService.instant(
            "cargaMasivaDatosCurriculares.numRegistros.literal"
          );
      } else {
        mess = this.translateService.instant(
          "general.message.confirmar.rehabilitacion"
        );
      }
    }
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.borrar(selectedItem);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.error.realiza.accion"
            )
          }
        ];
      }
    });
  }

  irEditarUsuario(id) {
    console.log(id)
    if (!this.selectMultiple) {
      var ir = null;
      if (id && id.length > 0) {
        ir = id[0];
      }
      sessionStorage.removeItem("usuarioBody");
      sessionStorage.removeItem("privilegios");
      sessionStorage.removeItem("first");
      sessionStorage.setItem("usuarioBody", JSON.stringify(id));
      sessionStorage.setItem(
        "privilegios",
        JSON.stringify(this.activacionEditar)
      );
      sessionStorage.setItem("searchUser", JSON.stringify(this.body));
      sessionStorage.setItem("editedUser", JSON.stringify(this.selectedDatos));
      sessionStorage.setItem("first", JSON.stringify(this.table.first));
      this.router.navigate(["/editarUsuario"]);
    } else {
      this.editar = false;
      this.numSelected = this.selectedDatos.length;
      this.dniCorrecto = null;
      this.body = new UsuarioRequestDto();
      this.body.activo = id[0].activo;
    }
    if (this.body.activo == "N") {
      this.activo = true;
    } else {
      this.activo = false;
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

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.Search();
    }
  }

  clear() {
    this.msgs = [];
  }


  //Diálogo de comunicación: ver y enviar servicio
  onComunicar(dato) {
    this.showComunicar = true;
    this.getModelosComunicacion();
  }

  getModelosComunicacion() {
    this.datosModelos = [
      { id: '1', modelo: '', tipoEnvio: '', plantillaEnvio: '' }
    ]
  }

  onEnviarComunicacion() {
    this.showComunicar = false;
  }


}
