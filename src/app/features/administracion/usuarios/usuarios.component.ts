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
import { CommonsService } from '../../../_services/commons.service';
import { MultiSelect } from 'primeng/multiselect';

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
  blockCrear: boolean = false;
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
  selectMultipleUsuario: boolean = false;
  es: any = esCalendar;
  nuevo: boolean = false;
  updateUsuarios: any[] = [];
  seleccion;
  selectionMode: string = "single";
  datosInicial: any[];
  filtrosIniciales: any;
  @ViewChild('someDropdown') someDropdown: MultiSelect;
  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private translateService: TranslateService,
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("table") table: DataTable;
  selectedDatos;
  textSelected: String = "{label}";

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
        //console.log(err);
      }
    );
    this.sigaServices.get("usuarios_perfil").subscribe(
      n => {
        this.usuarios_perfil = n.combooItems;

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

      },
      err => {
        //console.log(err);
      }
    );

    this.cols = [
      {
        field: "nif",
        header: "administracion.usuarios.literal.NIF",
        width: "8%"
      },
      {
        field: "nombreApellidos",
        header: "administracion.parametrosGenerales.literal.nombre.apellidos",
        width: "20%"
      },
      {
        field: "roles",
        header: "administracion.usuarios.literal.roles",
        width: "20%"
      },
      {
        field: "perfiles",
        header: "administracion.grupos.literal.perfiles",
        width: "20%"
      },
      {
        field: "fechaAlta",
        header: "administracion.usuarios.literal.fechaAlta",
        width: "8%"
      },
      {
        field: "codigoExterno",
        header: "general.codeext",
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

  openMultiSelect(dato) {
    dato.overlayVisible = true;
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
    this.selectedDatos = [];
    this.numSelected = 0;
    this.nuevo = false;
    this.progressSpinner = true;
    this.filtrosIniciales.activo = "N";
    this.sigaServices
      .postPaginado("usuarios_search", "?numPagina=1", this.filtrosIniciales)
      .subscribe(
        data => {
          this.searchUser = JSON.parse(data["body"]);
          this.datosActivos = this.searchUser.usuarioItem;
          this.table.paginator = true;
          this.datos.forEach(element => {
            element.editable = false
            element.overlayVisible = false;
            element.idGrupo = [];
            for (let i in element.perfiles) {
              element.idGrupo.push(element.perfiles[i]);
            }
            element.rol = element.roles;
          });
        },
        err => {
          //console.log(err);
        },
        () => {
          this.filtrosIniciales.activo = "S";
          this.sigaServices
            .postPaginado("usuarios_search", "?numPagina=1", this.filtrosIniciales)
            .subscribe(
              data => {
                this.progressSpinner = false;
                this.searchUser = JSON.parse(data["body"]);
                for (let i in this.searchUser.usuarioItem) {
                  this.datosActivos.push(this.searchUser.usuarioItem[i]);
                }
                this.datos = this.datosActivos;
                this.table.paginator = true;
                this.table.reset();
                this.datos.forEach(element => {
                  element.editable = false
                  element.overlayVisible = false;
                  element.idGrupo = [];
                  for (let i in element.perfiles) {
                    element.idGrupo.push(element.perfiles[i]);
                  }
                  let findDato = this.usuarios_rol.find(item => item.label === element.roles);
                  element.rol = findDato.value;
                });
              },
              err => {
                //console.log(err);
                this.progressSpinner = false;
              }, () => {
                this.datos.forEach((value2: any, key: number) => {
                  value2.perfiles = [];
                  if (value2.perfil != null) {
                    let perfilasos = value2.perfil.split(";");
                    perfilasos.forEach((valuePerfil: String, key: number) => {
                      this.usuarios_perfil.forEach((value: ComboItem, key: number) => {
                        if (valuePerfil.trim() == value.value) {
                          value2.perfiles.push(value);
                        }
                      });
                    });
                  }
                });
                this.datosInicial = JSON.parse(JSON.stringify(this.datos));
              }
            );
        }
      );

    this.historico = true;
  }

  toNotHistory() {
    this.selectedDatos = [];
    this.numSelected = 0;
    this.nuevo = false;
    this.historico = false;
    this.filtrosIniciales.activo = "S";
    this.updateUsuarios = [];
    this.nuevo = false;
    this.buscar = true;
    this.progressSpinner = true;
    if (this.filtrosIniciales.nombreApellidos == undefined) {
      this.filtrosIniciales.nombreApellidos = "";
    }
    if (this.filtrosIniciales.grupo == undefined) {
      this.filtrosIniciales.grupo = "";
    }
    if (this.filtrosIniciales.nif == undefined) {
      this.filtrosIniciales.nif = "";
    }
    if (this.filtrosIniciales.rol == undefined) {
      this.filtrosIniciales.rol = "";
    }
    this.filtrosIniciales.idInstitucion = "2000";
    this.sigaServices
      .postPaginado("usuarios_search", "?numPagina=1", this.filtrosIniciales)
      .subscribe(
        data => {

          this.progressSpinner = false;
          this.searchUser = JSON.parse(data["body"]);
          this.datos = this.searchUser.usuarioItem;
          this.table.paginator = true;

          this.datos.forEach(element => {
            element.editable = false
            element.overlayVisible = false;
            element.idGrupo = [];
            for (let i in element.perfiles) {
              element.idGrupo.push(element.perfiles[i]);
            }
            let findDato = this.usuarios_rol.find(item => item.label === element.roles);
            element.rol = findDato.value;
          });
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          if (sessionStorage.getItem("first") != null) {
            let first = JSON.parse(sessionStorage.getItem("first")) as number;
            this.table.first = first;
            sessionStorage.removeItem("first");
          }
          this.datos.forEach((value2: any, key: number) => {
            value2.perfiles = [];
            if (value2.perfil != null) {
              let perfilasos = value2.perfil.split(";");
              perfilasos.forEach((valuePerfil: String, key: number) => {
                this.usuarios_perfil.forEach((value: ComboItem, key: number) => {
                  if (valuePerfil.trim() == value.value) {
                    value2.perfiles.push(value);
                  }
                });
              });
            }
          });
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        }
      );
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
        //console.log(err);
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
    //   if (!(
    //     (this.body.nombreApellidos == null ||
    //       this.body.nombreApellidos == undefined ||
    //       this.body.nombreApellidos == "") &&
    //     (this.body.nif == null ||
    //       this.body.nif == undefined ||
    //       this.body.nif == "") &&
    //     (this.body.rol == null ||
    //       this.body.rol == undefined) &&
    //     (this.body.grupo == null ||
    //       this.body.grupo == undefined)
    //   )) {
    //     this.filtrosIniciales = JSON.parse(JSON.stringify(this.body));
    //   }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  pInputText;

  actualizaSeleccionados(selectedDatos) {
    if (this.selectedDatos != undefined) {
      if (this.selectedDatos.length == 1) {
        this.activacionEditar = true;
      }
      this.numSelected = selectedDatos.length;
    } else {
      this.selectedDatos = [];
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  editUsuarios(evento) {
    if (this.selectedDatos == undefined) this.selectedDatos = [];
    if (evento.data.activo == "S" && this.historico) {
      this.selectedDatos.pop();
    }
    if (this.nuevo) {
      this.seleccion = false;
    } else {
      if (!this.selectAll && !this.selectMultiple) {

        this.datos.forEach(element => {
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

  Search() {
    this.updateUsuarios = [];
    this.nuevo = false;
    if (this.checkFilters()) {
      this.filtrosIniciales = JSON.parse(JSON.stringify(this.body));

      this.buscar = true;
      this.progressSpinner = true;
      if (this.body.nombreApellidos == undefined) {
        this.body.nombreApellidos = "";
      }
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

            this.progressSpinner = false;
            this.searchUser = JSON.parse(data["body"]);
            this.datos = this.searchUser.usuarioItem;
            this.table.paginator = true;

            this.datos.forEach(element => {
              element.editable = false
              element.overlayVisible = false;
              element.idGrupo = [];
              for (let i in element.perfiles) {
                element.idGrupo.push(element.perfiles[i]);
              }
              let findDato = this.usuarios_rol.find(item => item.label === element.roles);
              element.rol = findDato.value;
            });
            this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
          },
          () => {
            if (sessionStorage.getItem("first") != null) {
              let first = JSON.parse(sessionStorage.getItem("first")) as number;
              this.table.first = first;
              sessionStorage.removeItem("first");
            }
            this.datos.forEach((value2: any, key: number) => {
              value2.perfiles = [];
              if (value2.perfil != null) {
                let perfilasos = value2.perfil.split(";");
                perfilasos.forEach((valuePerfil: String, key: number) => {
                  this.usuarios_perfil.forEach((value: ComboItem, key: number) => {
                    if (valuePerfil.trim() == value.value) {
                      value2.perfiles.push(value);
                    }
                  });
                });
              }
            });
            this.datosInicial = JSON.parse(JSON.stringify(this.datos));
            setTimeout(() => {
              this.commonsService.scrollTablaFoco('tablaFoco');
            }, 5);
          }
        );
    }
  }

  editPerfiles(dato) {

    if (!this.nuevo) {

      let findUpdate = this.updateUsuarios.find(item => item.idUsuario === dato.idUsuario);

      if (findUpdate == undefined) {
        let dato2 = dato;
        dato2.idGrupo = [];
        for (let i in dato2.perfiles) {
          dato2.idGrupo.push(dato2.perfiles[i].value);
        }
        // let perfilesNuevo = "";
        // for (let i in dato2.perfiles) {
        //   perfilesNuevo += ";" + dato2.perfiles[i].value;
        // }
        // dato2.perfil = perfilesNuevo.substring(1, perfilesNuevo.length);
        this.updateUsuarios.push(dato2);
      } else {
        let updateFind = this.updateUsuarios.findIndex(item => item.idUsuario === dato.idUsuario);
        let dato2 = dato;
        dato2.idGrupo = [];
        for (let i in dato2.perfiles) {
          dato2.idGrupo.push(dato2.perfiles[i].value);
        }
        let findDato = this.usuarios_rol.find(item => item.label === dato2.roles);
        this.updateUsuarios[updateFind].rol = findDato.value;

      }
      // }
    } else {
      this.selectedDatos = [];
    }
  }

  validateUsuario(e) {
    if (!this.nuevo) {
      let datoId = this.datos.findIndex(item => item.idUsuario === this.selectedDatos[0].idUsuario);

      let dato = this.datos[datoId];

      this.editUsuario(dato);

    }
  }

  checkFilters() {
    if (
      (this.body.nombreApellidos == null ||
        this.body.nombreApellidos == undefined ||
        this.body.nombreApellidos == "") &&
      (this.body.nif == null ||
        this.body.nif == undefined ||
        this.body.nif == "") &&
      (this.body.rol == null ||
        this.body.rol == undefined) &&
      (this.body.grupo == null ||
        this.body.grupo == undefined)
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      return true;
    }
  }

  showSearchIncorrect() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "cen.busqueda.error.busquedageneral"
      )
    });
  }

  isLimpiar() {
    this.body = new UsuarioRequestDto();

  }

  paginate(event) {

  }

  setItalic(datoH) {
    if (datoH.activo == "S") return false;
    else return true;
  }

  newUsuario() {
    this.nuevo = true;
    this.seleccion = false;
    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let usuario = {
      idUsuario: "",
      activo: "",
      nombreApellidos: "",
      roles: "",
      codigoExterno: "",
      perfiles: "",
      usuarioNuevo: true
    };

    if (this.datos.length == 0) {
      this.datos.push(usuario);
    } else {
      this.datos = [usuario, ...this.datos];
    }
    this.selectedDatos = this.datos[0];

  }

  // editarUsuario(dato) {

  //   let findDato = this.datosInicial.find(item => item.idUsuario === dato.idUsuario);

  //   if (findDato != undefined) {
  //     if (dato.codigoExterno != findDato.codigoExterno || dato.perfil != findDato.perfil) {

  //       let findUpdate = this.updateUsuarios.find(item => item.codigoExterno === dato.codigoExterno && item.perfil === dato.perfil);
  //       if (findUpdate == undefined) {
  //         this.updateUsuarios.push(dato);
  //       }
  //     }
  //   }

  // }

  editUsuario(event) {
    if (event != undefined) {
      this.numSelected = this.selectedDatos.length
      if (this.numSelected > 1) {
        this.activacionEditar = false;
      }
    }
  }

  cancelar() {
    this.editar = false;
    this.dniCorrecto = null;
    this.body = new UsuarioRequestDto();
    this.body.activo = "S";
    this.disabledRadio = false;
  }

  deseleccionar() {
    if (this.nuevo) {
      this.nuevo = false;
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    }
    if (!this.historico) {
      this.selectMultiple = false;
      this.selectionMode = 'single';
      this.selectedDatos = [];
      this.selectAll = false;
    } else {
      this.selectedDatos = [];
      this.selectAll = false;
    }
  }

  borrar(selectedItem) {
    this.usuariosDelete = new UsuarioDeleteRequestDto();
    selectedItem.forEach((value: UsuarioItem, key: number) => {
      this.usuariosDelete.idUsuario.push(value.idUsuario);
      this.usuariosDelete.activo = value.activo;
      this.usuariosDelete.idInstitucion = "2000";
    });
    this.sigaServices.post("usuarios_delete", this.usuariosDelete).subscribe(
      data => {
        this.showSuccessDelete(selectedItem.length);
        this.selectionMode = 'single';
        this.historico = false;
        this.selectMultiple = false;
      },
      err => {
        this.showFail();
        //console.log(err);
      },
      () => {
        this.editar = false;
        this.dniCorrecto = null;
        this.body.activo = "S";
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
    this.datos[0].grupo = this.datos[0].perfiles;
    this.sigaServices.post("usuarios_insert", this.datos[0]).subscribe(
      data => {
        this.searchUser = JSON.parse(data["body"]);
        this.showSuccess();
      },
      error => {
        this.searchUser = JSON.parse(error["error"]);
        this.showduplicateFail(this.searchUser.error.message.toString());
      },
      () => {
        this.selectMultiple = false;
        this.Search();
        this.table.reset();
      }
    );
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
    if (!this.historico) {
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
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  confirmarBorrar(selectedItem) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";

    if (this.historico) {
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
    } else {
      if (selectedItem.length > 1) {
        mess =
          this.translateService.instant("messages.deleteConfirmation.much") +
          selectedItem.length +
          " " +
          this.translateService.instant("messages.deleteConfirmation.register") +
          "?";
      } else {
        let mess = this.translateService.instant("messages.deleteConfirmation");
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


  isSelectMultiple(isSelectMultiple) {
    this.selectAll = isSelectMultiple;
    if (!this.historico && this.activacionEditar) {
      if (this.nuevo) {
        this.nuevo = false;
        this.datos = JSON.parse(JSON.stringify(this.datosInicial));
      }
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectionMode = "single"
      } else {
        this.selectAll = false;
        this.selectionMode = "multiple"
      }
      this.numSelected = isSelectMultiple;
      this.datos.forEach(element => {
        element.editable = false;
      });
    }
  }

  // onChangeSelectAll() {
  // if (this.nuevo) {
  //   this.nuevo = false;
  //   this.datos = JSON.parse(JSON.stringify(this.datosInicial));
  // }
  //   if (this.selectAll === true) {
  //     this.selectMultiple = false;
  //     this.selectedDatos = this.datos;
  //     this.numSelected = this.datos.length;
  //     this.selectionMode = "multiple"
  //   } else {
  //     this.selectedDatos = [];
  //     this.numSelected = 0;
  //     this.selectionMode = "single"
  //   }
  //   this.datos.forEach(element => {
  //     element.editable = false;
  //   });
  // }

  onChangeSelectAll() {
    if (this.nuevo) {
      this.nuevo = false;
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    }
    if (this.activacionEditar) {
      if (!this.historico) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datos;
          this.numSelected = this.datos.length;
          this.selectedDatos = this.datos;
          this.selectionMode = "multiple"
        } else {
          this.selectionMode = "single";
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectionMode = "multiple"
          this.selectedDatos = this.datos.filter(dato => dato.activo == 'N')
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectionMode = "single";
          this.selectedDatos = [];
          this.numSelected = 0;
        }
      }
    }
  }



  sendEdit() {
    if (this.datos[0].usuarioNuevo) {
      if (this.datos[0].nif != undefined && this.datos[0].nif.length >= 9) {
        this.crear();
      } else {
        this.msgs = [];
        this.msgs.push({
          severity: "error",
          summary: "Error",
          detail: this.translateService.instant(
            "messages.nifcif.comprobacion.incorrecto"
          )
        });
      }
    } else {
      this.sigaServices.post("usuarios_update", this.updateUsuarios).subscribe(
        data => {
          this.showSuccess();

        },
        err => {
          this.showFail();
          //console.log(err);
        },
        () => {
          this.selectMultiple = false;
          this.Search();
          this.table.reset();
        }
      );
    }
  }
  disableGuardar() {
    if (this.updateUsuarios.length == 0 || this.nuevo) {
      if (this.nuevo && this.datos[0].nombreApellidos != "" && this.datos[0].nif != "" && this.datos[0].rol != "" && this.datos[0].rol != undefined && this.datos[0].perfiles != "" && this.datos[0].perfiles != undefined) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
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

  focusInputField() {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();
    }, 300);
  }


}
