import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { saveAs } from "file-saver/FileSaver";
import { UnidadFamiliarEJGItem } from '../../../../../models/sjcs/UnidadFamiliarEJGItem';

@Component({
  selector: 'app-expedientes-economicos',
  templateUrl: './expedientes-economicos.component.html',
  styleUrls: ['./expedientes-economicos.component.scss']
})
export class ExpedientesEconomicosComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaExpedientesEconomicos: string;

  [x : string] : any;

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
  nExpedientes;
  progressSpinner: boolean = false;

  datosFamiliares: any;

  selectDatos: EJGItem = new EJGItem();
  resaltadoDatosGenerales: boolean = false;
  resaltadoDatos: boolean = false;

  fichaPosible = {
    key: "expedientesEconomicos",
    activa: false
  }

  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Input() openTarjetaExpedientesEconomicos;

  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService) { }

  ngOnInit() {
    if (this.persistenceService.getDatos()) {
      this.nuevo = false;
      this.modoEdicion = true;
      this.body = this.persistenceService.getDatos();
      this.item = this.body;
      this.getExpedientesEconomicos(this.item);
      this.getCols();
    } else {
      this.nuevo = true;
      this.modoEdicion = false;
      this.body = new EJGItem();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaExpedientesEconomicos == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
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
    this.getColJusticiable();

    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  getColJusticiable() {
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
  }

  getExpedientesEconomicos(selected) {
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getExpedientesEconomicos", selected).subscribe(
      n => {
        this.expedientesEcon = JSON.parse(n.body).expEconItems;
        /*if(n.body) 
        //Se asigna a la columna justiciable el solicitante actual del ejg
          this.expedientesEcon.forEach(element => {
            element.justiciable = JSON.parse(JSON.stringify(selected.nombreApeSolicitante));
          }); */
          
        this.nExpedientes = this.expedientesEcon.length;
        this.progressSpinner = false;
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
      if (!this.historico) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares;
          this.numSelected = this.datosFamiliares.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datosFamiliares.filter(
            (dato) => dato.fechaBaja != undefined && dato.fechaBaja != null
          );
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
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

  checkPermisosDownloadEEJ() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.downloadEEJ();
    }
  }
  downloadEEJ() {
    this.progressSpinner = true;

    let ejg: any[] = [];

    ejg.push(this.body);

    this.sigaServices.postDownloadFiles("gestionejg_descargarExpedientesJG", ejg).subscribe(
      data => {

        let blob = null;

        let mime = "application/pdf";
        blob = new Blob([data], { type: mime });
        saveAs(blob, "eejg_2005_2018-01200_45837302G_20210525_131611.pdf");

      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }
}
