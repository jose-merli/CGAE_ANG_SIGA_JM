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
import { Router } from '@angular/router';
import { ColegiadoItem } from '../../../../../../models/ColegiadoItem';
import { DatosDireccionesItem } from '../../../../../../models/DatosDireccionesItem';
import { DatosDireccionesObject } from '../../../../../../models/DatosDireccionesObject';
import { ParametroRequestDto } from '../../../../../../models/ParametroRequestDto';
import { ParametroDto } from '../../../../../../models/ParametroDto';
@Component({
  selector: "app-tarjeta-letrado",
  templateUrl: "./tarjeta-letrado.component.html",
  styleUrls: ["./tarjeta-letrado.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TarjetaLetradoComponent implements OnInit {
  // datos;
  openFicha: boolean = false;
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
  institucionActual: any;
  areas: any[] = [];
  tiposturno: any[] = [];
  turnosItem2;
  permisosTarjeta: boolean = true;
  permisosModificacionDirecciones: boolean = true;
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
  comboPJ
  datos2;
  datos3;
  datosContacto: any[];
  tipoturnoDescripcion;
  jurisdiccionDescripcion;
  partidaPresupuestaria;
  MateriaDescripcion
  isDisabledSubZona: boolean = false;
  colegiadoInscripcion = new ColegiadoItem();
  bodyDirecciones: DatosDireccionesItem;
  searchDireccionIdPersona = new DatosDireccionesObject();
  datosDirecciones: DatosDireccionesItem[] = [];
  disableDirecciones: boolean = true;
  searchParametros: ParametroDto = new ParametroDto();
  valorParametroDirecciones: any;
  datoMovil: string;
  datoTelefono: string;
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



  datosBody: any[];
  @Output() datosSend = new EventEmitter<any>();

  @Output() datosSend2 = new EventEmitter<any>();

  @Output() modoEdicionSend = new EventEmitter<any>();

  @ViewChild("importe") importe;
  //Resultados de la busqueda
  @Input() datos: InscripcionesItems;
  @Input() tarjetaLetrado: string;
  @Input() letradoItem: any;
  @Input() openLetrado;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private datepipe: DatePipe,
    private router: Router) { }

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

  navigateToFichaColegial() {
    this.router.navigate(["/fichaColegial"]);
  }

  ngOnInit() {
    let origen = sessionStorage.getItem("origin");
    if (origen == "newInscrip") {
      this.disableDirecciones = false;
    }
    //  sessionStorage.removeItem("origin");
    this.commonsService.checkAcceso(procesos_oficio.tarjetaLetrado)
      .then(respuesta => {
        this.permisosTarjeta = respuesta;
        if (this.permisosTarjeta != true) {
          this.permisosTarjeta = false;
        } else {
          this.permisosTarjeta = true;
        }
      }).catch(error => console.error(error));

    this.commonsService.checkAcceso(procesos_oficio.modificacionDirecciones)
      .then(respuesta => {
        this.permisosModificacionDirecciones = respuesta;
        this.persistenceService.setPermisos(this.permisosTarjeta);
        if (this.permisosModificacionDirecciones == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);

          this.permisosModificacionDirecciones = respuesta;
        }/*else if(this.persistenceService.getPermisos() != true){
          this.permisosModificacionDirecciones = true;
        }*/
      }
      ).catch(error => console.error(error));
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      let parametro = new ParametroRequestDto();
      parametro.idInstitucion = this.institucionActual;
      parametro.modulo = "CEN";
      parametro.parametrosGenerales = "SOLICITUDES_MODIF_CENSO";
      this.sigaServices
        .postPaginado("parametros_search", "?numPagina=1", parametro)
        .subscribe(
          data => {
            this.searchParametros = JSON.parse(data["body"]);
            let datosBuscar = this.searchParametros.parametrosItems;
            datosBuscar.forEach(element => {
              if (element.parametro == "SOLICITUDES_MODIF_CENSO") {
                this.valorParametroDirecciones = element.valor;
              }
            });

          },
          err => {
            //console.log(err);
          },
          () => {
          }
        );
    });
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


    this.colegiadoInscripcion.numColegiado = this.letradoItem.ncolegiado;
    if (this.letradoItem.nColegiado != undefined) this.colegiadoInscripcion.numColegiado = this.letradoItem.nColegiado;
    if (this.letradoItem.numColegiado != undefined) this.colegiadoInscripcion.numColegiado = this.letradoItem.numColegiado;
    this.colegiadoInscripcion.idPersona = this.letradoItem.idpersona;
    if (this.letradoItem.idPersona != undefined) this.colegiadoInscripcion.idPersona = this.letradoItem.idPersona;
    this.colegiadoInscripcion.idInstitucion = this.letradoItem.idinstitucion;
    if (this.letradoItem.idInstitucion != undefined) this.colegiadoInscripcion.idInstitucion = this.letradoItem.idInstitucion;
    this.sigaServices
      .post("busquedaColegiados_searchColegiadoFicha", this.colegiadoInscripcion)
      .subscribe(
        data => {
          let colegiadoItem = JSON.parse(data.body);
          sessionStorage.setItem("personaBody", JSON.stringify(colegiadoItem.colegiadoItem[0]));
          sessionStorage.setItem("disabledAction", "false");

          this.datos.ncolegiado = colegiadoItem.colegiadoItem[0].numColegiado;
          this.datos.apellidosnombre = colegiadoItem.colegiadoItem[0].nombre;
          this.datos.nifcif = colegiadoItem.colegiadoItem[0].nif;

          //Buscamos los datos de contacto asociados a la direccion de guardia del colegiado
          this.bodyDirecciones = new DatosDireccionesItem();
          this.bodyDirecciones.idPersona = colegiadoItem.colegiadoItem[0].idPersona;
          this.bodyDirecciones.historico = false;
          if (this.bodyDirecciones.idPersona != undefined && this.bodyDirecciones.idPersona != null) {
            this.sigaServices
              .postPaginado(
                "fichaDatosDirecciones_datosDireccionesSearch",
                "?numPagina=1",
                this.bodyDirecciones
              )
              .subscribe(
                data => {
                  this.searchDireccionIdPersona = JSON.parse(data["body"]);
                  this.datosDirecciones = this.searchDireccionIdPersona.datosDireccionesItem;
                  let contador = 0;
                  this.datosDirecciones.forEach(element => {

                    if (element.tipoDireccion != undefined) {
                      var index = element.tipoDireccion.indexOf("Guardia");
                      if (index != -1) {
                        this.datosContacto = [
                          { tipo: "censo.ws.literal.telefono", value: "tlf", valor: element.telefono },
                          { tipo: "censo.datosDireccion.literal.movil", value: "mvl", valor: element.movil },
                        ];
                      }

                    }
                  });

                  this.datosContacto.forEach(element => {
                    if (element.value == 'tlf') {
                      this.datoTelefono = element.valor;
                    }
                    if (element.value == 'mvl') {
                      this.datoMovil = element.valor;
                    }
                  })
                  sessionStorage.setItem("numDespacho", JSON.stringify(contador));

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
                  this.progressSpinner = false;
                },
                err => {
                  //console.log(err);
                  this.progressSpinner = false;
                },
              );
          }
        },
        err => {
          //console.log(err);
        },

      );


    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true;
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
          //console.log(err);

        }, () => {
          this.getPartidosJudiciales();
        }
      );
  }

  getPartidosJudiciales() {
    let fechaSolicitud = this.datepipe.transform(this.datos.fechasolicitud, 'dd/MM/yyyy');
    let fechaEfectAlta = this.datepipe.transform(this.datos.fechavalidacion, 'dd/MM/yyyy');

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

  cargarTarjetaResumen() {
    if (this.modoEdicion) {
      this.partidoJudiciales();
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



  isOpenReceive(event) {
    let fichaPosible = this.esFichaActiva(event);
    if (fichaPosible == false) {
      this.abreCierraFicha(event);
    }
    // window.scrollTo(0,0);
  }



  abreCierraFicha(key) {
    if (key == "tarjetaLetrado" && !this.openLetrado
    ) {
      this.openFicha = !this.openFicha;
      this.openLetrado = true;
    } else {
      this.openFicha = !this.openFicha;
      this.openLetrado = false;
    }

  }
}



