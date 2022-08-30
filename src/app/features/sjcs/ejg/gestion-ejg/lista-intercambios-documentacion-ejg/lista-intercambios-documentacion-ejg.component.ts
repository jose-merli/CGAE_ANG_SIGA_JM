import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { t } from '@angular/core/src/render3';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { ListaIntercambiosEjgItem } from '../../../../../models/sjcs/ListaIntercambiosEjgItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-lista-intercambios-documentacion-ejg',
  templateUrl: './lista-intercambios-documentacion-ejg.component.html',
  styleUrls: ['./lista-intercambios-documentacion-ejg.component.scss']
})
export class ListaIntercambiosDocumentacionEjgComponent implements OnInit, OnChanges {

  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaListaIntercambiosDocumentacionEjg: string;
  @Input() body: EJGItem;

  openFicha: boolean = false;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  msgs = [];

  fichaPosible = {
    key: "listaIntercambiosDocumentacionEjg",
    activa: false
  }

  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() newEstado = new EventEmitter();
  @Output() updateRes = new EventEmitter();
  @Input() openTarjetaListaIntercambiosDocumentacionEjg;

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
      if (this.body != undefined) {
        console.log(this.body);
      }
      // const request = { idInstitucion: 2014, annio: 2022, tipoEJG: 1, numero: 2 };
      const request = { idInstitucion: this.body.idInstitucion, annio: this.body.annio, tipoEJG: this.body.tipoEJG, numero: this.body.numero };
      console.log(request);
      this.datos = await this.getListaIntercambiosDocumentacionEjg(request);
    } catch (error) {
      console.error(error);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaListaIntercambiosDocumentacionEjg == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
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

  getListaIntercambiosDocumentacionEjg(request): Promise<ListaIntercambiosEjgItem[]> {
    return this.sigaServices.post("gestionejg_getListaIntercambiosDocumentacionEjg", request).toPromise().then(
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
      key == "listaIntercambiosDocumentacionEjg" &&
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
