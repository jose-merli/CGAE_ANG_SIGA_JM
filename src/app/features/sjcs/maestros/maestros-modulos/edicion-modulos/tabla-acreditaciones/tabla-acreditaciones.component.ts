import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { AcreditacionesItem } from '../../../../../../models/sjcs/AcreditacionesItem';
import { UpperCasePipe } from '../../../../../../../../node_modules/@angular/common';
import { AcreditacionesObject } from '../../../../../../models/sjcs/AcreditacionesObject';
import { findIndex } from 'rxjs/operators';
import { MultiSelect } from 'primeng/primeng';
import { PersistenceService } from '../../../../../../_services/persistence.service';


@Component({
  selector: 'app-tabla-acreditaciones',
  templateUrl: './tabla-acreditaciones.component.html',
  styleUrls: ['./tabla-acreditaciones.component.scss']
})
export class TablaAcreditacionesComponent implements OnInit {



  textSelected: String = "{label}";

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  cols;
  rowsPerPage;

  datos: any[];
  listaTabla: AcreditacionesItem[] = [];
  idAcreditacion;
  disableAll: boolean = false;

  progressSpinner: boolean = false;
  msgs;
  body;
  nuevo: boolean = false;
  datosInicial = [];
  updateAcreditaciones = [];
  comboAcreditaciones: any[] = [];
  comboAcreditacionesNew: any[] = [];

  // selectedBefore;
  overlayVisible: boolean = false;
  selectionMode: string = "single";
  showTarjeta: boolean = true;
  //Resultados de la busqueda
  @Input() idProcedimiento;
  //Resultados de la busqueda
  @Input() modoEdicion: boolean = false;

  @ViewChild("table") table;
  @ViewChild("multiSelectPJ") multiSelect: MultiSelect;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices, private translateService: TranslateService, private upperCasePipe: UpperCasePipe,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.getCols();

    if (this.idProcedimiento != undefined) {
      this.modoEdicion = true;
      this.getAcreditaciones();
      this.getComboAcreditaciones();
    } else {
      this.modoEdicion = false;
    }

    let datos = this.persistenceService.getDatos();
    if (datos.fechabaja != undefined) {
      this.disableAll = true;
    }
    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getCols();

    if (this.idProcedimiento != undefined) {
      this.modoEdicion = true;
      this.getAcreditaciones();
      this.getComboAcreditaciones();
    } else {
      this.modoEdicion = false;
    }

