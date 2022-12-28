import { ChangeDetectorRef, Component, OnInit, Input, Output, SimpleChanges, EventEmitter, ViewChild } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { saveAs } from "file-saver/FileSaver";
import { UnidadFamiliarEJGItem } from '../../../../../models/sjcs/UnidadFamiliarEJGItem';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { SolicitudIncorporacionItem } from '../../../../../models/SolicitudIncorporacionItem';
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { EjgService } from '../services/ejg.service';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { procesos_ejg } from '../../../../../permisos/procesos_ejg';

@Component({
  selector: 'app-expedientes-economicos',
  templateUrl: './expedientes-economicos.component.html',
  styleUrls: ['./expedientes-economicos.component.scss']
})
export class ExpedientesEconomicosComponent implements OnInit {
  @Input() modoEdicion;
  permisoEscritura: boolean = false;
  @Input() tarjetaExpedientesEconomicos: string;

  @ViewChild("table") table: DataTable;
  expedientesEcon: any;
  solicitante: JusticiableItem = new JusticiableItem();
  openFicha: boolean = false;
  nuevo;
  body: EJGItem;
  bodyInicial;
  rowsPerPage: any = [];
  cols;
  msgs;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  buscadores = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  item: EJGItem;
  nExpedientes = 0;
  progressSpinner: boolean = false;

  datosFamiliares: any;

  selectDatos: EJGItem = new EJGItem();
  resaltadoDatosGenerales: boolean = false;
  resaltadoDatos: boolean = false;

  buttonVisibleEnvioDocumentacionAdicional: boolean = false;
  esIdentificadorPericlesDisponible: boolean = false;

  @Output() actualizarTarjetasIntercambios = new EventEmitter<void>();

