import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { ZonasItem } from '../../../../../../models/sjcs/ZonasItem';
import { UpperCasePipe } from '../../../../../../../../node_modules/@angular/common';
import { ZonasObject } from '../../../../../../models/sjcs/ZonasObject';
import { findIndex } from 'rxjs/operators';
import { MultiSelect } from 'primeng/primeng';
import { PersistenceService } from '../../../../../../_services/persistence.service';

@Component({
  selector: 'app-zona',
  templateUrl: './zona.component.html',
  styleUrls: ['./zona.component.scss']
})
export class ZonaComponent implements OnInit {

  textSelected: String = "{label}";

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  cols;
  rowsPerPage;

  datos = [];

  historico: boolean = false;

  comboPJ;

  progressSpinner: boolean = false;
  msgs;
  body;
  nuevo: boolean = false;
  datosInicial = [];
  updateZonas = [];

  selectedBefore;
  overlayVisible: boolean = false;
  selectionMode: string = "single";

  //Resultados de la busqueda
  @Input() idZona;
  //Resultados de la busqueda
  @Input() modoEdicion: boolean = false;

  @ViewChild("table") table;
  @ViewChild("multiSelectPJ") multiSelect: MultiSelect;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices, private translateService: TranslateService, private upperCasePipe: UpperCasePipe, private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.getCols();
    this.getComboPartidosJudiciales();

