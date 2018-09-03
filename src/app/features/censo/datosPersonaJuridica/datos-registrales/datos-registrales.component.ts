import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
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

@Component({
  selector: "app-datos-registrales",
  templateUrl: "./datos-registrales.component.html",
  styleUrls: ["./datos-registrales.component.scss"]
})
export class DatosRegistralesComponent implements OnInit {
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
  modificablecontador: String;
  modo: String;
  contador: String;
  prefijo: String;
  sufijo: String;
  longitudcontador: String;
  cadenaContador: String;
  cadenaPrefijo: String;
  cadenaSufijo: String;
  noEditable: boolean = false;
  prefijoBlock: boolean = false;
  fechaConstitucion: Date;
  fechaCancelacion: Date;
  fechaInscripcion: Date;
  requiredContador: boolean = false;
  sociedadProfesional: Boolean;
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
  camposObligatorios: any = [];
  isValidate: boolean;
  isNuevo: boolean;

  @ViewChild(DatosRegistralesComponent)
  datosRegistralesComponent: DatosRegistralesComponent;

  @ViewChild("table")
  table;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private cardService: cardService,
    private fichasPosibles: DatosPersonaJuridicaComponent,
    private router: Router
  ) {
    this.formBusqueda = this.formBuilder.group({
      cif: null
    });
  }

  ngOnInit() {
    this.checkAcceso();
    this.desactivadoGuardar();

    this.sigaServices.get("datosRegistrales_datosContador").subscribe(
      data => {
        this.modificablecontador = data.modificablecontador;
        this.modo = data.modo;
        this.contador = data.contador;
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
        if (this.bodyAnterior[0] != undefined) {
          if (this.bodyAnterior != null) {
            this.body.idPersona = this.bodyAnterior[0].idPersona;
            this.idPersonaEditar = this.bodyAnterior[0].idPersona;
          }
          this.search();
          this.getActividadesPersona();
        }

        this.suscripcionBusquedaNuevo = this.cardService.searchNewAnnounce$.subscribe(
          id => {
            if (id !== null) {
              this.idPersonaEditar = id;
              this.search();
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
      },
      err => {
        console.log(err);
      }
    );
  }

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "12a";
    let derechoAcceso;
    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisosTree = JSON.parse(data.body);
        let permisosArray = permisosTree.permisoItems;
        derechoAcceso = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        if (derechoAcceso >= 2) {
          this.activacionEditar = true;
          if (derechoAcceso == 2) {
            this.camposDesactivados = true;
          }
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
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
    if (this.fechaInscripcion > new Date()) {
      this.fechaCorrecta = false;
    } else {
      this.fechaCorrecta = true;
      return true;
    }
  }

  compruebaFechaFin() {
    let fecha = this.transformaFecha(this.fechaConstitucion);
    if (this.fechaFin != undefined) {
      if (fecha > this.fechaFin) {
        this.fechaFinCorrecta = false;
      } else {
        this.fechaFinCorrecta = true;
      }
    }
    if (this.compruebaFechaConstitucion()) {
      return true;
    }
  }

  compruebaRegistro() {
    var a = this.body.contadorNumsspp;
    if (
      Number(this.body.contadorNumsspp) ||
      this.onlySpaces(this.body.contadorNumsspp)
    ) {
      this.contadorNoCorrecto = false;
      return true;
    } else {
      this.contadorNoCorrecto = true;
      return false;
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
    this.sigaServices
      .postPaginado("datosRegistrales_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.personaSearch = JSON.parse(data["body"]);
          this.body = this.personaSearch.datosRegistralesItems[0];
          console.log(this.body);
          if (this.body.identificacionReg == undefined) {
            this.body.fechaConstitucion = null;
            //this.body = new DatosRegistralesItem();
            this.isNuevo = true;
            if (this.modo == "0") {
              this.noEditable = true;
            } else {
              this.noEditable = false;
              // this.body.prefijoNumsspp = this.prefijo;
              // this.body.sufijoNumsspp = this.sufijo;
            }
          } else {
            this.isNuevo = false;
            this.body.idPersona = this.idPersonaEditar;
            this.fechaConstitucion = this.body.fechaConstitucion;
            this.fechaCancelacion = new Date(this.body.fechaCancelacion);
            this.fechaFin = this.body.fechaFin;
            this.fechaInscripcion = new Date(this.body.fechaInscripcion);

            if (this.modificablecontador == "0") {
              this.noEditable = true;
            } else {
              this.noEditable = false;
            }

            this.body.contadorNumsspp = this.fillWithCeros(
              this.body.contadorNumsspp,
              Number(this.longitudcontador)
            );

            this.cadenaPrefijo = this.body.prefijoNumsspp;
            this.cadenaContador = this.body.contadorNumsspp;
            this.cadenaSufijo = this.body.sufijoNumsspp;
          }
          if (this.body.sociedadProfesional == "1") {
            this.sociedadProfesional = true;
          } else if (this.body.sociedadProfesional == "0") {
            this.sociedadProfesional = false;
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  // Tratamos al número de registro
  fillWithCeros(cadena: String, lengthCadena: number): String {
    var cadenaWithCeros: string = "";

    var length: number = lengthCadena - cadena.length;

    if (length >= 1) {
      for (let i = 0; i < length; i++) {
        cadenaWithCeros += "0";
      }

      return cadenaWithCeros + cadena;
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
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }
  showFailGenerico(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(mensaje)
    });
  }

  showCustomFail(mensaje) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: mensaje
    });
  }

  guardar() {
    this.progressSpinner = true;
    this.arreglarFechas();
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

    if (this.sociedadProfesional == true) {
      this.body.sociedadProfesional = "1";
    } else {
      this.body.sociedadProfesional = "0";
      this.body.prefijoNumsspp = undefined;
      this.body.contadorNumsspp = undefined;
      this.body.sufijoNumsspp = undefined;
    }
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
          debugger;
          console.log("contador", this.body.contadorNumsspp);
          this.sigaServices
            .post("datosRegistrales_update", this.body)
            .subscribe(
              data => {
                this.showSuccess();
                this.progressSpinner = false;
              },
              error => {
                let mess = JSON.parse(error["error"]);
                this.showFailGenerico(JSON.stringify(mess.error.message));
                this.progressSpinner = false;
              },
              () => {
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
  }

  arreglarFechas() {
    if (this.fechaConstitucion != undefined) {
      this.body.fechaConstitucion = this.transformaFecha(
        this.fechaConstitucion
      );
    }
    if (this.fechaCancelacion != undefined) {
      this.body.fechaCancelacion = this.transformaFecha(this.fechaCancelacion);
    }
    if (this.fechaInscripcion != undefined) {
      this.body.fechaInscripcion = this.transformaFecha(this.fechaInscripcion);
    }
    if (this.fechaFin != undefined) {
      this.body.fechaFin = this.transformaFecha(this.fechaFin);
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
      (this.fechaInscripcion != undefined && this.compruebaFechaRegistro()) ||
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
      this.sociedadProfesional = true;
      this.onChangeSociedadProfesional();
    } else {
      this.sociedadProfesional = false;
      this.onChangeSociedadProfesional();
    }
  }

  desactivadoGuardar() {
    if (this.sociedadProfesional == true) {
      if (
        this.body.objetoSocial != undefined &&
        !this.onlySpaces(this.body.objetoSocial) &&
        this.body.resena != undefined &&
        !this.onlySpaces(this.body.resena) &&
        this.fechaConstitucion != undefined &&
        this.compruebaFechaConstitucion() &&
        this.fechaInscripcion != undefined &&
        this.compruebaFechaRegistro() &&
        this.body.numRegistro != undefined &&
        !this.onlySpaces(this.body.numRegistro) &&
        this.body.identificacionReg != undefined &&
        !this.onlySpaces(this.body.identificacionReg) &&
        this.body.contadorNumsspp != undefined &&
        !this.onlySpaces(this.body.contadorNumsspp)
      ) {
        if (this.camposDesactivados == true && this.noEditable == false) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else if (
      (this.body.numeroPoliza != undefined &&
        !this.onlySpaces(this.body.numeroPoliza)) ||
      (this.body.companiaAseg != undefined &&
        !this.onlySpaces(this.body.companiaAseg))
    ) {
      return false;
    } else {
      return true;
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
    // si no se esta creando una nueva sociedad
    if (
      this.activacionEditar == true &&
      sessionStorage.getItem("crearnuevo") == null
    ) {
      fichaPosible.activa = !fichaPosible.activa;
    }
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
      !this.desactivadoGuardar() &&
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
    // if (this.sociedadProfesional == true) {
    //   for (let campo of this.camposObligatorios) {
    //     if (
    //       campo.cardGeneral == true &&
    //       campo.cardRegistral == true &&
    //       campo.cardNotario == true &&
    //       campo.cardDirecciones == true &&
    //       campo.cardIntegrantes == true
    //     ) {
    //       this.sociedadProfesional = true;
    //     } else {
    //       this.showCustomFail(
    //         "Debe rellenar todos los campos obligatorios para poder activar la opción de sociedad profesional"
    //       );
    //       setTimeout(() => {
    //         this.sociedadProfesional = false;
    //       }, 50);
    //     }
    //   }
    // }
    if (this.isNuevo && this.sociedadProfesional == true) {
      if (this.modo == "0") {
        this.body.contadorNumsspp = String(
          this.fillWithCeros(
            String(Number(this.contador) + 1),
            Number(this.longitudcontador)
          )
        );

        this.body.prefijoNumsspp = this.prefijo;
        this.body.sufijoNumsspp = this.sufijo;
        this.noEditable = true;
      } else {
        this.body.prefijoNumsspp = this.prefijo;
        this.body.sufijoNumsspp = this.sufijo;
        this.noEditable = false;
      }
    } else {
      if (this.sociedadProfesional == false) {
        this.body.prefijoNumsspp = undefined;
        this.body.contadorNumsspp = undefined;
        this.body.sufijoNumsspp = undefined;
      } else {
        this.body.prefijoNumsspp = this.cadenaPrefijo;
        this.body.sufijoNumsspp = this.cadenaSufijo;
        this.body.contadorNumsspp = this.fillWithCeros(
          this.cadenaContador,
          Number(this.longitudcontador)
        );
      }
    }
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
}
