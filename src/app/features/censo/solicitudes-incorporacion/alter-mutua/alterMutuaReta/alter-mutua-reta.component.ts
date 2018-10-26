import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { DatosFamiliaresItem } from "../../../../../models/DatosFamiliaresItem";
import { DatePipe, Location } from "@angular/common";
import { AlterMutuaItem } from "../../../../../models/AlterMutuaItem";
import { FamiliarItem } from "../../../../../models/FamiliarItem";
import { SolicitudIncorporacionItem } from "../../../../../models/SolicitudIncorporacionItem";
import { AseguradoItem } from "../../../../../models/AseguradoItem";

@Component({
  selector: "app-alter-mutua-reta",
  templateUrl: "./alter-mutua-reta.component.html",
  styleUrls: ["./alter-mutua-reta.component.scss"]
})
export class AlterMutuaRetaComponent implements OnInit {
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
  msgs: any = [];
  progressSpinner: boolean = false;
  colsFisicas: any = [];
  datosAlter: AlterMutuaItem = new AlterMutuaItem();
  familiares: Array<FamiliarItem> = new Array<FamiliarItem>();
  asegurado: AseguradoItem = new AseguradoItem();

  rowsPerPage: any = [];
  datos: any;
  numSelected: number = 0;
  selectedItem: number = 10;
  selectMultiple: boolean = false;
  selectAll: boolean = false;
  sortO: number = 1;
  sortF: string = "";
  idFamiliar: String;
  datosFamiliar: DatosFamiliaresItem = new DatosFamiliaresItem();
  nuevaFecha = Date;
  isVolver: boolean = false;
  isCrear: boolean = false;
  isEliminar: boolean = false;

