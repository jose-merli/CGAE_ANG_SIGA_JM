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
import { FormBuilder, FormGroup } from "@angular/forms";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "../../../commons/translate/translation.service";
import { Message } from "primeng/components/common/api";
import { ContadorItem } from "./../../../../app/models/ContadorItem";
import { ContadorResponseDto } from "./../../../../app/models/ContadorResponseDto";
import { DataTable } from "primeng/datatable";
import { DialogoComunicacionesItem } from "../../../models/DialogoComunicacionItem";
import { esCalendar } from "./../../../utils/calendar";
import { CommonsService } from '../../../_services/commons.service';

export enum KEY_CODE {
  ENTER = 13
}

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
  selectedItem: number = 10;
  progressSpinner: boolean = false;

  formBusqueda: FormGroup;
  cols: any = [];
  datos: any[] = [];
  select: any[];
  selectedDatos: any;

  //Array de opciones del dropdown
  contadores_modo: any[];

  //elementos del form
  formDescripcion: String;

  //mensajes
  msgs: Message[] = [];

  showDatosGenerales: boolean = true;
  blockSeleccionar: boolean = false;
  blockBuscar: boolean = true;
  blockCrear: boolean = true;
  idModulo: String;
  idPantalla: String;
  first: number = 0;
  rowsPerPage: any = [];


  @ViewChild("table") table: DataTable;
  constructor(
    private formBuilder: FormBuilder,
    private sigaServices: SigaServices,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private activatedRoute: ActivatedRoute
  ) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({});
  }

  //Cargo el combo nada mas comenzar
  ngOnInit() {
    this.idModulo = this.activatedRoute.snapshot.params["id"];
    this.idPantalla = this.activatedRoute.snapshot.params["modulo"];
    if (this.idModulo == "0" || this.idPantalla == "admin") {
      this.editar = false;
    } else {
      this.body.idmodulo = this.idModulo;
      this.isBuscar();
    }
    this.body = new ContadorItem();
    this.sigaServices.get("contadores_module").subscribe(
      n => {
        this.contadores_modo = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.contadores_modo.map(e => {
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
      {
        field: "descripcion",
        header: "general.description",
        width: "25%"
      },
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

    if (sessionStorage.getItem("searchContador") != null) {
      this.body = JSON.parse(sessionStorage.getItem("searchContador"));
      this.isBuscar();
      sessionStorage.removeItem("searchContador");
      sessionStorage.removeItem("contadorBody");
      sessionStorage.removeItem("url");
    } else {
      this.body = new ContadorItem();
    }
    if (sessionStorage.getItem("editedUser") != null) {
      this.selectedDatos = JSON.parse(sessionStorage.getItem("editedUser"));
    }
    sessionStorage.removeItem("editedUser");
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
  onChangeForm(event) {
    this.idModulo = event;
    this.body.idmodulo = this.idModulo;
    // this.isBuscar();
  }

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

  //Busca inscripciones según los filtros
  isBuscar() {
    if (this.checkFilters()) {
      this.buscar = true;
      this.blockBuscar = false;
      this.tablaHistorico = false;
      this.eliminar = false;
      if (this.body.descripcion == undefined) {
        this.body.descripcion = "";
        this.formToBody();
      }

      if (this.body.idmodulo == "0") {
        this.body.idmodulo = "";
      }

      this.sigaServices
        .postPaginado("contadores_search", "?numPagina=1", this.body)
        .subscribe(
          data => {
             

            this.search = JSON.parse(data["body"]);
            this.datos = this.search.contadorItems;
            this.table.reset();
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
            setTimeout(()=>{
              this.commonsService.scrollTablaFoco('tablaFoco');
            }, 5);
          }
        );
    }
  }

  checkFilters() {
    if ((this.body.idmodulo == undefined || this.body.idmodulo == "" || this.body.idmodulo == "0") &&
      (this.body.idcontador == undefined || this.body.idcontador == "") &&
      (this.body.nombre == undefined || this.body.nombre == "") &&
      (this.body.descripcion == undefined || this.body.descripcion == "")) {
      this.showSearchIncorrect();
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.body.idcontador != undefined) {
        this.body.idcontador = this.body.idcontador.trim();
      }
      if (this.body.nombre != undefined) {
        this.body.nombre = this.body.nombre.trim();
      }
      if (this.body.descripcion != undefined) {
        this.body.descripcion = this.body.descripcion.trim();
      }
      return true;
    }
  }

  showSearchIncorrect() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "cen.busqueda.error.busquedageneral"
      )
    });
  }



  paginate(event) {
     
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
    var url = "/contadores/" + this.idModulo + "/" + this.idPantalla;
    if (id && id.length > 0) {
      ir = id[0];
    }
    sessionStorage.setItem("contadorBody", JSON.stringify(id));
    sessionStorage.setItem("url", JSON.stringify(url));
    sessionStorage.setItem("searchContador", JSON.stringify(this.body));
    sessionStorage.removeItem("first");
    sessionStorage.setItem("first", JSON.stringify(this.table.first));
    sessionStorage.setItem("editedUser", JSON.stringify(this.selectedDatos));
    if (this.idModulo == "0" || this.idModulo == "") {
      sessionStorage.setItem("permisoContadores", "320");
    } else if (this.idModulo == "3") {
      sessionStorage.setItem("permisoContadores", "112");
    } else if (this.idModulo == "11") {
      sessionStorage.setItem("permisoContadores", "20C");
    }
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