  fichaPosible = {
    key: "expedientesEconomicos",
    activa: false
  }

  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Input() openTarjetaExpedientesEconomicos;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private ejgService: EjgService,
    private confirmationService: ConfirmationService,
    private sigaStorageService: SigaStorageService) { }

  ngOnInit() {
    if (this.persistenceService.getDatos()) {
      this.nuevo = false;
      this.modoEdicion = true;
      this.body = this.persistenceService.getDatos();
      this.item = this.body;
      this.getExpedientesEconomicos(this.item);
      this.getCols();

      // Acción para el envío de documentación Adicional
      this.esColegioConfiguradoEnvioCAJG()
        .then(value => this.buttonVisibleEnvioDocumentacionAdicional = value);
      this.esIdentificadorPericlesDisponible = this.item.idExpedienteExt != undefined;
    } else {
      this.nuevo = true;
      this.modoEdicion = false;
      this.body = new EJGItem();
    }
    this.commonsService.checkAcceso(procesos_ejg.expedientesEconomicos)
    .then(respuesta => {
      this.permisoEscritura = respuesta;
    }
    ).catch(error => console.error(error));

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaExpedientesEconomicos == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
    this.ejgService.$eventEmitter.subscribe( () => { 
      this.getExpedientesEconomicos(this.item);
    });
  }

  esFichaActiva(key) {
    return this.fichaPosible.activa;
  }

  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "expedientesEconomicos" &&
      !this.activacionTarjeta
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    //Comprobamos si hay un solicitante y rellenamos la columna de justiciable
    //this.getColJusticiable();

    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  /* getColJusticiable() {
    let justiciable = "";
    let datosFamiliares = this.persistenceService.getBodyAux();
    //Comprobamos si hay un solicitante
    if (datosFamiliares != undefined) {
      //Se buscan los familiares activos
      let datosFamiliaresActivos = datosFamiliares.filter(
        (dato) => dato.fechaBaja == null);
      let solicitante: UnidadFamiliarEJGItem[] = datosFamiliaresActivos.filter(
        (dato) => dato.uf_solicitante == "1")[0];
      if (solicitante[0] != undefined) justiciable = solicitante[0].pjg_nombrecompleto;
    }
    this.expedientesEcon.forEach(element => {
      element.justiciable = justiciable;
    });
  } */

  getExpedientesEconomicos(selected) {
    //this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getExpedientesEconomicos", selected).subscribe(
      n => {
        this.expedientesEcon = JSON.parse(n.body).expEconItems;
        /* if (n.body) {
          this.expedientesEcon.forEach(element => {
            //element.justiciable = JSON.parse(JSON.stringify(selected.nombreApeSolicitante));
            element.justiciable = this.expedientesEcon.apellidos+", "+this.expedientesEcon.nombre+" "+this.expedientesEcon.nif;
          }); 

        } */
        if(this.expedientesEcon != null)this.nExpedientes = this.expedientesEcon.length;
        //this.progressSpinner = false;
      },
      err => {
      }
    );
  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {
    this.cols = [
      { field: "justiciable", header: "menu.justiciaGratuita.justiciable", width: "30%" },
      { field: "solicitadoPor", header: "justiciaGratuita.ejg.datosGenerales.SolicitadoPor", width: "30%" },
      { field: "f_solicitud", header: "formacion.busquedaInscripcion.fechaSolicitud", width: "10%" },
      { field: "f_recepcion", header: "justiciaGratuita.ejg.datosGenerales.FechaRecepcion", width: "10%" },
      { field: "estado", header: "censo.busquedaSolicitudesModificacion.literal.estado", width: "20%" },
    ];
    this.cols.forEach(it => this.buscadores.push(""));
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

  isSelectMultiple() {
    this.selectAll = false;
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.permisoEscritura) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares;
          this.numSelected = this.datosFamiliares.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  disabledDownload(): boolean {
    return this.selectDatos == undefined || this.selectedDatos.length == 0 || this.selectedDatos.some(d => d.idEstado != "30");
  }

  downloadEEJ() {
    this.progressSpinner=true;

    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
      this.progressSpinner=false;
    } else {
      let data = [];

      this.selectedDatos.forEach(element => {
        let ejgData: EJGItem = new EJGItem();

        ejgData.annio = this.body.annio;
        ejgData.idInstitucion = this.body.idInstitucion;
        ejgData.numEjg = this.body.numEjg;
        ejgData.tipoEJG = this.body.tipoEJG;
        ejgData.observaciones=element.csv;
        
        data.push(ejgData);
      });

      this.sigaServices.postDownloadFiles("gestionejg_descargarExpedientesJG", data).subscribe(
        data => {
          this.progressSpinner=false;

          if(data.size==0){
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }else{
            let blob = null;

            let now = new Date();
            let month = now.getMonth()+1;
            let nombreFichero = "eejg_"+now.getFullYear();

            if(month<10){
              nombreFichero = nombreFichero+"0"+month;
            }else{
              nombreFichero += month;
            }

            nombreFichero += now.getDate()+"_"+now.getHours()+""+now.getMinutes();

            let mime = data.type;
            blob = new Blob([data], { type: mime });
            saveAs(blob, nombreFichero);
          }
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
        }
      );
    }
  }

  disableEnviarDocumentacionAdicional(): boolean {
    return this.selectedDatos == undefined || this.selectedDatos.some(d => d.csv == undefined || d.csv.length == 0 || d.idEstado == "40");
  }

  async enviarDocumentacionAdicional() {
    try {
      if (this.buttonVisibleEnvioDocumentacionAdicional) {
        if (this.selectedDatos != undefined && this.selectedDatos.length != 0 && await this.confirmEnviarDocumentacionAdicional()) {          
          let requests = this.selectedDatos.filter(d => d.csv != undefined && d.csv.length != 0 && d.idEstado != "40").map(d => {
            return { idPeticion: d.idPeticion };
          });
          
          await Promise.all(requests.map(d => this.accionEnviarDocumentacionAdicional(d)));
          this.showMessage("info", "Info", this.translateService.instant("justiciaGratuita.ejg.listaIntercambios.peticionEnCurso"));
          this.actualizarTarjetasIntercambios.emit();
        } else {
          this.showMessage("info", "Info", this.translateService.instant("general.message.accion.cancelada"));
        }
      } else {
        this.showMessage("error", "Error", "La acción no se encuentra disponible");
      }
    } catch (error) {
      this.showMessage('error', 'Error', this.translateService.instant('general.mensaje.error.bbdd'));
    }
  }

  confirmEnviarDocumentacionAdicional(): Promise<boolean> {
    let mess = this.translateService.instant("justiciaGratuita.ejg.listaIntercambios.confirmEnviarDocAdicional");
    let icon = "fa fa-edit";
    return new Promise((accept1, reject1) => {
      this.confirmationService.confirm({
        key: "confirmEnvioExpEconomico",
        message: mess,
        icon: icon,
        accept: () => accept1(true),
        reject: () => accept1(false)
      });
    })
  }

  accionEnviarDocumentacionAdicional(body): Promise<any> {
    this.progressSpinner = true;
    return this.sigaServices.post("gestionejg_enviaDocumentacionAdicionalExpEconomico", body).toPromise().then(
      n => {
        this.progressSpinner = false;
        const body = JSON.parse(n.body);
        if (body.error != undefined) {
          return Promise.reject(n.error);
        }
      },
      err => {
        this.progressSpinner = false;
        return Promise.reject();
      }
    );
  }

  esColegioConfiguradoEnvioCAJG(): Promise<boolean> {
    return this.sigaServices.get("gestionejg_esColegioConfiguradoEnvioCAJG").toPromise().then(
      n => {
        if (n.error != undefined) {
          return Promise.resolve(false);
        } else {
          const result = n.data === 'true';
          return Promise.resolve(result);
        }
      },
      err => {
        return Promise.resolve(false);
      }
    )
  }
}
