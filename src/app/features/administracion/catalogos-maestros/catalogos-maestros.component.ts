import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  Input
} from "@angular/core";
import { SigaServices } from "./../../../_services/siga.service";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { SelectItem } from "primeng/api";
import { MenuItem } from "primeng/api";
import { Http, Response } from "@angular/http";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { Router } from "@angular/router";
import { TranslateService } from "../../../commons/translate/translation.service";
import { MessageService } from "primeng/components/common/messageservice";
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

@Component({
  selector: "app-catalogos-maestros",
  templateUrl: "./catalogos-maestros.component.html",
  styleUrls: ["./catalogos-maestros.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CatalogosMaestros extends SigaWrapper implements OnInit {
  maestros_update: String;
  maestros_create: String;
  maestros_delete: String;

  body: CatalogoRequestDto = new CatalogoRequestDto();

  //Creo los objetos para interactuar con sus respectivos DTO
  searchCatalogo: CatalogoResponseDto = new CatalogoResponseDto();
  his: CatalogoHistoricoRequestDto = new CatalogoHistoricoRequestDto();
  upd: CatalogoUpdateRequestDto = new CatalogoUpdateRequestDto();
  cre: CatalogoCreateRequestDto = new CatalogoCreateRequestDto();
  del: CatalogoDeleteRequestDto = new CatalogoDeleteRequestDto();

  pButton;
  buscar: boolean = false;
  tablaHistorico: boolean = false;
  editar: boolean = false;
  eliminar: boolean = false;
  crear: boolean = true;
  selectMultiple: boolean = false;
  selectedItem: number = 10;
  selectAll: boolean = false;

  formBusqueda: FormGroup;
  cols: any = [];
  datos: any[];
  datosHist: any[];
  datosEdit: any[];
  select: any[];

  //Array de opciones del dropdown
  catalogoArray: any[];

  //elemento seleccionado en el dropdown
  catalogoSeleccionado: String;

  //elementos del form
  formDescripcion: String;
  formCodigo: String;

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
  activacionEditar: boolean;
  newCatalogo: CatalogoMaestroItem = new CatalogoMaestroItem();
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();

  rowsPerPage: any = [];

  @ViewChild("table") table;
  selectedDatos;
  constructor(
    private formBuilder: FormBuilder,
    private sigaServices: SigaServices,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
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

  isEditar() {
    this.datosHist.forEach(
      (value: CatalogoMaestroItem, key: number) => {
        if (value.editar) {
          this.upd = new CatalogoUpdateRequestDto();
          this.upd.tabla = value.catalogo;
          this.upd.descripcion = value.descripcion;
          this.upd.codigoExt = value.codigoExt;
          this.upd.idRegistro = value.idRegistro;
          this.sigaServices.post("maestros_update", this.upd).subscribe(
            data => {
              this.showSuccess();
              console.log(data);
              sessionStorage.setItem(
                "registroAuditoriaUsuariosActualizado",
                JSON.stringify(true)
              );
            },
            error => {
              this.searchCatalogo = JSON.parse(error["error"]);
              this.showFail(this.searchCatalogo.error.message.toString());
              console.log(error);
            }
          );
        }
      },
      () => {
        this.volver();
      }
    );
  }
  confirmEdit() {
    let mess = this.translateService.instant(
      "general.message.aceptar.y.volver"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.isEditar();
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

    this.pressNew = true;
    this.buscar = false;
    this.datosHist = [dummy, ...this.datosHist];
    this.newCatalogo = new CatalogoMaestroItem();
    this.newCatalogo.catalogo = this.body.catalogo;

    console.log(this.datosHist);
    this.table.reset();
  }
  editarCompleto(event) {
    console.log(event);
    let data = event.data;
    //compruebo si la edicion es correcta con la basedatos
    this.editar = true;
    this.datosHist.forEach((value: CatalogoMaestroItem, key: number) => {
      if (value.idRegistro == data.idRegistro) {
        value.editar = true;
      }
    });
    console.log(this.datosHist);
  }
  volver() {
    this.editar = false;
    this.isBuscar();
  }
  confirmarCrear() {
    console.log(this.datosHist[0]);
    console.log(this.newCatalogo);
    this.cre = new CatalogoCreateRequestDto();
    this.cre.tabla = this.newCatalogo.catalogo;
    this.cre.idRegistro = "";
    this.cre.codigoExt = this.newCatalogo.codigoExt;
    this.cre.descripcion = this.newCatalogo.descripcion;
    this.cre.idInstitucion = "";
    this.sigaServices.post("maestros_create", this.cre).subscribe(
      data => {
        this.showSuccess();
      },
      error => {
        this.searchCatalogo = JSON.parse(error["error"]);
        this.showFail(this.searchCatalogo.error.message.toString());
        console.log(error);
      },
      () => {
        this.reset();
      }
    );
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
        } else {
          this.activacionEditar = false;
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
  onChangeCatalogo() {
    if (this.body.catalogo == "") {
      this.blockBuscar = true;
      this.blockCrear = true;
    } else {
      this.blockBuscar = false;
    }
    this.isBuscar();
  }
  //cada vez que cambia el formulario comprueba esto
  onChangeForm() {
    if (this.newCatalogo.codigoExt == undefined) {
      this.newCatalogo.codigoExt = "";
    }
    if (
      this.newCatalogo.descripcion == "" ||
      this.newCatalogo.descripcion == undefined
    ) {
      this.blockCrear = true;
    } else {
      this.blockCrear = false;
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
    this.body = new CatalogoRequestDto();
    this.body.catalogo = this.catalogoSeleccionado;
    this.bodyToForm();
    this.his = new CatalogoHistoricoRequestDto();
    this.his.catalogo = this.body.catalogo;
    this.his.codigoExt = "";
    this.his.descripcion = "";
    this.his.idInstitucion = "";
    this.his.idRegistro = "";
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
        this.reset();
      }
    );
  }
  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
    }
    this.volver();
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
    this.crear = false;
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
        }
      );
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
    this.cre.codigoExt = this.formCodigo;
    this.cre.descripcion = this.formDescripcion;
    this.cre.idInstitucion = "";
    this.sigaServices.post("maestros_create", this.cre).subscribe(
      data => {
        this.showSuccess();
      },
      error => {
        this.searchCatalogo = JSON.parse(error["error"]);
        this.showFail(this.searchCatalogo.error.message.toString());
        console.log(error);
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
    this.body = new CatalogoRequestDto();
    this.body.catalogo = this.catalogoSeleccionado;
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
      // sessionStorage.removeItem("catalogoBody");
      // sessionStorage.removeItem("privilegios");
      // sessionStorage.removeItem("searchCatalogo");
      // sessionStorage.setItem("catalogoBody", JSON.stringify(id));
      // sessionStorage.setItem("searchCatalogo", JSON.stringify(this.body));
      // if (id[0].fechaBaja != null) {
      //   sessionStorage.setItem("privilegios", JSON.stringify(false));
      // } else {
      //   sessionStorage.setItem(
      //     "privilegios",
      //     JSON.stringify(this.activacionEditar)
      //   );
      // }

      // this.router.navigate(["/EditarCatalogosMaestros"]);
    } else {
      this.editar = false;
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
      this.selectMultiple = true;
      this.selectedDatos = this.datosHist;
    } else {
      this.selectMultiple = false;
      this.selectedDatos = [];
    }
  }
}
