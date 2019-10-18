import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { MateriasItem } from '../../../../../../models/sjcs/MateriasItem';
import { UpperCasePipe } from '../../../../../../../../node_modules/@angular/common';
import { AreasObject } from '../../../../../../models/sjcs/AreasObject';
import { findIndex } from 'rxjs/operators';
import { MultiSelect } from 'primeng/primeng';
import { PersistenceService } from '../../../../../../_services/persistence.service';


@Component({
  selector: 'app-tabla-materias',
  templateUrl: './tabla-materias.component.html',
  styleUrls: ['./tabla-materias.component.scss']
})
export class TablaMateriasComponent implements OnInit {



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
  listaTabla: MateriasItem = new MateriasItem();

  disableAll: boolean = false;
  comboJurisdicciones: any[] = [];

  progressSpinner: boolean = false;
  msgs;
  body;
  nuevo: boolean = false;
  datosInicial = [];
  updateAreas = [];
  showTarjeta: boolean = true;
  // selectedBefore;
  overlayVisible: boolean = false;
  selectionMode: string = "single";

  //Resultados de la busqueda
  @Input() idArea;
  //Resultados de la busqueda
  @Input() modoEdicion: boolean = false;

  @ViewChild("table") table;
  @ViewChild("multiSelect") multiSelect: MultiSelect;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices, private translateService: TranslateService, private upperCasePipe: UpperCasePipe,
    private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.getCols();
    this.getComboJurisdicciones();