  comboSexo: any[];
  comboColegios: any[];
  comboEstadoCivil: any[];
  comboModContratacion: any[];
  comboComunicacion: any[];
  comboIdioma: any[];
  comboBeneficiario: any[];
  comboParentesco: any[];
  comboTipoIdentificacion: any[];

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
  parentescoSelected: any;
  tipoIdentificacionSelected: any;
  datosSolicitud: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    public datepipe: DatePipe,
    private location: Location
  ) {

  }

  ngOnInit() {
    this.es = this.translateService.getCalendarLocale();
    this.cargarCombos();




    if (sessionStorage.getItem("datosSolicitud") != null) {
      this.datosSolicitud = JSON.parse(sessionStorage.getItem("datosSolicitud"));
      this.tratarDatos();
    }





    this.colsFisicas = [
      {
        field: "idParentesco",
        header: "Parentesco"
      },
      {
        field: "idSexo",
        header: "Sexo"
      },
      {
        field: "nombre",
        header: "Nombre"
      },
      {
        field: "apellidos",
        header: "Apellidos"
      },
      {
        field: "idTipoIdentificacion",
        header: "Tipo identificación"
      },
      {
        field: "nIdentificacion",
        header: "Número identificación"
      },
      {
        field: "fechaNacimiento",
        header: "Fecha Nacimiento"
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

    this.checkStatusInit();
  }

  cargarCombos() {
    this.comboModContratacion = [
      { label: "", value: null },
      { label: "Alter profesional joven", value: "1" },
      { label: "Alter profesional", value: "2" },
      { label: "Alter profesional plus", value: "3" }
    ];

    this.comboSexo = [
      { label: "", value: null },
      { value: "H", label: "Hombre" },
      { value: "M", label: "Mujer" }
    ];

    this.comboEstadoCivil = [
      { label: "", value: null },
      { label: "Casado", value: "1" },
      { label: "Soltero", value: "2" },
      { label: "Separado", value: "3" },
      { label: "Viudo", value: "4" }
    ];

    this.comboIdioma = [
      { label: "", value: null },
      { label: "Español", value: "1" },
      { label: "Catalán", value: "2" }
    ];

    this.comboComunicacion = [
      { label: "", value: null },
      { label: "Correo Electrónico", value: "1" },
      { label: "Teléfono", value: "2" },
      { label: "Carta", value: "3" }
    ];

    this.TipoDireccion = [
      { label: "", value: null },
      { label: "Residencia", value: "1" },
      { label: "Despacho", value: "2" }
    ];

    this.comboBeneficiario = [
      { label: "", value: null },
      { label: "Herederos Legales", value: "1" },
      { label: "Familiares", value: "2" },
      { label: "Otros", value: "3" }
    ];

    this.comboParentesco = [
      { label: '', value: null },
      { label: 'Hij@', value: '1' },
      { label: 'Suegr@', value: '2' },
      { label: 'Otra Relacion', value: '3' },
      { label: 'Pareja', value: '4' },
      { label: 'No Familiar', value: '5' },
      { label: 'Conyuje', value: '6' },
      { label: 'Padre', value: '7' },
    ];

    this.sigaServices.get("solicitudInciporporacion_tipoIdentificacion").subscribe(result => {
      this.comboTipoIdentificacion = result.combooItems;
    }, error => {
      console.log(error);
    });

    this.sigaServices.get("busquedaPer_colegio").subscribe(
      result => {
        this.comboColegios = result.combooItems;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("solicitudInciporporacion_pais").subscribe(
      result => {
        this.paises = result.combooItems;
      },
      error => {
        console.log(error);
      }
    );

    this.sigaServices.get("integrantes_provincias").subscribe(
      result => {
        this.provincias = result.combooItems;
      },
      error => {
        console.log(error);
      }
    );
  }


  tratarDatos() {


    this.asegurado.apellidos = this.datosSolicitud.apellidos;
    this.asegurado.cp = this.datosSolicitud.codigoPostal;
    this.asegurado.domicilio = this.datosSolicitud.domicilio;
    this.asegurado.estadoCivil = this.datosSolicitud.estadoCivil;
    this.asegurado.fax = this.datosSolicitud.fax1;
    this.asegurado.fechaNacimiento = new Date(this.datosSolicitud.fechaNacimiento);
    this.asegurado.iban = this.datosSolicitud.iban;
    this.asegurado.identificador = this.datosSolicitud.numeroIdentificacion;
    this.asegurado.mail = this.datosSolicitud.correoElectronico;
    //this.asegurado.modContratacion = this.datosSolicitud.modalidad;
    this.asegurado.movil = this.datosSolicitud.movil;
    this.asegurado.nombre = this.datosSolicitud.nombre;
    this.asegurado.pais = this.datosSolicitud.idPais;
    this.asegurado.poblacion = this.datosSolicitud.nombrePoblacion;
    this.asegurado.provincia = this.datosSolicitud.idProvincia;
    this.asegurado.sexo = this.datosSolicitud.sexo;
    this.asegurado.telefono = this.datosSolicitud.telefono1;
    this.datosAlter.observaciones = this.datosSolicitud.observaciones;

    this.provinciaSelected = { value: this.datosSolicitud.idProvincia };
    this.modContratacionSelected = { value: this.datosSolicitud.modalidad };
    this.paisSelected = this.paisSelected = { value: this.datosSolicitud.idPais };
    this.sexoSelected = { value: this.datosSolicitud.sexo };
    this.estadoCivilSelected = { value: this.datosSolicitud.idEstadoCivil };
    this.provinciaSelected = { value: this.datosSolicitud.idProvincia };
    console.log(this.asegurado);
    console.log(this.datosSolicitud.idProvincia);

  }
  onChangePais(event) {

    this.paisSelected = event.value.value;
    if (event.value.value != "191") {
      this.provinciaSelected = null;
      this.asegurado.poblacion = null;
      this.asegurado.cp = null;
    }
  }

  isValidIBAN(): boolean {
    if (
      (this.asegurado.iban != null || this.asegurado.iban != undefined)) {
      this.asegurado.iban = this.asegurado.iban.replace(/\s/g, "");
      return (
        this.asegurado.iban &&
        typeof this.asegurado.iban === "string" &&
        /^ES\d{22}$/.test(this.asegurado.iban)
      );
    }
  }

  irDatosFamiliar(id) {
    this.datos.forEach((value: any, key: number) => {
      if (key == id) {
        this.datos[key].idParentesco = this.parentescoSelected;
        this.datos[key].idSexo = this.sexoSelected;
        this.datos[key].nombre = this.datosFamiliar.nombre;
        this.datos[key].apellidos = this.datosFamiliar.apellidos;
        this.datos[key].idTipoIdentificacion = this.tipoIdentificacionSelected;
        this.datos[key].nIdentificacion = this.datosFamiliar.nIdentificacion;
        this.datos[key].fechaNacimiento = this.datosFamiliar.fechaNacimiento;
        this.datos[key].fechaNacimiento = this.datepipe.transform(
          new Date(this.datos[key].fechaNacimiento),
          "dd/MM/yyyy"
        );
      }
    });
    this.isCrear = false;
  }

  onchangeParentesco(event) {
    if (event) {
      this.parentescoSelected = event.value.label;
    }
  }

  onchangeSexo(event) {
    if (event) {
      this.sexoSelected = event.value.label;
    }
  }

  onchangeIdentificacion(event) {
    if (event) {
      this.tipoIdentificacionSelected = event.value.label;
    }
  }

  crear() {
    this.isVolver = false;
    this.isCrear = true;
    this.isEliminar = true;
    this.datosFamiliar = new DatosFamiliaresItem();
    if (this.datos == null || this.datos == undefined || this.datos.length == 0) {
      this.datos = [];
    } else {
      let value = this.table.first;
    }

    let dummy = {
      idFamiliar: this.table.first,
      idParentesco: "",
      idSexo: "",
      nombre: "",
      apellidos: "",
      idTipoIdentificacion: "",
      nIdentificacion: "",
      fechaNacimiento: undefined
    };
    this.datos = [dummy, ...this.datos];

    // this.table.reset();
    let event = { field: "nombre", order: 1, multisortmeta: undefined };
    this.changeSort(event);
  }

  confirmEdit() {

    this.datos.forEach((value: any, key: number) => {
      if (key == value.idFamiliar) {
        this.datos[key].idFamiliar = value.idFamiliar;
        this.datos[key].idParentesco = this.parentescoSelected;
        this.datos[key].idSexo = this.sexoSelected;
        this.datos[key].nombre = this.datosFamiliar.nombre;
        this.datos[key].apellidos = this.datosFamiliar.apellidos;
        this.datos[key].idTipoIdentificacion = this.tipoIdentificacionSelected;
        this.datos[key].nIdentificacion = this.datosFamiliar.nIdentificacion;
        this.datos[key].fechaNacimiento = this.datosFamiliar.fechaNacimiento;
        this.datos[key].fechaNacimiento = this.datepipe.transform(
          new Date(this.datos[key].fechaNacimiento),
          "dd/MM/yyyy"
        );
      }
    });
    this.isCrear = false;
  }



  enviarDatosAlter() {


    this.asegurado.modContratacion = this.modContratacionSelected;
    this.asegurado.sexo = this.sexoSelected;
    this.asegurado.estadoCivil = this.estadoCivilSelected;
    this.asegurado.colegio = this.ColegioSelected;
    this.asegurado.medioComunicacion = this.comunicacionSelected;
    this.asegurado.idioma = this.idiomaSelected;
    this.asegurado.pais = this.paisSelected;
    this.asegurado.provincia = this.provinciaSelected;
    this.asegurado.tipoDireccion = this.tipoDirSelected;
    this.datosAlter.asegurado = this.asegurado;
    this.datosAlter.idPaquete = 1;
    debugger;
    this.sigaServices.post("alterMutua_solicitudAlter", this.datosAlter).subscribe(result => {

    }, error => {
      console.log(error);
    })



  }





  changeSort(event) {
    this.sortF = "nombre";
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

  clear() {
    this.msgs = [];
  }
  backTo() {
    this.location.back();
  }

  onChangeTipoBenef(event) {
    console.log(this.beneficiarioSelected);
  }

}
