import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/message';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { DestinatariosItem } from '../../../../../models/DestinatariosItem';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-destinatarios-individuales-series-factura',
  templateUrl: './destinatarios-individuales-series-factura.component.html',
  styleUrls: ['./destinatarios-individuales-series-factura.component.scss']
})
export class DestinatariosIndividualesSeriesFacturaComponent implements OnInit, OnChanges {

  msgs: Message[];
  progressSpinner: boolean = false;

  @Input() body: SerieFacturacionItem;

  // Tabla
  datos: DestinatariosItem[];
  datosInit: DestinatariosItem[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];

  @ViewChild("table") table: DataTable;
  selectedDatos;

  @Input() openTarjetaDestinatariosIndividuales;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() refreshData = new EventEmitter<void>();
  
  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.getCols();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.body && this.body.idSerieFacturacion != undefined) {
      if (sessionStorage.getItem("destinatarioIndv")) {
        let nuevoDestinatario: any = JSON.parse(sessionStorage.getItem("destinatarioIndv"));
        //console.log(nuevoDestinatario);
        this.guardarDestinarariosSerie(nuevoDestinatario);
  
        sessionStorage.removeItem("destinatarioIndv");
        sessionStorage.removeItem("AddDestinatarioIndvBack");
      }

      this.getDestinatariosSeries();
    }
    
  }

  getCols(): void {
    this.selectedItem = 10;
    this.selectedDatos = [];
    
    this.cols = [
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: 'correoElectronico',
        header: 'censo.datosDireccion.literal.correo'
      },
      {
        field: 'movil',
        header: 'censo.datosDireccion.literal.movil'
      },
      {
        field: 'domicilio',
        header: 'solicitudModificacion.especifica.domicilio.literal'
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
  }
  
  getDestinatariosSeries() {
    this.progressSpinner = true;

    this.sigaServices.getParam("facturacionPyS_getDestinatariosSeries", "?idSerieFacturacion=" + this.body.idSerieFacturacion).subscribe(
      n => {
        this.datos = n.destinatariosSeriesItems;
        this.datosInit = JSON.parse(JSON.stringify(this.datos));

        this.selectedDatos = [];
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  addDestinatario() {
    this.numSelected = 0;
    sessionStorage.setItem("AddDestinatarioIndv", "true");

    let migaPan = this.translateService.instant("menu.facturacion.asignacionDeConceptosFacturables");
    let menuProcede = this.translateService.instant("menu.facturacion");

    sessionStorage.setItem("migaPan", migaPan);
    sessionStorage.removeItem("migaPan2");
    sessionStorage.setItem("menuProcede", menuProcede);

    sessionStorage.setItem("serieFacturacionItem", JSON.stringify(this.body));

    this.router.navigate(["/busquedaGeneral"]);
  }

  guardarDestinarariosSerie(destinatariosSerie: any) {
    this.progressSpinner = true;
    destinatariosSerie.idSerieFacturacion = this.body.idSerieFacturacion;

    this.sigaServices.post("facturacionPyS_nuevoDestinatariosSerie", destinatariosSerie).subscribe(
      n => {
        this.refreshData.emit();
        this.progressSpinner = false;
      },
      err => {
        let error = JSON.parse(err.error).error;

        let message = this.translateService.instant("general.mensaje.error.bbdd");
        if (error != undefined && error.message != undefined) {
          let translatedError = this.translateService.instant(error.message);
          if (translatedError && translatedError.trim().length != 0) {
            message = translatedError;
          }
        }

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), message);
        this.progressSpinner = false;
      }
    );
  }

  eliminarDestinarariosSerie() {
    this.selectedDatos.forEach(e => {
      e.idSerieFacturacion = this.body.idSerieFacturacion;
    });

    return this.sigaServices.post("facturacionPyS_eliminaDestinatariosSerie", this.selectedDatos).subscribe(
      n => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.getDestinatariosSeries();
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
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

  clear() {
    this.msgs = [];
  }

  onChangeSelectAll() {
    if (this.selectAll) {
      this.selectMultiple = true;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
    
  esFichaActiva(): boolean {
    return this.openTarjetaDestinatariosIndividuales;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaDestinatariosIndividuales = !this.openTarjetaDestinatariosIndividuales;
    this.opened.emit(this.openTarjetaDestinatariosIndividuales);
    this.idOpened.emit(key);
  }

}
