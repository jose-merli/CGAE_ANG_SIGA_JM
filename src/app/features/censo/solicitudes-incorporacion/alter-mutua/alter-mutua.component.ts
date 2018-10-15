import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";


@Component({
  selector: "app-alter-mutua",
  templateUrl: "./alter-mutua.component.html",
  styleUrls: ["./alter-mutua.component.scss"]
})
export class AlterMutuaComponent implements OnInit {

  es: any;
  datosPropuesta: boolean = false;
  datosPersonales: boolean = false;
  datosContacto: boolean = false;
  datosCuentaBancaria: boolean = false;
  datosFamiliares: boolean = false;
  datosBeneficiarios: boolean = false;
  observaciones: boolean = false;
  mostrarInfo: boolean = false;

  @ViewChild("table")
  table;
  selectedDatos;
  cols: any = [];
  colsFisicas: any = [];
  rowsPerPage: any = [];
  datos: any;
  numSelected: number = 0;
  selectedItem: number = 10;
  selectMultiple: boolean = false;
  selectAll: boolean = false;
  sortO: number = 1;
  sortF: string = "";
  idFamiliar: String;

  comboSexo: any[];
  comboColegios: any[];
  comboEstadoCivil: any[];
  comboModContratacion: any[];
  comboComunicacion: any[];
  comboIdioma: any[];
  comboBeneficiario: any[];

  paises: any[];
  provincias: any[];
  TipoDireccion: any[];

  sexoSelected: any;
  estadoCivilSelected: any;
  ColegioSelected: any;
  idiomaSelected: any;
  comunicacionSelected: any;
  paisSelected: any;
  modContratacionSelected: any;
  provinciaSelected: any;
  tipoDirSelected: any;
  beneficiarioSelected: any;

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.es = this.translateService.getCalendarLocale();
    this.cargarCombos();

    this.colsFisicas = [
      {
        field: "ponerdto",
        header: "Parentesco"
      },
      {
        field: "Sexo",
        header: "Sexo"
      },
      {
        field: "descripcionRetencion",
        header: "Nombre"
      },
      {
        field: "porcentajeRetencion",
        header: "Apellidos"
      },
      {
        field: "porcentajeRetencion",
        header: "Tipo identificación"
      },
      {
        field: "porcentajeRetencion",
        header: "Número identificación"
      },
      {
        field: "porcentajeRetencion",
        header: "Fecha Nacimiento"
      }
    ];

