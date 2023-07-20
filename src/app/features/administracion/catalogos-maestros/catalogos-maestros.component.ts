import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { TranslateService } from "../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { CatalogoCreateRequestDto } from "./../../../../app/models/CatalogoCreateRequestDto";
import { CatalogoDeleteRequestDto } from "./../../../../app/models/CatalogoDeleteRequestDto";
import { CatalogoHistoricoRequestDto } from "./../../../../app/models/CatalogoHistoricoRequestDto";
import { CatalogoMaestroItem } from "./../../../../app/models/CatalogoMaestroItem";
import { CatalogoRequestDto } from "./../../../../app/models/CatalogoRequestDto";
import { CatalogoResponseDto } from "./../../../../app/models/CatalogoResponseDto";
import { CatalogoUpdateRequestDto } from "./../../../../app/models/CatalogoUpdateRequestDto";
import { ComboItem } from "./../../../../app/models/ComboItem";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";
import { SigaServices } from "./../../../_services/siga.service";
export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-catalogos-maestros",
  templateUrl: "./catalogos-maestros.component.html",
  styleUrls: ["./catalogos-maestros.component.scss"],
  host: {
    "(document:keypress)": "onKeyPress($event)"
  },
  encapsulation: ViewEncapsulation.None
})
export class CatalogosMaestros extends SigaWrapper implements OnInit {
  @Output() valueFocus = new EventEmitter();
  maestros_update: String;
  maestros_create: String;
  maestros_delete: String;
  pButton;
  body: CatalogoRequestDto = new CatalogoRequestDto();

  //Creo los objetos para interactuar con sus respectivos DTO
  searchCatalogo: CatalogoResponseDto = new CatalogoResponseDto();
  his: CatalogoHistoricoRequestDto = new CatalogoHistoricoRequestDto();
  upd: CatalogoUpdateRequestDto = new CatalogoUpdateRequestDto();
  cre: CatalogoCreateRequestDto = new CatalogoCreateRequestDto();
  del: CatalogoDeleteRequestDto = new CatalogoDeleteRequestDto();

  buscar: boolean = false;
  tablaHistorico: boolean = false;
  editar: boolean = false;
  eliminar: boolean = false;
  progressSpinner: boolean = false;

  selectMultiple: boolean = false;
  selectedItem: number = 10;
  selectAll: boolean = false;

  formBusqueda: FormGroup;
  cols: any = [];
  cols2: any = [];
  datos: any[];
  datosHist: any[];
  datosNew: any[];
  datosEdit: any[];
  select: any[];
  codigoExtAux: String;
  descripcionAux: String;
  //Array de opciones del dropdown
  catalogoArray: any[];

  //elemento seleccionado en el dropdown
  catalogoSeleccionado: String;
  local: String;

  //elementos del form
  formDescripcion: String;
  formCodigo: String;
  cdgoExt: String;
  descripcion: String;

  //mensajes
  msgs: Message[] = [];

  showDatosGenerales: boolean = true;
  blockSeleccionar: boolean = false;
  blockBuscar: boolean = true;
  blockCrear: boolean = true;
  pressNew: boolean = false;
  eliminado: boolean = false;
  //validacion permisos
  permisosTree: any;
  permisosArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean = true;
  newCatalogo: CatalogoMaestroItem = new CatalogoMaestroItem();
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  rowsPerPage: any = [];
  numSelected: number = 0;
  first: number = 0;



  @ViewChild("input1") inputEl: ElementRef;
  @ViewChild("inputDesc") inputDesc: ElementRef;
  @ViewChild("inputCdgoExt") inputCdgoExt: ElementRef;

