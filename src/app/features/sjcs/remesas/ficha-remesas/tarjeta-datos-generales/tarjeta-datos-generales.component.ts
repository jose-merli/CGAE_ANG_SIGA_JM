import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DataTable } from "primeng/datatable";
import { DatePipe, Location } from "@angular/common";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { Subject } from "rxjs/Subject";
import { DatosGeneralesConsultaItem } from '../../../../../models/DatosGeneralesConsultaItem';
import { DestinatariosItem } from '../../../../../models/DestinatariosItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { PrisionItem } from '../../../../../models/sjcs/PrisionItem';
import { TurnosItems } from '../../../../../models/sjcs/TurnosItems';
import { ModulosItem } from '../../../../../models/sjcs/ModulosItem';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
import { filter } from 'rxjs/operator/filter';
import { Router } from '@angular/router';
import { RemesasItem } from '../../../../../models/sjcs/RemesasItem';

@Component({
  selector: 'app-tarjeta-datos-generales',
  templateUrl: './tarjeta-datos-generales.component.html',
  styleUrls: ['./tarjeta-datos-generales.component.scss']
})
export class TarjetaDatosGeneralesComponent implements OnInit {

  // datos;
  openFicha: boolean = false;
  body: TurnosItems = new TurnosItems();
  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  nuevo: boolean = false;
  @Input() openGen;

  datosTarjetaResumen;
  msgs;
  historico;
  procedimientos;
  textFilter;
  showTarjeta: boolean = true;
  esComa: boolean = false;
  textSelected: String = "{label}";
  disableAll: boolean = false;
  jurisdicciones: any[] = [];
  areas: any[] = [];
  tiposIncidencias: any[] = ["Expedientes con incidencias", "Expedientes sin incidencias", "Expedientes con incidencias antes del envío", "Expedientes con incidencias después del envío", "Expedientes con incidencias y no en nueva remesa"];
  turnosItem2;
  permisosTarjeta: boolean = true;
  permisosTarjetaResumen: boolean = true;
  zonas: any[] = [];
  subzonas: any[] = [];
  materias: any[] = [];
  partidas: any[] = [];
  partidoJudicial: string;
  grupofacturacion: any[] = [];
  partidasJudiciales: any[] = [];
  isDisabledMateria: boolean = false;
  comboPJ
  resaltadoDatosGenerales: boolean = false;
  tipoturnoDescripcion;
  jurisdiccionDescripcion;
  partidaPresupuestaria;
  MateriaDescripcion
  isDisabledSubZona: boolean = false;
  fOpen: boolean = false;
  fichasPosibles = [
    {
      key: "generales",
      activa: true
    },
    {
      key: "configuracion",
      activa: false
    },
  ];
  @Output() datosTarjetaResumenEmit = new EventEmitter<any>();