    this.checkStatusInit();
  }

  cargarCombos() {

    this.comboModContratacion = [
      { label: '', value: null },
      { label: 'Alter profesional joven', value: '1' },
      { label: 'Alter profesional', value: '2' },
      { label: 'Alter profesional plus', value: '3' }
    ];

    this.comboSexo = [
      { label: '', value: null },
      { value: "H", label: "Hombre" },
      { value: "M", label: "Mujer" }
    ]

    this.comboEstadoCivil = [
      { label: '', value: null },
      { label: 'Casado', value: '1' },
      { label: 'Soltero', value: '2' },
      { label: 'Separado', value: '3' },
      { label: 'Viudo', value: '4' }
    ];

    this.comboIdioma = [
      { label: '', value: null },
      { label: 'Español', value: '1' },
      { label: 'Catalán', value: '2' }
    ];

    this.comboComunicacion = [
      { label: '', value: null },
      { label: 'Correo Electrónico', value: '1' },
      { label: 'Teléfono', value: '2' },
      { label: 'Carta', value: '3' }
    ];

    this.TipoDireccion = [
      { label: '', value: null },
      { label: 'Residencia', value: '1' },
      { label: 'Despacho', value: '2' }
    ];

    this.comboBeneficiario = [
      { label: '', value: null },
      { label: 'Herederos Legales', value: '1' },
      { label: 'Familiares', value: '2' },
      { label: 'Otros', value: '3' }
    ];

    this.sigaServices.get("busquedaPer_colegio").subscribe(
      result => {
        this.comboColegios = result.combooItems;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudInciporporacion_pais").subscribe(result => {
      this.paises = result.combooItems;
    }, error => {
      console.log(error);
    });

    this.sigaServices.get("integrantes_provincias").subscribe(result => {
      this.provincias = result.combooItems;
    }, error => {
      console.log(error);
    });

  }

  onChangePais(event) {

  }

  /*isValidIBAN(): boolean {
    if (
        (this.solicitudEditar.iban != null || this.solicitudEditar.iban != undefined)) {
        this.solicitudEditar.iban = this.solicitudEditar.iban.replace(/\s/g, "");
        return (
            this.solicitudEditar.iban &&
            typeof this.solicitudEditar.iban === "string" &&
            // /ES\d{2}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}[ ]\d{4}|ES\d{22}/.test(
            ///[A-Z]{2}\d{22}?[\d]{0,2}/.test(this.body.iban)
            /^ES\d{22}$/.test(this.solicitudEditar.iban)
        );
    }
  }*/

  irDatosFamiliar(id) {

    //console.log(id[0].fechaInicio);
    if (id[0].fechaFin == null && id[0].fechaInicio != "") {
      //this.nuevafecha = id[0].fechaInicio;
      //id[0].fechaInicio = "";
      //this.newRetencion.descripcionRetencion = id[0].idRetencion;
      // this.onChangeDrop(this.newRetencion.descripcionRetencion);
      //id[0].descripcionRetencion = "";
    }
  }

  crear() {
    /*this.isVolver = false;
    this.isCrear = true;
    this.isEliminar = true;*/

    let valur2 = new Date().setMilliseconds(new Date().getMilliseconds());
    if (this.datos == null || this.datos == undefined || this.datos.length == 0) {
      this.datos = [];
    } else {
      let value = this.table.first;
      // this.createArrayEdit(dummy, value);
      this.datos.forEach((value: any, key: number) => {

        if (value.fechaFin == null || value.fechaFin == undefined) {
          // if (
          //   this.datos[key].fechaInicio ==
          //   this.datepipe.transform(new Date(valur2), "dd/MM/yyyy")
          // ) {
          //   this.datos[key].fechaFin = this.datepipe.transform(
          //     new Date(valur2),
          //     "dd/MM/yyyy"
          //   );
          // } else {
          //   this.datos[key].fechaFin = this.datepipe.transform(
          //     new Date(valur2 - 86400000),
          //     "dd/MM/yyyy"
          //   );
          /* this.nuevafecha = new Date();
           this.retencionActiveAnt = this.datos[key];
           this.datos[key].fechaFin = this.datepipe.transform(
             new Date(valur2 - 86400000),
             "dd/MM/yyyy"
           );*/
        }
      });
    }

    let dummy = {
      idFamiliar: this.idFamiliar,
      idParentesco: "",
      idSexo: undefined,
      Nombre: "",
      idTipoIdentificacion: "",
      fechaNacimiento: undefined
    };
    this.datos = [dummy, ...this.datos];

    // this.table.reset();
    let event = { field: "fechaFin", order: 1, multisortmeta: undefined };
    this.changeSort(event);
  }

  changeSort(event) {
    this.sortF = "fechaFin";
    this.sortO = 1;
    this.table.sortMultiple();
  }
  checkStatusInit() {
    this.cols = this.colsFisicas;
  }

  mostarDatosPropuesta() {
    this.datosPropuesta = !this.datosPropuesta;
  }
  mostarDatosPersonales() {
    this.datosPersonales = !this.datosPersonales;
  }
  mostrarDatosContacto() {
    this.datosContacto = !this.datosContacto;
  }
  mostrarDatosBancarios() {
    this.datosCuentaBancaria = !this.datosCuentaBancaria;
  }
  mostrarFamiliares() {
    this.datosFamiliares = !this.datosFamiliares;
  }
  mostrarDatosBeneficiarios() {
    this.datosBeneficiarios = !this.datosBeneficiarios;
  }

  mostrarObservaciones() {
    this.observaciones = !this.observaciones;
  }

  mostarPopUp() {
    this.mostrarInfo = true;
  }

}
