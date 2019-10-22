import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { ModulosItem } from '../../../../../models/sjcs/ModulosItem';
import { UpperCasePipe } from '../../../../../../../node_modules/@angular/common';
import { ModulosObject } from '../../../../../models/sjcs/ModulosObject';
import { findIndex } from 'rxjs/operators';
import { MultiSelect } from 'primeng/primeng';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { PartidasJudicialesObject } from '../../../../../models/sjcs/PartidasJudicialesObject';
import { PartidasJudicialesItems } from '../../../../../models/sjcs/PartidasJudicialesItems';


@Component({
  selector: 'app-gestion-partidasjudiciales',
  templateUrl: './gestion-partidasjudiciales.component.html',
  styleUrls: ['./gestion-partidasjudiciales.component.scss']
})
export class TablaPartidasJudicialesComponent implements OnInit {


  rowsPerPage: any = [];
  cols;
  colsPartidoJudicial;
  msgs;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  body: PartidasJudicialesItems = new PartidasJudicialesItems;
  message;
  datosInicial = [];
  initDatos;
  guardar: boolean = false;
  nuevo: boolean = false;
  progressSpinner: boolean = false;
  selectionMode: string = "single";
  //Resultados de la busqueda
  @Input() datos;

  @Input() permisos;
  //Combo partidos judiciales
  comboPJ;

  @Output() searchPartidas = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService
  ) { }

  ngOnInit() {
    this.getComboPartidosJudiciales();
    this.getCols();
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
    this.nuevo = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.nuevo = false;
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    this.selectAll = false;
    this.selectMultiple = false;
  }

  delete() {
    let PartidasJudicialesDelete = new PartidasJudicialesObject();
    PartidasJudicialesDelete.partidasJudicialesItem = this.selectedDatos
    this.sigaServices.post("deletePartidosJudi_deletePartidosJudi", PartidasJudicialesDelete).subscribe(
      data => {
        this.selectedDatos = [];
        this.searchPartidas.emit(false);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.selectAll = false;
        this.selectMultiple = false;
        this.nuevo = false;
      }
    );
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      if (this.nuevo) this.datos.shift();
      this.nuevo = false;
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }
  save() {
    this.progressSpinner = true;
    let url = "";

    if (this.nuevo) {
      url = "gestionPartidosJudi_createPartidosJudi";
      let partidosJudiciales = this.datos[0];
      this.body.idpartido = partidosJudiciales.partidosJudiciales;
      this.callSaveService(url);
    }
  }

  callSaveService(url) {
    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (this.nuevo) {
          this.nuevo = false;
        }

        this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        this.searchPartidas.emit(false);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        }
        this.progressSpinner = false;
      },
      () => {
        this.selectedDatos = [];
        this.progressSpinner = false;
      }
    );

  }

  rest() {
    if (this.datosInicial != undefined) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }
    this.selectedDatos = [];
    this.selectMultiple = false;
    this.nuevo = false;
    this.selectAll = false;
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
  }


  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    this.cols = [
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre" }
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

  getPartidosJudiciales() {

    for (let i = 0; i < this.datos.length; i++) {
      this.datos[i].partidosJudiciales = [];
      this.datos[i].jurisdiccion.forEach(partido => {
        let findPartido = this.comboPJ.find(x => x.value === partido);

        if (findPartido != undefined) {
          this.datos[i].partidosJudiciales.push(findPartido);
        }

      });

      if (i == this.datos.length - 1) {
        this.datosInicial = JSON.parse(JSON.stringify(this.datos));
      }

    }

    if (this.datos.length == 0) {
      this.datosInicial = [];
    }
  }

  newPartidaJudicial() {
    this.nuevo = true;
    this.selectionMode = "single";
    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let partidaJudicial = {
      nombre: undefined,
      idpartido: undefined,
      editable: true
    };

    if (this.datos.length == 0) {
      this.datos.push(partidaJudicial);
    } else {
      this.datos = [partidaJudicial, ...this.datos];
    }

  }

  getComboPartidosJudiciales() {
    this.progressSpinner = true;

    this.sigaServices.get("gestionPartidosJudi_ComboPartidosJudi").subscribe(
      n => {

        this.comboPJ = n.combooItems;
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
   para poder filtrar el dato con o sin estos caracteres*/
        this.comboPJ.map(e => {
          let accents =
            "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
          let accentsOut =
            "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
      para poder filtrar el dato con o sin estos caracteres*/
      },
      err => {
        console.log(err);
      }
      , () => {
        this.progressSpinner = false;
      }

    );
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  isSelectMultiple() {
    if (this.permisos) {
      if (this.nuevo) this.datos.shift();
      this.nuevo = false;
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "single";
      } else {
        // this.pressNew = false;
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "multiple";
      }
    }
    // this.volver();
  }

  actualizaSeleccionados(selectedDatos) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
    }
  }

  actualizaFila() {
    if (this.selectedDatos[0] == undefined) {
      this.selectedDatos = []
    }
  }
  disabledSave() {
    if (this.permisos) {
      if (this.nuevo) {
        if (this.datos[0].partidosJudiciales != undefined) {
          return false;
        }
        else {
          return true;
        }
      }
      else {
        return true;
      }
    } else {
      return true;
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
