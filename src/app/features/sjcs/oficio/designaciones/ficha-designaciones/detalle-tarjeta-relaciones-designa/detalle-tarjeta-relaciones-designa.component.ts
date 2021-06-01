import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output, OnChanges } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { Message } from 'primeng/primeng';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detalle-tarjeta-relaciones-designa',
  templateUrl: './detalle-tarjeta-relaciones-designa.component.html',
  styleUrls: ['./detalle-tarjeta-relaciones-designa.component.scss']
})
export class DetalleTarjetaRelacionesDesignaComponent implements OnInit, OnChanges {

  msgs: Message[] = [];

  @Input() relaciones;

  @Output() searchRelaciones = new EventEmitter<boolean>();
  @Output() relacion = new EventEmitter<any>();

  selectedItem: number = 10;
  datos;
  cols;
  rowsPerPage;
  selectMultiple: boolean = false;
  selectionMode: string = "single";
  numSelected = 0;

  selectedDatos: any = [];

  selectAll: boolean = false;
  progressSpinner: boolean = false;

  @ViewChild("table") tabla;
  disabled: boolean = false;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private datepipe: DatePipe
  ) { }


  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }

  ngOnInit() {
    this.datos.forEach(element => {
      /* if (element.sjcs.charAt(0) != 'A') {
        element.centrodetencion = 'Dictamen: ' + element.dictamen + ' Fecha Dictamen: ' + element.fechadictamen + ' Resolucion: ' + this.formatDate(element.resolucion) + ' Fecha Resolucion: ' + this.formatDate(element.fecharesolucion)
      } */
      element.fechaasunto = this.formatDate(element.fechaasunto);
    });

    this.getCols();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const inputName in changes) {
      if (changes.hasOwnProperty(inputName)) {
        let change = changes[inputName];
        switch (inputName) {
          case 'relaciones': {
            this.datos = change.currentValue;
          }
        }
      }
    }
  }

  getCols() {
    this.cols = [
      { field: "sjcs", header: "justiciaGratuita.oficio.designas.interesados.identificador", width: '6%' },
      { field: "fechaasunto", header: "dato.jgr.guardia.saltcomp.fecha", width: '6%' },
      { field: "descturno", header: "justiciaGratuita.justiciables.literal.turnoGuardia" },
      { field: "letrado", header: "justiciaGratuita.sjcs.designas.colegiado" },
      { field: "interesado", header: "justiciaGratuita.sjcs.designas.datosInteresados" },
      { field: "dilnigproc", header: "sjcs.oficio.designaciones.relaciones.numDiligNigNproc" },
      { field: "resolucion", header: "justiciaGratuita.maestros.fundamentosResolucion.resolucion" }

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


  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  actualizaSeleccionados() {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = [];
      this.disabled = true;
    }
    if (this.selectedDatos != undefined) {
      this.disabled = false;
      if (this.selectedDatos.length == undefined) this.numSelected = 1;
      else this.numSelected = this.selectedDatos.length;
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


  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  clear() {
    this.msgs = [];
  }


  isAnySelected() {
    return this.selectedDatos != "";
  }

  eliminarRelacion() {
    this.progressSpinner = true;

    this.sigaServices.post("designaciones_eliminarRelacion", this.selectedDatos).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.relacion.emit();
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  porhacer() {
    this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
  }
}
