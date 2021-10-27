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
import { SigaStorageService } from '../../../../../siga-storage.service';
import { RemesasResultadoItem } from '../../../../../models/sjcs/RemesasResultadoItem';
import { RemesasResolucionItem } from '../../../../../models/sjcs/RemesasResolucionItem';
import { saveAs } from "file-saver/FileSaver";
import moment = require('moment');

@Component({
  selector: 'app-tarjeta-datos-generales-remesas-resultados',
  templateUrl: './tarjeta-datos-generales-remesas-resultados.component.html',
  styleUrls: ['./tarjeta-datos-generales-remesas-resultados.component.scss']
})
export class TarjetaDatosGeneralesRemesasResultadosComponent implements OnInit {

  // datos;
  openFicha: boolean = true;
  body: TurnosItems = new TurnosItems();
  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  nuevo: boolean = false;
  @Input() openGen;

  conFichero : boolean = false;
  remesaResolucion : RemesasResolucionItem = new RemesasResolucionItem();
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
  fOpen: boolean = true;
  newRegistroNumero;
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
  @Input() datos;
  cols;
  buscadores = [];
  rowsPerPage: any = [];
  item;
  @Input() remesaItem: RemesasResultadoItem;
  resultado;
  remesasDatosEntradaItem;
  busquedaActualizaciones: boolean;
  @ViewChild("pUploadFile") pUploadFile;
  isEnabledNuevo: boolean = true;
  

