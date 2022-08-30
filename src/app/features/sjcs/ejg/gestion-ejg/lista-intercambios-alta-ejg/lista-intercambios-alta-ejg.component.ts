import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ListaIntercambiosEjgItem } from '../../../../../models/sjcs/ListaIntercambiosEjgItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-lista-intercambios-alta-ejg',
  templateUrl: './lista-intercambios-alta-ejg.component.html',
  styleUrls: ['./lista-intercambios-alta-ejg.component.scss']
})
export class ListaIntercambiosAltaEjgComponent implements OnInit {

  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaListaIntercambiosAltaEjg: string;

  openFicha: boolean = false;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  msgs = [];

  fichaPosible = {
    key: "listaIntercambiosAltaEjg",
    activa: false
  }

  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() newEstado = new EventEmitter();
  @Output() updateRes = new EventEmitter();
  @Input() openTarjetaListaIntercambiosAltaEjg;

  selectedItem: number = 10;
  rowsPerPage: any = [];
  buscadores = [];
  selectedDatos: ListaIntercambiosEjgItem[] = [];
  numSelected = 0;
  selectAll: boolean = false;
  selectionMode: String = "multiple";
  cols;
  nCompensaciones: number = 0;

  datos: ListaIntercambiosEjgItem[] = [];

  @ViewChild("tabla") tabla;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    try {
      this.getCols();
      this.datos = await this.getListaIntercambiosAltaEjg();
      
    } catch (error) {
      console.error(error);
    }
  }

  getCols() {
    this.cols = [
      { field: "descripcion", header: "justiciaGratuita.ejg.listaIntercambios.intercambio" },
      { field: "fechaEnvio", header: "justiciaGratuita.ejg.listaIntercambios.fechaEnvio" },
      { field: "estadoRespuesta", header: "enviosMasivos.literal.estado" },
      { field: "fechaRespuesta", header: "justiciaGratuita.ejg.listaIntercambios.fechaRespuesta" },
      { field: "respuesta", header: "justiciaGratuita.ejg.listaIntercambios.respuesta" }
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

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
  }

  onChangeSelectAll() {
    
  }

  getListaIntercambiosAltaEjg(): Promise<ListaIntercambiosEjgItem[]> {
    const ejg = { idInstitucion: 2014, annio: 2021, tipoEJG: 1, numero: 1 };
    return this.sigaServices.post("gestionejg_getListaIntercambiosAltaEjg", ejg).toPromise().then(
      n => {
        const body = JSON.parse(n.body);
        const items: ListaIntercambiosEjgItem[] = body.ejgListaIntercambiosItems;
        console.log(items)
        return Promise.resolve(items);
      },
      err => {
        console.log(err);
        return Promise.resolve([]);
      }
    );
  }

  customSort(event) {

  }

  esFichaActiva(key) {
    return this.fichaPosible.activa;
  }

  abreCierraFicha(key) {
    // this.resaltadoDatosGenerales = true;
    if (
      key == "listaIntercambiosAltaEjg" &&
      !this.activacionTarjeta
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
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

}
