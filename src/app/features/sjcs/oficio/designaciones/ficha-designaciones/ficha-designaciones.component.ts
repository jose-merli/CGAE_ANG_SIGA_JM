import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { ActuacionDesignaItem } from '../../../../../models/sjcs/ActuacionDesignaItem';
import { ActuacionDesignaObject } from '../../../../../models/sjcs/ActuacionDesignaObject';
import { Message } from 'primeng/api';
import { Row, DetalleTarjetaProcuradorFichaDesignaionOficioService } from './detalle-tarjeta-procurador-designa/detalle-tarjeta-procurador-ficha-designaion-oficio.service';
import { ProcuradorItem } from '../../../../../models/sjcs/ProcuradorItem';
import { DetalleTarjetaContrariosFichaDesignacionOficioComponent } from './detalle-tarjeta-contrarios-designa/detalle-tarjeta-contrarios-ficha-designacion-oficio.component';
import { DetalleTarjetaInteresadosFichaDesignacionOficioComponent } from './detalle-tarjeta-interesados-designa/detalle-tarjeta-interesados-ficha-designacion-oficio.component';
import { CommonsService } from '../../../../../_services/commons.service';
import { Router } from '@angular/router';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';

@Component({
  selector: 'app-ficha-designaciones',
  templateUrl: './ficha-designaciones.component.html',
  styleUrls: ['./ficha-designaciones.component.scss']
})
export class FichaDesignacionesComponent implements OnInit {

  designaItem = JSON.parse(sessionStorage.getItem("designaItemLink"));
  procurador;
  showModal2 = false;
  showModal3 = false;
  listaPrueba = [];


  @ViewChild(DetalleTarjetaContrariosFichaDesignacionOficioComponent) tarjetaContrarios;
  @ViewChild(DetalleTarjetaInteresadosFichaDesignacionOficioComponent) tarjetaInteresados;

  rutas: string[] = ['SJCS', 'EJGS'];
  campos: DesignaItem = new DesignaItem();
  comboRenuncia: any;
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
      /* campos: [
         {
           "key": "Nº Colegiado",
           "value": this.procurador[0].nColegiado
         },
         {
           "key": "Nombre",
           "value": this.procurador[0].nombre
         },
         {
           "key": "Fecha designación",
           "value": this.procurador[0].fechaDesigna
         }
       ]*/
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

  selectedArray = [];
  seleccionarTodo = false;
  totalRegistros = 0;
  rowGroups: Row[];
  rowGroupsAux: Row[];
  selectedRow: Row;
  cabeceras = [
    { id: "fechadesigna", name: "dato.jgr.guardia.saltcomp.fecha" },
    { id: "numerodesignacion", name: "justiciaGratuita.ejg.datosGenerales.annioNum" },
    { id: "nColegiado", name: "censo.resultadosSolicitudesModificacion.literal.nColegiado" },
    { id: "nombre", name: "justiciaGratuita.oficio.designas.contrarios.procurador" },
    { id: "motivo", name: "censo.datosHistorico.literal.motivo" },
    { id: "observaciones", name: "censo.nuevaSolicitud.observaciones" },
    { id: "fecharenunciasolicita", name: "formacion.busquedaInscripcion.fechaSolicitud" },
    { id: "fechabaja", name: "administracion.auditoriaUsuarios.literal.fechaEfectiva" },
  ];

  actuacionesDesignaItems: ActuacionDesignaItem[] = [];

  constructor(private location: Location,
    private translateService: TranslateService, private sigaServices: SigaServices, private datepipe: DatePipe,
    private gbtservice: DetalleTarjetaProcuradorFichaDesignaionOficioService,
    private commonsService: CommonsService, private router: Router) { }