  file: File = undefined;
  archivoDisponible: boolean = false;
  nombreFichero: any;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private router: Router,
    private datepipe: DatePipe,
    private localStorageService: SigaStorageService) { }

  ngOnChanges(changes: SimpleChanges) {
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
    console.log("Empieza;")
    console.log(this.remesaItem)
    console.log("FIN")
    if(this.remesaItem.idRemesa == null){
      this.getUltimoRegitroRemesa();
      this.remesaItem.fechaCargaRemesaResultado = moment(new Date()).format('DD/MM/YYYY');

      //this.remesaItem.descripcion = "";
    }
    if(this.remesaItem.nombreFichero.length > 0){
        this.conFichero = true;
        console.log("Tiene fichero")
    }
    this.checkDatosGenerales();
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
    this.getInstitucionActual();
  }

  getInstitucionActual() {
		this.sigaServices.get("institucionActual").subscribe(n => { this.localStorageService.institucionActual = n.value });
	}

  getUltimoRegitroRemesa() {
    console.log("Dentro del getUltimoRegistroRemesa");
    this.sigaServices
      .get("ficharemesas_getUltimoRegistroRemesa")
      .subscribe(
        n => {
          console.log("Dentro de la respuesta. Contenido --> ", n.contador);
          //this.remesaItem.numero = n.contador + 1;
          this.remesaItem.prefijoRemesa = n.prefijo;
          this.remesaItem.numeroRemesa = (n.contador+1);
        },
        error => { },
        () => { }
      );
  }




  formatDate(date) {
    const pattern = 'dd/MM/yyyy HH24:MI:SS';
    return this.datepipe.transform(date, pattern);    
  }




  styleObligatorio(resaltado, evento) {
    if ((evento == null || evento == undefined || evento == "") && resaltado == "datosGenerales" && this.resaltadoDatosGenerales) {
      return "camposObligatorios";
    }
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

  fillFechaCargaDetalle(event){
    if (event != null) {
      this.remesaItem.fechaCargaRemesaResultado = event;
    }
  }

  fillFechaRemesaDetalle(event){
    if (event != null) {
      this.remesaItem.fechaResolucionRemesaResultado = event;
    }
  }

  getFile(event: any) {
    // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
    let fileList: FileList = event.files;

    let nombreCompletoArchivo = fileList[0].name;
    let extensionArchivo = nombreCompletoArchivo.substring(
      nombreCompletoArchivo.lastIndexOf("."),
      nombreCompletoArchivo.length
    );

    if (
      extensionArchivo == null ||
      extensionArchivo.trim() == "" ||
      !/\.(txt)$/i.test(extensionArchivo.trim().toUpperCase())
    ) {
      this.file = undefined;
      this.archivoDisponible = false;
      this.nombreFichero = "";
    } else {
      this.file = fileList[0];
      this.archivoDisponible = true;
      this.nombreFichero = nombreCompletoArchivo;
      this.remesaItem.nombreFichero = this.nombreFichero;
    }
  }

  save(){
    if(this.remesaItem != null){
      this.remesaResolucion = {
        'idRemesa' : this.remesaItem.idRemesa,
        'observaciones' : this.remesaItem.observacionesRemesaResultado,
        'nombreFichero' : this.remesaItem.nombreFichero,
        'fechaCarga' : this.datepipe.transform(this.remesaItem.fechaCargaRemesaResultado, 'dd/MM/yyyy'),
        'fechaResolucion' :  this.datepipe.transform(this.remesaItem.fechaResolucionRemesaResultado, 'dd/MM/yyyy'),
      };
    }
    if(this.remesaResolucion.idRemesa == null ){
      this.remesaResolucion.idRemesa = 0;
    }
    this.progressSpinner = true;
    this.sigaServices
    .postSendContentAndParameter(
    "remesasResultados_guardarRemesaResultado",
    "?idRemesa=" + this.remesaResolucion.idRemesa +
    "&observaciones=" + this.remesaResolucion.observaciones + 
    "&nombreFichero=" + this.remesaResolucion.nombreFichero +
    "&fechaCarga=" + this.remesaResolucion.fechaCarga +
    "&fechaResolucion=" + this.remesaResolucion.fechaResolucion,
    this.file)
    .subscribe(
      data => {
        let accion = JSON.parse(data.body).error.description;
        if(accion == "Insert"){
          this.showMessage("success", this.translateService.instant("general.message.correct"),  this.translateService.instant("justiciaGratuita.remesasResultados.mensaje.actualizacionCorrecta"));
        }else if(accion == "Updated"){
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("justiciaGratuita.remesasResultados.mensaje.guardadoCorrecto"));
        }
        this.progressSpinner = false;
      },
      err => {
        if (err.error != null && err.error.error != null && err.error.error.code == 400) {
          if (err.error.error.description != null) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          } else {
            this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.formatoNoPermitido"));
          }
        } else {
          this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.errorSubirDocumento"));
          console.log(err);
        }
        this.progressSpinner = false;
      },
      () => {
      }
    );
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }
  
  descargarFicheros(){
    this.progressSpinner = true;
    let remesasResultados: RemesasResultadoItem[] = []
    let remesa: RemesasResultadoItem = new RemesasResultadoItem(
        {
          'idRemesaResultado': this.remesaItem.idRemesaResultado,
          'numRemesaPrefijo': '',
          'numRemesaNumero': '',
          'numRemesaSufijo': '',
          'numRegistroPrefijo': '',
          'numRegistroNumero': '',
          'numRegistroSufijo': '',
          'nombreFichero': this.remesaItem.nombreFichero,
          'fechaRemesaDesde': '',
          'fechaRemesaHasta': '',
          'fechaCargaDesde': '',
          'fechaCargaHasta': '',
          'observacionesRemesaResultado': '',
          'fechaCargaRemesaResultado': '',
          'fechaResolucionRemesaResultado': '',
          'idRemesa': null,
          'numeroRemesa': '',
          'prefijoRemesa': '',
          'sufijoRemesa': '',
          'descripcionRemesa': '',
          'numRegistroRemesaCompleto': '',
          'numRemesaCompleto': ''
          }
      );
    remesasResultados.push(remesa);
    
    let descarga =  this.sigaServices.postDownloadFiles("remesasResultados_descargarFicheros", remesasResultados);
    descarga.subscribe(
      data => {
        let blob = null;
        // Se comprueba si todos los documentos asociados no tiene ningún fichero 
        let documentoAsociado = remesasResultados.find(item => item.nombreFichero !=null)
        if(documentoAsociado != undefined){
            blob = new Blob([data], { type: "application/zip" });
            if(blob.size > 50){
              saveAs(blob, "descargaRemesasResultados.zip");
            } else {
              this.showMessage("error", this.translateService.instant("general.message.informacion"), 'No se puede descargar los ficheros de las remesas de resultados seleccionadas');
            }
        }
        else this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.ejg.documentacion.noFich"));

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }
  

}

