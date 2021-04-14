import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import{ DetalleTarjetaContrariosFichaDesignacionOficioComponent } from './detalle-tarjeta-contrarios-ficha-designacion-oficio/detalle-tarjeta-contrarios-ficha-designacion-oficio.component';

@Component({
  selector: 'app-ficha-designaciones',
  templateUrl: './ficha-designaciones.component.html',
  styleUrls: ['./ficha-designaciones.component.scss']
})
export class FichaDesignacionesComponent implements OnInit {


  @ViewChild(DetalleTarjetaContrariosFichaDesignacionOficioComponent) tablaContrarios;

  rutas: string[] = ['SJCS', 'EJGS'];
  campos: any;
  nuevaDesigna: any;
  progressSpinner:boolean = false;
  contrarios: any;
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
      campos: [
        {
          "key": "Nº total",
          "value": "5"
        }
      ]
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

  constructor( private location: Location, 
    private  translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    let designaItem = JSON.parse(sessionStorage.getItem("designaItemLink"));
    this.campos = designaItem;

    if(!this.nuevaDesigna){
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
      this.searchContrarios(false);  
      
    /* this.listaTarjetas[4].enlaces=[{
    id: null,
        ref: null,
        nombre: this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.vacio')
    }] */
    }else{
      //NUEVA DESIGNA
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

  searchContrarios(event){
    this.progressSpinner = true;
    let data = sessionStorage.getItem("designaItemLink");
    let designaItem = JSON.parse(data);

    let item = [designaItem.idTurno.toString(), designaItem.nombreTurno,  designaItem.numero.toString() , designaItem.ano, event];
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
        if(this.listaTarjetas[4].campos.length==0){
          if(this.contrarios.length==0){
            this.listaTarjetas[4].campos=[{
                "key": null,
                "value": this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.vacio')
              },]
          }
          
          else{this.listaTarjetas[4].campos = [
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
      }
      if (this.tablaContrarios != undefined) {
        this.tablaContrarios.tabla.sortOrder = 0;
        this.tablaContrarios.tabla.sortField = '';
        this.tablaContrarios.tabla.reset();
        this.tablaContrarios.buscadores = this.tablaContrarios.buscadores.map(it => it = "");
      }
      if (this.tablaContrarios != null && this.tablaContrarios != undefined) {
        this.tablaContrarios.historico = event;
      }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      });
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