  ngOnInit() {
    this.progressSpinner=true;
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    let designaItem = JSON.parse(sessionStorage.getItem("designaItemLink"));
    this.campos = designaItem;
    this.motivosRenuncia();

    if (sessionStorage.getItem("nuevoProcurador")) {
      this.listaTarjetas[5].opened = true;
    }

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
          "value": designaItem.estado
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

      
      // this.searchContrarios(false);
      /* this.listaTarjetas[4].enlaces=[{
      id: null,
          ref: null,
          nombre: this.translateService.instant('justiciaGratuita.oficio.designas.contrarios.vacio')
      }] */
      //Actualizar para que los campos se rellenen en base a la tabla de la tarjeta interesados
      this.searchInteresados();
      this.searchContrarios(false);
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
    this.progressSpinner=false;
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

    let params = {
      anio: this.campos.ano.toString().split('/')[0].replace('D', ''),
      idTurno: this.campos.idTurno,
      numero: this.campos.codigo,
      historico: historico,
      idPersonaColegiado: ''
    };

    // if (!this.permisoEscritura) {
    //   params.idPersonaColegiado = '';
    // }

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

  motivosRenuncia() {
    this.progressSpinner = true;

    this.sigaServices.get("designaciones_motivosRenuncia").subscribe(
      n => {
        this.comboRenuncia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboRenuncia);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  mostrar() {
    let procurador = [this.campos.numColegiado, String(this.campos.idInstitucion)];
    this.sigaServices.post("designaciones_busquedaProcurador", procurador).subscribe(
      n => {
        this.procurador = JSON.parse(n.body).procuradorItems;
        this.procurador.forEach(element => {
          element.fechaDesigna = this.formatDate(element.fechaDesigna);
          element.fecharenunciasolicita = this.formatDate(element.fecharenunciasolicita);
        });
        this.jsonToRow(this.procurador);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  jsonToRow(datos) {
    let arr = [];
    let x = 0;

    datos.forEach((element, index) => {
      if (x == 0) {
        let obj = [
          { type: 'datePicker', value: element.fechaDesigna },
          { type: 'input', value: element.numerodesignacion },
          { type: 'text', value: element.nColegiado },
          { type: 'text', value: element.apellido1 + " " + element.apellido2 + ", " + element.nombre },
          { type: 'text', value: element.motivosRenuncia },
          { type: 'text', value: element.observaciones },
          { type: 'datePicker', value: element.fecharenunciasolicita },
          { type: 'text', value: element.fechabaja }
        ];
        let superObj = {
          id: index,
          row: obj
        };

        arr.push(superObj);
        x = 1;
      } else {
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

  nuevo() {
    sessionStorage.setItem("nuevoProcurador", "true");
    this.router.navigate(["/busquedaGeneral"]);
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
    this.compruebaProcurador(array2[0]);
  }

  cerrarModal(){
    this.showModal2 = false;
    this.showModal3 = false;
  }
  
  compruebaProcurador(event) {
    this.progressSpinner = true;

    this.listaPrueba = [];

    this.listaPrueba.push(event[0],event[1],event[2],event[3],event[4],event[5],event[6]);

  this.sigaServices.post("designaciones_comprobarProcurador", event[1]).subscribe(
    data => {

        if(data.body.procuradorItems != undefined){
          this.showModal2 = true;
        }else{
          this.guardarProcurador(this.listaPrueba);
        }
        this.progressSpinner = false;
  },
  err => {
    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
      this.progressSpinner = false;
    }
  );
  }

  comprobarFechaProcurador(){
    this.progressSpinner = true;

    this.sigaServices.post("designaciones_comprobarProcurador", event[1]).subscribe(
      data => {
          console.log(data);
          if(data.body.procuradorItems != undefined){
            this.showModal3 = true;
          }else{
            this.guardarProcurador(this.listaPrueba);
          }
          this.progressSpinner = false;
    },
    err => {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }
  
  guardarProcurador(event) {
    this.progressSpinner = true;

    event.push(String(this.campos.idInstitucion));
    event.push(this.campos.numColegiado);

    this.sigaServices.post("designaciones_guardarProcurador", event).subscribe(
      data => {
          this.showMessage("succes", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.progressSpinner = false;
    },
    err => {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
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
