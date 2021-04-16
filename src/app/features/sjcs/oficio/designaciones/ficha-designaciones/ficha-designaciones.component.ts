import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { TranslateService } from '../../../../../commons/translate';
import { Row, DetalleTarjetaProcuradorFichaDesignaionOficioService } from './detalle-tarjeta-procurador-ficha-designacion-oficio/detalle-tarjeta-procurador-ficha-designaion-oficio.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { ProcuradorItem } from '../../../../../models/sjcs/ProcuradorItem';

@Component({
  selector: 'app-ficha-designaciones',
  templateUrl: './ficha-designaciones.component.html',
  styleUrls: ['./ficha-designaciones.component.scss']
})
export class FichaDesignacionesComponent implements OnInit {
  
  designaItem = JSON.parse(sessionStorage.getItem("designaItemLink"));
  procurador: ProcuradorItem=new ProcuradorItem();

  rutas: string[] = ['SJCS', 'EJGS'];
  campos: DesignaItem=new DesignaItem();
  procuradores: any;
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
          "value": this.designaItem.numColegiado
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
  progressSpinner: boolean = false;

  constructor( private location: Location, 
    private  translateService: TranslateService,
    private sigaServices: SigaServices,
    private gbtservice : DetalleTarjetaProcuradorFichaDesignaionOficioService,
    ) { }

  ngOnInit() {
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    let designaItem = JSON.parse(sessionStorage.getItem("designaItemLink"));
    this.campos = designaItem;
    this.mostrar();

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

  modDatos(event){
    console.log(event);
  
    let array = [];
    let array2 = [];
  
    event.forEach(element => {
      element.cells.forEach(dato => {
        array.push(dato.value);
      });
      array2.push(array);
      array=[];
    });
    console.log(array);
    console.log(array2);
    //this.guardar(array2);
  }

  mostrar(){
    console.log(this.campos);
    let procurador = [this.campos.numColegiado,String(this.campos.idInstitucion)];
      this.sigaServices.post("designaciones_busquedaProcurador", procurador ).subscribe(
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

jsonToRow(datos){
  console.log(datos);
  let arr = [];

  datos.forEach((element, index) => {
      let obj = [
        { type: 'text', value: element.ncolegiado},
        { type: 'text', value: element.apellidos1 +" "+ element.apellidos2 + ", " + element.nombre},
        { type: 'text', value: element.tiponombre},
        { type: 'text', value: element.descripcion},
        { type: 'text', value: element.fechadesde},
        { type: 'text', value: element.fechahasta},
        { type: 'text', value: element.fechaalta},
        { type: 'text', value: element.validado},
        { type: 'text', value: element.fechaestado},
        { type: 'text', value: element.idpersona},
        { type: 'text', value: element.fechabt},
        { type: 'text', value: element.nuevo}
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
}
