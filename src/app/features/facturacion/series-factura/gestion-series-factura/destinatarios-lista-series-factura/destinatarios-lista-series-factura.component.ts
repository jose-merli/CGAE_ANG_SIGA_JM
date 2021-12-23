import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { D } from '@angular/core/src/render3';
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
  datos: any[] = [];
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
  @Output() refreshData = new EventEmitter<void>();

  institucionActual: number;
  nuevaConsulta: boolean = false;
  resaltadoDatos: boolean = false;
  
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

    this.progressSpinner = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.body && this.body.idSerieFacturacion != undefined) {
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
            this.consultas = data.consultas;
            this.consultas = this.consultas.filter(c => this.datos.find(d => d.idInstitucion == c.idInstitucion && d.idConsulta == c.value) == undefined);

            if (!this.consultas) {
              this.consultas = [];
            }

            this.commonsService.arregloTildesCombo(this.consultas);

            this.progressSpinner = false;
        },
        err => {
            this.progressSpinner = false;
        }
    );
  }

  // Combo de consultas
  getConsultasSerie() {
    this.progressSpinner = true;

    this.sigaServices.getParam("facturacionPyS_getConsultasSerie", `?idSerieFacturacion=${this.body.idSerieFacturacion}`).subscribe(
        data => {
            this.datosInit = data.consultaItem;
            this.datosInit.forEach(e => {
              // this.getFinalidad(e.idConsulta);
              e.finalidad = "";
              e.asociada = true;
            });
            this.datos = JSON.parse(JSON.stringify(this.datosInit));

            this.getConsultas();
        },
        err => {
            this.progressSpinner = false;
        }
    );
  }

  getFinalidad(consultaItem) {
    this.sigaServices.post("facturacionPyS_getFinalidadConsultasSerie", consultaItem).subscribe(
        data => {
            this.progressSpinner = false;
            let objetivo = JSON.parse(data['body']).objetivo;
            consultaItem.objetivo = objetivo;
        },
        err => {
            this.progressSpinner = false;
        },
        () => { }
    );
  }

  onChangeConsultas(e) {
    if (e.value != undefined) {
      this.datos[0].idConsulta = e.value;
      this.datos[0].idInstitucion = this.consultas.find(c => c.value == this.datos[0].idConsulta).idInstitucion;
      this.getFinalidad(this.datos[0]);
    } else {
      this.datos[0].objetivo = "";
    }
    
  }

  // Nueva consulta

  addConsulta(): void {
    this.numSelected = 0;
    let objNewConsulta = {
        idConsulta: undefined,
        nombre: "",
        finalidad: "",
        asociada: false
    };

    this.nuevaConsulta = true;

    if (this.datos == undefined) {
        this.datos = [];
    }

    this.datos.unshift(objNewConsulta);
    //this.datos = [...this.datos];
    this.selectedDatos = [];
  }

  // Restablecer

  restablecer(): void {
    this.datos = JSON.parse(JSON.stringify(this.datosInit));
    this.nuevaConsulta = false;
    this.resaltadoDatos = false;
  }

  // Guardar
  isValid(): boolean {
    return this.nuevaConsulta && this.datos[0].idConsulta != undefined && this.datos[0].idConsulta.trim() != "";
  }

  guardar(): void {
    if (this.isValid() && !this.deshabilitarGuardado()) {
      this.progressSpinner = true;

      let idConsulta = this.datos[0].idConsulta;
      let objNuevo = {
        idSerieFacturacion: this.body.idSerieFacturacion,
        idConsulta: idConsulta,
        idInstitucion: this.consultas.find(c => c.value == idConsulta).idInstitucion
      };

      this.sigaServices.post("facturacionPyS_nuevaConsultaSerie", objNuevo).subscribe(
        n => {
          this.progressSpinner = false;
          this.refreshData.emit();
        },
        error => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      });
    } else if (!this.isValid()) {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
    
  }

  eliminar(): void {
    this.progressSpinner = true;

    let deleteRequest = this.selectedDatos.map(d => {
      d.idConsulta = d.idConsultaAnterior;
      d.idSerieFacturacion = this.body.idSerieFacturacion;
      return d;
    });

    this.sigaServices.post("facturacionPyS_eliminaConsultasSerie", deleteRequest).subscribe(
      n => {
        this.progressSpinner = false;
        this.refreshData.emit();
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.datos == undefined || this.datos.length == 0 || this.datos[0].asociada;
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
