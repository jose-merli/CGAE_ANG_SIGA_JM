import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { ListaIntercambiosEjgItem } from '../../../../../models/sjcs/ListaIntercambiosEjgItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-lista-intercambios-alta-ejg',
  templateUrl: './lista-intercambios-alta-ejg.component.html',
  styleUrls: ['./lista-intercambios-alta-ejg.component.scss']
})
export class ListaIntercambiosAltaEjgComponent implements OnInit, OnChanges {

  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaListaIntercambiosAltaEjg: string;
  @Input() body: EJGItem;

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
      await this.actualizarDatosTarjeta();
    } catch (error) {
      console.error(error);
    }
  }

  async actualizarDatosTarjeta() {
    // const request = { idInstitucion: 2014, annio: 2022, tipoEJG: 1, numero: 2 };
    const request = { idInstitucion: this.body.idInstitucion, annio: this.body.annio, tipoEJG: this.body.tipoEJG, numero: this.body.numero };
    this.datos = await this.getListaIntercambiosAltaEjg(request);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaListaIntercambiosAltaEjg == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  getCols() {
    this.cols = [
      { field: "descripcion", header: "justiciaGratuita.ejg.listaIntercambios.intercambio", width: "20%" },
      { field: "fechaEnvio", header: "justiciaGratuita.ejg.listaIntercambios.fechaEnvio", width: "10%" },
      { field: "estadoRespuesta", header: "enviosMasivos.literal.estado", width: "10%" },
      { field: "fechaRespuesta", header: "justiciaGratuita.ejg.listaIntercambios.fechaRespuesta", width: "10%" },
      { field: "respuesta", header: "justiciaGratuita.ejg.listaIntercambios.respuesta", width: "50%" }
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

  getListaIntercambiosAltaEjg(request): Promise<ListaIntercambiosEjgItem[]> {
    this.progressSpinner = true;
    return this.sigaServices.post("gestionejg_getListaIntercambiosAltaEjg", request).toPromise().then(
      n => {
        this.progressSpinner = false;
        const body = JSON.parse(n.body);
        const items: ListaIntercambiosEjgItem[] = body.ejgListaIntercambiosItems;
        return Promise.resolve(items);
      },
      err => {
        this.progressSpinner = false;
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
