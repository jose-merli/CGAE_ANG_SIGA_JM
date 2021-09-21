import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { ActuacionDesignaItem } from '../../../../../models/sjcs/ActuacionDesignaItem';
import { ActuacionDesignaObject } from '../../../../../models/sjcs/ActuacionDesignaObject';
import { ConfirmationService, Message } from 'primeng/api';
import { Row, DetalleTarjetaProcuradorFichaDesignaionOficioService } from './detalle-tarjeta-procurador-designa/detalle-tarjeta-procurador-ficha-designaion-oficio.service';
import { ProcuradorItem } from '../../../../../models/sjcs/ProcuradorItem';
import { DetalleTarjetaContrariosFichaDesignacionOficioComponent } from './detalle-tarjeta-contrarios-designa/detalle-tarjeta-contrarios-ficha-designacion-oficio.component';
import { DetalleTarjetaInteresadosFichaDesignacionOficioComponent } from './detalle-tarjeta-interesados-designa/detalle-tarjeta-interesados-ficha-designacion-oficio.component';
import { CommonsService } from '../../../../../_services/commons.service';
import { Router } from '@angular/router';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { DetalleTarjetaRelacionesDesignaComponent } from './detalle-tarjeta-relaciones-designa/detalle-tarjeta-relaciones-designa.component';
import { RelacionesItem } from '../../../../../models/sjcs/RelacionesItem';
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';
import { DocumentoDesignaItem } from '../../../../../models/sjcs/DocumentoDesignaItem';
import { DocumentoDesignaObject } from '../../../../../models/sjcs/DocumentoDesignaObject';
import { Dialog } from 'primeng/dialog';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { TurnosItem } from '../../../../../models/sjcs/TurnosItem';

@Component({
  selector: 'app-ficha-designaciones',
  templateUrl: './ficha-designaciones.component.html',
  styleUrls: ['./ficha-designaciones.component.scss']
})
export class FichaDesignacionesComponent implements OnInit {

  designaItem = JSON.parse(sessionStorage.getItem("designaItemLink"));
  procurador;
  listaPrueba = [];
  relaciones: any;
  comunicaciones: any;
  isLetrado: boolean = false;
  usuarioLogado;
  nombreInteresado = this.translateService.instant('justiciaGratuita.oficio.designas.interesados.vacio');
  idPersonaLogado: any;
  numColegiadoLogado: any;
  esColegiado: boolean = false;
  confirmationSave: boolean = false;
  permiteTurno: boolean;

  @ViewChild(DetalleTarjetaContrariosFichaDesignacionOficioComponent) tarjetaContrarios;
  @ViewChild(DetalleTarjetaInteresadosFichaDesignacionOficioComponent) tarjetaInteresados;
  @ViewChild(DetalleTarjetaRelacionesDesignaComponent) tarjetaRelaciones;
  @ViewChild("cdSave") cdSave: Dialog;
  mostrarAnularCompensacion: boolean = false;
  rutas: string[] = ['SJCS', 'Designaciones'];
  campos: DesignaItem = new DesignaItem();
  comboRenuncia: any;
  nuevaDesigna: any;
  progressSpinner: boolean = false;
  contrarios: any;
  interesados: any;
  letrados: any;
  closeLetrado: boolean = true;
  totalActuacionesDesigna;
  refreshDesigna;
  msgs;
  msjEliminarDesignacion;
  msjGuardarProcurador;
  tarjetaFija = {
    nombre: this.translateService.instant("justiciaGratuita.oficio.turnos.inforesumen"),
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: true,
    campos: [],
    enlaces: []
  };

  listaTarjetas = [
    {
      id: 'sjcsDesigaDatosGen',
      nombre: "Datos Generales",
      imagen: "",
      icono: 'far fa-address-book',
      fixed: false,
      detalle: true,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigaDet',
      nombre: "Detalle Designación",
      icono: "fa fa-gavel",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigDatAdicionales',
      nombre: "Datos Adicionales",
      imagen: "",
      icono: 'fa fa-university',
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigInt',
      nombre: "Interesados",
      imagen: "",
      icono: "fa fa-users",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigContra',
      nombre: "Contrarios",
      imagen: "",
      icono: "fa fa-users",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigProc',
      nombre: "Procurador",
      imagen: "",
      icono: "fa fa-user",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigCamb',
      nombre: "Cambio Letrado",
      imagen: "",
      icono: "fa fa-graduation-cap",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [],
      enlaces: [],
      enlaceCardClosed: {},
      letrado: {}
    },
    {
      id: 'sjcsDesigRel',
      nombre: "Relaciones",
      imagen: "",
      icono: "fas fa-link",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigCom',
      nombre: "Comunicaciones",
      imagen: "",
      icono: "fa fa-inbox",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigDoc',
      nombre: "Documentación",
      imagen: "",
      icono: "fa fa-briefcase",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigAct',
      nombre: "Actuaciones",
      imagen: "",
      icono: "fa fa-gavel",
      detalle: true,
      fixed: false,
      opened: false,
      campos: []
    },
    {
      id: 'sjcsDesigDatFac',
      nombre: "Datos Facturación",
      imagen: "",
      icono: 'fa fa-usd',
      fixed: false,
      detalle: true,
      opened: false,
      campos: [

      ]
    },
  ];

  selectedArray = [];
  seleccionarTodo = false;
  totalRegistros = 0;
  rowGroups: Row[];
  rowGroupsAux: Row[];
  selectedRow: Row;
  cabeceras = [
    { id: "fechadesigna", name: "justiciaGratuita.oficio.designaciones.fechaDesignacion" },
    { id: "numerodesignacion", name: "justiciaGratuita.oficio.justificacionExpres.numDesignacion" },
    { id: "nColegiado", name: "censo.resultadosSolicitudesModificacion.literal.nColegiado" },
    { id: "nombre", name: "justiciaGratuita.oficio.designas.contrarios.procurador" },
    { id: "motivo", name: "censo.datosHistorico.literal.motivo" },
    { id: "observaciones", name: "censo.nuevaSolicitud.observaciones" },
    { id: "fecharenunciasolicita", name: "formacion.busquedaInscripcion.fechaSolicitud" },
    { id: "fechabaja", name: "administracion.auditoriaUsuarios.literal.fechaEfectiva" },
  ];
  permisosTarjeta: boolean = true;
  actuacionesDesignaItems: ActuacionDesignaItem[] = [];
  documentos: DocumentoDesignaItem[] = [];

