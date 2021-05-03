import { Component, OnInit } from '@angular/core';
import { Location, DatePipe } from '@angular/common';
import { ActuacionDesignaItem } from '../../../../../../../models/sjcs/ActuacionDesignaItem';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../../commons/translate/translation.service';
import { ColegiadoItem } from '../../../../../../../models/ColegiadoItem';
import { DesignaItem } from '../../../../../../../models/sjcs/DesignaItem';
import { AccionItem } from './tarjeta-his-ficha-act/tarjeta-his-ficha-act.component';
import { Message } from 'primeng/components/common/api';
import { ActuacionDesignaObject } from '../../../../../../../models/sjcs/ActuacionDesignaObject';
import { DocumentoActDesignaObject } from '../../../../../../../models/sjcs/DocumentoActDesignaObject';
import { DocumentoActDesignaItem } from '../../../../../../../models/sjcs/DocumentoActDesignaItem';

@Component({
  selector: 'app-ficha-actuacion',
  templateUrl: './ficha-actuacion.component.html',
  styleUrls: ['./ficha-actuacion.component.scss']
})
export class FichaActuacionComponent implements OnInit {

  rutas: string[] = ['SJCS', 'Designaciones', 'Actuaciones', 'Ficha Actuación'];

  tarjetaFija = {
    nombre: "Resumen Actuación",
    icono: 'fas fa-clipboard',
    imagen: '',
    detalle: false,
    fixed: true,
    campos: [
      {
        "key": "Año/Número designación",
        "value": ""
      },
      {
        "key": "Letrado",
        "value": ""
      },
      {
        "key": "Número Actuación",
        "value": ""
      },
      {
        "key": "Fecha Actuación",
        "value": ""
      }
    ],
    enlaces: []
  };

  listaTarjetas = [
    {
      id: 'sjcsDesigActuaOfiDatosGen',
      nombre: "Datos Generales",
      imagen: "",
      icono: 'far fa-address-book',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Juzgado",
          "value": ""
        },
        {
          "key": "Módulo",
          "value": ""
        },
        {
          "key": "Acreditación",
          "value": ""
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiJustifi',
      nombre: "Justificación",
      imagen: "",
      icono: 'fa fa-gavel',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Fecha Justificación",
          "value": ""
        },
        {
          "key": "Estado",
          "value": ""
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiDatFac',
      nombre: "Datos Facturación",
      imagen: "",
      icono: 'fa fa-usd',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [
        {
          "key": "Partida Presupuestaria",
          "value": ""
        },
      ]
    },
    {
      id: 'sjcsDesigActuaOfiRela',
      nombre: "Relaciones",
      imagen: "",
      icono: 'fas fa-link',
      fixed: false,
      detalle: true,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigActuaOfiHist',
      nombre: "Histórico",
      imagen: "",
      icono: 'fas fa-table',
      fixed: false,
      detalle: true,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigActuaOfiDoc',
      nombre: "Documentación",
      imagen: "",
      icono: 'fa fa-briefcase',
      fixed: false,
      detalle: true,
      opened: false,
      campos: []
    },
  ];

  institucionActual: string = '';
  actuacionDesigna: any;
  isNewActDesig: boolean = false;
  progressSpinner: boolean = false;
  isAnulada: boolean = false;
  usuarioLogado;
  listaAcciones: AccionItem[] = [];
  msgs: Message[] = [];
  relaciones: any;
  isColegiado;
  documentos: DocumentoActDesignaItem[] = [];

  constructor(private location: Location,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private datePipe: DatePipe) { }

  ngOnInit() {

    this.isColegiado = sessionStorage.getItem('isLetrado') == 'true';
    if (this.isColegiado) {
      this.getDataLoggedUser();
    } else {
      this.cargaInicial();
    }

    this.getInstitucionActual();

  }

  cargaInicial() {

    if (sessionStorage.getItem("actuacionDesigna")) {
      let actuacion = JSON.parse(sessionStorage.getItem("actuacionDesigna"));
      sessionStorage.removeItem("actuacionDesigna");
      this.actuacionDesigna = actuacion;

      if (actuacion.isNew) {

        this.isNewActDesig = true;
        this.listaTarjetas.find(el => el.id == 'sjcsDesigActuaOfiDatosGen').opened = true;
      } else {

        this.establecerValoresIniciales();
      }

      if (actuacion.relaciones != null) {

        this.relaciones = actuacion.relaciones;

      }

    }
  }

  ngAfterViewInit() {

    this.goTop();

    this.listaTarjetas.forEach(tarj => {
      let tarjTmp = {
        id: tarj.id,
        ref: document.getElementById(tarj.id),
        nombre: tarj.nombre
      };

      this.tarjetaFija.enlaces.push(tarjTmp);
    });

  }

  isOpenReceive(event) {
    let tarjTemp = this.listaTarjetas.find(tarj => tarj.id == event);

    if (tarjTemp.detalle) {
      tarjTemp.opened = true;
    }

  }

