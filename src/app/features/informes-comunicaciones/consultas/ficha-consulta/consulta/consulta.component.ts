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

    this.currentRoute = this.router.url;
    this.sigaServices.consultasRefresh$.subscribe(() => {
      this.getDatos();
    });

    this.sigaServices.deshabilitarEditar$.subscribe(() => {
      this.editar = false;
    });

    this.getDatos();
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
        console.log(err);
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
        this.showSuccess('Se ha guardado la consulta correctamente');
        this.consultaEditada = false;

      },
      err => {
        let error = JSON.parse(err.error);
        this.showFail('Error al guardar la consulta: ' + error.message);
        console.log(err);
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
        console.log(data);
        this.valores = JSON.parse(data.body).camposDinamicos;
        if (this.valores != undefined && this.valores != null && this.valores.length > 0) {
          this.valores.forEach(element => {
            if (element.valorDefecto != undefined && element.valorDefecto != null) {
              element.valor = element.valorDefecto;
            }
            if (element.valores != undefined && element.valores != null) {
              let empty = {
                ID: 0,
                DESCRIPCION: 'Seleccione una opción...'
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

        console.log(this.valores);
      }, error => {
        console.log(error);
        this.showFail("Error al obtener los parámetros dinámicos disponibles")
      });
  }

  isButtonDisabled() {
    if (this.consultaEditada) {
      return true;
    } else if (this.body.idClaseComunicacion != "5" || this.body.idObjetivo != "4") {
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
        debugger;
        this.showValores = false;
        if (data == null) {
          this.showInfo("La consulta no devuelve resultados");
        } else {
          saveAs(data, "ResultadoConsulta.xlsx");
        }
      }, error => {
        console.log(error);
        this.progressSpinner = false;
        this.showFail("Error al ejecutar la consulta");
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
        texto: "1.La sentencia debe ir etiquetada con los siguientes etiquetas para indicar el comienzo y fin de las diferentes partes de la sentencia:" +
          "<SELECT> </SELECT>%%, donde se indica la clausula SELECT.<FROM> </FROM>, donde se indica la clausula FROM de la sentencia principal." +
          "<WHERE> </WHERE>, donde se indica la clausula WHERE de la sentencia principal." +
          "<UNION> </UNION>, donde se indica la clausula UNION de la sentencia principal." +
          "<UNIONALL> </UNIONALL>, donde se indica la clausula UNION ALL de la sentencia principal." +
          "<GROUPBY> </GROUPBY>, donde se indica la clausula GROUP BY de la sentencia principal." +
          "<ORDERBY> </ORDERBY>, donde se indica la clausula ORDER BY de la sentencia principal."
      },
      {
        texto: "2.Los campos de salida deben tener ALIAS y con el siguiente formato: CAMPO AS 'ALIAS_CAMPO'."
      },
      {
        texto: "3.Los criterios dinámicos deben ir delimitados por los delimitadores %%OPERADOR%% %%CRITERIO%%, CRITERIO es el formato del campo."
      },
      {
        texto: "4.Los formatos de criterios dinámicos admitidos son:" +
          "%%NUMERO%%, para campos numéricos." +
          "%%TEXTO%%, para campos alfanuméricos." +
          "%%FECHA%%, para fechas." +
          "%%MULTIVALOR@CONSULTA%%, para campos multivalor. CONSULTA es una consulta con campos de salida ID y DESCRIPCION que no debe ir encerrada entre paréntesis."
      },
      {
        texto: "4.Los formatos de criterios dinámicos admitidos son:" +
          "%%NUMERO%%, para campos numéricos." +
          "%%TEXTO%%, para campos alfanuméricos." +
          "%%FECHA%%, para fechas." +
          "%%MULTIVALOR@CONSULTA%%, para campos multivalor. CONSULTA es una consulta con campos de salida ID y DESCRIPCION que no debe ir encerrada entre paréntesis."
      },
      {
        texto: "5.Si se utiliza como criterio dinámico %%TEXTO%% para los campos alfanuméricos.Recuerde que puede usar los comodines %Y _ tanto en la consulta como en los criterios dinámicos con el operador COMO. Si queremos hacer una búsqueda aproximada por nombre de colegiado ya que se desconoce su nombre exacto utilizaremos el comodín %NOMBRE COLEGIADO% y la consulta nos devolverá los resultados de esa cadena por ejemplo %JOSE% nos devolverá Maria Jose, Jose Maria. "
      },
      {
        texto: "6.Para que los criterios dinámicos del campo de texto sean independientes de mayúsculas y minúsculas puede utilizar la función UPPER delante de los campos usados en la consulta. Ejemplo: Si queremos buscar dinámicamente por el nombre de un colegiado para que nos ignore las mayúsculas y minúsculas haremos UPPER(Cen_persona.Nombre)%%OPERADOR%%UPPER(%%TEXTO%%). "
      },
      {
        texto: "7.Los campos de salida correspondientes a descripciones 'multi-idioma' deben tener el siguiente formato: F_SIGA_GETRECURSO(campo , %%IDIOMA%%) as 'alias_campo'"
      },
      {
        texto: "8.La cláusula ORDER BY no se comprueba al guardar, por lo que podría ser causa de error en la ejecución."
      },
      {
        texto: "9.La consulta, una vez construida, no se debe finalizar con ';'."
      },
      {
        texto: "10.Cuando se utiliza %%FECHA%% como criterio dinámicos, se puede utilizar la función TRUNC cuando se desee hacer las comparaciones sin horas/min/seg."
      },
      {
        texto: "11.Puede utilizar la función F_SIGA_GETDIRECCION (IDINSTITUCION, IDPERSONA, TIPOENVIO) para obtener una dirección a donde se harán los envíos." +
          "Esta dirección será siempre la preferente por tipo de envío, si no hay ninguna configurada, devolverá la de tipo correo, si no la de despacho y si no cualquier dirección dada de alta. TIPOENVIO puede tomar los siguientes valores:" +
          "1, si el tipo de envío es por correo electrónico." +
          "2, si el tipo de envío es por correo ordinario." +
          "3, si el tipo de envío es por fax."
      },
      {
        texto: "12.En el caso en que las consultas sean de Envíos a Grupos, la condición del tipo de dirección se añade automáticamente y cuando se ejecuta la consulta se pide el tipo de envío."
      },
      {
        texto: "13.	Las consultas de tipo 'Facturación' o 'Envío a Grupos' tienen las siguientes restricciones:" +
          "No puede incorporar solicitudes de criterios dinámicos por interfaz." +
          "Para las consultas de tipo 'Facturación' los siguientes campos son obligatorios: IDINSTITUCION , IDPERSONA." +
          "Para las consultas de tipo 'Envío a Grupos': IDINSTITUCION, IDPERSONA, CODIGOPOSTAL, CORREOELECTRONICO, DOMICILIO, MOVIL, FAX1, FAX1, IDPAIS, IDPROVINCIA, IDPOBLACION."

      },
      {
        texto: "14.	Las consultas de tipo 'Envío a Grupos' tiene las siguientes restricciones:" +
          "Las consultas listas para envíos han de llevar la tabla CEN_CLIENTE y CEN_DIRECCIONES sin alias." +
          "NO se debe añadir condiciones para filtrar la dirección, ya que eso se hace automáticamente."

      },
      {
        texto: "15.	Se han añadido los nuevos operadores =,!=,IS NULL,LIKE al formato de los criterios TEXTO. A estos operadores se añaden >,>=,<,<= cuando el formato sea NUMERO, FECHA o MULTIVALOR. Estos operadores funcionan del mismo modo que %%OPERADOR%%"

      },
      {
        texto: "16.	Se ha añadido la cláusula DEFECTO para los operadores. La notación será %%OPERADOR%% %%CRITERIO%% DEFECTO 'VALOR'. Estos valores aparecerán por defecto en la pantalla de criterios dinámicos. Si el criterio es FECHA el formato será dd/mm/yyyy y también acepta SYSDATE para la fecha actual."

      },
      {
        texto: "17. Se ha añadido la cláusula NULO para los operadores. La notación será %%OPERADOR%% %%CRITERIO%% NULO 'VALOR'. Donde valor es 'SI' y 'NO'. En caso que no exista será 'NO'. En el caso de que exista la cláusula DEFECTO debe ir siempre detrás de ella. En caso de que admita nulos no será obligatorio dar ningún valor al criterio dinámico en la pantalla de criterios dinámicos y filtrará como IS NULL"

      },
      {
        texto: "18. Si la consulta pertenece a una clase de comunicación será obligatorio introducir en la etiqueta <WHERE> de la consulta las claves asociadas a dicha clase de comunicación." +
          "Informes genéricos de censo: %%IDPERSONA%%, %%IDINSTITUCION%%. " +
          "Informes de sanciones de letrados: %%IDPERSONA%%, %%IDINSTITUCION%%, %%IDSANCION%%. " +
          "Plantilla de Orden de domiciliación de adeudo directo SEPA: %%IDPERSONA%%, %%IDINSTITUCION%%, %%IDCUENTA%%, %%IDMANDATO%%. " +
          "Plantilla de Anexo a la Orden de domiciliación de adeudo directo SEPA: %%IDPERSONA%%, %%IDINSTITUCION%%, %%IDCUENTA%%, %%IDMANDATO%%, %%IDANEXO%%."

      },
      {
        texto: "19. Es obligatorio introducir en la etiqueta <WHERE> la clave %%IDINSTITUCION%%."

      },
      {
        texto: "20. Si el objetivo de la consulta es 'DESTINATARIOS' se debe añadir dentro de la etiqueta <SELECT> los siguientes campos:" +
          "IDINSTITUCION, IDPERSONA, CODIGOPOSTAL, CORREOELECTRONICO, DOMICILIO, MOVIL, FAX1, FAX2, IDPAIS, IDPROVINCIA, IDPOBLACION"

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
    let rutaClaseComunicacion = this.currentRoute.toString();
    sessionStorage.removeItem('datosComunicar');
    sessionStorage.setItem('idConsulta', this.body.idConsulta);
    this.sigaServices.post("dialogo_claseComunicacion", rutaClaseComunicacion).subscribe(
      data => {
        this.idClaseComunicacion = JSON.parse(data['body']).clasesComunicaciones[0].idClaseComunicacion;
        this.router.navigate(["/dialogoComunicaciones"]);
      },
      err => {
        console.log(err);
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
