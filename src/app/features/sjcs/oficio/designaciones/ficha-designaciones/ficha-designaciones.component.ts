import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { ActuacionDesignaItem } from '../../../../../models/sjcs/ActuacionDesignaItem';
import { ActuacionDesignaObject } from '../../../../../models/sjcs/ActuacionDesignaObject';
import { Message } from 'primeng/api';
import { Row, DetalleTarjetaProcuradorFichaDesignaionOficioService } from './detalle-tarjeta-procurador-ficha-designacion-oficio/detalle-tarjeta-procurador-ficha-designaion-oficio.service';
import { ProcuradorItem } from '../../../../../models/sjcs/ProcuradorItem';
import { DetalleTarjetaContrariosFichaDesignacionOficioComponent } from './detalle-tarjeta-contrarios-ficha-designacion-oficio/detalle-tarjeta-contrarios-ficha-designacion-oficio.component';
import { DetalleTarjetaInteresadosFichaDesignacionOficioComponent } from './detalle-tarjeta-interesados-ficha-designacion-oficio/detalle-tarjeta-interesados-ficha-designacion-oficio.component';

@Component({
  selector: 'app-ficha-designaciones',
  templateUrl: './ficha-designaciones.component.html',
  styleUrls: ['./ficha-designaciones.component.scss']
})
export class FichaDesignacionesComponent implements OnInit {

  designaItem = JSON.parse(sessionStorage.getItem("designaItemLink"));
  procurador: ProcuradorItem = new ProcuradorItem();


  @ViewChild(DetalleTarjetaContrariosFichaDesignacionOficioComponent) tarjetaContrarios;
  @ViewChild(DetalleTarjetaInteresadosFichaDesignacionOficioComponent) tarjetaInteresados;

