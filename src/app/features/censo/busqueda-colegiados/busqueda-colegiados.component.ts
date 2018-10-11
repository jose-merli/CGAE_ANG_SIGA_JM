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
import { Router } from "@angular/router";
import { TranslateService } from "../../../commons/translate/translation.service";
import { ConfirmationService } from "primeng/api";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { DataTable } from "primeng/datatable";
import { esCalendar } from "./../../../utils/calendar";
import { DatosColegiadosItem } from "../../../models/DatosColegiadosItem";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "../../../../../node_modules/@angular/forms";
import { DatosColegiadosObject } from "../../../models/DatosColegiadosObject";
import { TrimPipePipe } from "../../../commons/trim-pipe/trim-pipe.pipe";

@Component({
  selector: "app-busqueda-colegiados",
  templateUrl: "./busqueda-colegiados.component.html",
  styleUrls: ["./busqueda-colegiados.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BusquedaColegiadosComponent extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = true;
  showDatosGeneneralesAvanzado: boolean = false;
  showDatosDireccion: boolean = false;
  progressSpinner: boolean = false;
  isDisabledPoblacion: boolean = true;
  isDisabledProvincia: boolean = true;

  formBusqueda: FormGroup;
  numSelected: number = 0;
  datos: any[];
  sortO: number = 1;
  selectedItem: number = 10;
  cols: any = [];
  rowsPerPage: any = [];
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  textFilter: String = "Elegir";
  buscar: boolean = false;

  es: any = esCalendar;

  editar: boolean = true;

  comboEtiquetas: any[];
  comboSituacion: any[];
  comboResidencia: any[] = [];
  comboInscrito: any[] = [];
  comboSexo: any[] = [];
  comboEstadoCivil: any[];
  comboCategoriaCurricular: any[];
  comboSubtipoCV: any[];
  comboProvincias: any[];
  comboPoblacion: any[];
  comboTiposDireccion: any[];

  textSelected: String = "{0} etiquetas seleccionadas";
  body: DatosColegiadosItem = new DatosColegiadosItem();
  colegiadoSearch = new DatosColegiadosObject();

  siNoResidencia: any;
  siNoInscrito: any;
  selectedEstadoCivil: any;
  selectedCategoriaCurricular: any;
  selectedSubtipoCV: any;
  selectedProvincia: any;
  selectedPoblacion: any;
  selectedTipoDireccion: any;
  resultadosPoblaciones: any;
  historico: boolean;

  fechaNacimientoSelect: Date;
  fechaNacimientoSelectOld: Date;
  fechaIncorporacionHastaSelect: Date;
  fechaIncorporacionDesdeSelect: Date;

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({
      nif: new FormControl(null, Validators.minLength(3)),
      nombre: new FormControl(null, Validators.minLength(3)),
      apellidos: new FormControl(null, Validators.minLength(3)),
      numeroColegiado: new FormControl(null, Validators.minLength(3))
    });
  }

  @ViewChild("table")
  table: DataTable;
  selectedDatos;

  ngOnInit() {
    this.getCombos();
    sessionStorage.removeItem("esColegiado");
    if (sessionStorage.getItem("filtrosBusquedaColegiados") != null) {
      this.body = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaColegiados")
      );
      sessionStorage.removeItem("filtrosBusquedaColegiados");
      this.isBuscar();
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onHideDatosColegiales() {
    this.showDatosColegiales = !this.showDatosColegiales;
  }

  onHideDatosGeneralesAvanzados() {
    this.showDatosGeneneralesAvanzado = !this.showDatosGeneneralesAvanzado;
  }

  onHideDireccion() {
    this.showDatosDireccion = !this.showDatosDireccion;
  }

  irEditarColegiado(id) {
    if (id.length >= 1 && this.selectMultiple == false) {
      sessionStorage.removeItem("personaBody");
      sessionStorage.setItem("esColegiado", "true");
      sessionStorage.setItem(
        "filtrosBusquedaColegiados",
        JSON.stringify(this.body)
      );
      sessionStorage.setItem("personaBody", JSON.stringify(id));
      console.log(id);
      this.router.navigate(["/fichaColegial"]);
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  activarPaginacion() {
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

  getComboPoblacion(dataFilter) {
    this.sigaServices
      .getParam(
        "busquedaColegiados_poblacion",
        "?idProvincia=" + this.body.idProvincia + "&dataFilter=" + dataFilter
      )
      .subscribe(
        n => {
          this.isDisabledPoblacion = false;
          this.comboPoblacion = n.combooItems;
        },
        error => {},
        () => {}
      );
  }

  onChangeCodigoPostal(event) {
    if (this.isValidCodigoPostal() && this.body.codigoPostal.length == 5) {
      let value = this.body.codigoPostal.substring(0, 2);
      if (
        value != this.body.idProvincia ||
        this.body.idProvincia == undefined
      ) {
        this.body.idProvincia = value;
        this.comboPoblacion = [];
        this.isDisabledPoblacion = false;
      }
    }
  }

  buscarPoblacion(e) {
    if (e.target.value && e.target.value !== null && e.target.value !== "") {
      if (e.target.value.length >= 3) {
        this.getComboPoblacion(e.target.value);
        this.resultadosPoblaciones = "No hay resultados";
      } else {
        this.comboPoblacion = [];
        this.resultadosPoblaciones = "Debe introducir al menos 3 caracteres";
      }
    } else {
      this.comboPoblacion = [];
      this.resultadosPoblaciones = "No hay resultados";
    }
  }

  isValidCodigoPostal(): boolean {
    return (
      this.body.codigoPostal &&
      typeof this.body.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
    );
  }

  arregloTildesCombo(combo) {
    combo.map(e => {
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
  }

  getCombos() {
    this.getComboEtiquetas();
    this.getComboSituacion();
    this.getComboResidencia();
    this.getComboInscrito();
    this.getComboSexo();
    this.getComboEstadoCivil();
    this.getComboCategoriaCurricular();
    this.getComboProvincias();
    this.getComboTiposDireccion();
  }

  getComboEtiquetas() {
    // obtener etiquetas
    this.sigaServices.get("busquedaColegiado_etiquetas").subscribe(
      n => {
        this.comboEtiquetas = n.combooItems;
        this.arregloTildesCombo(this.comboEtiquetas);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboSituacion() {
    this.sigaServices.get("busquedaColegiados_situacion").subscribe(
      n => {
        this.comboSituacion = n.combooItems;
        this.arregloTildesCombo(this.comboSituacion);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboResidencia() {
    this.comboResidencia = [
      { label: "Sí", value: 1 },
      { label: "No", value: 0 }
    ];

    this.arregloTildesCombo(this.comboResidencia);
  }

  getComboInscrito() {
    this.comboInscrito = [{ label: "Sí", value: 1 }, { label: "No", value: 0 }];

    this.arregloTildesCombo(this.comboInscrito);
  }
  getComboSexo() {
    this.comboSexo = [
      { label: "Hombre", value: "H" },
      { label: "Mujer", value: "M" }
    ];
  }

  getComboEstadoCivil() {
    this.sigaServices.get("busquedaColegiados_estadoCivil").subscribe(
      n => {
        this.comboEstadoCivil = n.combooItems;
        this.arregloTildesCombo(this.comboEstadoCivil);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboCategoriaCurricular() {
    this.sigaServices.get("busquedaColegiados_categoriaCurricular").subscribe(
      n => {
        this.comboCategoriaCurricular = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboProvincias() {
    this.sigaServices.get("busquedaColegiados_provincias").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.arregloTildesCombo(this.comboProvincias);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTiposDireccion() {
    this.sigaServices.get("busquedaColegiados_tipoDireccion").subscribe(
      n => {
        this.comboTiposDireccion = n.combooItems;
        this.arregloTildesCombo(this.comboTiposDireccion);
      },
      err => {
        console.log(err);
      }
    );
  }

  //Busca colegiados según los filtros
  isBuscar() {
    this.selectAll = false;
    this.historico = false;
    this.buscar = true;
    this.selectMultiple = false;

    this.selectedDatos = "";
    this.getColsResults();
    this.filtrosTrim();
    this.progressSpinner = true;
    this.buscar = true;

    this.body.fechaIncorporacion = [];
    this.body.fechaIncorporacion[1] = this.fechaIncorporacionHastaSelect;
    this.body.fechaIncorporacion[0] = this.fechaIncorporacionDesdeSelect;

    if (
      this.fechaNacimientoSelect != undefined ||
      this.fechaNacimientoSelect != null
    ) {
      this.body.fechaNacimiento = this.fechaNacimientoSelect;
    } else {
      this.body.fechaNacimiento = null;
    }

    this.sigaServices
      .postPaginado(
        "busquedaColegiados_searchColegiado",
        "?numPagina=1",
        this.body
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.colegiadoSearch = JSON.parse(data["body"]);
          this.datos = this.colegiadoSearch.colegiadoItem;
          this.table.paginator = true;
          this.body.fechaIncorporacion = [];
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  isLimpiar() {
    this.body = new DatosColegiadosItem();
  }

  //Elimina los espacios en blancos finales e iniciales de los inputs de los filtros
  filtrosTrim() {
    if (this.body.nif != null) {
      this.body.nif = this.body.nif.trim();
    }

    if (this.body.apellidos != null) {
      this.body.apellidos = this.body.apellidos.trim();
    }

    if (this.body.nombre != null) {
      this.body.nombre = this.body.nombre.trim();
    }

    if (this.body.numColegiado != null) {
      this.body.numColegiado = this.body.numColegiado.trim();
    }

    if (this.body.codigoPostal != null) {
      this.body.codigoPostal = this.body.codigoPostal.trim();
    }

    if (this.body.correo != null) {
      this.body.correo = this.body.correo.trim();
    }

    if (this.body.movil != null) {
      this.body.movil = this.body.movil.trim();
    }

    if (this.body.telefono != null) {
      this.body.telefono = this.body.telefono.trim();
    }
  }

  getColsResults() {
    this.cols = [
      {
        field: "nif",
        header: "censo.consultaDatosColegiacion.literal.numIden"
      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "numColegiado",
        header: "censo.busquedaClientesAvanzada.literal.nColegiado"
      },
      {
        field: "estadoColegial",
        header: "censo.fichaCliente.situacion.cabecera"
      },
      {
        field: "residenteInscrito",
        header: "censo.colegiarColegiados.literal.residenteInscrito"
      },
      {
        field: "correo",
        header: "censo.datosDireccion.literal.correo"
      },
      {
        field: "telefono",
        header: "censo.ws.literal.telefono"
      },
      {
        field: "movil",
        header: "censo.datosDireccion.literal.movil"
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
  }
}
