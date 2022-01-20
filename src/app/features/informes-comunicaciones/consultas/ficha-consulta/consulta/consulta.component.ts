import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { saveAs } from "file-saver/FileSaver";
import { Message } from "primeng/components/common/api";
import { CampoDinamicoItem } from '../../../../../models/CampoDinamicoItem';
import { ConsultaConsultasItem } from '../../../../../models/ConsultaConsultasItem';
import { esCalendar } from "../../../../../utils/calendar";
import { ControlAccesoDto } from "./../../../../../../app/models/ControlAccesoDto";
import { TranslateService } from "./../../../../../commons/translate/translation.service";
import { SigaServices } from "./../../../../../_services/siga.service";


@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {

  openFicha: boolean = false;
  activacionEditar: boolean = true;
  derechoAcceso: any;
  permisos: any;
  institucionActual: any;
  permisosArray: any[];
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  cuerpo: String;
  showAyuda: boolean = false;
  showValores: boolean = false;
  body: ConsultaConsultasItem = new ConsultaConsultasItem();
  bodyInicial: ConsultaConsultasItem = new ConsultaConsultasItem();
  saltoLinea: string = '';
  msgs: Message[];
  valores: CampoDinamicoItem[];
  consultaEditada: boolean = false;
  camposValores: any;
  progressSpinner: boolean = false;
  ayuda: any = [];
  es: any = esCalendar;
  operadoresTexto: any[];
  operadoresNumero: any[];
  editar: boolean = true;
  editMode: boolean;
  idClaseComunicacion: String = "";
  currentRoute: String = "";


  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "informes",
      activa: false
    },
    {
      key: "comunicacion",
      activa: false
    }
  ];

  constructor(private router: Router, private translateService: TranslateService,
    private sigaServices: SigaServices, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getMode();
    if (sessionStorage.getItem('nombreConsulta') != undefined) {
      sessionStorage.removeItem('nombreConsulta');
    }
    this.currentRoute = this.router.url;
    this.sigaServices.consultasRefresh$.subscribe(() => {
      this.getDatos();
    });
    this.sigaServices.deshabilitarEditar$.subscribe(() => {
      this.editar = false;
    });
    this.getInstitucion();
    this.getAyuda();
    this.valores = [];

    this.operadoresTexto = [
      {
        label: '=',
        value: '='
      },
      {
        label: '!=',
        value: '!='
      },
      {
        label: 'IS NULL',
        value: 'IS NULL'
      },
      {
        label: 'LIKE',
        value: 'LIKE'
      }
    ];

    this.operadoresNumero = [
      {
        label: '=',
        value: '='
      },
      {
        label: '!=',
        value: '!='
      },
      {
        label: '>',
        value: '>'
      },
      {
        label: '>=',
        value: '>='
      },
      {
        label: '<',
        value: '<'
      },
      {
        label: '<=',
        value: '<='
      },
      {
        label: 'IS NULL',
        value: 'IS NULL'
      }
    ]
  }

  getMode() {
    if (sessionStorage.getItem("soloLectura") === 'true') {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    },
      err => {
        //console.log(err);
      }, () => { this.getDatos(); }
    );
  }

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }


  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevaConsulta") == null) {
      this.openFicha = !this.openFicha;
      if (this.openFicha) {
        this.getDatos();
      }
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }


  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "110";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        //console.log(err);
      },
      () => {
        // if (this.derechoAcceso == 3) {
        //   this.activacionEditar = true;
        // } else if (this.derechoAcceso == 2) {
        //   this.activacionEditar = false;
        // } else {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        //   this.router.navigate(["/errorAcceso"]);
        // }
      }
    );
  }

  onShowAyuda() {
    this.showAyuda = !this.showAyuda;
  }


  getDatos() {
    if (sessionStorage.getItem("consultasSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("consultasSearch"));
      if(sessionStorage.getItem("constructorDeConsultasGuardado") == "true"){
        this.body.sentencia = sessionStorage.getItem("nuevaSentencia");
      }
      if (this.body.sentencia != 'undefined' && this.body.sentencia != null) {
        // this.body.sentencia = this.body.sentencia.replace(new RegExp(",", "g"), ",\n");
      }
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }
  }

  guardar() {

    this.sigaServices.post("consultas_guardarConsulta", this.body).subscribe(
      data => {
        sessionStorage.setItem("consultasSearch", JSON.stringify(this.body));
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.showSuccess(this.translateService.instant("informesYcomunicaciones.consultas.mensaje.guardar.consulta.correcto"));
        this.consultaEditada = false;
      },
      err => {
        let error = JSON.parse(err.error);
        this.showFail(this.translateService.instant("informesYcomunicaciones.consultas.mensaje.error.guardarConsulta") + ': ' + error.message);
        //console.log(err);
      },
      () => {
      }
    );

  }

  ejecutar() {
    this.valores = [];
  }


  obtenerParametros() {
    let consulta = {
      idClaseComunicacion: this.body.idClaseComunicacion,
      sentencia: this.body.sentencia
    };

    this.sigaServices.post("consultas_obtenerCamposDinamicos", consulta)
      .subscribe(data => {
        //console.log(data);
        this.valores = JSON.parse(data.body).camposDinamicos;
        if (this.valores != undefined && this.valores != null && this.valores.length > 0) {
          this.valores.forEach(element => {
            if (element.valorDefecto != undefined && element.valorDefecto != null) {
              element.valor = element.valorDefecto;
            }
            if (element.valores != undefined && element.valores != null) {
              let empty = {
                ID: 0,
                DESCRIPCION: this.translateService.instant("general.literal.seleccioneUnaOpcion") + '...'
              }
              element.valores.unshift(empty);
            }
            if (element.operacion == "OPERADOR") {
              element.operacion = this.operadoresNumero[0].value;
            }
          });
          this.showValores = true;
        } else {
          this.enviar();
        }
        //console.log(this.valores);
      }, error => {
        //console.log(error);
        this.showFail(this.translateService.instant("informesYcomunicaciones.consultas.mensaje.error.parametrosDinamicos"))
      });
  }

  isButtonDisabled() {
    if (this.consultaEditada && this.body.idObjetivo != '1') {
      return true;
    } else if ((this.body.idClaseComunicacion != "5" && this.body.idObjetivo != "4")) {
      return true;
    }
    return false;
  }

  restablecer() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  onChangeConsulta() {
    this.consultaEditada = true;
  }

  enviar() {
    this.progressSpinner = true;
    this.body.camposDinamicos = JSON.parse(JSON.stringify(this.valores));
    if (this.body.camposDinamicos != null && typeof this.body.camposDinamicos != "undefined") {
      this.body.camposDinamicos.forEach(element => {
        if (element.valor != undefined && typeof element.valor == "object") {
          element.valor = element.valor.ID;
        }
        if (element.ayuda == null || element.ayuda == "undefined") {
          element.ayuda = "-1";
        }
      });
    }
    this.sigaServices
      .postDownloadFiles("consultas_ejecutarConsulta", this.body)
      .subscribe(data => {
        this.showValores = false;
        if (data == null) {
          this.showInfo(this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
        } else {
          saveAs(data, "ResultadoConsulta.xlsx");
        }
      }, error => {
        //console.log(error);
        this.progressSpinner = false;
        this.showFail(this.translateService.instant("informesYcomunicaciones.consultas.mensaje.error.ejecutarConsulta"));
      }, () => {
        this.progressSpinner = false;
      });
  }

  validarCamposDinamicos() {
    let valido = true;
    this.valores.forEach(element => {
      if (valido) {
        if (!element.valorNulo) {
          if (element.valor != undefined && element.valor != null && element.valor != "") {
            valido = true;
          } else {
            valido = false;
          }
        } else {
          valido = true;
        }
      }
    });
    return valido;
  }

  getAyuda() {
    this.ayuda = [
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto1"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto2"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto3"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto4"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto5"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto6"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto7"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto8"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto9"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto10"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto11"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto12"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto13"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto14"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto15"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto16"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto17"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto18"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto19"
      },
      {
        texto: "informesYcomunicaciones.consultas.mensaje.ayuda.texto20"
      }
    ]
  }

  navigateComunicar() {
    sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
    //IDMODULO de adminsitracion es 4
    sessionStorage.setItem("idModulo", '4');
    this.getDatosComunicar();
  }

  getDatosComunicar() {
    let bodynombre;
    if (sessionStorage.getItem("consultasSearch") != null) {
      bodynombre = JSON.parse(sessionStorage.getItem("consultasSearch"));
    }
    let rutaClaseComunicacion = this.currentRoute.toString();
    sessionStorage.removeItem('datosComunicar');
    sessionStorage.setItem('idConsulta', this.body.idConsulta);
    sessionStorage.setItem('nombreConsulta', bodynombre.nombre);
    this.sigaServices.post("dialogo_claseComunicacion", rutaClaseComunicacion).subscribe(
      data => {
        this.idClaseComunicacion = JSON.parse(data['body']).clasesComunicaciones[0].idClaseComunicacion;
        this.router.navigate(["/dialogoComunicaciones"]);
      },
      err => {
        //console.log(err);
      }
    );
  }

  fillFechaValor(event, dato) {
    let id = this.valores.findIndex(
      x => x.campo === dato.campo
    );
    this.valores[id].valor = event;
  }
}
