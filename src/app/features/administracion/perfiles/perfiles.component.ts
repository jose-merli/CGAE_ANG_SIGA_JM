import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  ElementRef
} from "@angular/core";
import { SigaServices } from "./../../../_services/siga.service";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { TranslateService } from "../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { PerfilItem } from "./../../../../app/models/PerfilItem";
import { PerfilesResponseDto } from "./../../../../app/models/PerfilesResponseDto";
import { PerfilesRequestDto } from "./../../../../app/models/PerfilesRequestDto";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";
import { ComboItem } from "./../../../../app/models/ComboItem";
import { DataTable } from "primeng/datatable";
import { Error } from "../../../models/Error";
import { DialogoComunicacionesItem } from "../../../models/DialogoComunicacionItem";
import { MultiSelect } from 'primeng/multiselect';

@Component({
  selector: "app-perfiles",
  templateUrl: "./perfiles.component.html",
  styleUrls: ["./perfiles.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PerfilesComponent extends SigaWrapper implements OnInit {
  perfiles_data: any[];
  usuarios_rol: any[];
  cols: any = [];
  textFilter: String;
  datos: any[];
  textSelected: String = "{0} roles seleccionados";
  rolesNoAsignados: any[];
  msgs: Message[] = [];
  searchPerfiles: PerfilesResponseDto = new PerfilesResponseDto();
  requestPerfiles: PerfilesRequestDto = new PerfilesRequestDto();
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  newPerfil: PerfilItem = new PerfilItem();
  rowsPerPage: any = [];
  elementosAGuardar: PerfilItem[] = [];
  showDatosGenerales: boolean = true;
  pButton;
  editar: boolean = false;
  buscar: boolean = true;
  isRestablecer: boolean = false;
  save: boolean = false;
  isForSave: boolean = true;
  pressNew: boolean = true;
  progressSpinner: boolean = false;
  isforNew: boolean = true;
  historicoActive: boolean = false;
  blockSeleccionar: boolean = false;
  disabled: boolean = false;
  selectMultiple: boolean = false;
  blockCrear: boolean = true;
  permisosTree: any;
  permisosArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean = false;
  selectedItem: number = 10;
  selectAll: boolean = false;
  numSelected: number = 0;
  @ViewChild('someDropdown') someDropdown: MultiSelect;


  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("input2")
  inputEl: ElementRef;
  @ViewChild("table")
  table: DataTable;
  selectedDatos;

  ngOnInit() {
    this.textFilter = "Elegir";
    this.activacionEditar = false;
    this.sigaServices.get("usuarios_rol").subscribe(
      n => {
        this.usuarios_rol = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
    // this.isBuscar();
    this.checkAcceso();
    this.reestablecer();
    this.cols = [
      {
        field: "idGrupo",
        header: "administracion.grupos.literal.id",
        width: "10%"
      },
      {
        field: "descripcionGrupo",
        header: "general.description",
        width: "30%"
      },
      {
        field: "asignarRolDefecto",
        header: "menu.administracion.perfilrol"
      },
      {
        field: "rolesAsignados",
        header: "menu.administracion.perfilrol"
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
    var registroActualizado = JSON.parse(
      sessionStorage.getItem("registroActualizado")
    );
    if (sessionStorage.getItem("editedUser") != null) {
      this.selectedDatos = JSON.parse(sessionStorage.getItem("editedUser"));
    }
    sessionStorage.removeItem("editedUser");
    if (registroActualizado) {
      this.showSuccess();
      sessionStorage.setItem("registroActualizado", JSON.stringify(false));
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    if(this.numSelected > 1) {
      this.isforNew = false;
    }else{
      this.isforNew = true;
    }
  }

  isBuscar() {
    sessionStorage.setItem("searchOrHistory", JSON.stringify("search"));
    this.progressSpinner = true;
    this.historicoActive = false;
    this.getColSearch();
    this.isforNew = true;
    this.sigaServices
      .postPaginado("perfiles_search", "?numPagina=1", null)
      .subscribe(
        data => {
           

          this.searchPerfiles = JSON.parse(data["body"]);
          this.datos = this.searchPerfiles.usuarioGrupoItems;
          this.buscar = true;

          this.table.paginator = true;
          this.sigaServices.get("usuarios_rol").subscribe(
            n => { },
            err => {
              //console.log(err);
            }
          );
        },
        err => {
          //console.log(err);
        },
        () => {
          if (sessionStorage.getItem("first") != null) {
            let first = JSON.parse(sessionStorage.getItem("first")) as number;
            this.table.first = first;
            sessionStorage.removeItem("first");
          }
          this.progressSpinner = false;
        }
      );
  }
  terminarEditar() {
    this.progressSpinner = false;
    this.isBuscar();
  }
  isEditar() {
    this.progressSpinner = true;
    this.elementosAGuardar = [];
    this.datos.forEach((value: PerfilItem, key: number) => {
      if (value.editar) {
        this.elementosAGuardar.push(value);
      }
    });
    this.sigaServices.post("perfiles_update", this.elementosAGuardar).subscribe(
      data => {
        this.showSuccess();
      },
      err => {
        this.showFail();
        //console.log(err);
      },
      () => {
        this.progressSpinner = false;
        this.selectedDatos = [];
        this.isBuscar();
      }
    );
  }
  paginate(event) {
     
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "82";
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
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    );
  }

  onChangeDrop(event, dato) {
     
     
  }
  rolDefecto(event, dato) {
    let item = new PerfilItem();
    item.idGrupo = dato.idGrupo;
    dato.asignarRolDefecto.forEach((value: ComboItem, key: number) => {
      if (event.value == value.value) {
        item.asignarRolDefecto = [];
        item.asignarRolDefecto.push(value);
      }
    });
    this.sigaServices.post("perfiles_default", item).subscribe(
      data => {
        this.showSuccess();
        this.isBuscar();
      },
      err => {
        //console.log(err);
      }
    );
  }
  isGuardar() {
    if (this.datos[0].new) {
      this.datos[0].idGrupo = this.newPerfil.idGrupo;
      this.datos[0].descripcionGrupo = this.newPerfil.descripcionGrupo;
      this.newPerfil.rolesAsignados = this.datos[0].rolesAsignados;

      if (
        this.datos[0].idGrupo != null &&
        this.datos[0].idGrupo != undefined &&
        this.datos[0].idGrupo.trim() != null &&
        this.datos[0].descripcionGrupo != null &&
        this.datos[0].descripcionGrupo != undefined &&
        this.datos[0].descripcionGrupo.trim() != ""
      ) {
        this.isNew();
      } else {
        this.showFail2();
      }
    } else {
      this.isEditar();
    }
  }
  editRol(event, dato) {
     
    this.datos.forEach((value: PerfilItem, key: number) => {
      if (value.idGrupo == dato.idGrupo) {
        value.editar = true;
      }
    });
    this.isForSave = false;
    this.save = true;
  }

  reestablecer() {
    this.isforNew = true;
    this.save = false;
    this.activacionEditar = false;
    this.isRestablecer = false;
    this.isBuscar();
  }
  newData() {
    this.isforNew = false;
    this.blockSeleccionar = true;
    this.activacionEditar = true;
    let dummy = {
      idGrupo: "",
      grupo: [],
      descripcionGrupo: "",
      descripcionRol: "",
      asignarRolDefecto: [],
      nombre: "",
      rolesAsignados: [],
      rolesNoAsignados: [],
      fechaBaja: null,
      editar: false,
      new: true
    };
    this.newPerfil.idGrupo = "";
    this.newPerfil.descripcionGrupo = "";
    let value = this.table.first;
    this.pressNew = true;
    this.save = true;
    // this.buscar = false;
    // this.createArrayEdit(dummy, value);
    this.datos = [dummy, ...this.datos];

    this.table.reset();
  }
  onChangeId() {
    if (this.newPerfil.idGrupo != null && this.newPerfil.idGrupo != undefined) {
      if (this.newPerfil.idGrupo.trim().length >= 3) {
        this.newPerfil.idGrupo = this.newPerfil.idGrupo.trim().substring(0, 3);
        this.newPerfil.idGrupo = this.newPerfil.idGrupo
          .trim()
          .toLocaleUpperCase();
        this.inputEl.nativeElement.focus();
      } else {
        this.newPerfil.idGrupo = this.newPerfil.idGrupo.toLocaleUpperCase();
      }
    }
    if (
      this.newPerfil.idGrupo != null &&
      this.newPerfil.idGrupo != undefined &&
      this.newPerfil.idGrupo.trim() != "" &&
      this.newPerfil.descripcionGrupo != null &&
      this.newPerfil.descripcionGrupo != undefined &&
      this.newPerfil.descripcionGrupo.trim() != ""
    ) {
      this.isForSave = false;
    } else {
      this.isForSave = true;
    }
  }
  onChangeForm() {
    if (this.newPerfil.idGrupo != null && this.newPerfil.idGrupo != undefined && this.newPerfil.idGrupo.trim() != "" &&
      this.newPerfil.descripcionGrupo != null && this.newPerfil.descripcionGrupo != undefined && this.newPerfil.descripcionGrupo.trim() != ""
    ) {
      this.isForSave = false;
    } else {
      this.isForSave = true;
    }
  }

  onChangeEdit(dato) {

    this.datos.forEach((value: PerfilItem, key: number) => {
      if (value.idGrupo == dato.idGrupo) {
        value.editar = true;
      }
    });
    if (dato.descripcionGrupo != null && dato.descripcionGrupo != undefined && dato.descripcionGrupo.trim() != "") {
      this.isForSave = false;
      this.save = true;
    } else {
      this.save = false;
    }

  }

  isNew() {
    this.progressSpinner = true;
    this.sigaServices.post("perfiles_insert", this.newPerfil).subscribe(
      data => {
        this.progressSpinner = false;
        this.showSuccess();
        this.isBuscar();
      },
      error => {
        this.progressSpinner = false;
        let mess = JSON.parse(error["error"]);
        this.showFailError(mess.error.message.toString());
        // this.newPerfil.idGrupo = newPerfil.idGrupo;
        // this.newPerfil.descripcionGrupo = newPerfil.descripcionGrupo;
        this.datos[0].idGrupo = "";
        this.datos[0].descripcionGrupo = "";
        //console.log(error);
      }
    );
  }
  confirmarRolDefecto(event, dato) {
    let mess = "¿Desea asignar este rol?";
    let icon = "fa fa-plus";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.rolDefecto(event, dato);
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
        // this.isBuscar();
      }
    });
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
      this.numSelected = 0;
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  editarUsuario(selectedItem) {
    // if (!this.selectMultiple) {
    if (selectedItem.length == 1) {
    } else {
      this.editar = false;
    }
  }

  cancelar() {
    this.editar = false;
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
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
  showFailError(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "",
      detail: this.translateService.instant(mensaje)
    });
  }
  showFail2() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: "Revise los campos Id y Descripción"
    });
  }
  crear() {
    sessionStorage.setItem(
      "privilegios",
      JSON.stringify(this.activacionEditar)
    );
    sessionStorage.setItem("crear", JSON.stringify(true));
    this.router.navigate(["/EditarPerfiles"]);
  }
  irEditarUsuario(id) {
    this.numSelected = id.length;
    if(id.length > 1){
      this.selectMultiple = true;
    }else{
      this.selectMultiple = false;
    }
    if (!this.selectMultiple) {
      if (this.activacionEditar) {
        this.selectedDatos = id;
        this.isRestablecer = true;
        this.isforNew = true;
      }

      // var ir = null;
      // if (id && id.length > 0) {
      //   ir = id[0];
      // }
      // sessionStorage.setItem("crear", JSON.stringify(false));
      // sessionStorage.removeItem("perfil");
      // sessionStorage.removeItem("privilegios");
      // sessionStorage.removeItem("first");
      // sessionStorage.setItem("perfil", JSON.stringify(id));
      // sessionStorage.setItem("editedUser", JSON.stringify(this.selectedDatos));
      // sessionStorage.setItem("first", JSON.stringify(this.table.first));
      // if (id[0].fechaBaja != null) {
      //   sessionStorage.setItem("privilegios", JSON.stringify(false));
      // } else {
      //   sessionStorage.setItem(
      //     "privilegios",
      //     JSON.stringify(this.activacionEditar)
      //   );
      // }
      // this.router.navigate(["/EditarPerfiles"]);
    } else {
      this.editar = false;
      this.numSelected = this.selectedDatos.length;
      this.isforNew = false;
    }
  }
  isEliminar(selectedDatos) {
    this.selectedDatos = [];
    this.numSelected = 0;
    //console.log(selectedDatos);
    this.sigaServices.post("perfiles_delete", selectedDatos).subscribe(
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
        //console.log(err);
      },
      () => {
        this.isBuscar();
        this.editar = false;
      }
    );
  }
  getColHistory() {
    this.cols = [
      {
        field: "idGrupo",
        header: "administracion.grupos.literal.id",
        width: "10%"
      },
      {
        field: "descripcionGrupo",
        header: "general.description",
        width: "30%"
      },
      {
        field: "rolesAsignados",
        header: "menu.administracion.perfilrol"
      }
    ];
  }
  getColSearch() {
    this.cols = [
      {
        field: "idGrupo",
        header: "administracion.grupos.literal.id",
        width: "10%"
      },
      {
        field: "descripcionGrupo",
        header: "general.description",
        width: "30%"
      },
      {
        field: "asignarRolDefecto",
        header: "menu.administracion.perfilrol"
      },
      {
        field: "rolesAsignados",
        header: "menu.administracion.perfilrol"
      }
    ];
  }
  historico() {
    this.selectedDatos = [];
    this.numSelected = 0;
    sessionStorage.setItem("searchOrHistory", JSON.stringify("history"));
    this.historicoActive = true;
    this.selectMultiple = false;
    this.progressSpinner = true;
    this.isforNew = false;
    this.getColHistory();
    this.sigaServices
      .postPaginado("perfiles_historico", "?numPagina=1", null)
      .subscribe(
        data => {
           

          this.searchPerfiles = JSON.parse(data["body"]);
          this.datos = this.searchPerfiles.usuarioGrupoItems;
          this.buscar = false;
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
        },
        () => {
          this.table.reset();
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
  setItalic(dato) {
    this.selectedDatos = [];
      this.numSelected = 0;
    if (dato.fechaBaja == null) return false;
    else return true;
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.numSelected = this.datos.length;
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  clear() {
    this.msgs = [];
  }

  focusInputField(dato) {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();  
    }, 300);
  }

}
