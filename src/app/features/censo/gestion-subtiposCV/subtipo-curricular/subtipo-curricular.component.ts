import { SelectItem, ConfirmationService } from "primeng/api";
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef,
  HostListener
} from "@angular/core";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { SubtipoCurricularItem } from "../../../../models/SubtipoCurricularItem";
import { SubtipoCurricularObject } from "../../../../models/SubtipoCurricularObject";
// export enum KEY_CODE {
//   ENTER = 13
// }
@Component({
  selector: "app-subtipo-curricular",
  templateUrl: "./subtipo-curricular.component.html",
  styleUrls: ["./subtipo-curricular.component.scss"]
})
export class SubtipoCurricularComponent implements OnInit {
  body: SubtipoCurricularItem = new SubtipoCurricularItem();
  bodySearch: SubtipoCurricularObject = new SubtipoCurricularObject();

  bodyUpdate: SubtipoCurricularObject = new SubtipoCurricularObject();
  bodyRemove: SubtipoCurricularObject = new SubtipoCurricularObject();
  bodyHistory: SubtipoCurricularObject = new SubtipoCurricularObject();

  nuevoElemento: SubtipoCurricularItem = new SubtipoCurricularItem();
  history: SubtipoCurricularItem = new SubtipoCurricularItem();

  datosEditar: SubtipoCurricularItem[] = [];

  categoriaCurricular: SelectItem[];
  selectedCategoriaCurricular: any;

  @ViewChild("input1")
  inputEl: ElementRef;
  @ViewChild("inputDesc")
  inputDesc: ElementRef;
  @ViewChild("inputCdgoExt")
  inputCdgoExt: ElementRef;

  @ViewChild("table")
  table;
  selectedDatos = [];
  cols: any = [];
  rowsPerPage: any = [];
  datos: any[];
  datosHist: any[];
  datosNuevos: any[];
  selectedItem: number = 10;
  numSelected: number = 0;
  selectMultiple: boolean = false;
  selectAll: boolean = false;

  msgs: any = [];

