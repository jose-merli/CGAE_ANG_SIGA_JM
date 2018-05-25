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
import { DropdownModule } from "primeng/dropdown";
import { esCalendar } from "./../../../utils/calendar";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { DataTable } from "primeng/datatable";
import { TranslateService } from "../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { ButtonModule } from "primeng/button";
import { Router, ActivatedRoute } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { GrowlModule } from "primeng/growl";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { DatosGeneralesObject } from "./../../../../app/models/DatosGeneralesObject";
import { DatosGeneralesItem } from "./../../../../app/models/DatosGeneralesItem";
import { ComboItem } from "./../../../../app/models/ComboItem";
import { MultiSelectModule } from "primeng/multiSelect";
import { ControlAccesoDto } from "./../../../../app/models/ControlAccesoDto";
import { Location } from "@angular/common";
import { Observable } from "rxjs/Rx";
@Component({
  selector: "app-datos-generales",
  templateUrl: "./datos-generales.component.html",
  styleUrls: ["./datos-generales.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DatosGenerales extends SigaWrapper implements OnInit {
  etiquetas: any[];
  cols: any = [];
  datos: any[];
  select: any[];
  msgs: Message[] = [];
  rowsPerPage: any = [];
  body: DatosGeneralesItem = new DatosGeneralesItem();
  showDatosGenerales: boolean = true;
  pButton;
  editar: boolean = true;
  buscar: boolean = false;
  disabledRadio: boolean = false;
  disabled: boolean = false;
  selectMultiple: boolean = false;
  blockCrear: boolean = true;
  selectedItem: number = 10;
  first: number = 0;
  activo: boolean = false;
  dniCorrecto: boolean;
  es: any = esCalendar;
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  datosSearch: DatosGeneralesObject = new DatosGeneralesObject();
  permisosTree: any;
  permisosArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean;
  selectAll: boolean = false;
  progressSpinner: boolean = false;
  tipos: any[];
  fechaConstitucion: Date;
  textSelected: String = "{0} grupos seleccionados";
  textFilter = "Elegir";
  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private location: Location
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("table") table: DataTable;
  selectedDatos;

  ngOnInit() {
    this.activo = true;
    this.checkAcceso(); //coger tipos
    this.sigaServices.get("busquedaPerJuridica_tipo").subscribe(
      n => {
        this.tipos = n.combooItems;
        let first = { label: "", value: "" };
        this.tipos.unshift(first);
      },
      err => {
        console.log(err);
      }
    );
    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {
        this.etiquetas = n.combooItems;
        // let first = { label: "", value: "" };
        // this.etiquetas.unshift(first);
      },
      err => {
        console.log(err);
      }
    );
    this.cols = [
      {
        field: "tipo",
        header: "censo.busquedaClientesAvanzada.literal.tipoCliente"
      },
      { field: "nif", header: "administracion.usuarios.literal.NIF" },
      {
        field: "denominacion",
        header: "censo.consultaDatosGenerales.literal.denominacion"
      },
      {
        field: "FechaConstitucion",
        header: "censo.general.literal.FechaConstitucion"
      },
      {
        field: "abreviatura",
        header: "gratuita.definirTurnosIndex.literal.abreviatura"
      },
      {
        field: "numeroIntegrantes",
        header: "censo.general.literal.numeroIntegrantes"
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
    // if (sessionStorage.getItem("editedUser") != null) {
    //   this.selectedDatos = JSON.parse(sessionStorage.getItem("editedUser"));
    // }
    // sessionStorage.removeItem("editedUser");
    // if (sessionStorage.getItem("searchUser") != null) {
    //   this.body = JSON.parse(sessionStorage.getItem("searchUser"));
    //   this.isBuscar();
    //   sessionStorage.removeItem("searchUser");
    //   sessionStorage.removeItem("usuarioBody");
    // } else {
    //   this.body = new PersonaJuridicaRequestDto();
    // }
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "2";
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

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  onChangeForm() {
    if (
      this.body.tipo != "" &&
      this.body.tipo != undefined &&
      (this.body.identificacion != "" &&
        this.body.identificacion != undefined) &&
      (this.body.denominacion != "" && this.body.denominacion != undefined) &&
      (this.body.abreviatura != "" && this.body.abreviatura != undefined)
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
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  // sendEdit() {
  //   console.log(this.body);
  //   if (this.body.codigoExterno == undefined) {
  //     this.body.codigoExterno = "";
  //   }
  //   if (this.body.grupo == undefined) {
  //     this.body.grupo = "";
  //   }
  //   this.sigaServices.post("usuarios_update", this.body).subscribe(
  //     data => {
  //       this.showSuccess();
  //       console.log(data);
  //     },
  //     err => {
  //       this.showFail();
  //       console.log(err);
  //     },
  //     () => {
  //       this.cancelar();
  //       this.isBuscar();
  //       this.table.reset();
  //     }
  //   );
  // }

  isBuscar() {
    this.Search();
  }

  Search() {
    this.progressSpinner = true;
    this.buscar = true;
    if (this.body.cuentaContable == undefined) {
      this.body.cuentaContable = "";
    }
    if (this.body.idioma == undefined) {
      this.body.idioma = "";
    }
    if (this.body.anotaciones == undefined) {
      this.body.anotaciones = "";
    }
    if (this.body.etiquetas == undefined) {
      this.body.denominacion = "";
    }

    // this.body.idInstitucion = "2000";
    this.sigaServices
      .postPaginado("busquedaPerJuridica_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          console.log(data);
          this.progressSpinner = false;
          this.datosSearch = JSON.parse(data["body"]);
          this.datos = this.datosSearch.DatosGeneralesItem;
          this.table.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
  }
  paginate(event) {
    console.log(event);
  }

  cancelar() {
    this.editar = true;
    this.dniCorrecto = null;
    this.body = new DatosGeneralesItem();
    this.disabledRadio = false;
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
    this.sigaServices.post("busquedaPerJuridica_create", this.body).subscribe(
      data => {
        this.datosSearch = JSON.parse(data["body"]);
        this.showSuccess();
      },
      error => {
        this.datosSearch = JSON.parse(error["error"]);
        this.showduplicateFail(this.datosSearch.error.message.toString());
        console.log(error);
        this.showFail();
      },
      () => {
        this.cancelar();
        this.isBuscar();
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
    if (number >= 2) {
      msg =
        number +
        " " +
        this.translateService.instant("messages.deleted.selected.success");
    } else {
      msg = this.translateService.instant("messages.deleted.success");
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

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
    } else {
      this.selectedDatos = [];
    }
  }
}
