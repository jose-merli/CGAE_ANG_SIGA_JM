import { Component, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { ActuacionDesignaItem } from '../../../../../models/sjcs/ActuacionDesignaItem';
import { ActuacionDesignaObject } from '../../../../../models/sjcs/ActuacionDesignaObject';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-ficha-designaciones',
  templateUrl: './ficha-designaciones.component.html',
  styleUrls: ['./ficha-designaciones.component.scss']
})
export class FichaDesignacionesComponent implements OnInit {

  rutas: string[] = ['SJCS', 'EJGS'];
  campos: any;
  nuevaDesigna: any;
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
      campos: [
        {
          "key": "Número Procedimiento",
          "value": "2008/675432"
        },
        {
          "key": "Juzgado",
          "value": "Juzgado de lo social N1 BADAJOZ"
        },
        {
          "key": "Procedimiento",
          "value": "CONTENCIOSO ADMINISTRATIVO"
        },
        {
          "key": "Módulo",
          "value": "SSDF XXXXXXXXX"
        }
      ]
    },
    {
      id: 'sjcsDesigDatAdicionales',
      nombre: "Datos Adicionales",
      imagen: "",
      icono: 'fa fa-university',
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Fecha Oficio Juzgado",
          "value": "01/09/2019"
        },
        {
          "key": "Fecha Reecepción Colegio",
          "value": "03/09/2019"
        },
        {
          "key": "Fecha Juicio",
          "value": "10/09/2019"
        }
      ]
    },
    {
      id: 'sjcsDesigInt',
      nombre: "Interesados",
      imagen: "",
      icono: "fa fa-users",
      detalle: true,
      fixed: false,
      opened: false,
      campos: [
        {
          "key": "Identificación",
          "value": "76543287T"
        },
        {
          "key": "Nombre",
          "value": "sfsd dfgdg, Juan"
        }
      ]
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

  actuacionesDesignaItems: ActuacionDesignaItem[];
  progressSpinner: boolean = false;
  msgs: Message[] = [];

  constructor(private location: Location,
    private translateService: TranslateService, private sigaServices: SigaServices, private datepipe: DatePipe) { }

  ngOnInit() {
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    let designaItem = JSON.parse(sessionStorage.getItem("designaItemLink"));
    this.campos = designaItem;

    if (!this.nuevaDesigna) {
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
          "value": designaItem.nombreTurno
        },
        {
          "key": "Fecha",
          "value": designaItem.fechaAlta
        },
        {
          "key": "Designación Art. 27-28",
          "value": "NO"
        }, {
          "key": "Tipo",
          "value": designaItem.descripcionTipoDesigna
        }
      ];

      this.tarjetaFija.campos = camposResumen;
      this.listaTarjetas[0].campos = camposGenerales;
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
      /* this.listaTarjetas[4].enlaces=[{
      id: null,
          ref: null,
          nombre: this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.vacio')
      }] */
    } else {
      //NUEVA DESIGNA
    }

    this.getActuacionesDesigna(false);

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

  clear() {
    this.msgs = [];
  }

  showMessage(msg: Message) {
    this.msgs = [];
    this.msgs.push({
      severity: msg.severity,
      summary: msg.summary,
      detail: msg.detail
    });
  }

  getActuacionesDesigna(historico: boolean) {

    this.progressSpinner = true;

    const params = {
      anio: this.campos.ano.split('/')[0].replace('D', ''),
      idTurno: this.campos.idTurno,
      numero: this.campos.codigo,
      historico: historico
    };

    this.sigaServices.post("actuaciones_designacion", params).subscribe(
      data => {
        this.progressSpinner = false;

        let object: ActuacionDesignaObject = JSON.parse(data.body);

        if (object.error != null && object.error.description != null) {
          this.showMessage({ severity: 'error', summary: 'Error', detail: object.error.description.toString() });
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
          total = validadas + facturadas + justificadas;
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

}
