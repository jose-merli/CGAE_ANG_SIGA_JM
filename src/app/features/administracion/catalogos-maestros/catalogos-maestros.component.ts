import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  HostListener,
  ElementRef
} from "@angular/core";
import { SigaServices } from "./../../../_services/siga.service";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { FormBuilder, FormGroup } from "@angular/forms";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { TranslateService } from "../../../commons/translate/translation.service";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { CatalogoRequestDto } from "./../../../../app/models/CatalogoRequestDto";
import { CatalogoHistoricoRequestDto } from "./../../../../app/models/CatalogoHistoricoRequestDto";
import { CatalogoResponseDto } from "./../../../../app/models/CatalogoResponseDto";
import { CatalogoUpdateRequestDto } from "./../../../../app/models/CatalogoUpdateRequestDto";
import { CatalogoCreateRequestDto } from "./../../../../app/models/CatalogoCreateRequestDto";
import { CatalogoDeleteRequestDto } from "./../../../../app/models/CatalogoDeleteRequestDto";
import { CatalogoMaestroItem } from "./../../../../app/models/CatalogoMaestroItem";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";
import { ComboItem } from "./../../../../app/models/ComboItem";
import { Router } from "@angular/router";
import { DialogoComunicacionesItem } from "../../../models/DialogoComunicacionItem";
import { esCalendar } from "./../../../utils/calendar";
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

  //Diálogo de comunicación
  showComunicar: boolean = false;
  modelosComunicacion: any[];
  bodyComunicacion: DialogoComunicacionesItem = new DialogoComunicacionesItem();
  tiposEnvio: any[];
  plantillas: any[];
  datosModelos: any[];
  colsModelos: any[];


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
      },
      err => {
        console.log(err);
      }
    );
    this.cols2 = [{ field: "codigoExt", header: "general.codigoext" }];
    this.cols = [{ field: "descripcion", header: "general.description" }];

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
              console.log(data);
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
              console.log(error);

              this.isBuscar();
            }
          );
        }

        value.editar = false;
      },
      () => {
        this.volver();
      }
    );
  }

  confirmEdit() {
    this.isEditar();
  }
  newData() {
    this.blockSeleccionar = true;
    console.log(this.datosHist);
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
    console.log(event);
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
          console.log(this.datosHist);
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
        console.log(this.datosHist);
      }
    }
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
      console.log(this.datosHist[0]);
      console.log(this.newCatalogo);
      this.cre = new CatalogoCreateRequestDto();
      this.cre.tabla = this.newCatalogo.catalogo;
      this.cre.idRegistro = "";
      this.cre.codigoExt = this.newCatalogo.codigoExt;
      this.cre.descripcion = this.newCatalogo.descripcion;
      this.cre.idInstitucion = "";
      this.cre.local = this.local;

      this.sigaServices.post("maestros_create", this.cre).subscribe(
        data => {
          this.showSuccess();
        },
        error => {
          this.searchCatalogo = JSON.parse(error["error"]);
          let mensaje = JSON.stringify(this.searchCatalogo.error.message);
          this.showFail(mensaje.substring(1, mensaje.length - 1));
          console.log(error);
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
      console.log(this.inputDesc);
    }
  }

  cdgoEvent(e) {
    if (e) {
      this.newCatalogo.codigoExt = e.srcElement.value.trim();
      this.newCatalogo.codigoExt = this.newCatalogo.codigoExt.trim();
      this.cdgoExt = this.newCatalogo.codigoExt;
      this.inputCdgoExt.nativeElement.value = e.srcElement.value.trim();
      console.log(this.inputCdgoExt);
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
        console.log(data);
        this.searchCatalogo = JSON.parse(data["body"]);
        this.datosEdit = this.searchCatalogo.catalogoMaestroItem;
        this.datosHist = this.searchCatalogo.catalogoMaestroItem;
      },
      err => {
        console.log(err);
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
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.pressNew = false;
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
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
    sessionStorage.setItem("searchOrHistory", JSON.stringify("search"));
    this.buscar = true;
    this.blockBuscar = false;
    this.blockCrear = false;
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
          console.log(data);

          this.searchCatalogo = JSON.parse(data["body"]);
          this.datosEdit = this.searchCatalogo.catalogoMaestroItem;
          this.datosHist = this.searchCatalogo.catalogoMaestroItem;
        },
        err => {
          console.log(err);
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
        console.log(error);
        this.table.reset();
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
  irEditarCatalogo(id) {
    if (!this.selectMultiple) {
      var ir = null;
      if (id && id.length > 0) {
        ir = id[0];
      }
    } else {
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
      console.log(value);
      this.del.idRegistro.push(value.idRegistro);
      this.del.tabla = value.catalogo;
      this.del.local = this.local;
    });
    this.sigaServices.post("maestros_delete", this.del).subscribe(
      data => {
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
      },
      err => {
        console.log(err);
      },
      () => {
        this.isBuscar();
        this.editar = false;
      }
    );
  }
  isHabilitadoEliminar() {
    return this.eliminar;
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
      this.numSelected = this.datosHist.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER && !this.blockBuscar) {
      this.isBuscar();
    }
  }

  clear() {
    this.msgs = [];
  }


  //Diálogo de comunicación: ver y enviar servicio
  onComunicar(dato) {
    this.showComunicar = true;
  }

  onEnviarComunicacion() {
    this.showComunicar = false;
  }



}
