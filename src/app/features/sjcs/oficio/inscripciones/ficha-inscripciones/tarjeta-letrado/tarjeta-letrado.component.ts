import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { Location, DatePipe } from '@angular/common';
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Subject } from "rxjs/Subject";
import { DatosGeneralesConsultaItem } from '../../../../../../models/DatosGeneralesConsultaItem';
import { DestinatariosItem } from '../../../../../../models/DestinatariosItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PrisionItem } from '../../../../../../models/sjcs/PrisionItem';
import { TurnosItems } from '../../../../../../models/sjcs/TurnosItems';
import { ModulosItem } from '../../../../../../models/sjcs/ModulosItem';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { InscripcionesItems } from '../../../../../../models/sjcs/InscripcionesItems';
@Component({
  selector: "app-tarjeta-letrado",
  templateUrl: "./tarjeta-letrado.component.html",
  styleUrls: ["./tarjeta-letrado.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TarjetaLetradoComponent implements OnInit {
  // datos;
  openFicha: boolean = true;
  body: InscripcionesItems = new InscripcionesItems();
  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  nuevo: boolean = false;
  msgs;
  historico;
  procedimientos;
  textFilter;
  showTarjeta: boolean = true;
  cols: any[];
  esComa: boolean = false;
  textSelected: String = "{label}";
  disableAll: boolean = false;
  jurisdicciones: any[] = [];
  areas: any[] = [];
  tiposturno: any[] = [];
  turnosItem2;
  permisosTarjeta: boolean = true;
  permisosTarjetaResumen: boolean = true;
  zonas: any[] = [];
  rowsPerPage: any = [];
  subzonas: any[] = [];
  materias: any[] = [];
  partidas: any[] = [];
  partidoJudicial: string;
  grupofacturacion: any[] = [];
  partidasJudiciales: any[] = [];
  isDisabledMateria: boolean = false;
  datosColaOficio;
  comboPJ
  datos2;
  datos3;
  datosContacto;
  tipoturnoDescripcion;
  jurisdiccionDescripcion;
  partidaPresupuestaria;
  MateriaDescripcion
  isDisabledSubZona: boolean = false;
  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "configuracion",
      activa: false
    },
  ];
  @Output() datosSend = new EventEmitter<any>();

  @Output() datosSend2 = new EventEmitter<any>();

  @Output() modoEdicionSend = new EventEmitter<any>();

  @ViewChild("importe") importe;
  //Resultados de la busqueda

  @Input() datos: InscripcionesItems;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private datepipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.datos != undefined) {
      if (this.datos.idpersona != undefined) {
        this.body = this.datos;

        if (this.body.idpersona == undefined) {
          this.modoEdicion = false;
        } else {
          if (this.datos.fechabaja != undefined) {
            this.disableAll = true;
          }
          this.modoEdicion = true;
          this.cargarTarjetaResumen();
        }

      }
    } else {
      this.partidoJudicial = "";
      this.datos = new InscripcionesItems();
    }
  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }
  ngOnInit() {
    this.commonsService.checkAcceso(procesos_oficio.tarjetaLetrado)
      .then(respuesta => {
        this.permisosTarjeta = respuesta;
        if (this.permisosTarjeta != true) {
          this.permisosTarjeta = false;
        } else {
          this.permisosTarjeta = true;
        }
      }).catch(error => console.error(error));
      this.cols = [
        {
          field: "tipo",
          header: "censo.consultaDatosGenerales.literal.tipoCliente"
        },
        {
          field: "valor",
          header: "administracion.parametrosGenerales.literal.valor"
        }
      ];
  
      this.rowsPerPage = [
        {
          label: 10,
          value: 10
        },
        {
          label: 20,
          value: 20
        },
        {
          label: 30,
          value: 30
        },
        {
          label: 40,
          value: 40
        }
      ];

      this.datosContacto = [
        { tipo: "censo.ws.literal.telefono", value: "tlf", valor: "" },
        { tipo: "censo.datosDireccion.literal.movil", value: "mvl", valor: "" },
      ];
    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true;
    }

    if (this.datos != undefined) {
      this.body = this.datos;
      this.bodyInicial = JSON.parse(JSON.stringify(this.datos));
    } else {
      this.datos = new InscripcionesItems();
    }
    if (this.body.idturno == undefined) {
      this.modoEdicion = false;
    } else {
      this.modoEdicion = true;
    }
  }

  obtenerPartidos() {
    return this.partidoJudicial;
  }

  partidoJudiciales() {
    this.sigaServices
      .getParam(
        "fichaZonas_searchSubzones",
        "?idZona=" + this.datos.idzona
      )
      .subscribe(
        n => {
          this.partidasJudiciales = n.zonasItems;
        },
        err => {
          console.log(err);

        }, () => {
          this.getPartidosJudiciales();
        }
      );
  }

  getPartidosJudiciales() {
    let fechaSolicitud =this.datepipe.transform(this.datos.fechasolicitud, 'dd/MM/yyyy');
    let fechaEfectAlta =this.datepipe.transform(this.datos.fechavalidacion, 'dd/MM/yyyy');

    for (let i = 0; i < this.partidasJudiciales.length; i++) {
      this.partidasJudiciales[i].partidosJudiciales = [];
      this.partidasJudiciales[i].jurisdiccion.forEach(partido => {
        this.partidoJudicial = this.partidasJudiciales[i].nombrePartidosJudiciales.split(";").join("; ");
      });
      if (this.modoEdicion) {
      this.datos2 = [
        {
          label: "Turno",
          value: this.datos.nombreturno
        },
        {
          label: "Partido Judicial",
          value: this.partidoJudicial
        },
        {
          label: "Fecha Sol Alta",
          value: fechaSolicitud
        },
        {
          label: "Fecha Efec.Alta",
          value: fechaEfectAlta
        },
        {
          label: "Estado",
          value: this.datos.estadonombre
        },
      ]
     
      this.datosSend.emit(this.datos2);
    }
  }

  }

  getColaOficio() {
    this.datos.historico = this.historico;
    this.progressSpinner = true;
    this.sigaServices.post("inscripciones_TarjetaColaOficio", this.datos).subscribe(
      n => {
        // this.datos = n.turnosItem;
        this.datosColaOficio = JSON.parse(n.body).inscripcionesItem;
        this.datosColaOficio.forEach(element => {
          element.orden = +element.orden;
        });
        // if (this.turnosItem.fechabaja != undefined || this.persistenceService.getPermisos() != true) {
        //   this.turnosItem.historico = true;
        // }
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
        let prueba:String = this.datos.ncolegiado.toString();
        let findDato = this.datosColaOficio.find(item => item.numerocolegiado == prueba);
        if(findDato != undefined){
          this.datos3 = [
            {
              label: "Posición actual en la cola",
              value: findDato.orden
            },
            {
              label: "Número total de letrados apuntados",
              value: this.datosColaOficio.length
            },
          ]
          this.datosSend2.emit(this.datos3);
        }else{
          // this.datos3 = [
          //   {
          //     value:"Sin información disponible",
          //   }
          // ]
          // this.datosSend2.emit(this.datos3);
        }
      }
    );
  }


  cargarTarjetaResumen() {
    if (this.modoEdicion) {
      this.partidoJudiciales();
      this.getColaOficio();
    }
  }
  actualizarFichaResumen() {
    if (this.modoEdicion) {


      this.datos2 = [
        {
          label: "Nombre",
          value: "this.turnosItem.nombre"
        },
        {
          label: "Área",
          value: "this.turnosItem.area"
        },
        {
          label: "Materia",
          value: ""
        },
      ]
      this.datosSend.emit(this.datos2);
    }
  }

  rest() {
    if (this.datos != undefined) {
      this.datos = JSON.parse(JSON.stringify(this.bodyInicial));
    }

  }

  save() {
    this.progressSpinner = true;
    let url = "";
    if (!this.modoEdicion) {
      this.nuevo = true;
      this.persistenceService.setDatos(null);
      url = "turnos_createnewTurno";
      this.callSaveService(url);
    } else {
      url = "turnos_updateDatosGenerales";
      this.callSaveService(url);
    }
  }

  callSaveService(url) {
    this.sigaServices.post(url, this.datos).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          let turnos = JSON.parse(data.body);
          // this.modulosItem = JSON.parse(data.body);
          this.datos.idturno = turnos.id;
          let send = {
            modoEdicion: this.modoEdicion,
            idTurno: this.datos.idturno,
          }

        }

        this.actualizarFichaResumen();
        if (this.nuevo) {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("justiciaGratuita.oficio.turnos.mensajeguardarDatos"));
          this.progressSpinner = false;
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.progressSpinner = false;
        }
      },
      err => {

        if (JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.body = this.datos;
        this.bodyInicial = JSON.parse(JSON.stringify(this.datos));
      }
    );

  }

  guardarDatos() {



  }

  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  disabledSave() {
    // if (this.turnosItem.nombre != undefined && this.turnosItem.nombre != "" && this.turnosItem.abreviatura != undefined && this.turnosItem.abreviatura != "" && this.turnosItem.idpartidapresupuestaria != null && this.turnosItem.idpartidapresupuestaria != "" && this.turnosItem.idzona != null && this.turnosItem.idzona != "" && this.turnosItem.idsubzona != null && this.turnosItem.idsubzona != "" &&
    //   this.turnosItem.idjurisdiccion != null && this.turnosItem.idjurisdiccion != "" && this.turnosItem.idjurisdiccion != "" && this.turnosItem.idgrupofacturacion != null && this.turnosItem.idmateria != null && this.turnosItem.idmateria != "" &&
    //   this.turnosItem.idarea != null && this.turnosItem.idarea != "" && this.turnosItem.idtipoturno != null && this.turnosItem.idtipoturno != "" && (JSON.stringify(this.turnosItem) != JSON.stringify(this.bodyInicial))
    // ) {
    //   return false;
    // } else {
    //   return true;
    // }

  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
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
}