  rutas: string[] = ['SJCS', 'EJGS'];
  campos: DesignaItem = new DesignaItem();
  procuradores: any;
  nuevaDesigna: any;
  progressSpinner: boolean = false;
  contrarios: any;
  interesados: any;
  msgs;
  tarjetaFija = {
    nombre: "Información Resumen",
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
      campos: [
        {
          "key": "Nº Colegiado",
          "value": ""
        },
        {
          "key": "Nombre",
          "value": "MIGUEL HFGSGS AJSKFI"
        },
        {
          "key": "Fecha designación",
          "value": "02/07/2007"
        }
      ]
    },
    {
      id: 'sjcsDesigCamb',
      nombre: "Cambio Letrado",
      imagen: "",
      icono: "fa fa-graduation-cap",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
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
        }
      ],
      enlaces: [],
      enlaceCardClosed: { href: '/fichaColegiado', title: 'Ficha colegial' }
    },
    {
      id: 'sjcsDesigRel',
      nombre: "Relaciones",
      imagen: "",
      icono: "fas fa-link",
      detalle: false,
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
      campos: [
        {
          "key": "Nº total de Comunicaciones",
          "value": "54"
        }
      ]
    },
    {
      id: 'sjcsDesigDoc',
      nombre: "Documentación",
      imagen: "",
      icono: "fa fa-briefcase",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Nº total de Documentos",
          "value": "7"
        }
      ]
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
        {
          "key": "Partida Presupuestaria",
          "value": "frfr frfrgtg ththth"
        },
      ]
    },
  ];

  seleccionarTodo = false;
  totalRegistros = 0;
  rowGroups: Row[];
  rowGroupsAux: Row[];
  selectedRow: Row;
  cabeceras = [
    { id: "fecha", name: "dato.jgr.guardia.saltcomp.fecha" },
    { id: "aninum", name: "justiciaGratuita.ejg.datosGenerales.annioNum" },
    { id: "nColegiado", name: "censo.resultadosSolicitudesModificacion.literal.nColegiado" },
    { id: "nombre", name: "justiciaGratuita.oficio.designas.contrarios.procurador" },
    { id: "motivo", name: "censo.datosHistorico.literal.motivo" },
    { id: "observaciones", name: "censo.nuevaSolicitud.observaciones" },
    { id: "fechasolicitud", name: "formacion.busquedaInscripcion.fechaSolicitud" },
    { id: "fechaefectiva", name: "administracion.auditoriaUsuarios.literal.fechaEfectiva" },
  ];

  actuacionesDesignaItems: ActuacionDesignaItem[] = [];

  constructor(private location: Location,
    private translateService: TranslateService, private sigaServices: SigaServices, private datepipe: DatePipe, private gbtservice: DetalleTarjetaProcuradorFichaDesignaionOficioService) { }

  ngOnInit() {
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    let designaItem = JSON.parse(sessionStorage.getItem("designaItemLink"));
    this.campos = designaItem;
    if (sessionStorage.getItem("buscadorColegiados")) {
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
      // sessionStorage.removeItem("buscadorColegiados");
      this.listaTarjetas[0].opened = true;
    } else if (sessionStorage.getItem("colegiadoGeneralDesigna")) {
      let colegiadoGeneral = JSON.parse(sessionStorage.getItem("colegiadoGeneralDesigna"));
      this.listaTarjetas[0].opened = true;
    }
    if (!this.nuevaDesigna) {
      this.mostrar();
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
          "value": designaItem.art27
        },
        {
          "key": "Interesado",
          "value": designaItem.nombreInteresado
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
          "value": designaItem.nombreTurno
        },
        {
          "key": "Fecha",
          "value": designaItem.fechaEntradaInicio
        },
        {
          "key": "Designación Art. 27-28",
          "value": "NO"
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
          "value": designaItem.idJuzgado
        },
        {
          "key": "Procedimiento",
          "value": designaItem.idPretension
        },
        {
          "key": "Módulo",
          "value": designaItem.idProcedimiento
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
            "value": designaItem.fechaOficioJuzgado
          },
          {
            "key": "Fecha Reecepción Colegio",
            "value": designaItem.fechaRecepcionColegio
          },
          {
            "key": "Fecha Juicio",
            "value": designaItem.fechaJuicio
          }
        ];
        this.listaTarjetas[2].campos = datosAdicionales;
      }

      this.tarjetaFija.campos = camposResumen;
      this.listaTarjetas[0].campos = camposGenerales;
      this.listaTarjetas[1].campos = camposDetalle;

      //Actualizar para que los campos se rellenen en base a la tabla de la tarjeta contrarios
      this.listaTarjetas[4].campos = [
        {
          "key": null,
          "value": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.vacio')
        },
        {
          "key": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.identificadorprimero'),
          "value": designaItem.nombreTurno
        },
        {
          "key": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.apellidosnombreprimero'),
          "value": designaItem.fechaAlta
        },
        {
          "key": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.abogadoprimero'),
          "value": "NO"
        }, {
          "key": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.procuradorprimero'),
          "value": designaItem.descripcionTipoDesigna
        }, {
          "key": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.ncontrarios'),
          "value": designaItem.descripcionTipoDesigna
        }
      ]
      // this.searchContrarios(false);
      /* this.listaTarjetas[4].enlaces=[{
      id: null,
          ref: null,
          nombre: this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.vacio')
      }] */
      this.progressSpinner = false;
    } else {

      this.searchContrarios(false);
      /* this.listaTarjetas[4].enlaces=[{
      id: null,
          ref: null,
          nombre: this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.vacio')
      }] */
      //Actualizar para que los campos se rellenen en base a la tabla de la tarjeta interesados
      this.searchInteresados();
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
          "value": ""
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

      //DESHABILITAMOS TODAS LAS TARJETAS HASTA Q SE CREE LA DESIGNACION
      // this.listaTarjetas[1].detalle = false;
      // this.listaTarjetas[2].detalle = false;
      // this.listaTarjetas[3].detalle = false;
      // this.listaTarjetas[4].detalle = false;
      // this.listaTarjetas[5].detalle = false;
      // this.listaTarjetas[6].detalle = false;
      // this.listaTarjetas[7].detalle = false;
      // this.listaTarjetas[8].detalle = false;
      // this.listaTarjetas[9].detalle = false;
      // this.listaTarjetas[10].detalle = false;
      // this.listaTarjetas[11].detalle = false;
      /* this.listaTarjetas[4].enlaces=[{
      id: null,
          ref: null,
          nombre: this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.vacio')
      }] */

      this.progressSpinner = false;
    }
    this.getActuacionesDesigna(false);

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

  clear() {
    this.msgs = [];
  }

  getActuacionesDesigna(historico: boolean) {

    this.progressSpinner = true;

    const params = {
      anio: this.campos.ano.toString().split('/')[0].replace('D', ''),
      idTurno: this.campos.idTurno,
      numero: this.campos.codigo,
      historico: historico
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

            if (el.validada) {
              validadas += 1;
            }

            if (el.facturado) {
              facturadas += 1;
            }

            if (el.fechaJustificacion != '') {
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
            console.log("🚀 ~ file: ficha-designaciones.component.ts ~ line 416 ~ FichaDesignacionesComponent ~ getActuacionesDesigna ~ this.actuacionesDesignaItems", this.actuacionesDesignaItems)
          }
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );
  }

  modDatos(event) {
    console.log(event);

    let array = [];
    let array2 = [];

    event.forEach(element => {
      element.cells.forEach(dato => {
        array.push(dato.value);
      });
      array2.push(array);
      array = [];
    });
  }

  mostrar() {
    console.log(this.campos);
    let procurador = [this.campos.numColegiado, String(this.campos.idInstitucion)];
    this.sigaServices.post("designaciones_busquedaProcurador", procurador).subscribe(
      n => {
        this.procurador = JSON.parse(n.body).ProcuradoresItem;
        this.procuradores.forEach(element => {

          element.ncolegiado = +element.ncolegiado;
        });

        //this.jsonToRow(this.procuradores);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );
  }

  jsonToRow(datos) {
    console.log(datos);
    let arr = [];

    datos.forEach((element, index) => {
      let obj = [
        { type: 'text', value: element.ncolegiado },
        { type: 'text', value: element.apellidos1 + " " + element.apellidos2 + ", " + element.nombre },
        { type: 'text', value: element.numerodesignacion },
        { type: 'text', value: element.fechadesigna },
        { type: 'text', value: element.observaciones },
        { type: 'text', value: element.observaciones },
        { type: 'text', value: element.fechaalta },
        { type: 'text', value: element.fecharenunciasolicita },
        { type: 'text', value: element.fecharenunciaefectiva }
      ];
      let superObj = {
        id: index,
        row: obj
      };

      arr.push(superObj);
    });
    this.rowGroups = this.gbtservice.getTableData(arr);
    this.rowGroupsAux = this.gbtservice.getTableData(arr);
    this.totalRegistros = this.rowGroups.length;
  }
  /*
  guardarProcurador(event){
    let array = [];
    event.forEach(element => {
      if(this.datos[element].validado == "Pendiente"){
        if(this.datos[element].fechadesde != null){
          this.datos[element].fechadesde=this.transformaFecha(this.datos[element].fechadesde);
        }
        if(this.datos[element].fechahasta != null){
          this.datos[element].fechahasta=this.transformaFecha(this.datos[element].fechahasta);
        }
        if(this.datos[element].fechaalta != null){
          this.datos[element].fechaalta=this.transformaFecha(this.datos[element].fechaalta);
        }
        if(this.datos[element].fechabt != null){
          this.datos[element].fechabt=this.transformaFecha(this.datos[element].fechabt);
        }
        if(this.datos[element].fechaestado != null){
          this.datos[element].fechaestado=this.transformaFecha(this.datos[element].fechaestado);
        }
        this.datos[element].validado = "Validada";
        let tmp = this.datos[element];
        delete tmp.tiponombre;
        array.push(tmp);
      }else{
        this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.message.error.realiza.accion")});
        this.progressSpinner = false;
      }
    });
    this.updateBaja(array);
  }
  */

  updateProcurador(event) {
    this.progressSpinner = true;

    this.sigaServices.post("designaciones_guardarProcurador", event).subscribe(
      data => {
        let error = JSON.parse(data.body).error;
        this.showMessage("info", this.translateService.instant("general.message.correct"), error.description);
        this.progressSpinner = false;
      },
      err => {
        let error = JSON.parse(err.body).error;
        this.showMessage("info", this.translateService.instant("general.message.incorrect"), error.description);
        this.progressSpinner = false;
      }
    );
  }

  searchContrarios(event) {
    this.progressSpinner = true;
    let data = sessionStorage.getItem("designaItemLink");
    let designaItem = JSON.parse(data);

    let item = [designaItem.idTurno.toString(), designaItem.nombreTurno, designaItem.numero.toString(), designaItem.ano, event];
    /* ano: "D2021/4330"
nombreTurno: "ZELIMINAR-CIJAECI05 - MATRIMONIAL CONTENCIOSO JAÉN" */

    this.sigaServices.post("designaciones_listaContrarios", item).subscribe(
      n => {

        this.contrarios = JSON.parse(n.body);
        let primero = this.contrarios[0];
        //Columnas a obtener:
        //Identificador: nif/pasaporte del id persona del contrario. A partir de SCS_CONTRARIOSDESIGNA.IDPERSONA.
        //Apellido, nombre de dicha persona. A partir de SCS_CONTRARIOSDESIGNA.IDPERSONA.
        //nº colegiado, apellidos y nombre del abogado del contrario. Extraer de las columnas IDABOGADOCONTRARIO y NOMBREABOGADOCONTRARIO de SCS_CONTRARIOSDESIGNA.
        //nº colegiado, apellidos y nombre del procurador del contrario. SCS_CONTRARIOSDESIGNA.IDPROCURADOR

        let error = JSON.parse(n.body).error;

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
        console.log(err);
      });
  }

  searchInteresados() {
    this.progressSpinner = true;
    let data = sessionStorage.getItem("designaItemLink");
    let designaItem = JSON.parse(data);

    let item = [designaItem.idTurno.toString(), designaItem.nombreTurno, designaItem.numero.toString(), designaItem.ano];
    /* ano: "D2021/4330"
nombreTurno: "ZELIMINAR-CIJAECI05 - MATRIMONIAL CONTENCIOSO JAÉN" */

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
        }
        if (this.tarjetaInteresados != undefined) {
          this.tarjetaInteresados.tabla.sortOrder = 0;
          this.tarjetaInteresados.tabla.sortField = '';
          this.tarjetaInteresados.tabla.reset();
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );

  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

}