  showSubtipoCurricular: boolean = true;
  progressSpinner: boolean = false;
  buscar: boolean = false;
  nuevo: boolean = false;
  crear: boolean = false;
  editar: boolean = false;
  historico: boolean = false;
  blockCrear: boolean = true;
  blockBuscar: boolean = true;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // Llamada al rest para obtener la categoría curricular
    this.sigaServices.get("tipoCurricular_categoriaCurricular").subscribe(
      n => {
        this.categoriaCurricular = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.getRowPerPage();
  }

  getRowPerPage() {
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
  }

  onHideSubtipoCV() {
    this.showSubtipoCurricular = !this.showSubtipoCurricular;
  }

  // Métodos
  search() {
    this.progressSpinner = true;
    this.buscar = true;
    this.nuevo = false;
    this.editar = false;
    this.historico = false;

    this.selectAll = false;
    this.selectMultiple = false;

    if (this.body.tipoCategoriaCurricular == undefined) {
      this.body.tipoCategoriaCurricular = "";
    }

    this.sigaServices
      .postPaginado(
        "subtipoCurricular_searchSubtipoCurricular",
        "?numPagina=1",
        this.body
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodySearch = JSON.parse(data["body"]);
          this.datos = this.bodySearch.subtipoCurricularItems;

          this.table.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
  }

  restore() {
    this.body.tipoCategoriaCurricular = "";
    this.blockBuscar = true;
  }

  // Para la creación de un nuevo elemento
  newElement() {
    this.selectAll = false;
    this.selectMultiple = false;

    let nuevoDato = {
      codigoExterno: "",
      descripcion: ""
    };
    let value = this.table.first;
    this.nuevo = true;
    this.editar = false;
    this.buscar = false;

    // cambie datosNuevos por datos
    this.datosNuevos = [nuevoDato, ...this.datos];

    this.table.reset();
  }

  cancelAction() {
    // Limpiar
    this.body.codigoExterno = "";
    this.body.descripcion = "";

    if (this.buscar == true) {
      this.table.reset();
    }

    this.editar = false;
    this.nuevo = false;

    if (this.historico == false) {
      this.search();
    }

    this.blockCrear = true;
  }

  confirmAction() {
    if (this.body.descripcion) {
      this.nuevoElemento = this.body;

      this.sigaServices
        .post("subtipoCurricular_createSubtipoCurricular", this.nuevoElemento)
        .subscribe(
          data => {
            this.showSuccess();

            // Limpiar
            this.body.codigoExterno = "";
            this.body.descripcion = "";

            this.search();
          },
          error => {
            this.bodySearch = JSON.parse(error["error"]);
            let mensaje = JSON.stringify(this.bodySearch.error.message);
            this.showFail(mensaje);
          }
        );
    } else {
      this.showFail("La descripción no puede estar vacía");
    }
  }

  // Métodos gestión de inputs
  onChangeFormCdgoExt() {
    this.body.codigoExterno = this.body.codigoExterno.replace(/^\s+|\s+$/g, "");

    if (this.body.codigoExterno == undefined) {
      this.body.codigoExterno = "";
    } else {
      this.body.codigoExterno = this.body.codigoExterno.replace(
        /^\s+|\s+$/g,
        ""
      );
    }
  }

  cdgoEvent(e) {
    if (e) {
      this.body.codigoExterno = e.srcElement.value.trim();
      this.body.codigoExterno = this.body.codigoExterno.trim();
      this.inputCdgoExt.nativeElement.value = e.srcElement.value.trim();
      console.log(this.inputCdgoExt);
    }

    this.editar = false;
  }

  onChangeForm() {
    this.body.descripcion = this.body.descripcion.replace(/^\s+|\s+$/g, "");

    if (this.body.codigoExterno == undefined) {
      this.body.codigoExterno = "";
    }

    if (
      this.body.descripcion == "" ||
      this.body.descripcion == undefined ||
      this.onlySpaces(this.body.descripcion)
    ) {
      this.crear = true;
    } else {
      this.body.descripcion = this.body.descripcion.replace(/^\s+|\s+$/g, "");
      this.crear = false;
    }
  }

  onChangeTipoCategoriaCurricular(event) {
    if (this.body.tipoCategoriaCurricular == "") {
      this.blockBuscar = true;
      this.blockCrear = true;
    } else {
      this.blockBuscar = false;
    }
    this.body.tipoCategoriaCurricular = event.value;
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

  descripcionEvent(e) {
    if (e) {
      this.body.descripcion = e.srcElement.value.trim();
      this.body.descripcion = this.body.descripcion.trim();
      this.inputDesc.nativeElement.value = e.srcElement.value.trim();
    }
  }

  // Métodos creados para eliminar 1 o más registros
  confirmToRemove(selectedDatos) {
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
        this.removeElement(selectedDatos);
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

        this.editar = false;
        this.selectMultiple = false;
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    });
  }

  removeElement(selectedDatos) {
    selectedDatos.forEach((value: SubtipoCurricularItem, key: number) => {
      this.bodyRemove.subtipoCurricularItems.push(value);
    });

    console.log("Eliminamos", this.bodyRemove.subtipoCurricularItems);
    this.sigaServices
      .post("subtipoCurricular_deleteSubtipoCurricular", this.bodyRemove)
      .subscribe(
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
                this.translateService.instant(
                  "messages.deleted.selected.success"
                )
            });
          }
        },
        err => {
          console.log(err);
        },
        () => {
          this.editar = false;
          this.selectMultiple = false;
          this.selectAll = false;
          this.selectedDatos = [];
          this.numSelected = 0;
          this.search();
        }
      );
  }

  // PARA LA TABLA
  enablePagination() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.selectAll) {
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
      this.nuevo = false;
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onRowUnselect(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  onRowSelect(selectedDatos) {
    if (this.selectMultiple) {
      this.numSelected = this.selectedDatos.length;
    } else {
      this.editar = false;
      this.numSelected = this.selectedDatos.length;
    }
  }

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }

  //Métodos creados para editar un registro de la tabla
  editarCompleto(event) {
    let data = event.data;

    if (data.codigoExterno != null && data.codigoExterno != undefined) {
      if (
        data.descripcion.length > 2000 ||
        (data.codigoExterno.length > 10 &&
          data.codigoExterno != null &&
          data.codigoExterno != undefined)
      ) {
        this.datos.forEach((value: SubtipoCurricularItem, key: number) => {
          if (
            value.idTipoCV == data.idTipoCV &&
            value.idTipoCvSubtipo2 == data.idTipoCvSubtipo2
          ) {
            value.descripcion = data.descripcion.substring(0, 1950);
            value.codigoExterno = data.codigoExterno.substring(0, 10);
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
          this.datos.forEach((value: SubtipoCurricularItem, key: number) => {
            if (
              value.idTipoCV == data.idTipoCV &&
              value.idTipoCvSubtipo2 == data.idTipoCvSubtipo2
            ) {
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
        this.datosHist.forEach((value: SubtipoCurricularItem, key: number) => {
          if (
            value.idTipoCV == data.idTipoCV &&
            value.idTipoCvSubtipo2 == data.idTipoCvSubtipo2
          ) {
            value.editar = true;
          }
        });
        console.log(this.datosHist);
      }
    }
  }

  confirmEditAction() {
    this.datos.forEach((value: SubtipoCurricularItem, key: number) => {
      if (value.editar) {
        this.datosEditar.push(value);
      }
    });

    this.bodyUpdate.subtipoCurricularItems = this.datosEditar;

    this.sigaServices
      .post("subtipoCurricular_updateSubtipoCurricular", this.bodyUpdate)
      .subscribe(
        data => {
          this.showSuccess();
        },
        err => {
          this.showFail("Error al actualizar");
        },
        () => {
          this.search();
          this.datosEditar = [];
        }
      );
  }

  cancelEditAction() {
    this.nuevo = false;
    this.editar = false;

    this.search();
  }

  // Métodos creados para gestionar el historial
  getHistory() {
    this.buscar = false;
    this.selectMultiple = false;
    this.selectAll = false;

    this.historico = true;

    this.history.tipoCategoriaCurricular = this.body.tipoCategoriaCurricular;

    this.sigaServices
      .post("subtipoCurricular_historySubtipoCurricular", this.history)
      .subscribe(
        data => {
          console.log(data);
          this.bodySearch = JSON.parse(data["body"]);
          this.datos = this.bodySearch.subtipoCurricularItems;
        },
        err => {
          console.log(err);
        }
      );

    this.numSelected = 0;
  }

  return() {
    this.editar = false;
    this.search();
  }

  // Métodos creados para mostrar mensajes al usuario
  clear() {
    this.msgs = [];
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

  //búsqueda con enter
  // @HostListener("document:keypress", ["$event"])
  // onKeyPress(event: KeyboardEvent) {
  //   if (event.keyCode === KEY_CODE.ENTER) {
  //     this.search();
  //   }
  // }
}
