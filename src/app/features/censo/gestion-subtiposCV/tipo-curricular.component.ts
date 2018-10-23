import { OldSigaServices } from "../../../_services/oldSiga.service";
import { SelectItem } from "../../../../../node_modules/primeng/primeng";
import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  ElementRef
} from "@angular/core";
import { SigaServices } from "../../../_services/siga.service";
import { Router } from "../../../../../node_modules/@angular/router";
import { TipoCurricularItem } from "../../../models/TipoCurricularItem";
import { TipoCurricularObject } from "../../../models/TipoCurricularObject";
import { TranslateService } from "../../../commons/translate/translation.service";

@Component({
  selector: "app-tipo-curricular",
  templateUrl: "./tipo-curricular.component.html",
  styleUrls: ["./tipo-curricular.component.scss"]
})
export class TipoCurricularComponent {
  body: TipoCurricularItem = new TipoCurricularItem();
  nuevoElemento: TipoCurricularItem = new TipoCurricularItem();

  bodySearch: TipoCurricularObject = new TipoCurricularObject();

  categoriaCurricular: SelectItem[];
  selectedCategoriaCurricular: any;

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
  datosNuevos: any[];
  selectedItem: number = 10;
  numSelected: number = 0;
  selectMultiple: boolean = false;
  selectAll: boolean = false;
  msgs: any = [];
  showDatosCv: any;

  showTipoCurricular: boolean = true;
  progressSpinner: boolean = false;
  buscar: boolean = false;
  nuevo: boolean = false;
  crear: boolean = false;
  editar: boolean = false;
  enableCargo: boolean;
  enableColegiado: boolean;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private translateService: TranslateService
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

    this.getInfo();
  }

  getInfo() {
    // this.cols = [
    //   { field: "codigoExterno", header: "general.codeext" },
    //   {
    //     field: "descripcion",
    //     header: "general.description"
    //   }
    // ];

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
    this.showTipoCurricular = !this.showTipoCurricular;
  }

  search() {
    this.progressSpinner = true;
    this.buscar = true;
    this.nuevo = false;
    this.editar = false;

    if (this.body.tipoCategoriaCurricular == undefined) {
      this.body.tipoCategoriaCurricular = "";
    }

    this.sigaServices
      .postPaginado("tipoCurricular_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodySearch = JSON.parse(data["body"]);
          this.datos = this.bodySearch.tipoCurricularItems;

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
  }

  newElement() {
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

    this.nuevo = false;

    this.search();
  }

  confirmAction() {
    if (this.body.descripcion) {
      console.log("GOL", this.body);
      this.nuevoElemento = this.body;

      this.sigaServices
        .post("tipoCurricular_createTipoCurricular", this.nuevoElemento)
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
            console.log(error);
          }
        );
    } else {
      this.showFail("La descripción no puede estar vacía");
    }
  }

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
      console.log(this.inputDesc);
    }
  }

  removeElement(selectedDatos) {
    this.getInfo();

    let data = [];
    this.datos.forEach(element => {
      if (element.id != selectedDatos[0].id) {
        data.push(element);
      }
    });
    this.datos = [...data];

    this.selectAll = false;
    this.selectMultiple = false;
    this.numSelected = 0;
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
    if (this.selectAll === true) {
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
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  redirect(selectedDatos) {
    if (!this.selectMultiple) {
      sessionStorage.setItem("datos", JSON.stringify(selectedDatos));
      this.router.navigate(["/informacionGestionSubtipoCV"]);
    }

    this.numSelected = this.selectedDatos.length;
  }
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

  editarCompleto(event) {
    this.editar = true;
    console.log(event);
    let data = event.data;

    this.datos.forEach((value: TipoCurricularItem, key: number) => {
      if (
        value.idTipoCV == data.idTipoCV &&
        value.idTipoCvSubtipo1 == data.idTipoCvSubtipo1
      ) {
        value.editar = true;
      }
    });
  }

  confirmEditAction() {
    let datosEditar = [];
    this.datos.forEach((value: TipoCurricularItem, key: number) => {
      if (value.editar) {
        datosEditar.push(value);
      }
    });

    console.log("EDITAR", datosEditar);
  }
}