  goTop() {
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  backTo() {
    this.location.back();
  }

  changeDataTarjeta(event) {

    let tarjeta = this.listaTarjetas.find(el => el.id == event.tarjeta);

    if (event.tarjeta == 'sjcsDesigActuaOfiJustifi') {
      tarjeta.campos[0].value = event.fechaJusti;
      tarjeta.campos[1].value = event.estado;
    }

    if (event.tarjeta == 'sjcsDesigActuaOfiDatFac') {
      tarjeta.campos[0].value = event.partida;
    }

    if (event.tarjeta == 'sjcsDesigActuaOfiRela') {
      this.listaTarjetas.find(el => el.id == 'sjcsDesigActuaOfiRela').campos = event.campos;
    }

  }

  getDataLoggedUser() {

    this.progressSpinner = true;

    this.sigaServices.get("usuario_logeado").subscribe(n => {

      const usuario = n.usuarioLogeadoItem;
      const colegiadoItem = new ColegiadoItem();
      colegiadoItem.nif = usuario[0].dni;

      this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
        usr => {
          this.usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
          this.progressSpinner = false;
          this.cargaInicial();
        });

    });

  }

  getIdPartidaPresupuestaria() {

    this.progressSpinner = true;

    let factAct = new DesignaItem();
    factAct.idTurno = Number(this.actuacionDesigna.actuacion.idTurno);
    factAct.ano = Number(this.actuacionDesigna.actuacion.anio);
    factAct.numero = this.actuacionDesigna.designaItem.numero;

    this.sigaServices.post("designaciones_getDatosFacturacion", factAct).subscribe(
      n => {
        let resp = JSON.parse(n.body).combooItems;
        if (resp.length > 0) {
          this.listaTarjetas.find(el => el.id == 'sjcsDesigActuaOfiDatFac').campos[0].value = resp[0].label;
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        this.progressSpinner = false;
      }
    );
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  getAccionesActuacion() {

    this.progressSpinner = true;
    this.listaAcciones = [];

    let params = {
      anio: this.actuacionDesigna.actuacion.anio,
      idTurno: this.actuacionDesigna.actuacion.idTurno,
      numero: this.actuacionDesigna.actuacion.numero,
      numeroAsunto: this.actuacionDesigna.actuacion.numeroAsunto,
      idPersonaColegiado: '',
      historico: false
    };

    this.sigaServices.post("actuaciones_designacion_getHistorioAccionesActDesigna", params).subscribe(
      data => {
        let accion = JSON.parse(data.body);
        this.procesaAccion(accion);
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  procesaAccion(accion: ActuacionDesignaItem) {

    let registroCreacion = new AccionItem();
    let registroJustificacion = new AccionItem();
    let registroValidacion = new AccionItem();
    let fechas = [];

    let anadirCreacion = false;
    let anadirJustificacion = false;
    let anadirValidacion = false;

    registroCreacion.accion = 'Crear';
    registroJustificacion.accion = 'Justificar';
    registroValidacion.accion = 'Validar';

    if (accion.fechaCreacion != undefined && accion.fechaCreacion != null && accion.fechaCreacion != '') {
      registroCreacion.fecha = this.datePipe.transform(new Date(accion.fechaCreacion), 'dd/MM/yyyy');
      fechas.push(accion.fechaCreacion);
      anadirCreacion = true;
    }

    if (accion.usuCreacion != undefined && accion.usuCreacion != null && accion.usuCreacion != '') {
      registroCreacion.usuario = accion.usuCreacion;
      anadirCreacion = true;
    }

    if (accion.observaciones != undefined && accion.observaciones != null && accion.observaciones != '') {
      registroCreacion.observaciones = accion.observaciones;
      anadirCreacion = true;
    }

    if (accion.fechaUsuJustificacion != undefined && accion.fechaUsuJustificacion != null && accion.fechaUsuJustificacion != '') {
      registroJustificacion.fecha = this.datePipe.transform(new Date(accion.fechaUsuJustificacion), 'dd/MM/yyyy');
      fechas.push(accion.fechaUsuJustificacion);
      anadirJustificacion = true;
    }

    if (accion.usuJustificacion != undefined && accion.usuJustificacion != null && accion.usuJustificacion != '') {
      registroJustificacion.usuario = accion.usuJustificacion;
      anadirJustificacion = true;
    }

    if (accion.observacionesJusti != undefined && accion.observacionesJusti != null && accion.observacionesJusti != '') {
      registroJustificacion.observaciones = accion.observacionesJusti;
      anadirJustificacion = true;
    }

    if (accion.fechaValidacion != undefined && accion.fechaValidacion != null && accion.fechaValidacion != '') {
      registroValidacion.fecha = this.datePipe.transform(new Date(accion.fechaValidacion), 'dd/MM/yyyy');
      fechas.push(accion.fechaValidacion);
      anadirValidacion = true;
    }

    if (accion.usuValidacion != undefined && accion.usuValidacion != null && accion.usuValidacion != '') {
      registroValidacion.usuario = accion.usuValidacion;
      anadirValidacion = true;
    }

    if (anadirCreacion) {
      this.listaAcciones.push(registroCreacion);
    }

    if (anadirJustificacion) {
      this.listaAcciones.push(registroJustificacion);
    }

    if (anadirValidacion) {
      this.listaAcciones.push(registroValidacion);
    }

    if (this.listaAcciones.length > 0 && fechas.length > 0) {
      this.listaAcciones.sort((a, b) => {
        let aF = new Date(a.fecha);
        let bF = new Date(b.fecha);
        return (aF < bF ? -1 : 1 * (-1));
      });
    }

    if (this.listaAcciones.length > 0) {
      let tarj = this.listaTarjetas.find(el => el.id == 'sjcsDesigActuaOfiHist');

      tarj.campos = [];
      tarj.campos.push({ key: 'Fecha', value: this.listaAcciones[0].fecha });
      tarj.campos.push({ key: 'Acción', value: this.listaAcciones[0].accion });
      tarj.campos.push({ key: 'Usuario', value: this.listaAcciones[0].usuario });
    }

  }

  getInstitucionActual() {
    this.sigaServices.get("institucionActual").subscribe(n => { this.institucionActual = n.value });
  }

  getActuacionDesigna(event) {

    this.progressSpinner = true;

    let params = {
      anio: this.actuacionDesigna.designaItem.ano.split('/')[0].replace('D', ''),
      idTurno: this.actuacionDesigna.designaItem.idTurno,
      numero: this.actuacionDesigna.designaItem.numero,
      historico: false,
      idPersonaColegiado: '',
      numeroAsunto: event
    };

    this.sigaServices.post("actuaciones_designacion", params).subscribe(
      data => {

        let object: ActuacionDesignaObject = JSON.parse(data.body);

        if (object.error != null && object.error.description != null) {
          this.showMsg('error', 'Error', this.translateService.instant(object.error.description.toString()));
        } else {
          let resp = object.actuacionesDesignaItems[0];
          this.actuacionDesigna.actuacion = resp;
          this.actuacionDesigna.isNew = false;
          this.isNewActDesig = false;
          this.establecerValoresIniciales();
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  establecerValoresIniciales() {

    // Se rellenan la tarjeta resumen
    this.tarjetaFija.campos[0].value = this.actuacionDesigna.designaItem.ano;
    this.tarjetaFija.campos[1].value = `${this.actuacionDesigna.designaItem.numColegiado} ${this.actuacionDesigna.designaItem.nombreColegiado}`;
    this.tarjetaFija.campos[2].value = this.actuacionDesigna.actuacion.numeroAsunto;
    this.tarjetaFija.campos[3].value = this.datePipe.transform(new Date(this.actuacionDesigna.actuacion.fechaActuacion.split('/').reverse().join('-')), 'dd/MM/yyyy');

    // Se rellenan los campos de la tarjeta de Datos Generales plegada
    this.listaTarjetas[0].campos[0].value = this.actuacionDesigna.actuacion.nombreJuzgado;
    this.listaTarjetas[0].campos[1].value = this.actuacionDesigna.actuacion.modulo;
    this.listaTarjetas[0].campos[2].value = this.actuacionDesigna.actuacion.acreditacion;

    // Se rellenan los campos de la tarjeta de Justificación plegada

    this.listaTarjetas[1].campos[0].value = this.actuacionDesigna.actuacion.fechaJustificacion;
    this.listaTarjetas[1].campos[1].value = this.actuacionDesigna.actuacion.validada ? 'Validada' : 'Pendiente de validar';

    if (this.relaciones == undefined || this.relaciones == null || this.relaciones.length == 0) {
      this.listaTarjetas.find(el => el.id == 'sjcsDesigActuaOfiRela').campos = [{
        "key": "Nº total",
        "value": 'No existen relaciones asociadas a la actuación'
      }];
    } else {
      this.listaTarjetas.find(el => el.id == 'sjcsDesigActuaOfiRela').campos = [{
        "key": "Nº total",
        "value": this.relaciones.length
      }];
    }

    this.getIdPartidaPresupuestaria();
    this.getAccionesActuacion();
    this.getDocumentosPorActDesigna();
  }

  getDocumentosPorActDesigna() {

    this.progressSpinner = true;

    let params = {
      anio: this.actuacionDesigna.actuacion.anio,
      numero: this.actuacionDesigna.actuacion.numero,
      idActuacion: this.actuacionDesigna.actuacion.numeroAsunto
    };

    this.sigaServices.post("actuaciones_designacion_getDocumentosPorActDesigna", params).subscribe(
      data => {

        let resp: DocumentoActDesignaObject = JSON.parse(data.body);
        this.documentos = resp.listaDocumentoActDesignaItem;

        if (this.documentos != undefined && this.documentos != null) {

          let tarj = this.listaTarjetas.find(el => el.id == 'sjcsDesigActuaOfiDoc');

          if (this.documentos.length == 0) {

            tarj.campos = [];
            tarj.campos.push({
              key: null,
              value: 'No existe documentación asociada a la actuación'
            });
          } else {

            tarj.campos = [];
            tarj.campos.push({
              key: 'Número total de Documentos',
              value: this.documentos.length.toString()
            });
          }
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
      }
    );

  }

}
