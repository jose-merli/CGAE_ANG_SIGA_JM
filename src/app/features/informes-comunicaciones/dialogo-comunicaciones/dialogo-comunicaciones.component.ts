import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-dialogo-comunicaciones',
  templateUrl: './dialogo-comunicaciones.component.html',
  styleUrls: ['./dialogo-comunicaciones.component.scss'],

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
  maxNumModelos: number;
  progressSpinner: boolean = false;

  constructor(public sigaServices: SigaServices, private translateService: TranslateService, private location: Location) {
  }

  ngOnInit() {

    this.datosSeleccionados = JSON.parse(sessionStorage.getItem("datosComunicar"));

    this.getClaseComunicaciones();
    this.getInstitucion();
    //this.getFechaProgramada(dato.idInstutucion);

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
      { field: 'nombre', header: 'Modelo' },
      { field: 'plantillas', header: 'Plantilla Envío' },
      { field: 'tipoEnvio', header: 'Tipo envío' }
    ]
  }

  getClaseComunicaciones() {
    let rutaClaseComunicacion = sessionStorage.getItem("rutaComunicacion");
    this.sigaServices.post("dialogo_claseComunicacion", rutaClaseComunicacion).subscribe(
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

    this.sigaServices.post("dialogo_modelosComunicacion", this.idClaseComunicacion).subscribe(
      data => {
        this.modelosComunicacion = JSON.parse(data['body']).modelosComunicacionItems;
        this.modelosComunicacion.forEach(element => {
          element.plantillas = element.plantillas;
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  getFechaProgramada(idInstution) {
    this.sigaServices.post("dialogo_plantillasEnvio", idInstution).subscribe(
      data => {

      },
      err => {
        console.log(err);
      }
    );
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

        if (accion == "comunicar") {
          this.comunicar = true;
        } else {
          this.comunicar = false;
        }

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
      }
    );
  }

  enviarComunicacion() {
    console.log(this.listaConsultas);
  }


  enviar() {
    console.log(this.listaConsultas);
  }

  onRowSelectModelos() { }

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
    /*this.getKeysClaseComunicacion();
    
    let datosSeleccionados = [];
    this.selectedDatos.forEach(element => {
      let keysValues = [];
      this.keys.forEach(key =>{
        keysValues.push(element.get(key));
      })
      datosSeleccionados.push(keysValues);
    });*/

    /*let datosSeleccionados = [];
    let par = [2001,2000000359];
    let par2 = [2001,2000000745];

    datosSeleccionados.push(par);
    datosSeleccionados.push(par2);


    let modelos = [];
    let modelo = {
      idModeloComunicacion:61
    }
    modelos.push(modelo);*/

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
        consultas: this.listaConsultas
      }

      this.sigaServices
        .postDownloadFiles("dialogo_descargar", datos)
        .subscribe(
          data => {
            const blob = new Blob([data], { type: "text/csv" });
            saveAs(blob, "Documentos.zip");
            this.progressSpinner = false;
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
          }
        );
    } else {
      this.showFail("No se ha seleccionado nigún dato");
    }
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
    this.location.back();
  }
}
