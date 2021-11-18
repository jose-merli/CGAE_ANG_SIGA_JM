import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
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
  @Output() guardadoSend = new EventEmitter<SerieFacturacionItem>();
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.getCols();
  }

  ngOnChanges() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("destinatarioIndv")) {
      let nuevoDestinatario: any = JSON.parse(sessionStorage.getItem("destinatarioIndv"));
      this.guardarDestinarariosSerie(nuevoDestinatario);

      sessionStorage.removeItem("destinatarioIndv");
      sessionStorage.removeItem("AddDestinatarioIndvBack");
    }

    this.getDestinatariosSeries();

    this.progressSpinner = false;
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
    this.sigaServices.getParam("facturacionPyS_getDestinatariosSeries", "?idSerieFacturacion=" + this.body.idSerieFacturacion).subscribe(
      n => {
        this.datos = n.destinatariosSeriesItems;
        this.datosInit = JSON.parse(JSON.stringify(this.datos));
        console.log(n);
      },
      err => {
        console.log(err);
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

    this.router.navigate(["/busquedaGeneral"]);
  }

  guardarDestinarariosSerie(destinatariosSerie: any) {
    destinatariosSerie.idSerieFacturacion = this.body.idSerieFacturacion;

    console.log(destinatariosSerie);

    this.sigaServices.post("facturacionPyS_nuevoDestinatariosSerie", destinatariosSerie).subscribe(
      n => {
        this.getDestinatariosSeries();
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
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
