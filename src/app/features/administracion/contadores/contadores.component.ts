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
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "../../../commons/translate/translation.service";
import { MessageService } from "primeng/components/common/messageservice";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { ContadorItem } from "./../../../../app/models/ContadorItem";
import { ContadorResponseDto } from "./../../../../app/models/ContadorResponseDto";

@Component({
  selector: "app-contadorescomponent",
  templateUrl: "./contadores.component.html",
  styleUrls: ["./contadores.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ContadoresComponent extends SigaWrapper implements OnInit {
  body: ContadorItem = new ContadorItem();

  //Creo los objetos para interactuar con sus respectivos DTO
  search: ContadorResponseDto = new ContadorResponseDto();

  pButton;
  buscar: boolean = false;
  tablaHistorico: boolean = false;
  editar: boolean = true;
  eliminar: boolean = false;
  selectMultiple: boolean = false;
  selectedItem: number = 4;

  formBusqueda: FormGroup;
  cols: any = [];
  datos: any[];
  select: any[];
  selectedDatos: any;

  //Array de opciones del dropdown
  contadores_modo: any[];

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
  idModulo: String;
  rowsPerPage: any = [];

  @ViewChild("table") table;
  constructor(
    private formBuilder: FormBuilder,
    private sigaServices: SigaServices,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute
  ) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({});
  }

  //Cargo el combo nada mas comenzar
  ngOnInit() {
    this.idModulo = this.activatedRoute.snapshot.params["id"];
    this.body = new ContadorItem();
    this.sigaServices.get("contadores_module").subscribe(
      n => {
        this.contadores_modo = n.combooItems;
      },
      err => {
        console.log(err);
      },
      () => {
        this.body.idmodulo = this.idModulo;
      }
    );
    this.cols = [
      { field: "idcontador", header: "general.boton.code" },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      { field: "descripcion", header: "general.description" },
      {
        field: "prefijo",
        header: "administracion.parametrosGenerales.literal.prefijo"
      },
      {
        field: "contador",
        header: "administracion.parametrosGenerales.literal.contadorActual"
      },
      {
        field: "sufijo",
        header: "administracion.parametrosGenerales.literal.sufijo"
      }
    ];

    this.rowsPerPage = [
      {
        label: 4,
        value: 4
      },
      {
        label: 6,
        value: 6
      },
      {
        label: 8,
        value: 8
      },
      {
        label: 10,
        value: 10
      }
    ];

    if (sessionStorage.getItem("searchContador") != null) {
      this.body = JSON.parse(sessionStorage.getItem("searchContador"));
      this.isBuscar();
      sessionStorage.removeItem("searchContador");
      sessionStorage.removeItem("contadorBody");
      sessionStorage.removeItem("url");
    } else {
      this.body = new ContadorItem();
    }
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
  onChangeCatalogo() { }
  //cada vez que cambia el formulario comprueba esto
  onChangeForm() { }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
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

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
  }

  activarPaginacion() {
    if (this.datos.length == 0) return false;
    else return true;
  }

  isBuscar() {
    this.buscar = true;
    this.blockBuscar = false;
    this.tablaHistorico = false;
    this.eliminar = false;
    if (this.body.descripcion == undefined) {
      this.body.descripcion = "";
      this.formToBody();
    }

    this.sigaServices
      .postPaginado("contadores_search", "?numPagina=1", this.body)
      .subscribe(
      data => {
        console.log(data);

        this.search = JSON.parse(data["body"]);
        this.datos = this.search.contadorItems;
        console.log(this.datos);
        this.table.reset();
      },
      err => {
        console.log(err);
      }
      );
  }

  isLimpiar() {
    this.body = new ContadorItem();
    this.bodyToForm();
    this.editar = false;
    this.blockSeleccionar = false;
    this.blockCrear = true;
    this.blockBuscar = true;
  }

  reset() {
    if (this.buscar == true) {
      this.table.reset();
    }
    this.editar = false;
    this.body = new ContadorItem();
    this.blockSeleccionar = false;
    this.bodyToForm();
    if (this.tablaHistorico == false) {
      this.isBuscar();
    }

    this.blockCrear = true;
  }

  formToBody() {
    this.body.descripcion = this.formDescripcion;
  }

  bodyToForm() {
    this.formDescripcion = this.body.descripcion;
  }
  irEditarContador(id) {
    var ir = null;
    var url = "/contadores/" + this.idModulo;
    if (id && id.length > 0) {
      ir = id[0];
    }
    sessionStorage.setItem("contadorBody", JSON.stringify(id));
    sessionStorage.setItem("url", JSON.stringify(url));
    sessionStorage.setItem("searchContador", JSON.stringify(this.body));
    this.router.navigate(["/gestionContadores"]);
  }

  editarCatalogos(selectedDatos) {
    if (selectedDatos.length == 1) {
      this.body = new ContadorItem();
      this.body = selectedDatos[0];
      this.editar = true;
      this.blockSeleccionar = true;
      this.bodyToForm();
    } else {
      this.editar = false;
      this.blockSeleccionar = false;

      this.body = new ContadorItem();
      this.bodyToForm();
      this.table.reset();
    }
  }
}