  constructor(private location: Location,
    private translateService: TranslateService, private sigaServices: SigaServices, private datepipe: DatePipe,
    private gbtservice: DetalleTarjetaProcuradorFichaDesignaionOficioService,
    private commonsService: CommonsService, private router: Router,
    private confirmationService: ConfirmationService,
    private localStorageService: SigaStorageService,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.progressSpinner = true;
    this.getDataLoggedUser();

    this.isLetrado = this.localStorageService.isLetrado;
    this.idPersonaLogado = this.localStorageService.idPersona;
    this.numColegiadoLogado = this.localStorageService.numColegiado;

    this.msjEliminarDesignacion = this.translateService.instant("justiciaGratuita.oficio.designaciones.eliminarDesignacion");
    this.msjGuardarProcurador = this.translateService.instant("justiciaGratuita.oficio.designaciones.guardarProcurador");

    this.checkAcceso();
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    let designaItem = JSON.parse(sessionStorage.getItem("designaItemLink"));
    if (designaItem == null) {
      this.campos = new DesignaItem();
    } else {
      this.campos = designaItem;
    }
    if (sessionStorage.getItem('refreshDataAct')) {
      let dataRefresh: ActuacionDesignaItem = JSON.parse(sessionStorage.getItem('refreshDataAct'));

      if (this.campos.nig == undefined || this.campos.nig == null || this.campos.nig.trim().length == 0) {
        this.campos.nig = dataRefresh.nig;
      }

      if (this.campos.numProcedimiento == undefined || this.campos.numProcedimiento == null || this.campos.numProcedimiento.trim().length == 0) {
        this.campos.numProcedimiento = dataRefresh.numProcedimiento;
      }

      if (this.campos.idJuzgado == undefined || this.campos.idJuzgado == null || this.campos.idJuzgado == 0) {
        this.campos.idJuzgado = Number(dataRefresh.idJuzgado);
      }

      if (this.campos.idModulos == undefined || this.campos.idModulos == null) {
        this.campos.idModulo = dataRefresh.idProcedimiento;
      }

      if (this.campos.idProcedimiento == undefined || this.campos.idProcedimiento == null || this.campos.idProcedimiento == 0) {
        this.campos.idProcedimiento = Number(dataRefresh.idPretension);
      }

      if (this.campos.nombreJuzgado == undefined || this.campos.nombreJuzgado == null || this.campos.nombreJuzgado.trim().length == 0) {
        this.campos.nombreJuzgado = dataRefresh.nombreJuzgado;
      }

      if (this.campos.nombreProcedimiento == undefined || this.campos.nombreProcedimiento == null || this.campos.nombreProcedimiento.trim().length == 0) {
        this.campos.nombreProcedimiento = dataRefresh.nombreProcedimiento;
      }

      if (this.campos.modulo == undefined || this.campos.modulo == null || this.campos.modulo.trim().length == 0) {
        this.campos.modulo = dataRefresh.nombreModulo;
      }

      sessionStorage.removeItem('refreshDataAct');
    }

    this.motivosRenuncia();

    if (sessionStorage.getItem("buscadorColegiados")) {
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
      //sessionStorage.removeItem("buscadorColegiados");
      this.listaTarjetas[0].opened = true;
    } else if (sessionStorage.getItem("colegiadoGeneralDesigna")) {
      let colegiadoGeneral = JSON.parse(sessionStorage.getItem("colegiadoGeneralDesigna"));
      this.listaTarjetas[0].opened = true;
    }
    this.commonsService.checkAcceso(procesos_oficio.designaTarjetaLetrado)
      .then(respuesta => {
        this.permisosTarjeta = respuesta;
        let esColegio = this.commonsService.getLetrado();
        this.persistenceService.setPermisos(this.permisosTarjeta);
        if (this.permisosTarjeta == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        } else if (this.persistenceService.getPermisos() != true) {
          this.closeLetrado = false;
        }
        this.listaTarjetas[6].detalle = this.closeLetrado;
      }
      ).catch(error => console.error(error));
    if (!this.nuevaDesigna) {

      this.getPermiteTurno();

      //EDICIÓN DESIGNA
      let camposResumen = [
        {
          "key": "Año/Número",
          "value": designaItem.ano
        },
        {
          "key": "Letrado",
          "value": designaItem.numColegiado
        },
        {
          "key": "Estado",
          "value": designaItem.estado
        },
        {
          "key": "Interesado",
          "value": this.nombreInteresado
        },
        {
          "key": "Número Actuaciones",
          "value": ""
        },
        {
          "key": "Validado",
          "value": designaItem.validada
        }
      ];

      let camposGenerales = [
        {
          "key": "Turno",
          "value": designaItem.nombreTurno
        },
        {
          "key": "Fecha",
          "value": designaItem.fechaEntradaInicio
        },
        {
          "key": "Designación Art. 27-28",
          "value": designaItem.art27
        }, {
          "key": "Tipo",
          "value": designaItem.descripcionTipoDesigna
        }
      ];

      let camposDetalle = [
        {
          "key": "Número Procedimiento",
          "value": designaItem.numProcedimiento
        },
        {
          "key": "Juzgado",
          "value": designaItem.nombreJuzgado
        },
        {
          "key": "Procedimiento",
          "value": designaItem.nombreProcedimiento
        },
        {
          "key": "Módulo",
          "value": designaItem.modulo
        }
      ];
      if ((designaItem.observaciones == null || designaItem.observaciones == undefined || designaItem.observaciones == "")
        && (designaItem.delitos == null || designaItem.delitos == undefined || designaItem.delitos == "")
        && (designaItem.defensaJuridica == null || designaItem.defensaJuridica == undefined || designaItem.defensaJuridica == "")
        && (designaItem.fechaOficioJuzgado == null || designaItem.fechaOficioJuzgado == undefined || designaItem.fechaOficioJuzgado == "")
        && (designaItem.fechaJuicio == null || designaItem.fechaJuicio == undefined || designaItem.fechaJuicio == "")
        && (designaItem.fechaRecepcionColegio == null || designaItem.fechaRecepcionColegio == undefined || designaItem.fechaRecepcionColegio == "")) {
        let datosAdicionales = [
          {
            "key": null,
            "value": "No existen observaciones definidas para la designación"
          }
        ];
        this.listaTarjetas[2].campos = datosAdicionales;
      } else {
        let datosAdicionales = [
          {
            "key": "Fecha Oficio Juzgado",
            "value": this.formatDate(designaItem.fechaOficioJuzgado)
          },
          {
            "key": "Fecha Reecepción Colegio",
            "value": this.formatDate(designaItem.fechaRecepcionColegio)
          },
          {
            "key": "Fecha Juicio",
            "value": this.formatDateWithHours(designaItem.fechaJuicio)
          }
        ];
        this.listaTarjetas[2].campos = datosAdicionales;

      }

      this.tarjetaFija.campos = camposResumen;
      this.listaTarjetas[0].campos = camposGenerales;
      this.listaTarjetas[1].campos = camposDetalle;


      // this.searchContrarios(false);
      /* this.listaTarjetas[4].enlaces=[{
      id: null,
          ref: null,
          nombre: this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.vacio')
      }] */
      //Actualizar para que las tarjetas se rellenen
      this.searchInteresados();
      this.searchContrarios(false);
      this.searchRelaciones();
      this.searchLetrados();
      this.getIdPartidaPresupuestaria(this.campos);
      this.getActuacionesDesigna(false);
      this.getDocumentosDesigna();
      if (!this.isLetrado) {
        this.searchComunicaciones();
      } else {
        this.sigaServices.get("usuario_logeado").subscribe(n => {

          const usuario = n.usuarioLogeadoItem;
          const colegiadoItem = new ColegiadoItem();
          colegiadoItem.nif = usuario[0].dni;

          this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
            usr => {
              this.usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
              this.progressSpinner = false;
              this.searchComunicaciones();
            });

        });
      }
      //this.searchColegiado();
      /* {
        "key": "Nº Colegiado",
        "value": "6492"
      },
      {
        "key": "Nombre",
        "value": "MIGUEL HFGSGS AJSKFI"
      },
      {
        "key": "Fecha designación",
        "value": "02/07/2007"
      } */
      this.progressSpinner = false;
    } else {


      /* this.listaTarjetas[4].enlaces=[{
      id: null,
          ref: null,
          nombre: this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.vacio')
      }] */

      this.progressSpinner = false;

      //NUEVA DESIGNA
      let camposResumen = [
        {
          "key": "Año/Número",
          "value": ""
        },
        {
          "key": "Letrado",
          "value": ""
        },
        {
          "key": "Estado",
          "value": ""
        },
        {
          "key": "Interesado",
          "value": this.translateService.instant('justiciaGratuita.oficio.designas.interesados.vacio')
        },
        {
          "key": "Número Actuaciones",
          "value": ""
        },
        {
          "key": "Validado",
          "value": ""
        }
      ];
      let camposGenerales = [
        {
          "key": "Turno",
          "value": ""
        },
        {
          "key": "Fecha",
          "value": this.formatDate(new Date())
        },
        {
          "key": "Designación Art. 27-28",
          "value": "NO"
        }, {
          "key": "Tipo",
          "value": ""
        }
      ];

      let camposDetalle = [
        {
          "key": "Número Procedimiento",
          "value": ""
        },
        {
          "key": "Juzgado",
          "value": ""
        },
        {
          "key": "Procedimiento",
          "value": ""
        },
        {
          "key": "Módulo",
          "value": ""
        }
      ];
      let datosAdicionales = [
        {
          "key": null,
          "value": "No existen observaciones definidas para la designación"
        }
      ];

      let datosFacturacion = [
        {
          "key": "Partida Presupuestaria",
          "value": ""
        }
      ];
      let interesadosVacio = [{
        "key": null,
        "value": this.translateService.instant('justiciaGratuita.oficio.designas.interesados.vacio')
      },]
      let contrariosVacio = [{
        "key": null,
        "value": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.vacio')
      },]

      this.tarjetaFija.campos = camposResumen;
      this.listaTarjetas[0].campos = camposGenerales;
      this.listaTarjetas[1].campos = camposDetalle;
      this.listaTarjetas[2].campos = datosAdicionales;
      this.listaTarjetas[3].campos = interesadosVacio;
      this.listaTarjetas[4].campos = contrariosVacio;
      this.listaTarjetas[11].campos = datosFacturacion;
      this.listaTarjetas[0].opened = true;
      this.listaTarjetas[1].detalle = false;
      this.listaTarjetas[2].detalle = false;
      this.listaTarjetas[3].detalle = false;
      this.listaTarjetas[4].detalle = false;
      this.listaTarjetas[5].detalle = false;
      this.listaTarjetas[6].detalle = false;
      this.listaTarjetas[7].detalle = false;
      this.listaTarjetas[8].detalle = false;
      this.listaTarjetas[9].detalle = false;
      this.listaTarjetas[10].detalle = false;
      this.listaTarjetas[11].detalle = false;
      /* this.listaTarjetas[4].enlaces=[{
      id: null,
          ref: null,
          nombre: this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.vacio')
      }] */

      this.progressSpinner = false;
    }

