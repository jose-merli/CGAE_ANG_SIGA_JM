import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef, SimpleChanges, ViewChildren } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { ConfirmationService, Paginator } from 'primeng/primeng';
import { CommonsService } from '../../../../_services/commons.service';
import { Router } from '@angular/router';
import { saveAs } from "file-saver/FileSaver";
import { RemesasResultadoItem } from '../../../../models/sjcs/RemesasResultadoItem';

@Component({
  selector: 'app-tabla-remesas-resultados',
  templateUrl: './tabla-remesas-resultados.component.html',
  styleUrls: ['./tabla-remesas-resultados.component.scss']
})
export class TablaRemesasResultadosComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  msgs;
  page: number = 0;
  datosInicial = [];
  selectedBefore;


  body;

  selectedItem: number = 10;
  selectAll: boolean = false;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;

  message;

  numRemesaSufijo;
  prefijoRemesa;
  numeroRemesa;

  initDatos;
  progressSpinner: boolean = false;
  buscadores = []
  //Resultados de la busqueda
  @Input() datos;
  @Input() filtrosValues;
  @Input() permisos;

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
    console.log(this.datos)

  }

  ngOnChanges(changes: SimpleChanges) {
    this.selectedDatos = [];
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
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
      { field: "numRemesaCompleto", header: "justiciaGratuita.remesasResultados.tabla.numRemesa" },
      { field: "descripcionRemesa", header: "justiciaGratuita.remesasResultados.tabla.descripcionRemesa" },
      { field: "numRegistroRemesaCompleto", header: "justiciaGratuita.remesasResultados.tabla.numRegistro" },
      { field: "fechaCargaRemesaResultado", header: "justiciaGratuita.remesasResultados.tabla.fechaCarga", width: "6%" },
      { field: "fechaResolucionRemesaResultado", header: "justiciaGratuita.remesasResultados.tabla.fechaRemesa", width: "6%" },
      { field: "nombreFichero", header: "justiciaGratuita.remesasResultados.tabla.nombreFichero" },
      { field: "observacionesRemesaResultado", header: "justiciaGratuita.remesasResultados.tabla.observaciones" }
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

  openTab(evento) {

    let paginacion = {
      paginacion: this.tabla.first,
      selectedItem: this.selectedItem
    };

    this.persistenceService.setPaginacion(paginacion);
    this.progressSpinner = true;
    this.persistenceService.setDatos(evento);
    this.router.navigate(["/remesasResultadoFicha"]);
    localStorage.setItem('remesaItem', JSON.stringify(evento));
    localStorage.setItem('fichaRemesaResultado', "registro");
    localStorage.setItem('filtrosRemesa', JSON.stringify(this.filtrosValues));
    console.log("123 "+ evento)
    console.log(JSON.stringify(this.selectedDatos))
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

  descargarFicheros(){
    this.progressSpinner = true;
    let remesasResultados: RemesasResultadoItem[] = []
    this.selectedDatos.forEach(rem => {
      let remesa: RemesasResultadoItem = new RemesasResultadoItem(
        {
          'idRemesaResultado': rem.idRemesaResultado,
          'numRemesaPrefijo': '',
          'numRemesaNumero': '',
          'numRemesaSufijo': '',
          'numRegistroPrefijo': '',
          'numRegistroNumero': '',
          'numRegistroSufijo': '',
          'nombreFichero': rem.nombreFichero,
          'fechaRemesaDesde': '',
          'fechaRemesaHasta': '',
          'fechaCargaDesde': '',
          'fechaCargaHasta': '',
          'observacionesRemesaResultado': '',
          'fechaCargaRemesaResultado': '',
          'fechaResolucionRemesaResultado': '',
          'idRemesa': null,
          'numeroRemesa': '',
          'prefijoRemesa': '',
          'sufijoRemesa': '',
          'descripcionRemesa': '',
          'numRegistroRemesaCompleto': '',
          'numRemesaCompleto': ''
          }
      );
      remesasResultados.push(remesa);
    });
    let descarga =  this.sigaServices.postDownloadFiles("remesasResultados_descargarFicheros", remesasResultados);
    descarga.subscribe(
      data => {
        let blob = null;
        // Se comprueba si todos los documentos asociados no tiene ningún fichero 
        let documentoAsociado = remesasResultados.find(item => item.nombreFichero !=null)
        if(documentoAsociado != undefined){
            blob = new Blob([data], { type: "application/zip" });
            if(blob.size > 50){
              saveAs(blob, "descargaRemesasResultados.zip");
            } else {
              this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.remesasResultados.mensaje.descargaFallida"));
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

}