    let datos = this.persistenceService.getDatos();
    if (datos.fechabaja != undefined) {
      this.disableAll = true;
    }
    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true;
    }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  getAcreditaciones() {
    this.sigaServices
      .getParam(
        "modulosybasesdecompensacion_searchAcreditaciones",
        "?idProcedimiento=" + this.idProcedimiento
      )
      .subscribe(
        res => {
          this.datos = res.acreditacionItem;
          this.listaTabla = JSON.parse(JSON.stringify(this.datos));
          this.datos.forEach(element => {
            let seleccionados = [];
            if (element.nig_numprocedimiento == 1) {
              element.nigProcedimiento = true;
            } else {
              element.nigProcedimiento = false;
            }
            element.editable = false;
            element.overlayVisible = false;
            element.idprocedimiento = this.idProcedimiento;

          });

          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          this.progressSpinner = false;

        },
        err => {
          console.log(err);
        }
      );

  }

  getComboAcreditaciones() {
    this.sigaServices
      .getParam(
        "modulosybasesdecompensacion_comboAcreditacionesDisponibles",
        "?idProcedimiento=" + this.idProcedimiento
      )
      .subscribe(
        res => {
          this.comboAcreditacionesNew = res.combooItems;
        },
        err => {
          console.log(err);
        }
      );

    this.sigaServices
      .get(
        "modulosybasesdecompensacion_comboAcreditaciones"
      )
      .subscribe(
        res => {
          this.comboAcreditaciones = res.combooItems;
        },
        err => {
          console.log(err);
        }
      );
  }


  save() {
    this.progressSpinner = true;
    let url = "";

    if (this.nuevo) {
      url = "modulosybasesdecompensacion_createAcreditacion";
      this.validatenewAcreditacion(url);

    } else {
      url = "modulosybasesdecompensacion_updateAcreditacion";
      this.body = new AcreditacionesObject();
      this.body.acreditacionItem = this.updateAcreditaciones;
      this.callSaveService(url);
    }

  }

  callSaveService(url) {

    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (this.nuevo) {
          this.nuevo = false;
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        }

        this.getComboAcreditaciones();
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.selectedDatos = [];
        this.updateAcreditaciones = [];
        this.progressSpinner = false;
        this.getAcreditaciones();
      }
    );

  }

  newAcreditacion() {
    this.nuevo = true;
    this.seleccion = false;

    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let acreditacion = {
      idAcreditacion: "",
      porcentaje: "",
      nig_numprocedimiento: "",
      nigProcedimiento: false,
      codigoext: "",
      codSubTarifa: "",
      idprocedimiento: this.idProcedimiento,
      acreditacionNueva: true
    };

    if (this.datos.length == 0) {
      this.datos.push(acreditacion);
    } else {
      this.datos = [acreditacion, ...this.datos];
    }

  }

  validateAcreditacion(e) {
    if (!this.nuevo) {
      let datoId = this.datos.findIndex(item => item.idAcreditacion === this.selectedDatos[0].idAcreditacion);

      let dato = this.datos[datoId];
      if (dato.porcentaje > 100) {
        dato.porcentaje = 100;
      }
      this.editarAcreditacion(dato);

    } else {
      if (this.datos[0].porcentaje > 100) this.datos[0].porcentaje = 100;
    }
  }

  validatenewAcreditacion(url) {
    let acreditacion = this.datos[0];

    this.body = acreditacion;
    this.callSaveService(url);

  }

  disabledSave() {
    if (this.nuevo) {
      if (this.datos[0].idAcreditacion != undefined && this.datos[0].porcentaje != "") {
        return false;
      } else {
        return true;
      }

    } else {
      if ((this.updateAcreditaciones != undefined && this.updateAcreditaciones.length > 0)) {
        return false;
      } else {
        return true;
      }
    }
  }

  editAreas(evento) {

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

      }

    }
  }

  editarAcreditacion(dato) {

    let findDato = this.datosInicial.find(item => item.idAcreditacion === dato.idAcreditacion);

    if (findDato != undefined) {
      if (dato.codigoext != findDato.codigoext || dato.porcentaje != findDato.porcentaje || dato.nigProcedimiento != findDato.nigProcedimiento || dato.codSubTarifa != findDato.codSubTarifa) {

        let findUpdate = this.updateAcreditaciones.find(item => item.codigoext === dato.codigoext && item.porcentaje === dato.porcentaje && item.nigProcedimiento === dato.nigProcedimiento && item.codSubTarifa === dato.codSubTarifa);

        if (findUpdate == undefined) {
          let dato2 = dato;
          dato2.idprocedimiento = this.idProcedimiento;
          this.updateAcreditaciones.push(dato2);
        }
      }
    }

  }

  delete() {
    this.progressSpinner = true;

    this.body = new AcreditacionesObject();
    this.body.acreditacionItem = this.selectedDatos;
    this.sigaServices.post("modulosybasesdecompensacion_deleteAcreditacion", this.body).subscribe(
      data => {
        this.nuevo = false;
        this.selectedDatos = [];
        this.getAcreditaciones();
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {//areasacreditaciones.acreditaciones.ficha.materiaEnUso

        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.getComboAcreditaciones();

      }
    );
  }

  rest() {
    if (this.datosInicial != undefined) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }
    this.datos.forEach(element => {
      element.editable = false;
      element.overlayVisible = false;
    });
    this.selectedDatos = [];
    this.updateAcreditaciones = [];
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
      { field: "idAcreditacion", header: "menu.justiciaGratuita.maestros.Acreditacion" },
      { field: "porcentaje", header: "menu.justiciaGratuita.maestros.porcentaje" },
      { field: "nig_numprocedimiento", header: "menu.justiciaGratuita.maestros.numProcedimiento" },
      { field: "codigoext", header: "general.codeext" },
      { field: "codSubTarifa", header: "menu.justiciaGratuita.maestros.codSubtarifa" }
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
    if (!this.disableAll) {
      this.selectMultiple = false;
      if (this.selectAll) {
        this.selectedDatos = this.datos;
        this.numSelected = this.datos.length;
        this.selectionMode = "multiple";
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectMultiple = false;
        this.selectionMode = "single";
      }
    } else {
      this.selectionMode = undefined;
    }
  }

  isSelectMultiple() {
    if (!this.disableAll) {
      this.selectAll = false;
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
    } else {
      this.selectionMode = undefined;
    }
    // this.volver();
  }

  actualizaSeleccionados(selectedDatos) {
    if (selectedDatos != undefined)
      this.numSelected = selectedDatos.length;
    // this.seleccion = false;
  }

  clear() {
    this.msgs = [];
  }

  openMultiSelect(dato) {
    console.log(this.multiSelect);
    dato.overlayVisible = true;
  }

}