  @ViewChild("table") table;
  selectedDatos;
  constructor(
    private formBuilder: FormBuilder,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private router: Router
  ) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({});
  }

  //Cargo el combo nada mas comenzar
  ngOnInit() {
    this.checkAcceso();
    this.sigaServices.get("maestros_rol").subscribe(
      n => {
        this.catalogoArray = n.comboCatalogoItems;
        this.catalogoArray = this.catalogoArray.filter(filtrado => filtrado.value != "SCS_TIPOFUNDAMENTOS");
     
      },
      err => {
        //console.log(err);
      }
    );
    this.cols2 = [{ field: "codigoExt", header: "general.codigoext" }];
    this.cols = [{ field: "descripcion", header: "general.description" }];

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

    var registroActualizado = JSON.parse(
      sessionStorage.getItem("registroAuditoriaUsuariosActualizado")
    );
    if (registroActualizado) {
      this.showSuccess();
      sessionStorage.setItem(
        "registroAuditoriaUsuariosActualizado",
        JSON.stringify(false)
      );
    }

    if (sessionStorage.getItem("searchCatalogo") != null) {
      this.body = JSON.parse(sessionStorage.getItem("searchCatalogo"));

      let tablaAnterior = JSON.parse(sessionStorage.getItem("searchOrHistory"));
      sessionStorage.removeItem("searchOrHistory");

      if (tablaAnterior == "history") {
        this.historico();
      } else {
        this.isBuscar();
      }
      sessionStorage.removeItem("searchCatalogo");
      sessionStorage.removeItem("catalogoBody");
    } else {
      this.body = new CatalogoRequestDto();
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  isEditar() {
    sessionStorage.setItem("first", JSON.stringify(this.table.first));

    this.datosHist.forEach(
      (value: CatalogoMaestroItem, key: number) => {
        if (value.editar) {
          this.upd = new CatalogoUpdateRequestDto();
          this.upd.tabla = value.catalogo;
          this.upd.descripcion = value.descripcion.trim();
          if (value.codigoExt == null) {
            this.upd.codigoExt = value.codigoExt;
          } else {
            this.upd.codigoExt = value.codigoExt.trim();
          }

          this.upd.idRegistro = value.idRegistro;

          this.upd.local = this.local;

          this.sigaServices.post("maestros_update", this.upd).subscribe(
            data => {
              this.showSuccess();
              sessionStorage.setItem(
                "registroAuditoriaUsuariosActualizado",
                JSON.stringify(true)
              );
              this.isBuscar();
            },
            error => {
              this.searchCatalogo = JSON.parse(error["error"]);
              let mensaje = JSON.stringify(this.searchCatalogo.error.message);
              this.showFail(mensaje.substring(1, mensaje.length - 1));

              this.isBuscar();
            }
          );
        }

        value.editar = false;
      }
    );

    this.editar = false;
    this.blockCrear = true;

  }

  confirmEdit() {
    this.isEditar();
  }
  newData() {
    this.blockSeleccionar = true;
    let dummy = {
      catalogo: "",
      codigoExt: "",
      descripcion: "",
      fechaBaja: "",
      idInstitucion: "",
      idRegistro: ""
    };
    let value = this.table.first;
    this.pressNew = true;
    this.buscar = false;

    this.datosNew = [dummy, ...this.datosHist];

    this.newCatalogo = new CatalogoMaestroItem();
    this.newCatalogo.catalogo = this.body.catalogo;
    this.cdgoExt = "";
    this.descripcion = "";
    this.table.reset();
  }

  createArrayEdit(dummy, index) {
    if (index != 0) {
      for (let i = 0; i < this.datosHist.length; i++) {
        if (this.table.first != index) {
          this.datosNew = [...this.datosNew, ...this.datosHist[i]];
        } else {
          this.datosNew = [...this.datosNew, dummy, ...this.datosHist[i]];
        }
      }
    } else {
      this.datosNew = [dummy, ...this.datosHist];
    }
  }

  editarCompleto(event) {
    let data = event.data;

    if (data.codigoExt != null && data.codigoExt != undefined) {
      if (
        data.descripcion.length > 2000 ||
        (data.codigoExt.length > 10 &&
          data.codigoExt != null &&
          data.codigoExt != undefined)
      ) {
        this.datosHist.forEach((value: CatalogoMaestroItem, key: number) => {
          if (value.idRegistro == data.idRegistro) {
            value.descripcion = data.descripcion.substring(0, 1950);
            value.codigoExt = data.codigoExt.substring(0, 10);
          }
        });
        this.inputEl.nativeElement.focus();
      } else {
        //compruebo si la edicion es correcta con la basedatos
        if (this.onlySpaces(data.descripcion)) {
          this.blockCrear = true;
        } else {
          this.editar = true;
          this.blockCrear = false;
          this.datosHist.forEach((value: CatalogoMaestroItem, key: number) => {
            if (value.idRegistro == data.idRegistro) {
              value.editar = true;
            }
          });
        }
      }
    } else {
      //compruebo si la edicion es correcta con la basedatos
      if (this.onlySpaces(data.descripcion)) {
        this.blockCrear = true;
      } else {
        this.editar = true;
        this.blockCrear = false;
        this.datosHist.forEach((value: CatalogoMaestroItem, key: number) => {
          if (value.idRegistro == data.idRegistro) {
            value.editar = true;
          }
        });
      }
    }
  }

  onEditCancel(event) {
    this.editar = false;
    this.valueFocus.emit(event);
  }

  guardarCodigo(event) {
    let data = event.data;
    this.codigoExtAux = data.codigoExt;
    this.descripcionAux = data.descripcion;
  }
  volver() {
    this.editar = false;
    this.isBuscar();
  }
  confirmarCrear() {
    if (this.newCatalogo.descripcion) {
      this.cre = new CatalogoCreateRequestDto();
      this.cre.tabla = this.newCatalogo.catalogo;
      this.cre.idRegistro = "";
      this.cre.codigoExt = this.newCatalogo.codigoExt;
      this.cre.descripcion = this.newCatalogo.descripcion;
      this.cre.idInstitucion = "";
      this.cre.local = this.local;

      this.progressSpinner = true;

      this.sigaServices.post("maestros_create", this.cre).subscribe(
        data => {
          this.progressSpinner = false;
          this.showSuccess();
        },
        error => {
          this.searchCatalogo = JSON.parse(error["error"]);
          let mensaje = JSON.stringify(this.searchCatalogo.error.message);
          this.showFail(mensaje.substring(1, mensaje.length - 1));
          this.pressNew = false;
          this.isBuscar();
        },
        () => {
          this.reset();
        }
      );
    } else {
      this.showFail("La descripción no puede estar vacía");
    }
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "78";
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

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
  // Control de buscar desactivado por ahora (hasta tener primer elemento del combo preparado)
  onChangeCatalogo(event) {
    if (this.body.catalogo == "") {
      this.blockBuscar = true;
      this.blockCrear = true;
    } else {
      this.blockBuscar = false;
    }
    this.body.catalogo = event.value;
    this.catalogoArray.forEach((value: ComboItem, key: number) => {
      if (value.value == event.value) {
        this.body.local = value.local;
        this.local = value.local;
      }
    });

    this.isBuscar();
  }

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
  // cada vez que cambia el formulario comprueba esto
  onChangeForm() {
    this.newCatalogo.descripcion = this.descripcion;
    this.newCatalogo.descripcion = this.newCatalogo.descripcion.replace(
      /^\s+|\s+$/g,
      ""
    );

    if (this.newCatalogo.codigoExt == undefined) {
      this.newCatalogo.codigoExt = "";
    }

    if (
      this.newCatalogo.descripcion == "" ||
      this.newCatalogo.descripcion == undefined ||
      this.onlySpaces(this.newCatalogo.descripcion)
    ) {
      this.blockCrear = true;
    } else {
      this.descripcion = this.newCatalogo.descripcion.replace(/^\s+|\s+$/g, "");
      this.blockCrear = false;
    }
  }

  onChangeFormCdgoExt() {
    this.newCatalogo.codigoExt = this.cdgoExt;
    this.newCatalogo.codigoExt = this.newCatalogo.codigoExt.replace(
      /^\s+|\s+$/g,
      ""
    );

    if (this.newCatalogo.codigoExt == undefined) {
      this.newCatalogo.codigoExt = "";
    } else {
      this.cdgoExt = this.newCatalogo.codigoExt.replace(/^\s+|\s+$/g, "");
    }
  }

  descripcionEvent(e) {
    if (e) {
      this.newCatalogo.descripcion = e.srcElement.value.trim();
      this.newCatalogo.descripcion = this.newCatalogo.descripcion.trim();
      this.descripcion = this.newCatalogo.descripcion;
      this.inputDesc.nativeElement.value = e.srcElement.value.trim();
    }
  }

  cdgoEvent(e) {
    if (e) {
      this.newCatalogo.codigoExt = e.srcElement.value.trim();
      this.newCatalogo.codigoExt = this.newCatalogo.codigoExt.trim();
      this.cdgoExt = this.newCatalogo.codigoExt;
      this.inputCdgoExt.nativeElement.value = e.srcElement.value.trim();
    }
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail(message: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: message
    });
  }

  historico() {
    sessionStorage.setItem("searchOrHistory", JSON.stringify("history"));
    this.progressSpinner = true;
    this.buscar = false;
    this.selectMultiple = false;
    this.catalogoSeleccionado = this.body.catalogo;
    this.local = this.body.local;
    this.selectAll = false;
    this.body = new CatalogoRequestDto();
    this.body.catalogo = this.catalogoSeleccionado;
    this.body.local = this.local;
    this.bodyToForm();
    this.his = new CatalogoHistoricoRequestDto();
    this.his.catalogo = this.body.catalogo;
    this.his.codigoExt = "";
    this.his.descripcion = "";
    this.his.idInstitucion = "";
    this.his.idRegistro = "";
    this.his.local = this.body.local;
    this.tablaHistorico = true;
    this.eliminar = true;
    this.sigaServices.post("maestros_historico", this.his).subscribe(
      data => {
        this.searchCatalogo = JSON.parse(data["body"]);
        this.datosEdit = this.searchCatalogo.catalogoMaestroItem;
        this.datosHist = this.searchCatalogo.catalogoMaestroItem;
        this.progressSpinner = false;
      },
      err => {
        //console.log(err); this.progressSpinner = false;
      },
      () => {
        if (this.datosHist != null && this.datosHist != undefined) {
          this.datosHist.forEach((value: CatalogoMaestroItem, key: number) => {
            value.editar = false;
          });
        }
        this.reset();
      }
    );
    this.numSelected = 0;
  }
  isSelectMultiple() {
    if (this.activacionEditar) {
      this.selectMultiple = !this.selectMultiple;
      this.selectedDatos = this.datosHist;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        // if (this.tablaHistorico) {
        //   this.eliminado = false;
        // }
        this.selectedDatos.forEach((value: CatalogoMaestroItem, key: number) => {
          if (value.fechaBaja == null) {
            this.eliminado = true;
          } else {
            this.eliminado = false;
          }
        });
        this.pressNew = false;
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }

    // this.volver();
  }

  activarPaginacion() {
    if (this.datosHist == undefined) {
      return false;
    } else {
      if (this.datosHist.length == 0) return false;
      else return true;
    }
  }

  isBuscar() {
    this.progressSpinner = true;
    sessionStorage.setItem("searchOrHistory", JSON.stringify("search"));
    this.buscar = true;
    this.blockBuscar = false;
    // this.blockCrear = false;
    this.selectAll = false;
    this.selectMultiple = false;
    this.tablaHistorico = false;
    this.eliminar = false;
    if (this.body.codigoExt != undefined) {
      this.formToBody();
    }
    if (this.body.codigoExt == undefined) {
      this.body.codigoExt = "";
      this.formToBody();
    }
    if (this.body.descripcion == undefined) {
      this.body.descripcion = "";
      this.formToBody();
    }
    if (this.body.idInstitucion == undefined) {
      this.body.idInstitucion = "";
    }
    if (this.body.local == undefined) {
      this.body.local = "";
    }
    this.sigaServices
      .postPaginado("maestros_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.searchCatalogo = JSON.parse(data["body"]);
          this.datosEdit = this.searchCatalogo.catalogoMaestroItem;
          this.datosHist = this.searchCatalogo.catalogoMaestroItem;

          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.datosHist.forEach((value: CatalogoMaestroItem, key: number) => {
            value.editar = false;
          });
        }
      );
    this.numSelected = 0;
  }

  isLimpiar() {
    this.body = new CatalogoRequestDto();
    this.bodyToForm();
    this.editar = false;
    this.blockSeleccionar = false;
    this.blockCrear = true;
    this.blockBuscar = true;
  }

  isCrear() {
    this.cre = new CatalogoCreateRequestDto();
    this.cre.tabla = this.body.catalogo;
    this.cre.idRegistro = "";
    this.cre.codigoExt = this.formCodigo.trim();
    this.cre.descripcion = this.formDescripcion.trim();
    this.cre.idInstitucion = "";
    this.sigaServices.post("maestros_create", this.cre).subscribe(
      data => {
        this.showSuccess();
        this.isBuscar();
      },
      error => {
        this.searchCatalogo = JSON.parse(error["error"]);
        let mensaje = JSON.stringify(this.searchCatalogo.error.message);
        this.showFail(mensaje.substring(1, mensaje.length - 1));
        this.table.reset();
        this.pressNew = false;
        this.isBuscar();
      },
      () => {
        this.reset();
      }
    );
  }

  reset() {
    if (this.buscar == true) {
      this.table.reset();
    }
    this.editar = false;
    this.selectedDatos = [];
    this.catalogoSeleccionado = this.body.catalogo;
    this.local = this.body.local;
    this.body = new CatalogoRequestDto();
    this.body.catalogo = this.catalogoSeleccionado;
    this.body.local = this.local;
    this.blockSeleccionar = false;
    this.pressNew = false;
    this.bodyToForm();
    if (this.tablaHistorico == false) {
      this.isBuscar();
    }

    this.blockCrear = true;
  }

  formToBody() {
    this.body.descripcion = this.formDescripcion;
    this.body.codigoExt = this.formCodigo;
  }

  bodyToForm() {
    this.formDescripcion = this.body.descripcion;
    this.formCodigo = this.body.codigoExt;
  }
  irEditarCatalogo(selectedDatos) {
    if (selectedDatos && selectedDatos.length > 0) {
      if (this.tablaHistorico) {
        this.selectedDatos.forEach((value: CatalogoMaestroItem, key: number) => {
          if (value.fechaBaja == null) {
            this.eliminado = true;
          } else {
            this.eliminado = false;
          }
        });
      }
      else {
        if (selectedDatos[0].fechaBaja == null) {
          this.eliminado = false;
        }
      }
    }

    if (this.selectMultiple) {
      this.editar = false;
      this.numSelected = this.selectedDatos.length;
    }
  }

  editarCatalogos(selectedDatos) {
    if (selectedDatos.length == 1) {
      this.body = new CatalogoRequestDto();
      this.body = selectedDatos[0];
      this.editar = true;
      this.blockSeleccionar = true;
      this.bodyToForm();
    } else {
      this.editar = false;
      this.blockSeleccionar = false;

      this.body = new CatalogoRequestDto();
      this.bodyToForm();
      this.table.reset();
    }
  }

  isEliminar(selectedDatos) {
    this.del = new CatalogoDeleteRequestDto();
    selectedDatos.forEach((value: CatalogoMaestroItem, key: number) => {
      this.del.idRegistro.push(value.idRegistro);
      this.del.tabla = value.catalogo;
      this.del.local = this.local;
    });
    this.sigaServices.post("maestros_delete", this.del).subscribe(
      data => {
        let status = JSON.parse(data["body"]);

        if (status.status == 'OK') {
          if (selectedDatos == 1) {
            this.msgs = [];
            this.msgs.push({
              severity: "success",
              summary: "Correcto",
              detail: this.translateService.instant("messages.deleted.success")
            });
          } else {
            this.msgs = [];
            this.msgs.push({
              severity: "success",
              summary: "Correcto",
              detail:
                selectedDatos.length +
                " " +
                this.translateService.instant("messages.deleted.selected.success")
            });
          }
        } else {
          this.msgs = [];
          this.msgs.push({
            severity: "error",
            summary: "Incorrecto",
            detail:
              selectedDatos.length +
              " " +
              this.translateService.instant("general.message.error.realiza.accion")
          });
        }

        if (this.tablaHistorico == true) {
          this.historico();
        } else {
          this.isBuscar();
        }
        this.editar = true;
        this.eliminar = true;
        this.selectedDatos = [];
        this.progressSpinner = false;
      }
    );
  }
  isActivar(selectedDatos) {
    this.del = new CatalogoDeleteRequestDto();
    selectedDatos.forEach((value: CatalogoMaestroItem, key: number) => {
      this.del.idRegistro.push(value.idRegistro);
      this.del.tabla = value.catalogo;
      this.del.local = this.local;
    });
    this.sigaServices.post("maestros_activate", this.del).subscribe(
      data => {
        let status = JSON.parse(data["body"]);

        if (status.status == 'OK') {
          if (selectedDatos == 1) {
            this.msgs = [];
            this.msgs.push({
              severity: "success",
              summary: "Correcto",
              detail: this.translateService.instant("messages.activate.success")
            });
          } else {
            this.msgs = [];
            this.msgs.push({
              severity: "success",
              summary: "Correcto",
              detail:
                selectedDatos.length +
                " " +
                this.translateService.instant("messages.activate.selected.success")
            });
          }
        } else {
          this.msgs = [];
          this.msgs.push({
            severity: "error",
            summary: "Incorrecto",
            detail:
              selectedDatos.length +
              " " +
              this.translateService.instant("general.message.error.realiza.accion")
          });
        }
        this.isBuscar();
        this.editar = true;
        this.eliminar = true;
        this.selectedDatos = [];
        this.progressSpinner = false;
      }
    );
  }
  isHabilitadoEliminar() {
    if (this.activacionEditar) {
      if (this.selectedDatos != null && this.selectedDatos != '') {
        if (this.eliminado) {
          this.eliminar = true;
        } else {
          this.eliminar = false;
        }
      } else {
        this.eliminar = true;
      }
    } else {
      this.eliminar = true;
    }
    return this.eliminar;
  }
  confirmarBorrar(selectedDatos) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";

    // if (selectedDatos.length > 1) {
    //   mess =
    //     this.translateService.instant("messages.deleteConfirmation.much") +
    //     selectedDatos.length +
    //     " " +
    //     this.translateService.instant("messages.deleteConfirmation.register") +
    //     "?";
    // }
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.isEliminar(selectedDatos);
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

        this.selectAll = false;
        this.selectMultiple = false;
        this.selectedDatos = [];
        this.eliminar = false;
        this.progressSpinner = false;
      }
    });
  }

  confirmarActivar(selectedDatos) {
    let mess = this.translateService.instant("messages.activateConfirmation");
    let icon = "fa fa-trash-alt";

    // if (selectedDatos.length > 1) {
    //   mess =
    //     this.translateService.instant("messages.deleteConfirmation.much") +
    //     selectedDatos.length +
    //     " " +
    //     this.translateService.instant("messages.deleteConfirmation.register") +
    //     "?";
    // }
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.isActivar(selectedDatos);
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

        this.selectAll = false;
        this.selectMultiple = false;
        this.selectedDatos = [];
        this.eliminar = false;
        this.progressSpinner = false;
      }
    });
  }

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }
  setBold(data) {
    if (data.local == null) {
      return false;
    } else if (data.local == "") {
      return false;
    } else if (data.local == "N") {
      return false;
    } else {
      return true;
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datosHist;
      if (this.tablaHistorico) {
        this.selectedDatos.forEach((value: CatalogoMaestroItem, key: number) => {
          if (value.fechaBaja == null) {
            this.eliminado = false;
          } else {
            // this.eliminado = false;
            this.selectedDatos = this.datosHist.filter(datoHist => datoHist.fechaBaja != undefined && datoHist.fechaBaja != null);
          }
        });
      } else {
        this.selectedDatos.forEach((value: CatalogoMaestroItem, key: number) => {
          if (value.fechaBaja == null) {
            this.eliminado = false;
          } else {
            // this.eliminado = true;
            this.selectedDatos = this.datosHist.filter(datoHist => datoHist.fechaBaja != undefined && datoHist.fechaBaja != null);
          }
        });
      }
      this.numSelected = this.selectedDatos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }

  clear() {
    this.msgs = [];
  }





}
