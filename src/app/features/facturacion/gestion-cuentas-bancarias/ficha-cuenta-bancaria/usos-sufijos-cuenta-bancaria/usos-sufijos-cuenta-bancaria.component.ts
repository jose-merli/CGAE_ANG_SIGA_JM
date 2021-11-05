import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataTable } from 'primeng/primeng';
import { CuentasBancariasItem } from '../../../../../models/CuentasBancariasItem';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-usos-sufijos-cuenta-bancaria',
  templateUrl: './usos-sufijos-cuenta-bancaria.component.html',
  styleUrls: ['./usos-sufijos-cuenta-bancaria.component.scss']
})
export class UsosSufijosCuentaBancariaComponent implements OnInit {

  msgs;
  progressSpinner: boolean = false;

  @Input() openTarjetaUsoFicheros;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<any>();
  
  // Tabla
  datos: SerieFacturacionItem[] = [];
  datosInit: SerieFacturacionItem[] = [];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];

  @ViewChild("table") table: DataTable;
  selectedDatos;

  bodyInicial: CuentasBancariasItem;
  body: CuentasBancariasItem = new CuentasBancariasItem();

  resaltadoDatos: boolean = false;

  constructor(
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getCols();
    if (this.persistenceService.getDatos()) {
      this.body = this.persistenceService.getDatos();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }

    this.progressSpinner = false;
  }

  getCols(): void {
    this.selectedItem = 10;
    this.selectedDatos = [];
    
    this.cols = [
      {
        field: "tipo",
        header: "Tipo"
      },
      {
        field: 'abreviatura',
        header: 'Abreviatura'
      },
      {
        field: 'descripcion',
        header: 'Descripción'
      },
      {
        field: 'numPendientes',
        header: 'Núm. Pendientes'
      },
      {
        field: 'sufijo',
        header: 'Sufijo'
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
    return this.openTarjetaUsoFicheros;
  }

  abreCierraFicha(key): void {
    this.openTarjetaUsoFicheros = !this.openTarjetaUsoFicheros;
    this.opened.emit(this.openTarjetaUsoFicheros);
    this.idOpened.emit(key);
  }

}