    this.progressSpinner = false;
  }

  ngOnChanges() {
    if (sessionStorage.getItem("buscadorColegiados")) {
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
      this.tarjetaFija.campos[1].value = busquedaColegiado.nColegiado;
    } else if (sessionStorage.getItem("colegiadoGeneralDesigna")) {
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("colegiadoGeneralDesigna"));
      this.tarjetaFija.campos[1].value = busquedaColegiado.numeroColegiado;
    }
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    if (this.nuevaDesigna) {
      this.listaTarjetas[1].detalle = true;
      this.listaTarjetas[2].detalle = true;
      this.listaTarjetas[3].detalle = true;
      this.listaTarjetas[4].detalle = true;
      this.listaTarjetas[5].detalle = true;
      this.listaTarjetas[6].detalle = true;
      this.listaTarjetas[7].detalle = true;
      this.listaTarjetas[8].detalle = true;
      this.listaTarjetas[9].detalle = true;
      this.listaTarjetas[10].detalle = true;
      this.listaTarjetas[11].detalle = true;
    }
    /*
        if (sessionStorage.getItem("rowGroupsProcurador")) {
          sessionStorage.removeItem("rowGroupsProcurador");
        }
    
        if (this.changes.rowGroups.currentValue) {
          sessionStorage.setItem("rowGroupsProcurador", JSON.stringify(this.changes.rowGroups.currentValue));
        }*/
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
    sessionStorage.setItem("volver", 'true');
    //this.router.navigate(['/designaciones']);
    this.location.back();
  }

  transformaFecha(fecha) {
    if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(fecha);
      }
    } else {
      fecha = undefined;
    }

    return fecha;
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }

  formatDateWithHours(date)
  {
    const pattern = 'dd/MM/yyyy hh:mm';
    return this.datepipe.transform(date, pattern);
  }

  clear() {
    this.msgs = [];
  }

  getActuacionesDesigna(historico: boolean) {

    this.progressSpinner = true;

    let idPersonaColegiado = '';

    if (this.isLetrado) {
      idPersonaColegiado = this.idPersonaLogado;
    }

    let params = {
      anio: this.campos.ano.toString().split('/')[0].replace('D', ''),
      idTurno: this.campos.idTurno,
      numero: this.campos.numero,
      historico: historico,
      idPersonaColegiado: idPersonaColegiado
    };


    this.sigaServices.post("actuaciones_designacion", params).subscribe(
      data => {
        this.progressSpinner = false;

        let object: ActuacionDesignaObject = JSON.parse(data.body);

        if (object.error != null && object.error.description != null) {
          this.showMessage('error', 'Error', object.error.description.toString());
        } else {
          let resp = object.actuacionesDesignaItems;

          let justificadas = 0;
          let validadas = 0;
          let facturadas = 0;
          let total = 0;

          resp.forEach(el => {

            if (!this.isLetrado) {
              el.permiteModificacion = true;
            }

            if (el.validada) {
              validadas += 1;
            }

            if (el.facturado) {
              facturadas += 1;
            }

            if (el.fechaJustificacion != undefined && el.fechaJustificacion != null && el.fechaJustificacion != '') {
              justificadas += 1;
            }

            el.validadaTexto = el.validada ? 'Sí' : 'No'
            el.fechaActuacion = this.datepipe.transform(el.fechaActuacion, 'dd/MM/yyyy');
            el.fechaJustificacion = this.datepipe.transform(el.fechaJustificacion, 'dd/MM/yyyy');
          });
          this.actuacionesDesignaItems = resp;

          let tarj = this.listaTarjetas.find(tarj => tarj.id === 'sjcsDesigAct');
          tarj.campos = [];
          total = this.actuacionesDesignaItems.length;
          this.totalActuacionesDesigna = total;
          if (this.actuacionesDesignaItems.length == 0) {

            tarj.campos = [
              {
                "key": "Nº total",
                "value": "No existen actuaciones asociadas a la designación"
              }
            ];
          } else if (this.actuacionesDesignaItems.length == 1) {

            let act = this.actuacionesDesignaItems[0];

            let estado = '';

            if (act.facturado) {
              estado = 'Facturada';
            } else if (act.anulada) {
              estado = 'Anulada';
            } else if (!act.validada) {
              estado = 'Activa';
            } else if (act.validada) {
              estado = 'Validada';
            }

            tarj.campos = [
              {
                "key": "Fecha",
                "value": act.fechaActuacion
              },
              {
                "key": "Módulo",
                "value": act.modulo
              },
              {
                "key": "Acreditación",
                "value": act.acreditacion
              },
              {
                "key": "Estado",
                "value": estado
              }
            ];

          } else {

            tarj.campos = [
              {
                "key": "Justificadas",
                "value": justificadas.toString()
              },

              {
                "key": "Validadas",
                "value": validadas.toString()
              },

              {
                "key": "Facturadas",
                "value": facturadas.toString()
              },

              {
                "key": "Número total",
                "value": total.toString()
              }
            ];
          }

          this.tarjetaFija.campos[4].value = total.toString();

        }

      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  motivosRenuncia() {
    this.progressSpinner = true;

    this.sigaServices.get("designaciones_motivosRenuncia").subscribe(
      n => {
        this.comboRenuncia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboRenuncia);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.mostrar();
      }
    );
  }

  mostrar() {
    if (!this.nuevaDesigna) {
      let procurador = [this.campos.numero, String(this.campos.idInstitucion), this.campos.idTurno, this.campos.ano];
      this.sigaServices.post("designaciones_busquedaProcurador", procurador).subscribe(
        n => {
          this.procurador = JSON.parse(n.body).procuradorItems;
          if (this.procurador != null) {
            sessionStorage.setItem("compruebaProcurador", "true");
          }

          this.procurador.forEach(element => {
            element.fechaDesigna = this.formatDate(element.fechaDesigna);
            element.fecharenunciasolicita = this.formatDate(element.fecharenunciasolicita);
            element.fechabaja = this.formatDate(element.fechabaja);
          });

          if (this.procurador.length != 0) {
            this.listaTarjetas[5].campos = [{
              "key": this.translateService.instant('censo.resultadosSolicitudesModificacion.literal.nColegiado'),
              "value": this.procurador[0].nColegiado
            },
            {
              "key": this.translateService.instant('censo.usuario.nombre'),
              "value": this.procurador[0].nombre + " " + this.procurador[0].apellido1 + " " + this.procurador[0].apellido2
            },
            {
              "key": this.translateService.instant('justiciaGratuita.oficio.designaciones.fechaDesignacion'),
              "value": this.procurador[0].fechaDesigna
            },
            {
              "key": this.translateService.instant('justiciaGratuita.oficio.designaciones.numerototalprocuradores'),
              "value": this.procurador[0].numeroTotalProcuradores
            }]
          } else {
            this.listaTarjetas[5].campos = [
              {
                "key": null,
                "value": this.translateService.instant('justiciaGratuita.oficio.designas.procuradores.vacio')
              }
            ]
          }

          //Si se trae un procurador desde su pantalla de busqueda
          if (sessionStorage.getItem("datosProcurador")) {
            let newProcurador = JSON.parse(sessionStorage.getItem("datosProcurador"))[0];
            //sessionStorage.removeItem("datosProcurador")
            //Se introduce la informacion basica en el primer lugar del array
            //que posteriormente sera el editable.
            this.procurador.unshift({
              fechaDesigna:  null,
              numerodesignacion: null,
              nColegiado: newProcurador.nColegiado,
              nombre: newProcurador.nombre,
              apellido1: newProcurador.apellido1,
              apellido2: newProcurador.apellido2,
              motivosRenuncia: null,
              observaciones: null,
              fecharenunciasolicita: null,
              fechabaja: null
            });
          }
          this.jsonToRow(this.procurador);
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
  }

  jsonToRow(datos) {
    let arr = [];
    let x = 0;

    datos.forEach((element, index) => {
      if (x == 0) {
        let obj;
        //Si se trata de la introduccion de un procurador nuevo.
        //Recordar que en este caso se estaria modificando la entrada correspondiente al procurador traido.
        if (sessionStorage.getItem("datosProcurador")) {
          obj = [
            { type: 'datePicker', value: new Date() },
            { type: 'input', value: element.numerodesignacion },
            { type: 'text', value: element.nColegiado },
            { type: 'text', value: element.apellido1 + " " + element.apellido2 + ", " + element.nombre },
            { type: 'select', combo: this.comboRenuncia, value: element.motivosRenuncia },
            { type: 'input', value: element.observaciones },
            { type: 'datePicker', value: element.fecharenunciasolicita },
            { type: 'text', value: element.fechabaja }
          ];
        }
        else{
          obj = [
            { type: 'datePicker', value: element.fechaDesigna },
            { type: 'input', value: element.numerodesignacion },
            { type: 'text', value: element.nColegiado },
            { type: 'text', value: element.apellido1 + " " + element.apellido2 + ", " + element.nombre },
            { type: 'select', combo: this.comboRenuncia, value: element.motivosRenuncia },
            { type: 'input', value: element.observaciones },
            { type: 'datePicker', value: element.fecharenunciasolicita },
            { type: 'text', value: element.fechabaja }
          ];
        }
        let superObj = {
          id: index,
          row: obj
        };

        arr.push(superObj);
        x = 1;
      } else {
        let comboValue;
        this.comboRenuncia.forEach(renun => {
          if(renun.value==element.motivosRenuncia)element.motivosRenuncia = renun.label;
        });
        let obj = [
          { type: 'text', value: element.fechaDesigna },
          { type: 'text', value: element.numerodesignacion },
          { type: 'text', value: element.nColegiado },
          { type: 'text', value: element.apellido1 + " " + element.apellido2 + ", " + element.nombre },
          { type: 'text', value: element.motivosRenuncia },
          { type: 'text', value: element.observaciones },
          { type: 'text', value: element.fecharenunciasolicita },
          { type: 'text', value: element.fechabaja }
        ];
        let superObj = {
          id: index,
          row: obj
        };

        arr.push(superObj);
      }
    });
    this.rowGroups = this.gbtservice.getTableData(arr);
    this.rowGroupsAux = this.gbtservice.getTableData(arr);
    if (sessionStorage.getItem("datosProcurador")) {
      
      this.listaTarjetas[5].opened = true;
    }
    this.totalRegistros = this.rowGroups.length;
  }

  restablecer() {
    this.selectedArray = [];
    this.progressSpinner = true;
    this.rowGroups = [];
    this.rowGroups = JSON.parse(sessionStorage.getItem("rowGroupsInitProcurador"));
    this.rowGroupsAux = [];
    this.rowGroupsAux = JSON.parse(sessionStorage.getItem("rowGroupsInitProcurador"));
    this.totalRegistros = this.rowGroups.length;
    this.progressSpinner = false;
    this.showMessage("success", 'Operación realizada con éxito', 'Los registros han sido restablecidos');
  }

  searchContrarios(event) {
    this.progressSpinner = true;
    let data = sessionStorage.getItem("designaItemLink");
    let designaItem = JSON.parse(data);

    let item = [designaItem.idTurno.toString(), designaItem.nombreTurno, designaItem.numero.toString(), designaItem.ano, event];

    this.sigaServices.post("designaciones_listaContrarios", item).subscribe(
      n => {

        this.contrarios = JSON.parse(n.body);
        let primero = this.contrarios[0];

        let error = JSON.parse(n.body).error;
        // if(sessionStorage.getItem("contrarios" &&)!=null)this.router.navigate(["/justiciables"]);
        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }
        this.progressSpinner = false;
        if (this.contrarios.length == 0) {
          this.listaTarjetas[4].campos = [{
            "key": null,
            "value": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.vacio')
          },]
        }

        else {
          this.listaTarjetas[4].campos = [
            {
              "key": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.identificadorprimero'),
              "value": primero.nif
            },
            {
              "key": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.apellidosnombreprimero'),
              "value": primero.apellidosnombre
            },
            {
              "key": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.abogadoprimero'),
              "value": primero.abogado
            },
            {
              "key": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.procuradorprimero'),
              "value": primero.procurador
            },
            {
              "key": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.ncontrarios'),
              "value": this.contrarios.length
            }
          ]

        }
        if (this.tarjetaContrarios != undefined) {
          this.tarjetaContrarios.tabla.sortOrder = 0;
          this.tarjetaContrarios.tabla.sortField = '';
          this.tarjetaContrarios.tabla.reset();
        }
        if (this.tarjetaContrarios != null && this.tarjetaContrarios != undefined) {
          this.tarjetaContrarios.historico = event;
        }
      },
      err => {
        this.progressSpinner = false;
      });

  }

  searchInteresados() {
    this.progressSpinner = true;
    let data = sessionStorage.getItem("designaItemLink");
    let designaItem = JSON.parse(data);

    if (designaItem.idTurno != null) {

      let item = [designaItem.idTurno.toString(), designaItem.nombreTurno, designaItem.numero.toString(), designaItem.ano];

      this.sigaServices.post("designaciones_listaInteresados", item).subscribe(
        n => {

          this.interesados = JSON.parse(n.body);
          let primero = this.interesados[0];
          //Columnas a obtener:
          //Identificador: Número de identificación correspondiente a la persona (NIF, pasaporte,..)
          //Apellidos, Nombre: Concatenación de los apellidos y nombre de la persona.
          //Dirección: Dirección postal (domicilio) registrada para esa persona. 
          //Representante: Apellidos, Nombre del justiciable representante.


          let error = JSON.parse(n.body).error;

          if (error != null && error.description != null) {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
          }
          this.progressSpinner = false;

          if (this.interesados.length == 0) {
            this.listaTarjetas[3].campos = [{
              "key": null,
              "value": this.translateService.instant('justiciaGratuita.oficio.designas.interesados.vacio')
            },]
            this.tarjetaFija.campos[3].value = this.translateService.instant('justiciaGratuita.oficio.designas.interesados.vacio');
            this.nombreInteresado = this.translateService.instant('justiciaGratuita.oficio.designas.interesados.vacio');
          }

          else {
            this.listaTarjetas[3].campos = [
              {
                "key": this.translateService.instant('justiciaGratuita.oficio.designas.interesados.identificadorprimero'),
                "value": primero.nif
              },
              {
                "key": this.translateService.instant('justiciaGratuita.oficio.designas.interesados.apellidosnombreprimero'),
                "value": primero.apellidosnombre
              },
              {
                "key": this.translateService.instant('justiciaGratuita.oficio.designas.interesados.diccionarioprimero'),
                "value": primero.diccionario
              },
              {
                "key": this.translateService.instant('justiciaGratuita.oficio.designas.interesados.representanteprimero'),
                "value": primero.representante
              },
              {
                "key": this.translateService.instant('justiciaGratuita.oficio.designas.interesados.ninteresados'),
                "value": this.interesados.length
              }
            ]
            this.tarjetaFija.campos[3].value = primero.apellidosnombre;
            this.nombreInteresado = primero.apellidosnombre;
          }
          if (this.tarjetaInteresados != undefined) {
            this.tarjetaInteresados.tabla.sortOrder = 0;
            this.tarjetaInteresados.tabla.sortField = '';
            this.tarjetaInteresados.tabla.reset();
          }
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
  }

  searchRelaciones() {
    if (!this.nuevaDesigna) {
      this.progressSpinner = true;
      let data = sessionStorage.getItem("designaItemLink");
      let designaItem = JSON.parse(data);

      let item = [designaItem.ano, designaItem.idTurno, designaItem.idInstitucion, designaItem.numero];

      this.sigaServices.post("designacionesBusquedaRelaciones", item).subscribe(
        n => {
          this.relaciones = JSON.parse(n.body).relacionesItem;
          let primero = this.relaciones[0];
          let error = JSON.parse(n.body).error;

          if (error != null && error.description != null) {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
          }
          this.progressSpinner = false;

          if (this.relaciones.length > 0) {
            this.listaTarjetas[7].campos = [{
              "key": this.translateService.instant('justiciaGratuita.oficio.justificacionExpres.numeroEJG'),
              "value": this.relaciones[0].sjcs
            },
            {
              "key": this.translateService.instant('justiciaGratuita.oficio.designas.relaciones.total'),
              "value": this.relaciones.length
            }
            ]

          } else if (this.relaciones.length == 0 || this.relaciones == undefined || this.relaciones == null) {
            this.listaTarjetas[7].campos = [{
              "key": null,
              "value": this.translateService.instant('justiciaGratuita.oficio.designas.relaciones.vacio')
            }
            ]
          }
        },
        err => {
          this.progressSpinner = false;
        },
        () => {

        }
      );
    }
  }

  relacion() {
    this.searchRelaciones();
  }

  getDataLoggedUser() {
    if (this.isLetrado) {
      this.progressSpinner = true;

      this.sigaServices.get("usuario_logeado").subscribe(n => {

        const usuario = n.usuarioLogeadoItem;
        const colegiadoItem = new ColegiadoItem();
        colegiadoItem.nif = usuario[0].dni;

        this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
          usr => {
            this.usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
            this.progressSpinner = false;
            this.searchComunicaciones();
          });

      });
    }
  }

  searchComunicaciones() {
    if (!this.nuevaDesigna) {
      this.progressSpinner = true;
      let data = sessionStorage.getItem("designaItemLink");
      let designaItem = JSON.parse(data);
      let item;

      if (this.isLetrado) {
        item = [designaItem.ano, designaItem.idTurno, this.isLetrado, this.usuarioLogado.idPersona];
      } else {
        item = [designaItem.ano, designaItem.idTurno, this.isLetrado];
      }

      this.sigaServices.post("designacionesBusquedaComunicaciones", item).subscribe(
        n => {
          this.comunicaciones = JSON.parse(n.body).enviosMasivosItem;
          let error = JSON.parse(n.body).error;

          // this.comunicaciones.forEach(element => {
          //   if (element.fechaProgramada != null && element.fechaProgramada != "") {
          //     element.fechaProgramada = this.formatDate(element.fechaProgramada);
          //   }

          //   if (element.fechaCreacion != null && element.fechaCreacion != "") {
          //     element.fechaCreacion = this.formatDate(element.fechaCreacion);
          //   }
          // });
          this.progressSpinner = false;
          if (this.comunicaciones.length == 0 || this.comunicaciones == undefined || this.comunicaciones == null) {
            this.listaTarjetas[8].campos = [{
              "key": null,
              "value": this.translateService.instant('justiciaGratuita.designas.comunicaciones.vacio')
            }]
          } else {
            this.listaTarjetas[8].campos = [{
              "key": this.translateService.instant('justiciaGratuita.designas.comunicaciones.total'),
              "value": this.comunicaciones.length
            }
            ]
          }
        },
        err => {
          this.progressSpinner = false;
        }
      );
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  getIdPartidaPresupuestaria(designaItem) {
    let facturacionDesigna = new DesignaItem();
    facturacionDesigna.idTurno = designaItem.idTurno;
    let aux = String(this.campos.ano);
    let anio = aux.split("/");
    facturacionDesigna.ano = Number(anio[0].substring(1, 5));
    facturacionDesigna.numero = designaItem.numero;
    this.sigaServices.post("designaciones_getDatosFacturacion", facturacionDesigna).subscribe(
      n => {
        let a = JSON.parse(n.body).combooItems;
        if (a.length > 0 && a[0] != null) {
          this.campos.idPartidaPresupuestaria = a[0].value;
          this.campos.nombrePartida = a[0].label;
          let camposFacturacion = [
            {
              "key": "Partida Presupuestaria",
              "value": a[0].label
            }
          ];
          this.listaTarjetas[11].campos = camposFacturacion;
        } else {
          this.campos.idPartidaPresupuestaria = null;
          this.campos.nombrePartida = '';
          let camposFacturacion = [
            {
              "key": "Partida Presupuestaria",
              "value": ''
            }
          ];
          this.listaTarjetas[11].campos = camposFacturacion;
        }

      }
    );
  }
  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = procesos_oficio.designa;
    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        const permisos = JSON.parse(data.body);
        const permisosArray = permisos.permisoItems;
        const derechoAcceso = permisosArray[0].derechoacceso;

        this.esColegiado = true;
        if (derechoAcceso == 3) { //es colegio
          this.esColegiado = false;
        } else if (derechoAcceso == 2) {//es colegiado
          this.esColegiado = true;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
        }
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  refreshData(event) {
    this.progressSpinner = true;
    this.campos = event;
    this.getActuacionesDesigna(false);
    if (event.estado == 'V') {
      event.sufijo = event.estado;
      event.estado = 'Activo';
    } else if (event.estado == 'F') {
      event.sufijo = event.estado;
      event.estado = 'Finalizado';
    } else if (event.estado == 'A') {
      event.sufijo = event.estado;
      event.estado = 'Anulada';
    }
    let camposResumen = [
      {
        "key": "Año/Número",
        "value": event.ano
      },
      {
        "key": "Letrado",
        "value": event.numColegiado
      },
      {
        "key": "Estado",
        "value": event.estado
      },
      {
        "key": "Interesado",
        "value": this.nombreInteresado
      },
      {
        "key": "Número Actuaciones",
        "value": this.totalActuacionesDesigna
      },
      {
        "key": "Validado",
        "value": event.validada
      }
    ];

    let camposDetalle = [
      {
        "key": "Número Procedimiento",
        "value": event.numProcedimiento
      },
      {
        "key": "Juzgado",
        "value": event.nombreJuzgado
      },
      {
        "key": "Procedimiento",
        "value": event.nombreProcedimiento
      },
      {
        "key": "Módulo",
        "value": event.modulo
      }
    ];
    this.tarjetaFija.campos = camposResumen;
    this.listaTarjetas[1].campos = camposDetalle;
    if (event.rol[0] == "A") {
      this.mostrarAnularCompensacion = true
    }
    this.progressSpinner = false;
  }
  refreshDataGenerales(event) {
    this.progressSpinner = true;
    this.getActuacionesDesigna(false);
    this.busquedaDesignaciones(event);
    this.progressSpinner = false;

  }

  busquedaDesignaciones(event) {
    this.progressSpinner = true;
    let designaItem = new DesignaItem();
    designaItem.ano = event.ano;
    designaItem.numero = event.numero;
    designaItem.idTurno = event.idTurno;
    if (event.numColegiado == "") {
      designaItem.numColegiado = null;
    } else {
      designaItem.numColegiado = event.numColegiado;
    }
    this.sigaServices.post("designaciones_busqueda", designaItem).subscribe(
      n => {
        this.refreshDesigna = JSON.parse(n.body);
        this.refreshDesigna.forEach(element => {
          element.factConvenio = element.ano;
          element.ano = 'D' + element.ano + '/' + element.codigo;
          //  element.fechaEstado = new Date(element.fechaEstado);
          element.fechaEstado = this.formatDate(element.fechaEstado);
          element.fechaAlta = this.formatDate(element.fechaAlta);
          element.fechaEntradaInicio = this.formatDate(element.fechaEntradaInicio);
          if (element.estado == 'V') {
            element.sufijo = element.estado;
            element.estado = 'Activo';
          } else if (element.estado == 'F') {
            element.sufijo = element.estado;
            element.estado = 'Finalizado';
          } else if (element.estado == 'A') {
            element.sufijo = element.estado;
            element.estado = 'Anulada';
          }
          element.nombreColegiado = element.apellido1Colegiado + " " + element.apellido2Colegiado + ", " + element.nombreColegiado;
          element.nombreInteresado = element.apellido1Interesado + " " + element.apellido2Interesado + ", " + element.nombreInteresado;
          if (element.art27 == "1") {
            element.art27 = "Si";
          } else {
            element.art27 = "No";
          }
          const params = {
            anio: element.factConvenio,
            idTurno: element.idTurno,
            numero: element.numero,
            historico: false
          };
          this.progressSpinner = false;
          this.sigaServices.post("actuaciones_designacion", params).subscribe(
            data => {
              let object: ActuacionDesignaObject = JSON.parse(data.body);
              let resp = object.actuacionesDesignaItems;
              let validadas = 0;
              let total = 0;

              resp.forEach(el => {

                if (el.validada) {
                  validadas += 1;
                }
              });
              this.actuacionesDesignaItems = resp;
              total = this.actuacionesDesignaItems.length;
              if (total == validadas && total > 0) {
                element.validada = "Si";
              } else {
                element.validada = "No";
              }
            });
          this.progressSpinner = false;
        },
          err => {
            this.progressSpinner = false;
          }
        );
        let camposResumen = [
          {
            "key": "Año/Número",
            "value": this.refreshDesigna.ano
          },
          {
            "key": "Letrado",
            "value": this.refreshDesigna.numColegiado
          },
          {
            "key": "Estado",
            "value": this.refreshDesigna.estado
          },
          {
            "key": "Interesado",
            "value": this.nombreInteresado
          },
          {
            "key": "Número Actuaciones",
            "value": this.totalActuacionesDesigna
          },
          {
            "key": "Validado",
            "value": this.refreshDesigna.validada
          }
        ];

        let camposGenerales = [
          {
            "key": "Turno",
            "value": this.refreshDesigna.nombreTurno
          },
          {
            "key": "Fecha",
            "value": this.refreshDesigna.fechaEntradaInicio
          },
          {
            "key": "Designación Art. 27-28",
            "value": this.refreshDesigna.art27
          }, {
            "key": "Tipo",
            "value": this.refreshDesigna.descripcionTipoDesigna
          }
        ];
        this.tarjetaFija.campos = camposResumen;
        this.listaTarjetas[0].campos = camposGenerales;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        // this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }, () => {
        this.progressSpinner = false;
      });;

  }

  searchLetrados() {

    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    let datos: DesignaItem = designa;
    this.progressSpinner = true;
    if (this.isLetrado) {
      this.sigaServices.get("usuario_logeado").subscribe(n => {
        const usuario = n.usuarioLogeadoItem;
        const colegiadoItem = new ColegiadoItem();
        colegiadoItem.nif = usuario[0].dni;
        this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
          usr => {
            this.usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
            //Buscamos los letrados asociados a la designacion
            let request = [designa.ano, designa.idTurno, designa.numero, this.usuarioLogado.idPersona];
            this.sigaServices.post("designaciones_busquedaLetradosDesignacion", request).subscribe(
              data => {
                let datos = JSON.parse(data.body);
                if (datos != [] && datos.length != 0) {
                  this.letrados = datos;
                  /* this.datos.fecharenunciasolicita;
                  this.datos.fecharenuncia;
                  this.datos.motivosrenuncia; */

                  this.listaTarjetas[6].campos = [
                    {
                      "key": this.translateService.instant('censo.resultadosSolicitudesModificacion.literal.nColegiado'),
                      "value": this.letrados[0].nColegiado
                    },
                    {
                      "key": this.translateService.instant('justiciaGratuita.justiciables.literal.colegiado'),
                      "value": this.letrados[0].apellidosNombre
                    }
                  ]
                  this.listaTarjetas[6].enlaceCardClosed = { click: 'irFechaColegial()', title: this.translateService.instant('informesycomunicaciones.comunicaciones.fichaColegial') };
                  this.listaTarjetas[6].letrado = datos[0];
                }else if (datos.length == 0){
                  this.listaTarjetas[6].campos = [
                    {
                      "key": this.translateService.instant('censo.resultadosSolicitudesModificacion.literal.nColegiado'),
                      "value": ""
                    },
                    {
                      "key": this.translateService.instant('justiciaGratuita.justiciables.literal.colegiado'),
                      "value": designa.nombreColegiado
                    }
                  ]
                  // this.listaTarjetas[6].enlaceCardClosed = { click: 'irFechaColegial()', title: this.translateService.instant('informesycomunicaciones.comunicaciones.fichaColegial') };
                  // this.listaTarjetas[6].letrado = datos[0];
                }
              },
              err => {
                if (err != undefined && JSON.parse(err.error).error.description != "") {
                  this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
                } else {
                  this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
                }
                this.progressSpinner = false;
              },
              () => {
                this.progressSpinner = false;
              }
            );
          });
      });
    } else {
      //Buscamos los letrados asociados a la designacion
      let request = [designa.ano, designa.idTurno, designa.numero];
      this.sigaServices.post("designaciones_busquedaLetradosDesignacion", request).subscribe(
        data => {
          let datos = JSON.parse(data.body);
          if (datos != [] && datos.length != 0) {
            this.letrados = datos;

            this.listaTarjetas[6].campos = [
              {
                "key": this.translateService.instant('censo.resultadosSolicitudesModificacion.literal.nColegiado'),
                "value": this.letrados[0].nColegiado
              },
              {
                "key": this.translateService.instant('justiciaGratuita.justiciables.literal.colegiado'),
                "value": this.letrados[0].apellidosNombre
              }
            ]

            this.listaTarjetas[6].enlaceCardClosed = { click: 'irFechaColegial()', title: this.translateService.instant('informesycomunicaciones.comunicaciones.fichaColegial') }
            this.listaTarjetas[6].letrado = datos[0];
          }else if (datos.length == 0){
            this.listaTarjetas[6].campos = [
              {
                "key": this.translateService.instant('censo.resultadosSolicitudesModificacion.literal.nColegiado'),
                "value": ""
              },
              {
                "key": this.translateService.instant('justiciaGratuita.justiciables.literal.colegiado'),
                "value": designa.nombreColegiado
              }
            ]
            // this.listaTarjetas[6].enlaceCardClosed = { click: 'irFechaColegial()', title: this.translateService.instant('informesycomunicaciones.comunicaciones.fichaColegial') };
            // this.listaTarjetas[6].letrado = datos[0];
          }
        },
        err => {
          if (err != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
    }


  }

  refreshAditionalData(event) {
    this.progressSpinner = true;
    this.getActuacionesDesigna(false);
    if ((event.observaciones == null || event.observaciones == undefined || event.observaciones == "")
      && (event.delitos == null || event.delitos == undefined || event.delitos == "")
      && (event.defensaJuridica == null || event.defensaJuridica == undefined || event.defensaJuridica == "")
      && (event.fechaOficioJuzgado == null || event.fechaOficioJuzgado == undefined || event.fechaOficioJuzgado == "")
      && (event.fechaJuicio == null || event.fechaJuicio == undefined || event.fechaJuicio == "")
      && (event.fechaRecepcionColegio == null || event.fechaRecepcionColegio == undefined || event.fechaRecepcionColegio == "")) {
      let datosAdicionales = [
        {
          "key": null,
          "value": "No existen observaciones definidas para la designación"
        }
      ];
      this.listaTarjetas[2].campos = datosAdicionales;
    } else {
      let datosAdicionales = [
        {
          "key": "Fecha Oficio Juzgado",
          "value": this.formatDate(event.fechaOficioJuzgado)
        },
        {
          "key": "Fecha Reecepción Colegio",
          "value": this.formatDate(event.fechaRecepcionColegio)
        },
        {
          "key": "Fecha Juicio",
          "value": this.formatDate(event.fechaJuicio)
        }
      ];
      this.listaTarjetas[2].campos = datosAdicionales;

      this.progressSpinner = false;
    }
  }

  changeDataTarjeta(event) {
    // lettarjeta = this.listaTarjetas.find(el=>el.id == event.tarjeta);
    // if (event.tarjeta == 'sjcsDesigActuaOfiJustifi') {​​​​​
    // tarjeta.campos[0].value = event.fechaJusti;
    // tarjeta.campos[1].value = event.estado;
    //     }​​​​​
    // if (event.tarjeta == 'sjcsDesigActuaOfiDatFac') {​​​​​
    // tarjeta.campos[0].value = event.partida;
    //     }​​​​​
  }

  actualizaFicha(event) {
    this.campos = event;
    this.progressSpinner = true;
    let designaItem = this.campos;

    this.getPermiteTurno();
    this.searchLetrados();
    if (sessionStorage.getItem("datosProcurador")) {
      this.listaTarjetas[5].opened = true;
    }

    if (sessionStorage.getItem("buscadorColegiados")) {
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
      this.listaTarjetas[0].opened = true;
    } else if (sessionStorage.getItem("colegiadoGeneralDesigna")) {
      let colegiadoGeneral = JSON.parse(sessionStorage.getItem("colegiadoGeneralDesigna"));
      this.listaTarjetas[0].opened = true;
    }
    if (designaItem.estado == 'V') {
      designaItem.sufijo = designaItem.estado;
      designaItem.estado = 'Activo';
    } else if (designaItem.estado == 'F') {
      designaItem.sufijo = designaItem.estado;
      designaItem.estado = 'Finalizado';
    } else if (designaItem.estado == 'A') {
      designaItem.sufijo = designaItem.estado;
      designaItem.estado = 'Anulada';
    }
    //EDICIÓN DESIGNA
    let camposResumen = [
      {
        "key": "Año/Número",
        "value": designaItem.ano
      },
      {
        "key": "Letrado",
        "value": designaItem.numColegiado
      },
      {
        "key": "Estado",
        "value": designaItem.estado
      },
      {
        "key": "Interesado",
        "value": this.nombreInteresado
      },
      {
        "key": "Número Actuaciones",
        "value": ""
      },
      {
        "key": "Validado",
        "value": designaItem.validada
      }
    ];

    let camposGenerales = [
      {
        "key": "Turno",
        "value": designaItem.nombreTurno
      },
      {
        "key": "Fecha",
        "value": designaItem.fechaEntradaInicio
      },
      {
        "key": "Designación Art. 27-28",
        "value": designaItem.art27
      }, {
        "key": "Tipo",
        "value": designaItem.descripcionTipoDesigna
      }
    ];

    let camposDetalle = [
      {
        "key": "Número Procedimiento",
        "value": designaItem.numProcedimiento
      },
      {
        "key": "Juzgado",
        "value": designaItem.nombreJuzgado
      },
      {
        "key": "Procedimiento",
        "value": designaItem.nombreProcedimiento
      },
      {
        "key": "Módulo",
        "value": designaItem.modulo
      }
    ];
    if ((designaItem.observaciones == null || designaItem.observaciones == undefined || designaItem.observaciones == "")
      && (designaItem.delitos == null || designaItem.delitos == undefined || designaItem.delitos == "")
      && (designaItem.defensaJuridica == null || designaItem.defensaJuridica == undefined || designaItem.defensaJuridica == "")
      && (designaItem.fechaOficioJuzgado == null || designaItem.fechaOficioJuzgado == undefined)
      && (designaItem.fechaJuicio == null || designaItem.fechaJuicio == undefined)
      && (designaItem.fechaRecepcionColegio == null || designaItem.fechaRecepcionColegio == undefined)) {
      let datosAdicionales = [
        {
          "key": null,
          "value": "No existen observaciones definidas para la designación"
        }
      ];
      this.listaTarjetas[2].campos = datosAdicionales;
    } else {
      let datosAdicionales = [
        {
          "key": "Fecha Oficio Juzgado",
          "value": this.formatDate(designaItem.fechaOficioJuzgado)
        },
        {
          "key": "Fecha Reecepción Colegio",
          "value": this.formatDate(designaItem.fechaRecepcionColegio)
        },
        {
          "key": "Fecha Juicio",
          "value": this.formatDateWithHours(designaItem.fechaJuicio)
        }
      ];
      this.listaTarjetas[2].campos = datosAdicionales;

    }

    this.tarjetaFija.campos = camposResumen;
    this.listaTarjetas[0].campos = camposGenerales;
    this.listaTarjetas[1].campos = camposDetalle;
    this.listaTarjetas[1].detalle = true;
    this.listaTarjetas[2].detalle = true;
    this.listaTarjetas[3].detalle = true;
    this.listaTarjetas[4].detalle = true;
    this.listaTarjetas[5].detalle = true;
    this.listaTarjetas[6].detalle = true;
    this.listaTarjetas[7].detalle = true;
    this.listaTarjetas[8].detalle = true;
    this.listaTarjetas[9].detalle = true;
    this.listaTarjetas[10].detalle = true;
    this.listaTarjetas[11].detalle = true;

    this.getIdPartidaPresupuestaria(this.campos);
    this.progressSpinner = false;
  }

  getDocumentosDesigna() {
    this.progressSpinner = true;

    let params = {
      anio: this.campos.ano.toString().split('/')[0].replace('D', ''),
      numero: this.campos.numero,
      idTurno: this.campos.idTurno
    };

    this.sigaServices.post("designacion_getDocumentosPorDesigna", params).subscribe(
      data => {

        let resp: DocumentoDesignaObject = JSON.parse(data.body);
        this.documentos = resp.listaDocumentoDesignaItem;

        if (this.documentos != undefined && this.documentos != null) {

          let tarj = this.listaTarjetas.find(el => el.id == 'sjcsDesigDoc');

          if (this.documentos.length == 0) {

            tarj.campos = [];
            tarj.campos.push({
              key: null,
              value: 'No existe documentación asociada a la designación'
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
      },
      () => {
        this.progressSpinner = false;
      }
    );

  }

  getPermiteTurno() {

    this.progressSpinner = true;

    let turnoItem = new TurnosItem();
    turnoItem.idturno = this.campos.idTurno.toString();

    this.sigaServices.post("turnos_busquedaFichaTurnos", turnoItem).subscribe(
      data => {
        let resp: TurnosItem = JSON.parse(data.body).turnosItem[0];
        this.permiteTurno = resp.letradoactuaciones == "1";
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );

  }

  changeDataDatosFacEvent(event) {
    let camposFacturacion = [
      {
        "key": "Partida Presupuestaria",
        "value": this.campos.nombrePartida
      }
    ];
    this.listaTarjetas[11].campos = camposFacturacion;
  }
}
