import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SigaServices } from "./../../../_services/siga.service";
import { DialogoComunicacionesItem } from '../../../models/DialogoComunicacionItem';
import { ModelosComunicacionesItem } from '../../../models/ModelosComunicacionesItem';
import { TranslateService } from '../../../commons/translate/translation.service';
import { esCalendar } from './../../../utils/calendar';
import { ConsultaConsultasItem } from '../../../models/ConsultaConsultasItem';
import { CampoDinamicoItem } from '../../../models/CampoDinamicoItem';
import { saveAs } from "file-saver/FileSaver";
import { Location } from "@angular/common";
import { typeSourceSpan } from '@angular/compiler';
import { DataTable } from "primeng/datatable";
import { truncate } from 'fs';
import { findIndex } from 'rxjs/operators';

@Component({
  selector: 'app-dialogo-comunicaciones',
  templateUrl: './dialogo-comunicaciones.component.html',
  styleUrls: ['./dialogo-comunicaciones.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class DialogoComunicacionesComponent implements OnInit {
  msgs: any;
  selectedItem: number = 10;
  //Diálogo de comunicación
  showComunicar: boolean = false;
  modelosComunicacion: ModelosComunicacionesItem[] = [];
  bodyComunicacion: DialogoComunicacionesItem = new DialogoComunicacionesItem();
  tiposEnvio: any[];
  plantillasEnvio: any[];
  datosModelos: any[];
  colsModelos: any = [];
  selectMultipleComunicar: boolean = false;
  first: number = 0;
  currentDate: Date = new Date();
  clasesComunicaciones: any = [];
  currentRoute: String;
  selectedModelos: any = [];
  idClaseComunicacion: String;
  idModulo: String;
  keys: String[] = [];
  es: any = esCalendar;
  showValores: boolean = false;
  valores: CampoDinamicoItem[];
  operadoresTexto: any[];
  operadoresNumero: any[];
  listaConsultas: ConsultaConsultasItem[];
  comunicar: boolean = false;
  idInstitucion: String;
  datosSeleccionados: any[];
  maxNumModelos: number = 20;
  progressSpinner: boolean = false;
  rutaComunicacion: String;
  fechaProgramada: Date;
  plantillas: any[] = [];
  idConsulta: string;
  dato: any;
  selectedModelosSend: any = [];
  selectAll: boolean = false;
  @ViewChild("table")
  tableModelos: DataTable;

  constructor(public sigaServices: SigaServices, private translateService: TranslateService, private location: Location) {
  }

  ngOnInit() {
    this.progressSpinner = true;
    this.datosSeleccionados = JSON.parse(sessionStorage.getItem("datosComunicar"));
    sessionStorage.removeItem("back");
    this.getClaseComunicaciones();
    this.getInstitucion();
    this.getMaxNumeroModelos();
    this.getFechaProgramada();
    this.getPlantillas();

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

    this.colsModelos = [
      { field: 'nombre', header: 'informesycomunicaciones.comunicaciones.fichaRegistroComunicacion.configuracion.modeloComunicaciones' },
      { field: 'plantillas', header: 'enviosMasivos.literal.plantillasEnvio' },
      { field: 'tipoEnvio', header: 'informesycomunicaciones.comunicaciones.busqueda.tipoEnvio' }
    ]
  }

  getClaseComunicaciones() {
    this.rutaComunicacion = sessionStorage.getItem("rutaComunicacion");
    this.sigaServices.post("dialogo_claseComunicacion", this.rutaComunicacion).subscribe(
      data => {
        this.idClaseComunicacion = JSON.parse(data['body']).clasesComunicaciones[0].idClaseComunicacion;
        this.getModelosComunicacion();
      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeClaseComunicacion() {
    this.getModelosComunicacion();
  }

  getModelosComunicacion() {

    this.idModulo = sessionStorage.getItem('idModulo');

    if (this.idClaseComunicacion == "5") {
      this.idConsulta = sessionStorage.getItem('idConsulta');
    }

    let modeloSearch = {
      idModulo: this.idModulo,
      idClaseComunicacion: this.idClaseComunicacion,
      idConsulta: this.idConsulta
    }

    this.sigaServices.post("dialogo_modelosComunicacion", modeloSearch).subscribe(
      data => {
        this.modelosComunicacion = JSON.parse(data['body']).modelosComunicacionItems;

        for (let index = 0; index < this.modelosComunicacion.length; index++) {
          const element = this.modelosComunicacion[index];

          if (element.preseleccionar == "SI") {
            this.selectedModelos.push(element);
          }

        }
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  onChangeSelectAll() {
    if (this.selectAll) {
      this.selectedModelos = JSON.parse(JSON.stringify(this.modelosComunicacion));
    } else {
      this.selectedModelos = [];
    }
  }

  onChangePlantillaEnvio(dato) {
    this.getTipoEnvios(dato);
  }

  getTipoEnvios(dato) {
    this.sigaServices.post("dialogo_tipoEnvios", dato.idPlantillaEnvio).subscribe(
      data => {
        let tipoEnvio = JSON.parse(data['body']).tipoEnvio;
        dato.tipoEnvio = tipoEnvio.tipoEnvio;
        dato.idTipoEnvio = tipoEnvio.idTipoEnvio;
      },
      err => {
        console.log(err);
      }
    );
  }

  obtenerCamposDinamicos(accion) {
    this.bodyComunicacion.modelos = this.selectedModelos;
    this.bodyComunicacion.idClaseComunicacion = this.idClaseComunicacion;

    if (accion == "comunicar") {
      this.comunicar = true;
    } else {
      this.comunicar = false;
    }

    if (this.comunicar && !this.comprobarPlantillas()) {
      this.showFail("Se ha de seleccionar al menos una plantilla de envio por modelo");
    } else {
      this.sigaServices.post("dialogo_obtenerCamposDinamicos", this.bodyComunicacion).subscribe(
        data => {
          console.log(data);
          this.valores = [];
          this.listaConsultas = JSON.parse(data['body']).consultaItem;
          this.listaConsultas.forEach(element => {
            if (element.camposDinamicos != null) {
              element.camposDinamicos.forEach(campo => {
                this.valores.push(campo);
              });
            }
          })

          if (this.valores.length > 0) {
            this.showValores = true;
          } else {
            if (this.comunicar) {
              this.enviarComunicacion();
            } else {
              this.descargarComunicacion();
            }
          }
        },
        err => {
          console.log(err);
          this.showFail(this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.consulta.errorParametros"));
        }
      );
    }
  }

  comprobarPlantillas() {
    let envioCorrecto = true;
    this.bodyComunicacion.modelos.forEach(element => {
      if (!element.idPlantillaEnvio || element.idPlantillaEnvio == null || element.idPlantillaEnvio == "") {
        envioCorrecto = false;
      }
    });
    return envioCorrecto;
  }

  enviarComunicacion() {
    this.progressSpinner = true;

    this.valores.forEach(element => {
      if (element.valor != null && typeof element.valor == "object") {
        element.valor = element.valor.ID;
      }
    });

    if (this.datosSeleccionados != null && this.datosSeleccionados != undefined) {
      let datos = {
        idClaseComunicacion: this.idClaseComunicacion,
        modelos: this.bodyComunicacion.modelos,
        selectedDatos: this.datosSeleccionados,
        idInstitucion: this.idInstitucion,
        consultas: this.listaConsultas,
        ruta: this.rutaComunicacion,
        fechaProgramada: this.bodyComunicacion.fechaProgramacion
      }

      this.sigaServices
        .post("dialogo_generarEnvios", datos)
        .subscribe(
          data => {
            this.showSuccess(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.envio.generado"));
            this.showValores = false;
            this.backTo();
          },
          err => {
            console.log(err);
            this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.envio.error.generar"));
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
          }
        );
    } else {
      this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.envio.error.datos"));
      this.progressSpinner = false;
    }
  }


  enviar() {
    console.log(this.listaConsultas);
  }

  onRowSelectModelos(event) {
    event.data = true;
    return event.data;
  }


  onUnRowSelectModelos(event) {
    event.data = false;
    return event.data;
  }

  getKeysClaseComunicacion() {
    this.sigaServices.post("dialogo_keys", this.idClaseComunicacion).subscribe(
      data => {
        this.keys = JSON.parse(data['body']);
      },
      err => {
        console.log(err);
      }
    );
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

  descargarComunicacion() {

    this.progressSpinner = true;

    this.valores.forEach(element => {
      if (element.valor != null && typeof element.valor == "object") {
        element.valor = element.valor.ID;
      }
    });

    let datos = {
      idClaseComunicacion: this.idClaseComunicacion,
      modelos: this.bodyComunicacion.modelos,
      selectedDatos: this.datosSeleccionados,
      idInstitucion: this.idInstitucion,
      consultas: this.listaConsultas,
      ruta: this.rutaComunicacion
    }

    this.sigaServices
      .postDownloadFiles("dialogo_descargar", datos)
      .subscribe(
        data => {
          // let a = JSON.parse(data);
          const blob = new Blob([data], { type: "text/csv" });

          // if (blob. != undefined) {
          //   saveAs(blob, data.nombre);
          // } else {
          saveAs(blob, "Documentos.zip");
          // }
          this.progressSpinner = false;
          this.showValores = false;
          this.backTo();
        },
        err => {
          console.log(err);
          this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.descargar.error"));
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;

        }
      );

  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.idInstitucion = n.value;
    });
  }

  getMaxNumeroModelos() {
    this.sigaServices.get("dialogo_maxModelos").subscribe(n => {
      this.maxNumModelos = n.value;
    });
  }

  getFechaProgramada() {
    this.sigaServices.get("dialogo_fechaProgramada").subscribe(n => {
      this.bodyComunicacion.fechaProgramacion = new Date(n.fecha);
    },
      err => {
        console.log(err);
      }
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


  backTo() {
    sessionStorage.setItem("back", "true");
    this.location.back();
  }

  getPlantillas() {
    this.sigaServices.get("modelos_detalle_plantillasComunicacion").subscribe(
      data => {
        this.plantillas = data.combooItems;
        this.plantillas.unshift({ label: "Seleccionar", value: "" });
      },
      err => {
        console.log(err);
      },
      () => { }
    );
  };
}
