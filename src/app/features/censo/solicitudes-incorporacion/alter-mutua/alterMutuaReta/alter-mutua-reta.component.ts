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
import { Message } from "primeng/components/common/api";
import { DomSanitizer } from "../../../../../../../node_modules/@angular/platform-browser";
import { ConfirmationService } from "primeng/api";

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
  datosEstadoSolicitud: boolean = false;
  observaciones: boolean = false;
  mostrarInfo: boolean = false;
  tienePropuesta: boolean = true;
  tieneSolicitud: boolean = false;
  showSolicitarSeguro: boolean = false;
  deshabilitarDireccion: boolean = false;
  propuestas: any;
  estadoSolicitudResponse: any;

  @ViewChild("table")
  table;
  @ViewChild("tableB")
  tableB;
  selectedDatos;
  selectedDatosB;
  cols: any = [];
  progressSpinner: boolean = false;
  colsFisicas: any = [];
  datosAlter: AlterMutuaItem = new AlterMutuaItem();
  familiares: Array<FamiliarItem> = new Array<FamiliarItem>();
  herederosList: Array<FamiliarItem> = new Array<FamiliarItem>();
  asegurado: AseguradoItem = new AseguradoItem();
  herederos: boolean = false;
  tipoPropuesta: number;
  msgs: Message[] = [];

  rowsPerPage: any = [];
  datos: any;
  datosB: any;
  numSelected: number = 0;
  selectedItem: number = 10;
  selectMultiple: boolean = false;
  selectAll: boolean = false;
  sortO: number = 1;
  sortF: string = "";
  idFamiliar: String;
  datosFamiliar: DatosFamiliaresItem = new DatosFamiliaresItem();
  datosHeredero: DatosFamiliaresItem = new DatosFamiliaresItem();
  nuevaFecha = Date;
  isVolver: boolean = false;
  isCrear: boolean = false;
  isEliminar: boolean = false;
  tarifa: any;
  infoPropuesta: any;


  comboSexo: any[];
  comboColegios: any[];
  comboEstadoCivil: any[];
  comboModContratacion: any[] = [];
  comboComunicacion: any[];
  comboIdioma: any[];
  comboBeneficiario: any[];
  comboParentesco: any[];
  comboTipoIdentificacion: any[];
  comboTiposSolicitud: any[];

  paises: any[];
  provincias: any[];
  TipoDireccion: any[];

  sexoSelected: any;
  sexoSelectedTabla: any;
  estadoCivilSelected: any;
  ColegioSelected: any;
  idiomaSelected: any;
  comunicacionSelected: any;
  paisSelected: any;
  modContratacionSelected: any;
  provinciaSelected: any;
  tipoDirSelected: any;
  parentescoSelected: any;
  tipoIdentificacionSelected: any;
  tipoSolicitudSelected: any;
  tipoEjercicioSelected: any;
  parentescoSend: any;
  datosSolicitud: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    public datepipe: DatePipe,
    private location: Location,
    private domSanitizer: DomSanitizer,
    private confirmationService: ConfirmationService
  ) {

  }

  ngOnInit() {
    this.progressSpinner = true;
    this.es = this.translateService.getCalendarLocale();

    if (sessionStorage.getItem("datosSolicitud") != null) {
      this.datosSolicitud = JSON.parse(sessionStorage.getItem("datosSolicitud"));
      //Reta es tipo 1
      this.tipoPropuesta = 1;
      //ofertas es tipo 3
      let tipoIdenficador;
      if (this.datosSolicitud.tipoIdentificacion.lastIndexOf("NIF") == 0)
        tipoIdenficador = 0
      else
        tipoIdenficador = 1
      let estadoColegiado = {
        tipoIdentificador: tipoIdenficador,
        identificador: this.datosSolicitud.numeroIdentificacion
      }
      this.sigaServices.post("alterMutua_estadoColegiado", estadoColegiado).subscribe(result => {
        this.estadoSolicitudResponse = JSON.parse(result.body);
        this.progressSpinner = false;
      }, error => {
        console.log(error)
      }, () => {
        if (this.estadoSolicitudResponse.error == false) {
          this.tieneSolicitud = true;
        } else {
          this.showSolicitarSeguro = true;
        }
      })

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

    if (this.propuestas.propuestas != null) {
      for (let i = 0; i < this.propuestas.propuestas.length; i++) {
        if (i == 0) {
          let item = { label: "", value: "" };
          this.comboModContratacion.push(item);
        }
        let item = { label: this.propuestas.propuestas[i].nombre, value: this.propuestas.propuestas[i].idPaquete };
        this.comboModContratacion.push(item);
      }
      this.comboModContratacion = [...this.comboModContratacion];
    }
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
      { label: "Español", value: 1 },
      { label: "Catalán", value: 2 }
    ];

    this.comboComunicacion = [
      { label: "", value: null },
      { label: "Correo Electrónico", value: 1 },
      { label: "Teléfono", value: 2 },
      { label: "Carta", value: 3 }
    ];

    this.TipoDireccion = [
      { label: "", value: null },
      { label: "Residencia", value: 1 },
      { label: "Despacho", value: 2 }
    ];

    this.comboBeneficiario = [
      { label: "", value: null },
      { label: "Herederos Legales", value: "1" },
      { label: "Familiares", value: "2" },
      { label: "Otros", value: "3" }
    ];

    this.comboParentesco = [
      { label: '', value: null },
      { label: 'Hij@', value: 1 },
      { label: 'Suegr@', value: 14 },
      { label: 'Otra Relacion', value: 16 },
      { label: 'Pareja', value: 17 },
      { label: 'No Familiar', value: 18 },
      { label: 'Conyuje', value: 3 },
      { label: 'Padre', value: 4 },
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

    this.sigaServices.get("solicitudInciporporacion_tipoSolicitud").subscribe(
      result => {
        this.comboTiposSolicitud = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );
  }


  buscarPropuestas() {
    this.progressSpinner = true;
    this.tieneSolicitud = false;

    let datosPropuesta = {
      tipoIdentificador: this.datosSolicitud.tipoIdentificacion,
      identificador: this.datosSolicitud.numeroIdentificacion,
      fechaNacimiento: this.datosSolicitud.fechaNacimiento,
      sexo: this.datosSolicitud.sexo,
      tipoPropuesta: this.tipoPropuesta
    };
    this.sigaServices.post("alterMutua_propuestas", datosPropuesta).subscribe(result => {

      this.propuestas = JSON.parse(result.body);
    }, error => {
      console.log(error);
      this.showFail("No es posible solicitar el seguro alternativa al RETA");

    }, () => {
      if (this.propuestas.error == true) {
        this.tienePropuesta = false;
      } else {
        this.tienePropuesta = true;
        this.showSolicitarSeguro = false;
      }
      this.cargarCombos();
      this.tratarDatos();
      this.progressSpinner = false;
    });

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
    this.asegurado.movil = this.datosSolicitud.movil;
    this.asegurado.nombre = this.datosSolicitud.nombre;
    this.asegurado.pais = this.datosSolicitud.idPais;
    this.asegurado.poblacion = this.datosSolicitud.nombrePoblacion;
    this.asegurado.provincia = this.datosSolicitud.idProvincia;
    this.asegurado.sexo = this.datosSolicitud.sexo;
    this.asegurado.telefono = this.datosSolicitud.telefono1;
    this.datosAlter.observaciones = this.datosSolicitud.observaciones;
    this.provinciaSelected = { value: this.datosSolicitud.idProvincia };
    this.paisSelected = { value: this.datosSolicitud.idPais };
    this.paisSelected == '191' ? this.deshabilitarDireccion = false : this.deshabilitarDireccion = true;
    this.sexoSelected = { value: this.datosSolicitud.sexo };
    this.estadoCivilSelected = { value: this.datosSolicitud.idEstadoCivil };
    this.provinciaSelected = { value: this.datosSolicitud.idProvincia };
    this.ColegioSelected = { value: this.datosSolicitud.idInstitucion };
    this.tipoEjercicioSelected = { value: this.datosSolicitud.idTipo };


  }
  onChangePais(event) {

    this.paisSelected = { value: event.value.value };
    if (event.value.value != "191") {
      this.provinciaSelected = null;
      this.asegurado.poblacion = null;
      this.asegurado.cp = null;
      this.deshabilitarDireccion = true;
    } else {
      this.deshabilitarDireccion = false;
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
        this.datos[key].idSexo = this.sexoSelectedTabla;
        this.datos[key].nombre = this.datosFamiliar.nombre;
        this.datos[key].apellidos = this.datosFamiliar.apellidos;
        this.datos[key].idTipoIdentificacion = this.tipoIdentificacionSelected;
        this.datos[key].nIdentificacion = this.datosFamiliar.nIdentificacion;
        this.datos[key].fechaNacimiento = this.datosFamiliar.fechaNacimiento;
      }
    });
  }
  isInvalidFamiliar(): boolean {
    if (this.datosFamiliar.idSexo != '' && this.datosFamiliar.nombre != '' && this.datosFamiliar.apellidos != '' && this.datosFamiliar.idParentesco != ''
      && this.datosFamiliar.idTipoIdentificacion != '' && this.datosFamiliar.nIdentificacion != '' && this.datosFamiliar.fechaNacimiento != undefined) {
      return false;
    } else {
      return true;
    }
  }

  isInvalidHeredero(): boolean {
    if (this.datosHeredero.idSexo != '' && this.datosHeredero.nombre != '' && this.datosHeredero.apellidos != '' && this.datosHeredero.idParentesco != ''
      && this.datosHeredero.idTipoIdentificacion != '' && this.datosHeredero.nIdentificacion != '' && this.datosHeredero.fechaNacimiento != undefined) {
      return false;
    } else {
      return true;
    }
  }
  irDatosHeredero(id) {

    this.datosB.forEach((value: any, key: number) => {
      if (key == id) {
        this.datosB[key].idParentesco = this.parentescoSelected;
        this.datosB[key].idSexo = this.sexoSelectedTabla;
        this.datosB[key].nombre = this.datosFamiliar.nombre;
        this.datosB[key].apellidos = this.datosFamiliar.apellidos;
        this.datosB[key].idTipoIdentificacion = this.tipoIdentificacionSelected;
        this.datosB[key].nIdentificacion = this.datosFamiliar.nIdentificacion;
        this.datosB[key].fechaNacimiento = this.datosFamiliar.fechaNacimiento;
      }
    });
  }

  onchangeParentesco(event) {
    if (event) {
      this.parentescoSelected = event.value.label;
    }
  }

  onchangeSexo(event) {
    if (event) {
      this.sexoSelectedTabla = event.value.label;
    }
  }

  onchangeIdentificacion(event) {
    if (event) {
      this.tipoIdentificacionSelected = event.value.label;
    }
  }

  crear() {

    this.isCrear = true;
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

  crearB() {
    this.isCrear = true;
    this.datosHeredero = new DatosFamiliaresItem();
    if (this.datosB == null || this.datosB == undefined || this.datosB.length == 0) {
      this.datosB = [];
    } else {
      let value = this.table.first;
    }

    let dummy = {
      idFamiliar: this.tableB.first,
      idParentesco: "",
      idSexo: "",
      nombre: "",
      apellidos: "",
      idTipoIdentificacion: "",
      nIdentificacion: "",
      fechaNacimiento: undefined
    };
    this.datosB = [dummy, ...this.datosB];

    // this.table.reset();
    let event = { field: "nombre", order: 1, multisortmeta: undefined };
    this.changeSort(event);
  }

  confirmEdit() {

    this.datos.forEach((value: any, key: number) => {
      if (key == value.idFamiliar) {
        this.datos[key].idFamiliar = value.idFamiliar;
        this.datos[key].idParentesco = this.parentescoSelected;
        this.datos[key].idSexo = this.sexoSelectedTabla;
        this.datos[key].nombre = this.datosFamiliar.nombre;
        this.datos[key].apellidos = this.datosFamiliar.apellidos;
        this.datos[key].idTipoIdentificacion = this.tipoIdentificacionSelected;
        this.datos[key].nIdentificacion = this.datosFamiliar.nIdentificacion;
        this.datos[key].fechaNacimiento = this.datosFamiliar.fechaNacimiento;

      }
    });
    this.isCrear = false;

    this.selectedDatos = [];
    this.selectAll = false;
  }

  confirmEditB() {

    this.datosB.forEach((value: any, key: number) => {
      if (key == value.idFamiliar) {
        this.datosB[key].idFamiliar = value.idFamiliar;
        this.datosB[key].idParentesco = this.parentescoSelected;
        this.datosB[key].idSexo = this.sexoSelectedTabla;
        this.datosB[key].nombre = this.datosHeredero.nombre;
        this.datosB[key].apellidos = this.datosHeredero.apellidos;
        this.datosB[key].idTipoIdentificacion = this.tipoIdentificacionSelected;
        this.datosB[key].nIdentificacion = this.datosHeredero.nIdentificacion;
        this.datosB[key].fechaNacimiento = this.datosHeredero.fechaNacimiento;

      }
    });
    this.isCrear = false;
    this.selectedDatosB = [];
    this.selectAll = false;
  }



  enviarDatosAlter() {
    this.datosAlter.idPaquete = this.modContratacionSelected.value;
    this.asegurado.modContratacion = this.modContratacionSelected.value;
    this.asegurado.sexo = this.sexoSelected.value;
    this.asegurado.estadoCivil = this.estadoCivilSelected.value;
    this.asegurado.colegio = this.ColegioSelected.value;
    this.asegurado.medioComunicacion = this.comunicacionSelected.value;
    this.asegurado.idioma = this.idiomaSelected.value;
    this.asegurado.pais = this.paisSelected.value;
    this.asegurado.provincia = this.provinciaSelected.value;
    this.asegurado.tipoDireccion = this.tipoDirSelected.value;
    this.asegurado.tipoEjercicio = this.tipoEjercicioSelected.value;
    if (this.datosSolicitud.tipoIdentificacion.lastIndexOf("NIF") == 0)
      this.asegurado.tipoIdentificador = 0
    else
      this.asegurado.tipoIdentificador = 1

    this.datosAlter.asegurado = this.asegurado;

    if (this.herederos == true) {
      if (this.datosB != null) {
        this.datosB.forEach(element => {
          let heredero: FamiliarItem = new FamiliarItem();
          heredero.nombre = element.nombre;
          heredero.apellido = element.apellidos;
          heredero.parentesco = element.idParentesco;
          if (element.idSexo == "Hombre") {
            heredero.sexo = 1;
          } else {
            heredero.sexo = 2;
          }
          heredero.tipoIdentificacion = element.idTipoIdentificacion;
          heredero.identificacion = element.nIdentificacion;
          heredero.fechaNacimiento = element.fechaNacimiento;
          this.herederosList.push(heredero);
        });
        this.datosAlter.herederos = this.herederosList;
      }
    } else {
      if (this.datos != null) {
        this.datos.forEach(element => {
          let familiar: FamiliarItem = new FamiliarItem();
          familiar.nombre = element.nombre;
          familiar.apellido = element.apellidos;
          familiar.parentesco = element.idParentesco;
          if (element.idSexo == "Hombre") {
            familiar.sexo = 1;
          } else {
            familiar.sexo = 2;
          }
          familiar.tipoIdentificacion = element.idTipoIdentificacion;
          familiar.identificacion = element.nIdentificacion;
          familiar.fechaNacimiento = element.fechaNacimiento;
          this.familiares.push(familiar);
        });
        this.datosAlter.familiares = this.familiares;
      }
    }



    this.sigaServices.post("alterMutua_solicitudAlter", this.datosAlter).subscribe(result => {
      this.propuestas = JSON.parse(result.body);

    }, error => {
      console.log(error);
    }, () => {
      if (this.propuestas.error == false) {
        this.showSuccess("La solicitud se ha enviado correctamente a Alter Mútua");
      } else {
        this.showFail("La solicitud no se ha enviado correctamente a Alter Mútua");
      }
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

  isEnviar(): boolean {
    if (this.modContratacionSelected != null && this.modContratacionSelected != "" && this.ColegioSelected != null && this.ColegioSelected != ""
      && this.comunicacionSelected != null && this.comunicacionSelected != "" && this.idiomaSelected != null && this.idiomaSelected != ""
      && this.asegurado.telefono != null && this.asegurado.domicilio && this.paisSelected != null && this.paisSelected != "" && this.asegurado.movil &&
      this.tipoDirSelected != null && this.tipoDirSelected != "" && this.asegurado.mail != null && this.asegurado.iban != null && this.tipoEjercicioSelected != null &&
      this.tipoEjercicioSelected != '' && (this.datos != null || this.datosB != null)) {
      return true;
    } else {
      return false;
    }
  }

  onchangeModalidad(event) {
    if (event) {
      this.modContratacionSelected = event.value;
      for (let i = 0; i < this.propuestas.propuestas.length; i++) {
        if (event.value.value == this.propuestas.propuestas[i].idPaquete) {
          this.tarifa = this.propuestas.propuestas[i].tarifa;
          this.infoPropuesta = {
            tarifa: this.propuestas.propuestas[i].tarifa,
            breve: this.propuestas.propuestas[i].breve,
            descripcion: this.domSanitizer.bypassSecurityTrustHtml(this.propuestas.propuestas[i].descripcion)
          };
        }
      }
      if (event.value.value == "") {
        this.tarifa = null;
      }
    }
    console.log(this.infoPropuesta.descripcion);
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

  mostrarDatosEstado() {
    this.datosEstadoSolicitud = !this.datosEstadoSolicitud;
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

  showFail(message: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: message
    });
  }

  showSuccess(message) {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Solicitud enviada",
      detail: message
    });
  }



  backTo() {
    this.location.back();
  }

  onChangeTipoBenef(event) {

    if (event.value.value == "3") {
      this.herederos = true;
    } else {
      this.herederos = false;
      this.datosB = [];
    }
  }

}
