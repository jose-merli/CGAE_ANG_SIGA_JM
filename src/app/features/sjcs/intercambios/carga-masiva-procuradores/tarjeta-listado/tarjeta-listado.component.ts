import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { ConfirmationService } from 'primeng/primeng';
import { CommonsService } from '../../../../../_services/commons.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { DatePipe } from '@angular/common';
import { saveAs } from "file-saver/FileSaver";
import { CargaMasivaProcuradorItem } from '../../../../../models/cargaMasivaProcuradorItem';

@Component({
  selector: 'app-tarjeta-listado',
  templateUrl: './tarjeta-listado.component.html',
  styleUrls: ['./tarjeta-listado.component.scss']
})
export class TarjetaListadoComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  msgs;
  page: number = 0;
  datosInicial = [];
  selectedBefore;


  body;

  selectedItem: number = 10;
  selectAll: boolean = false;
  selectedDatos: any[] = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;

  initDatos;
  progressSpinner: boolean = false;
  buscadores = []
  //Resultados de la busqueda
  @Input() datos;

  @Input() permisos;

  @Output() search = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private router: Router,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
    console.log("selectMultiple -> ", this.selectMultiple);
    console.log("selectAll -> ", this.selectAll);
    this.selectedDatos = [];
    this.getCols();

    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));

    this.tabla.filterConstraints['inCollection'] = function inCollection(value: any, filter: any): boolean {
      // value = array con los datos de la fila actual
      // filter = valor del filtro por el que se va a buscar en el array value

      const pattern = 'dd/MM/yyyy';

      let datepipe = new DatePipe('en-US');

      let incidencias = datepipe.transform(value, pattern);

      if (filter === undefined || filter === null) {
        return true;
      }

      if (incidencias === undefined || incidencias === null || incidencias.length === 0) {
        return false;
      }

      if (incidencias.includes(filter)) {
        return true;
      }

      return false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.selectedDatos = [];
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
  }

  descargarFicheros(){
    this.progressSpinner = true;
    let cargaMasivaProcuradorItem: CargaMasivaProcuradorItem[] = []
    this.selectedDatos.forEach(rem => {
      let procurador: CargaMasivaProcuradorItem = 
        {
          'idCargaMasiva': rem.idCargaMasiva,
          'nombreFichero': rem.nombreFichero
        };

      cargaMasivaProcuradorItem.push(procurador);
    });
    this.sigaServices.postDownloadFilesWithFileName("remesasResultados_descargarFicheros", cargaMasivaProcuradorItem).subscribe(
      (response: {file: Blob, filename: string}) => {
        // Se comprueba si todos los documentos asociados no tiene ningún fichero 
        let documentoAsociado = cargaMasivaProcuradorItem.find(item => item.nombreFichero !=null)
        if(documentoAsociado != undefined){
          let filename = response.filename.split(';')[1].split('filename')[1].split('=')[1].trim();
            if(response.file.size > 0){
              saveAs(response.file, filename);
            } else {
              this.showMessage("error", this.translateService.instant("general.message.informacion"), 'No se puede descargar los ficheros de las remesas de resultados seleccionadas');
            }
        }
        else this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.ejg.documentacion.noFich"));

        this.selectedDatos = [];
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  selectedRow(selectedDatos) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
      if (this.numSelected == 1) {
        this.selectMultiple = false;
      } else {
        this.selectMultiple = true;
      }
    }
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.editElementDisabled();
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
    this.selectMultiple = true;
  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    this.cols = [
      { field: "fechaCarga", header: "censo.datosCv.literal.fechaCarga" },
      { field: "nombreFichero", header: "censo.cargaMasivaDatosCurriculares.literal.nombreFichero" },
      { field: "numRegistros", header: "formacion.fichaCursos.tarjetaPrecios.resumen.numRegistros" }
    ];
    this.cols.forEach(it => this.buscadores.push(""))

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

  editElementDisabled() {
    this.datos.forEach(element => {
      element.editable = false
      element.overlayVisible = false;
    });
  }

  actualizaSeleccionados(selectedDatos) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
      if (this.numSelected == 1) {
        this.selectMultiple = false;
      } else {
        this.selectMultiple = true;
      }
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
}
