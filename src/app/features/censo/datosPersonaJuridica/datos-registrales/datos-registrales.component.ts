import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, SimpleChanges, Output, EventEmitter, ViewEncapsulation, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { esCalendar } from "../../../../utils/calendar";
import { Message } from "primeng/components/common/api";

import { SigaServices } from "./../../../../_services/siga.service";
import { cardService } from "./../../../../_services/cardSearch.service";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { Subscription } from "rxjs/Subscription";

/*** COMPONENTES ***/
import { DatosRegistralesItem } from "./../../../../../app/models/DatosRegistralesItem";
import { DatosRegistralesObject } from "./../../../../../app/models/DatosRegistralesObject";
import { DatosPersonaJuridicaComponent } from "../../datosPersonaJuridica/datosPersonaJuridica.component";
import { ControlAccesoDto } from "./../../../../../app/models/ControlAccesoDto";
import { ComboItem } from "../../../../models/ComboItem";
import { debug } from "util";
import { Router } from "@angular/router";
import { CommonsService } from '../../../../_services/commons.service';

import { MultiSelect } from 'primeng/multiselect';
@Component({
  selector: "app-datos-registrales",
  templateUrl: "./datos-registrales.component.html",
  styleUrls: ["./datos-registrales.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class DatosRegistralesComponent implements OnInit, OnChanges {
  uploadedFiles: any[] = [];
  formBusqueda: FormGroup;
  cols: any = [];
  datosDirecciones: any[];
  select: any[];
  es: any = esCalendar;
  msgs: Message[];
  bodyInicio: DatosRegistralesItem = new DatosRegistralesItem();
  body: DatosRegistralesItem = new DatosRegistralesItem();
  bodyAnterior: DatosRegistralesItem = new DatosRegistralesItem();
  personaSearch: DatosRegistralesObject = new DatosRegistralesObject();
  modificablecontador: string;
  modo: string;
  contador: string;
  prefijo: string;
  sufijo: string;
  longitudcontador: string;
  cadenaContador: String;
  cadenaPrefijo: String;
  cadenaSufijo: String;
  noEditable: boolean = false;
  prefijoBlock: boolean = false;
  fechaConstitucion: Date;
  fechaCancelacion: Date;
  fechaInscripcion: Date;
  requiredContador: boolean = false;
  sociedadProfesional: Boolean = false;
  fichasActivas: Array<any> = [];
  todo: boolean = false;
  textFilter: String = "Elegir";
  selectedDatos: any = [];

  progressSpinner: boolean = false;
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  rowsPerPage: any = [];
  showAll: boolean = false;

  selectedItem: number = 10;
  selectedDoc: string = "NIF";
  newDireccion: boolean = false;

  editar: boolean = false;
  archivoDisponible: boolean = false;
  file: File = undefined;
  base64String: any;
  source: any;
  resaltadoDatos:boolean = false;
  imageBase64: any;
  imagenURL: any;
  generos: any[];
  tratamientos: any[];
  actividadesDisponibles: any[];
  fecha;
  fechaCorrecta: boolean;
  fechaFinCorrecta: boolean;
  fechaConst: Date;
  fechaFin: Date;
  fechaReg: Date;
  fechaCanc: Date;
  contadorNoCorrecto: boolean;
  selectActividad: any[];
  idiomas: any[] = [
    { label: "", value: "" },
    { label: "Castellano", value: "castellano" },
    { label: "Catalá", value: "catalan" },
    { label: "Euskara", value: "euskera" },
    { label: "Galego", value: "gallego" }
  ];
  textSelected: String = "{0} actividades seleccionadas";
  idPersona: String;
  idPersonaEditar: String;
  datos: any[];
  suscripcionBusquedaNuevo: Subscription;
  activacionEditar: boolean;
  camposDesactivados: boolean = false;
  disabledAction: boolean = false;
  camposObligatorios: any = [];
  isValidate: boolean;
  isNuevo: boolean;

  prefijoSSPPInicial;
  sufijoSSPPInicial;
  contadorSSPPInicial;
  colapsarTarjeta: boolean = true;

  @ViewChild('someDropdown') someDropdown: MultiSelect;

  @ViewChild(DatosRegistralesComponent)
  datosRegistralesComponent: DatosRegistralesComponent;

  @ViewChild("table")
  table;

  tarjeta: string;
  searchDatos: boolean = false;
  @Input() cantidadIntegrantes; 
  @Input() openTarjeta;
  @Output() permisosEnlace = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private cardService: cardService,
    private fichasPosibles: DatosPersonaJuridicaComponent,
    private router: Router,
    private commonsService: CommonsService,
  ) {
    this.formBusqueda = this.formBuilder.group({
      cif: null
    });
  }

  ngOnInit() {
    this.checkAcceso();

    if (sessionStorage.getItem("disabledAction") == "true") {
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }

    this.getDatosRegistrales();

    this.suscripcionBusquedaNuevo = this.cardService.searchNewAnnounce$.subscribe(
      id => {
        if (id !== null && !this.searchDatos) {
          this.searchDatos = true;
          this.idPersonaEditar = id;
          this.getDatosRegistrales();
        }
      }
    );

    this.sigaServices
      .get("datosRegistrales_actividadesDisponible")
      .subscribe(
        n => {
          this.actividadesDisponibles = n.combooItems;
        },
        err => {
          console.log(err);
        }
      );

    this.select = [
      { label: "", value: null },
      { label: "NIF", value: "nif" },
      { label: "Pasaporte", value: "pasaporte" },
      { label: "NIE", value: "nie" }
    ];

    this.generos = [
      { label: "", value: "" },
      { label: "Mujer", value: "M" },
      { label: "Hombre", value: "H" }
    ];
  }



  getDatosRegistrales() {
    this.progressSpinner = true;
    this.sigaServices.get("datosRegistrales_datosContador").subscribe(
      data => {
        this.modificablecontador = data.modificablecontador;
        this.modo = data.modo;
        this.contador = data.contador;
        //Se calcula contador + 1
        let contadorNumber = Number(this.contador);
        contadorNumber += 1;
        this.contador = contadorNumber.toString();
        this.prefijo = data.prefijo;
        this.sufijo = data.sufijo;
        this.longitudcontador = data.longitudcontador;
        // this.desactivadoSociedad();
        //   this.onChangeSociedad();
        if (sessionStorage.getItem("historicoSociedad") != null) {
          this.camposDesactivados = true;
          this.prefijoBlock = true;
        }

        this.bodyAnterior = JSON.parse(sessionStorage.getItem("usuarioBody"));
        if (sessionStorage.getItem("nuevoRegistro") == null) {
          if (this.bodyAnterior[0] != undefined) {
            if (this.bodyAnterior[0] != null) {
              this.body.idPersona = this.bodyAnterior[0].idPersona;
              this.idPersonaEditar = this.bodyAnterior[0].idPersona;
              
            }
            this.search();
            this.getActividadesPersona();
          } else {
            this.progressSpinner = false;
          }

        } else {
          this.progressSpinner = false;
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );
  }
  ngOnChanges(changes: SimpleChanges) {
    let fichaPosible = this.esFichaActiva(this.openTarjeta);
    if (fichaPosible == false) {
      this.abreCierraFicha(this.openTarjeta);
    }

    if (changes.cantidadIntegrantes && 
        changes.cantidadIntegrantes != null && 
        changes.cantidadIntegrantes.currentValue == 0 && 
        this.sociedadProfesional == true) { 
      this.sociedadProfesional = false; 
      this.showCustomFail("Debe haber como mínimo un integrante para poder marcar la sociedad como profesional."); 
    } 

  }
  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "12a";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjeta = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        if (this.tarjeta == "3" || this.tarjeta == "2") {
          let permisos = "registrales";
          this.permisosEnlace.emit(permisos);
        }
      }
    );
  }

  compruebaFechaConstitucion() {
    if (this.fechaConstitucion > new Date()) {
      this.fechaCorrecta = false;
    } else {
      this.fechaCorrecta = true;
      return true;
    }
  }

  compruebaFechaRegistro() {
    //   if (this.fechaInscripcion > new Date()) {
    //     this.fechaCorrecta = false;
    //   } else {
    //     this.fechaCorrecta = true;
    //     return true;
    //   }
    //this.fechaCorrecta = true;
  }

  compruebaFechaFin() {
    let fecha = this.transformaFecha(this.fechaConstitucion);
    if (this.fechaFin != undefined && this.fechaFin != null) {
      if (fecha > this.fechaFin) {
        this.fechaFinCorrecta = false;
      } else {
        this.fechaFinCorrecta = true;
      }
    } else {
      this.fechaFinCorrecta = null;
    }
    if (this.compruebaFechaConstitucion()) {
      return true;
    }
  }

  compruebaRegistro() {
    if (
      Number(this.body.contadorNumsspp) &&
      !this.onlySpaces(this.body.contadorNumsspp)
    ) {
      this.contadorNoCorrecto = false;
      return true;
    } else {
      if (
        this.body.contadorNumsspp == "" ||
        this.onlySpaces(this.body.contadorNumsspp)
      ) {
        this.contadorNoCorrecto = null;
        return false;
      } else {
        this.contadorNoCorrecto = true;
        return false;
      }
    }
  }

  getActividadesPersona() {
    this.sigaServices
      .post("datosRegistrales_actividadesPersona", this.body)
      .subscribe(
        data => {
          this.selectActividad = JSON.parse(data["body"]).combooItems;
          // seleccionadas.forEach((value: any, index: number) => {
          //   this.selectActividad.push(value.value);
          // });
        },
        err => {
          console.log(err);
        }
      );
  }

  search() {
    this.body.idPersona = this.idPersonaEditar;
    this.contadorNoCorrecto = false;
    this.fechaCorrecta = true;
    this.getActividadesPersona();
    this.progressSpinner = true;
    this.sigaServices
      .postPaginado("datosRegistrales_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.personaSearch = JSON.parse(data["body"]);
          this.body = this.personaSearch.datosRegistralesItems[0];
          if((this.body.objetoSocial == null || this.body.objetoSocial == undefined || this.body.objetoSocial == "")||
          (this.body.resena == null || this.body.resena == undefined || this.body.resena == "")||
          (this.body.fechaConstitucion == null || this.body.fechaConstitucion == undefined)||
          (this.body.numRegistro == null || this.body.numRegistro == undefined || this.body.numRegistro == "")||
          (this.body.identificacionReg == null || this.body.numRegistro == undefined || this.body.numRegistro == "")||
          (this.body.prefijoNumsspp == null || this.body.prefijoNumsspp == undefined || this.body.prefijoNumsspp == "")||
          (this.body.sufijoNumsspp == null || this.body.sufijoNumsspp == undefined || this.body.sufijoNumsspp == "")||
          (this.body.contadorNumsspp == null || this.body.contadorNumsspp == undefined || this.body.contadorNumsspp == "")){
            this.abreCierraFicha('registrales');
          }
          this.progressSpinner = false;
          // if (this.body.identificacionReg == undefined) {
          //   this.body.fechaConstitucion = null;

          //   this.body.objetoSocial = "";
          //   this.body.resena = "";

          //   //this.body = new DatosRegistralesItem();
          //   this.isNuevo = true;
          //   if (this.modo == "0") {
          //     this.noEditable = true;
          //   } else {
          //     this.noEditable = false;
          //     // this.body.prefijoNumsspp = this.prefijo;
          //     // this.body.sufijoNumsspp = this.sufijo;
          //   }
          // } else {
          this.isNuevo = false;
          if (this.body != undefined) {
            this.body.idPersona = this.idPersonaEditar;
            this.fechaConstitucion = this.body.fechaConstitucion;
            if (this.body.fechaCancelacion != null) {
              this.fechaCancelacion = new Date(this.body.fechaCancelacion);
            } else {
              this.fechaCancelacion = null;
            }

            this.fechaFin = this.body.fechaFin;
            if(this.body.fechaInscripcion != null){
              this.fechaInscripcion = new Date(this.body.fechaInscripcion);
            } else {
              this.fechaInscripcion = null;
            }

            if (this.body.sociedadProfesional == "1") {
              this.sociedadProfesional = true;
            } else if (this.body.sociedadProfesional == "0") {
              this.sociedadProfesional = false;
            }

            this.contadorSSPPInicial = this.body.contadorNumsspp;
            this.prefijoSSPPInicial = this.body.prefijoNumsspp;
            this.sufijoSSPPInicial = this.body.sufijoNumsspp;

            this.getNumsspp();

            //}

          } else {
            this.body = new DatosRegistralesItem();
          }
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        }
      );
  }

  // Tratamos al número de registro
  fillWithCeros(cadena: string, lengthCadena: number): string {
    var cadenaWithCeros: string = "";

    if (cadena != null) {
      if (cadena != "") {
        var length: number = lengthCadena - cadena.toString().length;

        if (length == 0 || length < 0) {
          return cadena;
        } else if (length >= 1) {
          for (let i = 0; i < length; i++) {
            cadenaWithCeros += "0";
          }

          return cadenaWithCeros + cadena;
        }
      } else {
        return cadena;
      }
    } else return cadena;
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }
  showFailGenerico(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(mensaje)
    });
  }

  showCustomFail(mensaje) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }

  guardar() {
    this.colapsarTarjeta = false;
    if (!this.desactivadoGuardar()) {
      this.progressSpinner = true;
      this.arreglarFechas();
      if (sessionStorage.getItem("nuevoRegistro") == undefined && sessionStorage.getItem("nuevoRegistro") == null) {
        this.body.cif = this.bodyAnterior[0].nif;
      }
      this.body.idPersona = this.idPersonaEditar;
      if (this.selectActividad != undefined) {
        this.body.actividades = [];
        this.selectActividad.forEach((value: ComboItem, key: number) => {
          this.body.actividades.push(value.value);
        });
      } else {
        this.body.actividades = [];
      }
      if (this.body.companiaAseg == undefined) this.body.companiaAseg = "";

      if (this.body.numeroPoliza == undefined) this.body.numeroPoliza = "";

      // if (this.sociedadProfesional == true) {
      //   this.body.sociedadProfesional = "1";
      // } else {
      //   this.body.sociedadProfesional = "0";
      //   this.body.prefijoNumsspp = "";
      //   this.body.contadorNumsspp = "";
      //   this.body.sufijoNumsspp = "";
      // }

      if (
        (this.body.contadorNumsspp != undefined &&
          !this.onlySpaces(this.body.contadorNumsspp)) ||
        !this.requiredContador
      ) {
        if (!(this.requiredContador && Number(this.body.contadorNumsspp))) {
          if (
            !(
              this.requiredContador &&
              this.body.contadorNumsspp.length <= Number(this.longitudcontador)
            )
          ) {
            if (this.body.numRegistro == "") {
              this.body.numRegistro = null;
            }

            if (this.cantidadIntegrantes == 0) { 
              this.body.sociedadProfesional = "0"; 
            } 

            if (this.body.resena == null) { 
              this.body.resena = ""; 
            } 

            if (this.body.objetoSocial == null) { 
              this.body.objetoSocial = ""; 
            } 
            this.sigaServices
              .post("datosRegistrales_update", this.body)
              .subscribe(
                data => {
                  this.showSuccess();
                  this.progressSpinner = false;
                },
                error => {
                  let mess = JSON.parse(error["error"]);
                  if (mess.error != undefined && mess.error != null) {
                    this.showFailGenerico(mess.error.message);
                  }
                  this.progressSpinner = false;
                },
                () => {
                  this.resaltadoDatos = false;
                  this.search();
                }
              );
          } else {
            this.showCustomFail(
              "El campo número de registro SIGA no puede ser superior a la longitud del contador: " +
              this.longitudcontador
            );
            this.progressSpinner = false;
          }
        } else {
          this.showCustomFail(
            "El campo número de registro SIGA debe ser numérico"
          );
          this.progressSpinner = false;
        }
      } else {
        this.showCustomFail(
          "Las sociedades profesionales deben especificar el número de registro"
        );
        this.progressSpinner = false;
      }
    } else {
      this.showCustomFail("Debe rellenar todos los datos obligatorios para guardar");
    }

  }

  arreglarFechas() {
    if (this.fechaConstitucion != undefined && this.fechaConstitucion != null) {
      this.body.fechaConstitucion = this.transformaFecha(
        this.fechaConstitucion
      );
    } else {
      this.body.fechaConstitucion = this.fechaConstitucion;
    }
    if (this.fechaCancelacion != undefined && this.fechaCancelacion != null) {
      this.body.fechaCancelacion = this.transformaFecha(this.fechaCancelacion);
    } else {
      this.body.fechaCancelacion = this.fechaCancelacion;
    }
    if (this.fechaInscripcion != undefined && this.fechaInscripcion != null) {
      this.body.fechaInscripcion = this.transformaFecha(this.fechaInscripcion);
    } else {
      this.body.fechaInscripcion = this.fechaInscripcion;
    }
    if (this.fechaFin != undefined && this.fechaFin != null) {
      this.body.fechaFin = this.transformaFecha(this.fechaFin);
    } else {
      this.body.fechaFin = this.fechaFin;
    }
  }

  transformaFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(fecha);
    }
    return fecha;
  }

  onChangeSociedad() {
    if (this.sociedadProfesional == true) {
      this.prefijoBlock = true;
      this.body.prefijoNumsspp = "SP/";
      this.requiredContador = true;
    } else {
      if (this.camposDesactivados == true) {
        this.prefijoBlock = false;
      }
      this.requiredContador = false;
    }
  }

  habilitarCheck() {
    if (
      (this.body.objetoSocial != undefined &&
        this.body.objetoSocial != "" &&
        !this.onlySpaces(this.body.objetoSocial)) ||
      (this.body.resena != undefined &&
        this.body.resena != "" &&
        !this.onlySpaces(this.body.resena)) ||
      (this.fechaConstitucion != undefined &&
        this.compruebaFechaConstitucion()) ||
      this.fechaInscripcion != undefined ||
      (this.body.numRegistro != undefined &&
        this.body.numRegistro != "" &&
        !this.onlySpaces(this.body.numRegistro)) ||
      (this.body.identificacionReg != undefined &&
        this.body.identificacionReg != "" &&
        !this.onlySpaces(this.body.identificacionReg) &&
        (this.body.contadorNumsspp != undefined &&
          this.body.contadorNumsspp != "") &&
        !this.onlySpaces(this.body.contadorNumsspp)) ||
      (this.body.identificacionReg != undefined &&
        this.body.identificacionReg != "" &&
        !this.onlySpaces(this.body.identificacionReg))
    ) {
      // this.sociedadProfesional = true;
      this.onChangeSociedadProfesional();
      return true;
    } else {
      this.onChangeSociedadProfesional();
      return false;
    }
  }

  getNumsspp() {

    if (this.modificablecontador == "0" && this.sociedadProfesional) {
      this.noEditable = true;
    } else {
      this.noEditable = false;
    }

    if (this.sociedadProfesional) {
      if (this.body.contadorNumsspp != undefined && this.body.contadorNumsspp != null && this.body.contadorNumsspp != "") {

        this.body.contadorNumsspp = this.fillWithCeros(
          this.body.contadorNumsspp,
          Number(this.longitudcontador)
        );

        this.cadenaPrefijo = this.body.prefijoNumsspp;
        this.cadenaContador = this.body.contadorNumsspp;
        this.cadenaSufijo = this.body.sufijoNumsspp;
      } else {

        this.body.contadorNumsspp = this.fillWithCeros(
          this.contador,
          Number(this.longitudcontador)
        );

        this.body.prefijoNumsspp = this.prefijo;
        this.body.sufijoNumsspp = this.sufijo;

      }
    }
  }

  desactivadoGuardar() {
    if (this.sociedadProfesional == true) {
      if (
        this.body.resena != undefined &&
        !this.onlySpaces(this.body.resena) &&
        this.fechaConstitucion != undefined &&
        this.compruebaFechaConstitucion() &&
        this.body.contadorNumsspp != undefined &&
        !this.onlySpaces(this.body.contadorNumsspp) &&
        this.contadorNoCorrecto == false &&
        this.fechaFinCorrecta != false
      ) {
        if (this.camposDesactivados == true && this.noEditable == false) {
          this.muestraCamposObligatorios();
          return true;
        } else {
          return false;
        }
      } else {

        if ((this.body.contadorNumsspp == undefined ||
          this.onlySpaces(this.body.contadorNumsspp) || this.body.contadorNumsspp == null) && this.noEditable) {
          this.showCustomFail("No está configurado correctamente el contador de Sociedades. Si no tiene acceso a la configuración de contadores, por favor contacte con el Administrador");
        }
        // this.muestraCamposObligatorios();
        this.resaltadoDatos = true;
        return true;
      }
    } else {

      if ((this.body.contadorNumsspp == undefined ||
        this.onlySpaces(this.body.contadorNumsspp) || this.body.contadorNumsspp == null) && this.noEditable) {
        this.showCustomFail("No está configurado correctamente el contador de Sociedades. Si no tiene acceso a la configuración de contadores, por favor contacte con el Administrador");
        
        // this.muestraCamposObligatorios();
        this.resaltadoDatos = true;
        return true;
      } else {
        return false;
      }
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

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  onHideDatosColegiales() {
    this.showDatosColegiales = !this.showDatosColegiales;
  }
  onHideDatosFacturacion() {
    this.showDatosFacturacion = !this.showDatosFacturacion;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if(!fichaPosible.activa){
      this.resaltadoDatos=true;
    }
    // si no se esta creando una nueva sociedad && sessionStorage.getItem("crearnuevo") == null
    if (
      (this.tarjeta == '2' || this.tarjeta == '3') && sessionStorage.getItem("nuevoRegistro") == null && this.colapsarTarjeta
    ) {
      fichaPosible.activa = !fichaPosible.activa;
    }
    this.colapsarTarjeta = true;
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  onAbrirTodoClick() {
    this.showAll = !this.showAll;
    this.fichasPosibles.getFichasPosibles().forEach((ficha: any) => {
      ficha.activa = this.showAll;
    });
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.getFichasPosibles().filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }
  clear() {
    this.msgs = [];
  }

  comprobarValidacion() {
    if (
      this.body.identificacionReg != undefined &&
      !this.onlySpaces(this.body.identificacionReg)
      //  && this.body.fechaInscripcion != undefined
    ) {
      this.isValidate = true;
    } else {
      this.isValidate = false;
    }

    this.cardService.newCardValidator$.subscribe(data => {
      this.camposObligatorios = data.map(result => {
        result.cardRegistral = this.isValidate;
        return result;
      });

      console.log(data);
    });
  }

  onChangeSociedadProfesional() {
    this.comprobarValidacion();
    if (this.isNuevo && this.sociedadProfesional) {
      this.body.sociedadProfesional = "1";
      // if (this.modo == "0") {
      this.body.contadorNumsspp = String(
        this.fillWithCeros(this.contador,
          Number(this.longitudcontador)
        )
      );

      this.body.prefijoNumsspp = this.prefijo;
      this.body.sufijoNumsspp = this.sufijo;

      // } else {
      //   this.body.prefijoNumsspp = this.prefijo;
      //   this.body.sufijoNumsspp = this.sufijo;
      //   this.noEditable = false;
      // }
    } else if (this.sociedadProfesional) {
      this.body.sociedadProfesional = "1";

      if (this.contadorSSPPInicial != null && this.contadorSSPPInicial != undefined) {
        this.body.contadorNumsspp = this.contadorSSPPInicial;
        this.body.prefijoNumsspp = this.prefijoSSPPInicial;
        this.body.sufijoNumsspp = this.sufijoSSPPInicial;

      } else {
        this.getNumsspp();
      }

    } else if (!this.sociedadProfesional) {
      this.body.sociedadProfesional = "0";
      this.body.prefijoNumsspp = undefined;
      this.body.contadorNumsspp = undefined
      this.body.sufijoNumsspp = undefined;
      this.noEditable = false;
    }

    // else {
    //   if (this.sociedadProfesional == true) {
    //     this.body.prefijoNumsspp = this.cadenaPrefijo;
    //     this.body.sufijoNumsspp = this.cadenaSufijo;
    // this.body.contadorNumsspp = this.fillWithCeros(
    //       this.cadenaContador,
    //       Number(this.longitudcontador)
    //     );
    //   }
    // }
  }

  // isSociedadDisabled() {
  //   this.comprobarValidacion();
  //   if (this.sociedadProfesional == true) {
  //     for (let campo of this.camposObligatorios) {
  //       if (campo.cardGeneral == true && campo.cardRegistral == true && campo.cardNotario == true && campo.cardDirecciones == true && campo.cardIntegrantes == true) {
  //         this.sociedadProfesional = true;
  //       } else {
  //         setTimeout(() => {
  //           this.sociedadProfesional = false;
  //         }, 50);
  //       }
  //     }
  //   }
  // }

  compruebaNumIntegrantes() { 
    if (this.cantidadIntegrantes == 0) { 
      this.showCustomFail("Debe haber como mínimo un integrante para poder marcar la sociedad como profesional."); 
    } 
  } 

  fillFechaConstitucion(event) {
    this.fechaConstitucion = event;
    this.habilitarCheck();
    this.compruebaFechaConstitucion();
  }

  fillFechaFin(event) {
    this.fechaFin = event;
    this.compruebaFechaFin();
  }

  fillFechaInscripcion(event) {
    this.fechaInscripcion = event;
    this.habilitarCheck();
  }

  fillFechaCancelacion(event) {
    this.fechaCancelacion = event;
    this.habilitarCheck();
  }

  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento==undefined || evento==null || evento=="")){
      return this.commonsService.styleObligatorio(evento);
    }
  }
  muestraCamposObligatorios(){
    this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios')}];
    this.resaltadoDatos=true;
  }

  focusInputField() {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();  
    }, 300);
  }
}
