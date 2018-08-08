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

@Component({
  selector: "app-busqueda-colegiados",
  templateUrl: "./busqueda-colegiados.component.html",
  styleUrls: ["./busqueda-colegiados.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BusquedaColegiadosComponent extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosGeneneralesAvanzado: boolean = false;
  showDatosDireccion: boolean = false;

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

  etiquetas: any[];
  situacion: any[];
  residencia: any[] = [];
  inscrito: any[] = [];
  sexo: any[] = [];
  estadoCivil: any[];
  categoriaCurricular: any[];
  subtipoCV: any[];
  provincias: any[];
  poblaciones: any[];
  tiposDireccion: any[];

  textSelected: String = "{0} etiquetas seleccionadas";

  pruebas: string = "pruebas";
  siNoResidencia: any;
  siNoInscrito: any;
  selectedEstadoCivil: any;
  selectedCategoriaCurricular: any;
  selectedSubtipoCV: any;
  selectedProvincia: any;
  selectedPoblacion: any;
  selectedTipoDireccion: any;

  etiquetasPersonaJuridicaSelecionados: any = [];

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
  }

  @ViewChild("table") table: DataTable;
  selectedDatos;

  ngOnInit() {
    this.etiquetasPersonaJuridicaSelecionados = "";

    // obtener etiquetas
    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {
        this.etiquetas = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    // obtener situación
    this.sigaServices.get("busquedaColegiados_situacion").subscribe(
      n => {
        this.situacion = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    // residencia
    this.residencia = [
      { label: "", value: 0 },
      { label: "Sí", value: 1 },
      { label: "No", value: 2 }
    ];
    // inscrito
    this.inscrito = [
      { label: "", value: 0 },
      { label: "Sí", value: 1 },
      { label: "No", value: 2 }
    ];
    // sexo
    this.sexo = [
      { label: "", value: 0 },
      { label: "Hombre", value: 1 },
      { label: "Mujer", value: 2 }
    ];

    // estado civil
    this.sigaServices.get("busquedaColegiados_estadoCivil").subscribe(
      n => {
        this.estadoCivil = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    // categoria curricular
    this.sigaServices.get("busquedaColegiados_categoriaCurricular").subscribe(
      n => {
        this.categoriaCurricular = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    // provincias
    this.sigaServices.get("busquedaColegiados_provincias").subscribe(
      n => {
        this.provincias = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    // tipos direccion
    this.sigaServices.get("busquedaColegiados_tipoDireccion").subscribe(
      n => {
        this.tiposDireccion = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    // columnas de la tabla de datos tras la busqueda
    this.cols = [
      {
        field: "identificacion",
        header: "censo.consultaDatosColegiacion.literal.numIden"
      },
      {
        field: "apellidos",
        header: "gratuita.mantenimientoTablasMaestra.literal.apellidos"
      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "numeroColegiado",
        header: "censo.busquedaClientesAvanzada.literal.nColegiado"
      },
      {
        field: "residente",
        header: "censo.ws.literal.residente"
      },
      {
        field: "inscrito",
        header: "censo.fusionDuplicados.colegiaciones.inscrito"
      },
      {
        field: "fechaNacimiento",
        header: "censo.consultaDatosColegiacion.literal.fechaNac"
      },
      {
        field: "correoElectronico",
        header: "censo.datosDireccion.literal.correo"
      },
      {
        field: "telefonoFijo",
        header: "censo.ws.literal.telefono"
      },
      {
        field: "telefonoMovil",
        header: "censo.datosDireccion.literal.movil"
      }
    ];
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

  irEditarColegiado(id) {}

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
}