    if (this.idArea != undefined) {
      this.modoEdicion = true;
      this.getMaterias();
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

  getComboJurisdicciones() {
    this.progressSpinner = true;

    this.sigaServices.get("fichaAreas_getJurisdicciones").subscribe(
      n => {
        this.comboJurisdicciones = n.combooItems;

        if (this.idArea != undefined) {
          this.getMaterias();
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

  getMaterias() {
    this.sigaServices
      .getParam(
        "fichaAreas_searchMaterias",
        "?idArea=" + this.idArea
      )
      .subscribe(
        res => {
          this.datos = res.materiasItems;
          this.listaTabla = JSON.parse(JSON.stringify(this.datos));

          this.validateHistorical();

          this.datos.forEach(element => {
            let seleccionados = [];
            element.editable = false
            element.overlayVisible = false;

            if (element.jurisdicciones != null) {
              element.jurisdicciones.forEach(element => {
                seleccionados.push(this.comboJurisdicciones.find(x => x.value == element));
              });
              element.jurisdiccionesReal = seleccionados;
            } else {
              element.jurisdiccionesReal = [];
            }


          });

          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          this.progressSpinner = false;

          this.getJurisdicciones();
        },
        err => {
          console.log(err);
          this.progressSpinner = false;

        }
      );
  }

  validateHistorical() {
    // if (this.datos != undefined && this.datos.length > 0) {

    //   if (this.datos[0].fechabaja != null) {
    //     this.historico = true;
    //   } else {
    //     this.historico = false;
    //   }

    //   this.persistenceService.setHistorico(this.historico);

    // }
  }

  getJurisdicciones() {

    // for (let i = 0; i < this.datos.length; i++) {
    //   this.datos[i].jurisdicciones = [];
    //   this.datos[i].jurisdiccion.forEach(partido => {
    //     let findPartido = this.comboJurisdicciones.find(x => x.value === partido);

    //     if (findPartido != undefined) {
    //       this.datos[i].jurisdicciones.push(findPartido);
    //     }

    //   });

    //   if (i == this.datos.length - 1) {
    //     this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    //   }

    // }

    // if (this.datos.length == 0) {
    //   this.datosInicial = [];
    // }

  }

  save() {
    this.progressSpinner = true;
    let url = "";

    if (this.nuevo) {
      url = "fichaAreas_createMaterias";
      this.validatenewMateria(url);

    } else {
      url = "fichaAreas_updateMaterias";
      this.body = new AreasObject();
      this.body.areasItems = this.updateAreas;
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

        this.getMaterias();
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
        this.updateAreas = [];
        this.progressSpinner = false;
      }
    );

  }

  newMateria() {
    this.nuevo = true;
    this.seleccion = false;
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let materia = {
      nombreMateria: "",
      contenido: "",
      jurisdicciones: "",
      jurisdiccion: "",
      idArea: this.idArea,
      areaNueva: true
    };

    if (this.datos.length == 0) {
      this.datos.push(materia);
    } else {
      this.datos = [materia, ...this.datos];
    }

  }

  validateArea(e) {

    if (!this.nuevo) {
      let datoId = this.datos.findIndex(item => item.idMateria === this.selectedDatos[0].idMateria);

      let findDato = this.datos.filter(item => this.upperCasePipe.transform(item.nombreMateria) === this.upperCasePipe.transform(e.srcElement.value.trim()));

      if (findDato.length > 1) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.censo.nombreExiste"));
        this.progressSpinner = false;
        this.datos[datoId].nombreMateria = this.selectedDatos[0].nombreMateria;
      } else {
        let dato = this.datos[datoId];
        this.editarMateria(dato);
      }

      // this.seleccion = false;
    }
  }

  validatenewMateria(url) {
    let materia = this.datos[0];

    let findDato = this.datosInicial.find(item => item.idArea === materia.idArea && item.nombreMateria === materia.nombreMateria);

    let jurisdiccionesString = "";
    for (let i in materia.jurisdiccionesReal) {
      jurisdiccionesString += ";" + materia.jurisdiccionesReal[i].value;
    }

    materia.jurisdiccion = jurisdiccionesString.substring(1, jurisdiccionesString.length);
    materia.jurisdicciones = "";

    if (findDato != undefined) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.censo.nombreExiste"));
      this.progressSpinner = false;
    } else {
      this.body = materia;
      this.callSaveService(url);
    }

  }

  disabledSave() {
    if (this.nuevo) {
      if (this.datos[0].nombreMateria != undefined && this.datos[0].nombreMateria != "") {
        return false;
      } else {
        return true;
      }

    } else {
      if ((this.updateAreas != undefined && this.updateAreas.length > 0) || this.selectedDatos.length > 0) {
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

  editarMateria(dato) {

    let findDato = this.datosInicial.find(item => item.idMateria === dato.idMateria && item.idArea === dato.idArea);

    if (findDato != undefined) {
      if ((dato.nombreMateria != findDato.nombreMateria) || (dato.contenido != findDato.contenido)) {

        let findUpdate = this.updateAreas.find(item => item.idMateria === dato.idMateria && item.idArea === dato.idArea);

        if (findUpdate == undefined) {
          let dato2 = dato;
          dato2.jurisdicciones = "";
          this.updateAreas.push(dato2);
        }
      }
    }

  }

  editJurisdicciones(dato) {

    if (!this.nuevo) {

      // if (dato.jurisdicciones.length == 0) {
      //   this.showMessage("info", "Informacion", "Debe seleccionar al menos un partido judicial");
      //   let findUpdate = this.updateZonas.findIndex(item => item.idArea === dato.idArea && item.idMateria === dato.idMateria);

      //   if (findUpdate != undefined) {
      //     this.updateZonas.splice(findUpdate);
      //   }

      // } else {
      let findUpdate = this.updateAreas.find(item => item.idArea === dato.idArea && item.idMateria === dato.idMateria);

      if (findUpdate == undefined) {
        let dato2 = dato;
        let jurisdiccionesString = "";
        for (let i in dato2.jurisdiccionesReal) {
          jurisdiccionesString += ";" + dato2.jurisdiccionesReal[i].value;
        }

        dato2.jurisdiccion = jurisdiccionesString.substring(1, jurisdiccionesString.length);
        dato2.jurisdicciones = "";
        this.updateAreas.push(dato2);
      } else {
        let updateFind = this.updateAreas.findIndex(item => item.idArea === dato.idArea && item.idMateria === dato.idMateria);
        let jurisdiccionesString = "";
        for (let i in findUpdate.jurisdiccionesReal) {
          jurisdiccionesString += ";" + dato.jurisdiccionesReal[i].value;
        }
        this.updateAreas[updateFind].jurisdiccionesReal = dato.jurisdiccionesReal;
        this.updateAreas[updateFind].jurisdiccion = jurisdiccionesString.substring(1, jurisdiccionesString.length);
        this.updateAreas[updateFind].jurisdicciones = "";
      }
      // }
    } else {
      this.selectedDatos = [];
    }
  }

  delete() {
    this.body = new AreasObject();
    for (let i in this.selectedDatos) {
      this.selectedDatos[i].jurisdicciones = "";
    }
    this.body.areasItems = this.selectedDatos;

    this.sigaServices.post("fichaAreas_deleteMaterias", this.body).subscribe(
      data => {

        this.nuevo = false;
        this.selectedDatos = [];
        this.getMaterias();
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {//areasmaterias.materias.ficha.materiaEnUso

        if (err != undefined && JSON.parse(err.error).error.description != "") {
          if (JSON.parse(err.error).error.description == "areasmaterias.materias.ficha.materiaEnUso") {
            this.showMessage("warn", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          }
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
    this.updateAreas = [];
    this.nuevo = false;
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
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
      { field: "nombreMateria", header: "administracion.parametrosGenerales.literal.nombre" },
      { field: "contenido", header: "maestros.areasmaterias.literal.contenido" },
      { field: "jurisdicciones", header: "menu.justiciaGratuita.maestros.Jurisdiccion" }
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
    // console.log(this.multiSelect);
    dato.onPanelShow;
    // this.multiSelect.show();
    // dato.overlayVisible = true;
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }
}