    if (this.idZona != undefined) {
      this.modoEdicion = true;
    } else {
      this.modoEdicion = false;
    }


  }

  getComboPartidosJudiciales() {
    this.progressSpinner = true;

    this.sigaServices.get("fichaZonas_gePartidosJudiciales").subscribe(
      n => {
        this.comboPJ = n.combooItems;

        if (this.idZona != undefined) {
          this.getZonas();
        } else {
          this.progressSpinner = false;
        }

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      }
    );
  }

  getZonas() {
    this.sigaServices
      .getParam(
        "fichaZonas_searchSubzones",
        "?idZona=" + this.idZona
      )
      .subscribe(
        res => {
          this.datos = res.zonasItems;

          this.validateHistorical();

          this.datos.forEach(element => {
            element.editable = false
            element.overlayVisible = false;
          });

          this.progressSpinner = false;

          this.getPartidosJudiciales();
        },
        err => {
          console.log(err);
          this.progressSpinner = false;

        }
      );
  }

  validateHistorical() {
    if (this.datos != undefined && this.datos.length > 0) {

      if (this.datos[0].fechabaja != null) {
        this.historico = true;
      } else {
        this.historico = false;
      }

      this.persistenceService.historico = this.historico;

    }
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


  save() {
    this.progressSpinner = true;
    let url = "";

    if (this.nuevo) {
      url = "fichaZonas_createZone";
      this.validateNewZone(url);

    } else {
      url = "fichaZonas_updateZones";
      this.body = new ZonasObject();
      this.body.zonasItems = this.updateZonas;
      this.callSaveZoneService(url);
    }


  }


  callSaveZoneService(url) {


    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (this.nuevo) {
          this.nuevo = false;
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        }

        this.getZonas();
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
        this.selectedDatos = [];
        this.updateZonas = [];
        this.progressSpinner = false;
      }
    );

  }

  newZone() {
    this.nuevo = true;
    this.seleccion = false;

    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let zona = {
      descripcionzona: "",
      descripcionsubzona: "",
      partidosJudiciales: [],
      jurisdiccion: [],
      idzona: this.idZona,
      zonaNueva: true
    };

    if (this.datos.length == 0) {
      this.datos.push(zona);
    } else {
      this.datos = [zona, ...this.datos];
    }

  }

  validateZone(e) {

    if (!this.nuevo) {
      let datoId = this.datos.findIndex(item => item.idsubzona === this.selectedBefore.idsubzona);

      let findDato = this.datos.filter(item => this.upperCasePipe.transform(item.descripcionsubzona) === this.upperCasePipe.transform(e.srcElement.value.trim()));

      if (findDato.length > 1) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Ya existe una subzona con esa descripción");
        this.progressSpinner = false;
        this.datos[datoId].descripcionsubzona = this.selectedBefore.descripcionsubzona;

      } else {
        let dato = this.datos.find(item => this.upperCasePipe.transform(item.descripcionsubzona) === this.upperCasePipe.transform(e.srcElement.value.trim()));
        this.editarDescripcionZona(dato);
      }

      this.seleccion = false;
    }
  }

  validateNewZone(url) {
    let zona = this.datos[0];

    let findDato = this.datosInicial.find(item => item.idzona === zona.idzona && item.descripcionsubzona === zona.descripcionsubzona);

    if (findDato != undefined) {
      this.showMessage("info", "Informacion", "Ya existe un zona con ese nombre");
      this.progressSpinner = false;
    } else {
      this.body = zona;
      this.callSaveZoneService(url);
    }

  }

  disabledSave() {
    if (this.nuevo) {
      if (this.datos[0].descripcionsubzona != undefined && this.datos[0].descripcionsubzona != null
        && this.datos[0].descripcionsubzona != "" && this.datos[0].partidosJudiciales != undefined && this.datos[0].partidosJudiciales.length > 0) {
        return false;
      } else {
        return true;
      }

    } else {
      if (!this.historico && (this.updateZonas != undefined && this.updateZonas.length > 0)) {
        return false;
      } else {
        return true;
      }
    }
  }

  editZonas(evento) {

    if (this.nuevo) {
      this.seleccion = false;
    } else {

      if (!this.selectAll && !this.selectMultiple) {

        this.datos.forEach(element => {
          element.editable = false;
          element.overlayVisible = false;
        });

        evento.data.editable = true;


        this.selectedDatos = [];
        this.selectedDatos.push(evento.data);

        this.seleccion = true;

        let findDato = this.datosInicial.find(item => item.idzona === this.selectedDatos[0].idzona && item.idsubzona === this.selectedDatos[0].idsubzona);

        this.selectedBefore = findDato;
      }

    }
  }

  editarDescripcionZona(dato) {

    let findDato = this.datosInicial.find(item => item.idzona === dato.idzona && item.idsubzona === dato.idsubzona);

    if (findDato != undefined) {
      if (dato.descripcionsubzona != findDato.descripcionsubzona) {

        let findUpdate = this.updateZonas.find(item => item.idzona === dato.idzona && item.idsubzona === dato.idsubzona);

        if (findUpdate == undefined) {
          this.updateZonas.push(dato);
        }
      }
    }

  }

  editPartidosJudiciales(dato) {

    if (!this.nuevo) {

      if (dato.partidosJudiciales.length == 0) {
        this.showMessage("info", "Informacion", "Debe seleccionar al menos un partido judicial");
        let findUpdate = this.updateZonas.findIndex(item => item.idzona === dato.idzona && item.idsubzona === dato.idsubzona);

        if (findUpdate != undefined) {
          this.updateZonas.splice(findUpdate);
        }

      } else {
        let findUpdate = this.updateZonas.find(item => item.idzona === dato.idzona && item.idsubzona === dato.idsubzona);

        if (findUpdate == undefined) {
          this.updateZonas.push(dato);
        } else {
          let findUpdate = this.updateZonas.findIndex(item => item.idzona === dato.idzona && item.idsubzona === dato.idsubzona);
          this.updateZonas[findUpdate].partidosJudiciales = dato.partidosJudiciales;
        }
      }
    } else {
      this.selectedDatos = [];
    }

  }

  delete() {
    this.body = new ZonasObject();
    this.body.zonasItems = this.selectedDatos;

    this.sigaServices.post("fichaZonas_deleteZones", this.body).subscribe(
      data => {

        this.nuevo = false;
        this.selectedDatos = [];
        this.getZonas();
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
    this.updateZonas = [];
    this.nuevo = false;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  getCols() {

    this.cols = [
      { field: "descripcionsubzona", header: "justiciaGratuita.maestros.zonasYSubzonas.zona" },
      { field: "jurisdiccion", header: "menu.justiciaGratuita.maestros.partidosJudiciales" }
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
    this.table.reset();
  }

  onChangeSelectAll() {

    if (this.selectAll) {
      this.selectMultiple = true;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
      this.selectionMode = "multiple";
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
      this.selectionMode = "single";
    }
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;

    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectionMode = "single";

    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectionMode = "multiple";

    }
    // this.volver();
  }


  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
  }

  clear() {
    this.msgs = [];
  }

  openMultiSelect(dato) {
    console.log(this.multiSelect);
    dato.overlayVisible = true;
  }

}