  @Output() modoEdicionSend = new EventEmitter<any>();

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  @ViewChild("importe") importe;
  //Resultados de la busqueda
  @Input() turnosItem: TurnosItems;
  @Input() newTurno: boolean;
  @Input() tarjetaDatosGenerales: string;
  cols;
  buscadores = [];
  rowsPerPage: any = [];
  item;
  remesaTabla;
  remesaItem: RemesasItem = new RemesasItem();
  datos;
  remesasDatosEntradaItem;
  editar: boolean;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private router: Router,
    private datepipe: DatePipe) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.turnosItem != undefined && (changes.turnosItem.currentValue != null || changes.turnosItem.currentValue != undefined)) {
      this.turnosItem = changes.turnosItem.currentValue;
      if (this.turnosItem != undefined) {
        if (this.turnosItem.idturno != undefined) {
          this.body = this.turnosItem;
          if (this.body.idturno == undefined) {
            this.modoEdicion = false;
          } else {
            if (this.turnosItem.fechabaja != undefined) {
              this.disableAll = true;
            }
            this.modoEdicion = true;
            // this.getCombos();
          }
        }
      } else {
        this.partidoJudicial = "";
        this.turnosItem = new TurnosItems();
      }
    }
    if (this.openGen == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('datosGenerales')
      }
    }
  }

  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (
      key == "datosGenerales" &&
      !this.modoEdicion
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.modoEdicion) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  ngOnInit() {
    if(localStorage.getItem('ficha') == "registro"){
      this.editar = true;
      this.item = localStorage.getItem('remesaItem');
      console.log("Item -> ", this.item);
      localStorage.removeItem('remesaItem');
      this.remesaTabla = JSON.parse(this.item);
      console.log("Item en JSON -> ", this.remesaTabla);
      this.listadoEstadosRemesa();
    }else if(localStorage.getItem('ficha') == "nuevo"){
      this.editar = false;
      this.getUltimoRegitroRemesa();
      this.remesaItem.descripcion = "";
    }
    localStorage.removeItem('ficha');

    this.checkDatosGenerales();
    this.actualizarFichaResumen();
    this.resaltadoDatosGenerales = true;
    // this.abreCierraFicha('datosGenerales');
    this.commonsService.checkAcceso(procesos_oficio.datosGenerales)
      .then(respuesta => {
        this.permisosTarjeta = respuesta;
        this.persistenceService.setPermisos(this.permisosTarjeta);
        if (this.permisosTarjeta == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        } else if (this.persistenceService.getPermisos() != true) {
          this.disableAll = true;
        }
      }
      ).catch(error => console.error(error));

    if (this.turnosItem != undefined) {
      this.body = this.turnosItem;
      this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
    } else {
      this.turnosItem = new TurnosItems();
    }
    if (this.body.idturno == undefined) {
      this.modoEdicion = false;
    } else {
      this.modoEdicion = true;
    }
    this.getCols();
  }

  getUltimoRegitroRemesa() {
    console.log("Dentro del getUltimoRegistroRemesa");
    this.sigaServices
      .get("ficharemesas_getUltimoRegistroRemesa")
      .subscribe(
        n => {
          console.log("Dentro de la respuesta. Contenido --> ", n.contador);
          this.remesaItem.numero = n.contador + 1;
          console.log("remesaItem -> ", this.remesaItem);
        },
        error => { },
        () => { }
      );
  }

  getCols() {

    this.cols = [
      { field: "fechaModificacion", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado" },
      { field: "estado", header: "justiciaGratuita.Calendarios.Estado" }
    ];
    this.cols.forEach(it => this.buscadores.push(""))

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
  }

  listadoEstadosRemesa(){
    this.progressSpinner = true;
    this.remesasDatosEntradaItem =
    {
      'idRemesa': (this.remesaTabla[0].idRemesa != null && this.remesaTabla[0].idRemesa != undefined) ? this.remesaTabla[0].idRemesa.toString() : this.remesaTabla[0].idRemesa,  
    };
    this.sigaServices.post("ficharemesas_listadoEstadosRemesa", this.remesasDatosEntradaItem).subscribe(
      n => {
        console.log("Dentro del servicio del padre que llama al listadoEstadosRemesa");
        this.datos = JSON.parse(n.body).estadoRemesaItem;

        this.datos.forEach(element => {
          element.fechaRemesa = this.formatDate(element.fechaModificacion);
        });

        console.log("Contenido de la respuesta del back --> ", this.datos);
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
        let error = err;
        console.log(err);
      });
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy HH24:MI:SS';
    return this.datepipe.transform(date, pattern);    
  }

  obtenerPartidos() {
    return this.partidoJudicial;
  }

  onChangeArea() {

    this.turnosItem.idmateria = "";
    this.materias = [];

    if (this.turnosItem.idarea != undefined && this.turnosItem.idarea != "") {
      this.isDisabledMateria = false;
      this.getComboMaterias();
    } else {
      this.isDisabledMateria = true;
    }

  }

  styleObligatorio(resaltado, evento) {
    if ((evento == null || evento == undefined || evento == "") && resaltado == "datosGenerales" && this.resaltadoDatosGenerales) {
      return "camposObligatorios";
    }
  }

  onChangeZona() {

    this.turnosItem.idsubzona = "";
    this.subzonas = [];

    if (this.turnosItem.idzona != undefined && this.turnosItem.idzona != "") {
      this.isDisabledSubZona = false;
      this.getComboSubZonas();
      this.partidoJudicial = "";
    } else {
      this.isDisabledSubZona = true;
      this.partidoJudicial = "";
    }

  }

  onChangeTipoincidencias() {
    for (let i = 0; i < this.tiposIncidencias.length; i++) {
      if (this.tiposIncidencias[i].value == this.turnosItem.idtipoturno) {
        this.tipoturnoDescripcion = this.tiposIncidencias[i].label
      }
    }
  }

  getPartidosJudiciales() {

    for (let i = 0; i < this.partidasJudiciales.length; i++) {
      this.partidasJudiciales[i].partidosJudiciales = [];
      this.partidasJudiciales[i].jurisdiccion.forEach(partido => {
        let findPartido = this.comboPJ.find(x => x.value === partido);
        this.partidoJudicial = this.partidasJudiciales[i].nombrePartidosJudiciales.split(";").join("; ");
      });
    }
    this.actualizarFichaResumen();
  }
  actualizarFichaResumen() {
    if (this.modoEdicion) {


      this.datosTarjetaResumen = [
        {
          label: "Nombre",
          value: this.turnosItem.nombre
        },
        {
          label: "Área",
          value: this.turnosItem.area
        },
        {
          label: "Materia",
          value: this.turnosItem.materia
        },
        {
          label: "Jurisdicción",
          value: this.jurisdiccionDescripcion
        },
        {
          label: "Tipo Turno",
          value: this.tipoturnoDescripcion
        },
        {
          label: "Grupo Zona",
          value: this.turnosItem.zona
        },
        {
          label: "Zona",
          value: this.turnosItem.subzona
        },
        {
          label: "Partida Presupuestaria",
          value: this.partidaPresupuestaria
        },
        {
          label: "Partido Judicial",
          value: this.partidoJudicial
        },
      ]
      this.datosTarjetaResumenEmit.emit(this.datosTarjetaResumen);
    }
  }

  partidoJudiciales() {
    if (this.turnosItem.idsubzona != null || this.turnosItem.idsubzona != undefined) {
      this.sigaServices
        .getParam(
          "fichaZonas_searchSubzones",
          "?idZona=" + this.turnosItem.idzona
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
    } else {
      this.partidoJudicial = "";
    }

  }
  getComboMaterias() {
    this.sigaServices
      .getParam(
        "combossjcs_comboMaterias",
        "?idArea=" + this.turnosItem.idarea)
      .subscribe(
        n => {
          this.materias = n.combooItems;
        },
        error => { },
        () => {
          if (this.turnosItem.idarea != null) {
            this.isDisabledMateria = false;
          }
        }
      );
  }

  getComboSubZonas() {
    this.sigaServices
      .getParam(
        "combossjcs_comboSubZonas",
        "?idZona=" + this.turnosItem.idzona)
      .subscribe(
        n => {
          this.subzonas = n.combooItems;
        },
        error => { },
        () => {

        }
      );
  }

  arreglaCombos() {
    this.sigaServices.get("combossjcs_comboAreas").subscribe(
      n => {
        this.areas = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
      },
      err => {
        console.log(err);
      }, () => {
        if (this.turnosItem.idarea != null) {

          this.sigaServices
            .getParam(
              "combossjcs_comboMaterias",
              "?idArea=" + this.turnosItem.idarea)
            .subscribe(
              n => {
                this.materias = n.combooItems;
              },
              error => { },
              () => {
                if (this.turnosItem.idarea != null) {
                  this.isDisabledMateria = false;
                }
              }
            );
        }
      }
    );

    this.sigaServices.get("combossjcs_comboZonas").subscribe(
      n => {
        this.zonas = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.zonas.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        console.log(err);
      }, () => {
        if (this.turnosItem.idzona != null) {
          this.sigaServices
            .getParam(
              "fichaZonas_searchSubzones",
              "?idZona=" + this.turnosItem.idzona
            )
            .subscribe(
              n => {
                this.partidasJudiciales = n.zonasItems;
              },
              err => {
                console.log(err);

              }, () => {
                if (this.turnosItem.idzona != null) {
                  this.isDisabledSubZona = false;
                }
                this.getPartidosJudiciales();
              }
            );

          this.sigaServices
            .getParam(
              "combossjcs_comboSubZonas",
              "?idZona=" + this.turnosItem.idzona)
            .subscribe(
              n => {
                this.subzonas = n.combooItems;
              },
              error => { },
              () => {
                this.body = this.turnosItem;
                this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
              }
            );
        }
      }
    );
  }

  rest() {
    if (this.turnosItem != undefined) {
      this.turnosItem = JSON.parse(JSON.stringify(this.bodyInicial));
      this.arreglaCombos();
    }

  }

  save() {
    //comprobamos si todos los campos obligatorios se han rellenado
    var camposOblig = document.getElementsByClassName('camposObligatorios');
    if (camposOblig.length > 0) {
      this.showMessage("error", "Error", this.translateService.instant("general.message.camposObligatorios"));
    } else {
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
  }

  callSaveService(url) {
    if (this.turnosItem.codigoext != undefined) {
      this.turnosItem.codigoext = this.turnosItem.codigoext.trim();
    }
    if (this.turnosItem.nombre != undefined) {
      this.turnosItem.nombre = this.turnosItem.nombre.trim();
    }
    if (this.turnosItem.abreviatura != undefined) {
      this.turnosItem.abreviatura = this.turnosItem.abreviatura.trim();
    }
    this.sigaServices.post(url, this.turnosItem).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          let turnos = JSON.parse(data.body);
          this.turnosItem.idturno = turnos.id;
          let send = {
            modoEdicion: this.modoEdicion,
            idTurno: this.turnosItem.idturno,
          }
          this.sigaServices.post("turnos_busquedaFichaTurnos", this.turnosItem).subscribe(
            n => {
              this.turnosItem2 = JSON.parse(n.body).turnosItem[0];
            },
            err => {
              console.log(err);
            }, () => {
              this.persistenceService.setDatos(this.turnosItem2);
              this.modoEdicionSend.emit(send);
            }
          );

        }

        for (let i = 0; i < this.tiposIncidencias.length; i++) {
          if (this.tiposIncidencias[i].value == this.turnosItem.idtipoturno) {
            this.tipoturnoDescripcion = this.tiposIncidencias[i].label
          }
        }
        for (let i = 0; i < this.subzonas.length; i++) {
          if (this.subzonas[i].value == this.turnosItem.idsubzona) {
            this.turnosItem.subzona = this.subzonas[i].label
          }
        }
        for (let i = 0; i < this.zonas.length; i++) {
          if (this.zonas[i].value == this.turnosItem.idzona) {
            this.turnosItem.zona = this.zonas[i].label
          }
        }
        for (let i = 0; i < this.areas.length; i++) {
          if (this.areas[i].value == this.turnosItem.idarea) {
            this.turnosItem.area = this.areas[i].label
          }
        }
        for (let i = 0; i < this.materias.length; i++) {
          if (this.materias[i].value == this.turnosItem.idmateria) {
            this.turnosItem.materia = this.materias[i].label
          }
        }
        for (let i = 0; i < this.jurisdicciones.length; i++) {
          if (this.jurisdicciones[i].value == this.turnosItem.idjurisdiccion) {
            this.jurisdiccionDescripcion = this.jurisdicciones[i].label
          }
        }
        for (let i = 0; i < this.partidas.length; i++) {
          if (this.partidas[i].value == this.turnosItem.idpartidapresupuestaria) {
            this.partidaPresupuestaria = this.partidas[i].label
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
        this.body = this.turnosItem;
        this.bodyInicial = JSON.parse(JSON.stringify(this.turnosItem));
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

  checkDatosGenerales() {
    if (!(this.body.abreviatura != "" && this.body.abreviatura != undefined && this.body.abreviatura != null
      && this.body.nombre != "" && this.body.nombre != "" && this.body.nombre != "" != null
      && this.body.idpartidapresupuestaria != undefined && this.body.idpartidapresupuestaria != "" && this.body.idpartidapresupuestaria != null
      && this.body.grupofacturacion != undefined && this.body.grupofacturacion != "" && this.body.grupofacturacion != null
      && this.body.idtipoturno != "" && this.body.idtipoturno != undefined && this.body.idtipoturno != null
      && this.body.idarea != null && this.body.idarea != undefined && this.body.idarea != ""
      && this.body.idmateria != null && this.body.idmateria != undefined && this.body.idmateria != ""
      && this.body.idsubzona != null && this.body.idsubzona != undefined && this.body.idsubzona != ""
      && this.body.idzona != null && this.body.idzona != undefined && this.body.idzona != ""
    )) {
      this.abreCierraFicha('datosGenerales');
    }
  }
}

