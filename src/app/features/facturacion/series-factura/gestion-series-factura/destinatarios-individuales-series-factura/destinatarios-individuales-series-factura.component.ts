import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-destinatarios-individuales-series-factura',
  templateUrl: './destinatarios-individuales-series-factura.component.html',
  styleUrls: ['./destinatarios-individuales-series-factura.component.scss']
})
export class DestinatariosIndividualesSeriesFacturaComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;

  body: SerieFacturacionItem;

  // Tabla
  datos: any[];
  datosInit: any[];
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
  @Output() guardadoSend = new EventEmitter<any>();
  
  constructor(
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getCols();
    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();

      this.getDestinatariosSeries();
    }

    this.progressSpinner = false;
  }

  getCols(): void {
    this.selectedItem = 10;
    this.selectedDatos = [];
    
    this.cols = [
      {
        field: "nombreCompleto",
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
        console.log(n);
      },
      err => {
        console.log(err);
      }
    );
  }


  clear() {
    this.msgs = [];
  }
  
  esFichaActiva(): boolean {
    return this.openTarjetaDestinatariosIndividuales;// this.fichaPosible.activa;
  }

  abreCierraFicha(key): void {
    this.openTarjetaDestinatariosIndividuales = !this.openTarjetaDestinatariosIndividuales;
  }

}
