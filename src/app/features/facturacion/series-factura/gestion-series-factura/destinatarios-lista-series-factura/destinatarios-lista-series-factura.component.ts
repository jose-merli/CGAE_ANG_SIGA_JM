import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/message';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { SerieFacturacionItem } from '../../../../../models/SerieFacturacionItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-destinatarios-lista-series-factura',
  templateUrl: './destinatarios-lista-series-factura.component.html',
  styleUrls: ['./destinatarios-lista-series-factura.component.scss']
})
export class DestinatariosListaSeriesFacturaComponent implements OnInit, OnChanges {

  msgs: Message[];
  progressSpinner: boolean = false;

  @Input() body: SerieFacturacionItem;

  consultas: any[] = [];
  selectedConsulta: any;

  // Tabla
  datos: any[];
  datosInit: any[] = [];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];

  @ViewChild('table') table: DataTable;
  selectedDatos;

  @Input() openTarjetaListaDestinatarios;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<SerieFacturacionItem>();

  institucionActual: number;
  nuevaConsulta: boolean = false;
  
  constructor(
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private router: Router,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getCols();
    this.getInstitucion();
    this.getConsultas();

    this.progressSpinner = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.body) {
      this.getConsultasSerie();
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
          field: 'objetivo',
          header: 'administracion.parametrosGenerales.literal.objetivo'
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

  //Institucion actual
  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
        this.institucionActual = n.value;
    });
  }

  // Combo de consultas
  getConsultas() {
    this.sigaServices.get("facturacionPyS_comboConsultas").subscribe(
        data => {
            console.log(data);
            this.consultas = data.consultas;
            this.commonsService.arregloTildesCombo(this.consultas);
        },
        err => {
            console.log(err);
            this.progressSpinner = false;
        }
    );
  }

  // Combo de consultas
  getConsultasSerie() {
    this.sigaServices.getParam("facturacionPyS_getConsultasSerie", `?idSerieFacturacion=${this.body.idSerieFacturacion}`).subscribe(
        data => {
            console.log(data);
            this.datosInit = data.consultaItem;
            this.datosInit.forEach(e => {
              e.finalidad = "";
              e.asociada = true;
            });
            this.datos = JSON.parse(JSON.stringify(this.datosInit));
        },
        err => {
            console.log(err);
            this.progressSpinner = false;
        }
    );
  }

  // Nueva consulta

  addConsulta(): void {
    this.numSelected = 0;
    let objNewConsulta = {
        idConsulta: "",
        nombre: "",
        finalidad: "",
        asociada: false
    };

    this.nuevaConsulta = true;

    if (this.datos == undefined) {
        this.datos = [];
    }

    this.datos.push(objNewConsulta);
    this.datos = [...this.datos];
    this.selectedDatos = [];
  }

  // Restablecer

  restablecer(): void {
    this.datos = JSON.parse(JSON.stringify(this.datosInit));
  }

  guardar(): void {
    if (!this.deshabilitarGuardado()) {
      /*
      this.progressSpinner = true;

      let objEtiquetas = {
        idSerieFacturacion: this.body.idSerieFacturacion,
        seleccionados: this.etiquetasSeleccionadas,
        noSeleccionados: this.etiquetasNoSeleccionadas
      };

      this.sigaServices.post("facturacionPyS_nuevaConsultaSerie", objEtiquetas).subscribe(
        n => {
          this.refreshData.emit();
          this.progressSpinner = false;
        },
        error => {
          console.log(error);
          this.progressSpinner = false;
      });
      */
    }
    
  }

  eliminar() {

    return this.sigaServices.post("facturacionPyS_eliminaConsultasSerie", this.selectedDatos).subscribe(
      n => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return false;//this.arraysEquals(this.etiquetasSeleccionadasInicial, this.etiquetasSeleccionadas);
  }

  // Enlace a la ficha de consultas
  navigateTo() {
    if (!this.selectMultiple && !this.nuevaConsulta) {
        if (this.institucionActual == 2000) {
            sessionStorage.setItem("consultaEditable", "S");
        } else {
            sessionStorage.setItem("consultaEditable", "N");
        }
        this.router.navigate(["/fichaConsulta"]);
    }
    this.numSelected = this.selectedDatos.length;
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

  esFichaActiva() {
    return this.openTarjetaListaDestinatarios;
  }

  abreCierraFicha(key): void {
    this.openTarjetaListaDestinatarios = !this.openTarjetaListaDestinatarios;
    this.opened.emit(this.openTarjetaListaDestinatarios);
    this.idOpened.emit(key);
  }

}
