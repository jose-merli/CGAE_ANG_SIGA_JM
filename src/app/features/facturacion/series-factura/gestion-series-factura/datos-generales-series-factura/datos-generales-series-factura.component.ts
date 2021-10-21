import { Component, Input, OnInit } from '@angular/core';
import { t } from '@angular/core/src/render3';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-datos-generales-series-factura',
  templateUrl: './datos-generales-series-factura.component.html',
  styleUrls: ['./datos-generales-series-factura.component.scss']
})
export class DatosGeneralesSeriesFacturaComponent implements OnInit {

  msgs;
  progressSpinner: boolean = false;

  @Input() datos: SerieFacturacionItem;
  @Input() tarjetaDatosGenerales: string;
  @Input() openTarjetaDatosGenerales;

  body: SerieFacturacionItem = new SerieFacturacionItem();

  // Opciones de los combos y el autocompletado
  comboFacturacion = [];
  comboCuentaBancaria = [];
  comboSufijo = [];
  comboTiposProductos = [];
  comboTiposServicios = [];

  // Sugerencias de los campos de autocompletado
  suggestionsTiposProductos = [];
  suggestionsTiposServicios = [];
  

  resaltadoDatosGenerales: boolean = false;
  resaltadoDatos: boolean = false;

  constructor(
    private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService
  ) { }

  ngOnInit() {
    this.resaltadoDatos = true;
    this.progressSpinner = false;

    this.getCombos();

    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      console.log(this.body);
    }

    this.progressSpinner = false;
  }

  getCombos() {
    this.getComboCuentaBancaria();
    this.getComboSufijo();
    this.getComboTiposProductos();
    this.getComboTiposServicios();
  }

  // Combos

  getComboCuentaBancaria() {
    this.sigaServices.get("facturacionPyS_comboCuentaBancaria").subscribe(
      n => {
        this.comboCuentaBancaria = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboCuentaBancaria);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboSufijo() {
    this.sigaServices.get("facturacionPyS_comboSufijo").subscribe(
      n => {
        this.comboSufijo = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboSufijo);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTiposProductos() {
    this.sigaServices.get("tiposProductos_comboProducto").subscribe(
      n => {
        this.comboTiposProductos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTiposProductos);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTiposServicios() {
    this.sigaServices.get("tiposServicios_comboServicios").subscribe(
      n => {
        this.comboTiposServicios = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTiposServicios);
      },
      err => {
        console.log(err);
      }
    );
  }

  filterLabelsTiposProductos(event) {
    let query = event.query;
    console.log(query)
    this.suggestionsTiposProductos = this.comboTiposProductos.filter(tp => {
      if (tp.label != undefined && query != undefined) {
        if (!this.body.tiposProductos.some(x => x.value === tp.value)) {
          return tp.label.toLowerCase().includes(query.toLowerCase()) || tp.labelSinTilde != undefined && tp.labelSinTilde.toLowerCase().includes(query.toLowerCase());
        }
      }
      
      return false;
    });
  }

  filterLabelsTiposServicios(event) {
    let query = event.query;
    console.log(query)
    this.suggestionsTiposServicios = this.comboTiposServicios.filter(ts => {
      if (ts.label != undefined && query != undefined) {
        if (!this.body.tiposServicios.some(x => x.value === ts.value)) {
          return ts.label.toLowerCase().includes(query.toLowerCase()) || ts.labelSinTilde != undefined && ts.labelSinTilde.toLowerCase().includes(query.toLowerCase());
        }
      }
      
      return false;
    });
  }

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

}
