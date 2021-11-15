import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { CuentasBancariasItem } from '../../../../../models/CuentasBancariasItem';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-usos-sufijos-cuenta-bancaria',
  templateUrl: './usos-sufijos-cuenta-bancaria.component.html',
  styleUrls: ['./usos-sufijos-cuenta-bancaria.component.scss']
})
export class UsosSufijosCuentaBancariaComponent implements OnInit, OnChanges {

  msgs;
  progressSpinner: boolean = false;

  @Input() openTarjetaUsosSufijos;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<any>();
  
  // Tabla
  datos: any[] = [];
  datosInit: any[] = [];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];

  @ViewChild("table") table: DataTable;
  selectedDatos;

  @Input() body: CuentasBancariasItem;

  resaltadoDatos: boolean = false;

  // Combos
  comboSufijos = [];
  comboSeriesFacturacion = [];

  constructor(
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getCols();
    
    this.progressSpinner = false;
  }

  ngOnChanges() {
    this.getComboSufijo();
    this.getComboSerieFacturacion();
    this.getUsosSufijos();
  }

  // Combo de sufijos

  getComboSufijo() {
    this.sigaServices.get("facturacionPyS_comboSufijo").subscribe(
      n => {
        this.comboSufijos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboSufijos);
      },
      err => {
        console.log(err);
      }
    );
  }

  // Combo de Series de Facturación

  getComboSerieFacturacion() {
    this.sigaServices.get("facturacionPyS_comboSeriesFacturacion").subscribe(
      n => {
        this.comboSeriesFacturacion = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboSeriesFacturacion);
      },
      err => {
        console.log(err);
      }
    );
  }

  // Obtener usos y sufijos

  getUsosSufijos() {
    this.sigaServices.getParam("facturacionPyS_getUsosSufijos", "?codBanco=" + this.body.bancosCodigo).subscribe(
      n => {
        this.datos = n.usosSufijosItems;
        this.datosInit = JSON.parse(JSON.stringify(this.datos));
      },
      err => {
        console.log(err);
      }
    );
  }

  getCols(): void {
    this.selectedItem = 10;
    this.selectedDatos = [];
    
    this.cols = [
      {
        field: "tipo",
        header: "facturacion.productos.tipo"
      },
      {
        field: 'abreviatura',
        header: 'administracion.parametrosGenerales.literal.abreviatura'
      },
      {
        field: 'descripcion',
        header: 'general.description'
      },
      {
        field: 'numPendientes',
        header: 'facturacion.cuentaBancaria.numPendientes'
      },
      {
        field: 'sufijo',
        header: 'facturacionSJCS.facturacionesYPagos.sufijo'
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

  // Añadir serie de facturación

  addSerie() {
    let newDato = {
      tipo: "SERIE",
      idSerieFacturacion: undefined,
      idSufijo: undefined,
      bancosCodigo: this.body.bancosCodigo,
      nuevo: true
    };

    this.datos.unshift(newDato);
  }

  // Restablecer

  restablecer(): void {
    this.datos = JSON.parse(JSON.stringify(this.datosInit));
    this.resaltadoDatos = false;
  }

  // Guadar

  isValid(): boolean {
    return this.datos.every(u => (u.nuevo == undefined || u.idSerieFacturacion != undefined) && u.idSufijo != undefined);
  }

  checkSave(): void {
    if (this.isValid()) {
      this.save();
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
  }

  save(): void {
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_insertaActualizaSerie", this.datos).subscribe(
      n => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.body.numUsos = this.datos.length;
        this.persistenceService.setDatos(this.body);
        this.guardadoSend.emit();

        this.progressSpinner = false;
      },
      err => {
        let error = JSON.parse(err.error).error;
        if (error != undefined && error.message != undefined) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.message));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }

        this.progressSpinner = false;
      }
    );
  }

  // Estilo obligatorio
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
      return this.commonsService.styleObligatorio(evento);
    }
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

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaUsosSufijos;
  }

  abreCierraFicha(key): void {
    this.openTarjetaUsosSufijos = !this.openTarjetaUsosSufijos;
    this.opened.emit(this.openTarjetaUsosSufijos);
    this.idOpened.emit(key);
  }

}
