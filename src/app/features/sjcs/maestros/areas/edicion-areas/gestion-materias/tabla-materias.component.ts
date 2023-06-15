import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { MateriasItem } from '../../../../../../models/sjcs/MateriasItem';
import { UpperCasePipe } from '../../../../../../../../node_modules/@angular/common';
import { AreasObject } from '../../../../../../models/sjcs/AreasObject';
import { findIndex } from 'rxjs/operators';
import { MultiSelect, ConfirmationService } from 'primeng/primeng';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../_services/commons.service';


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
  buscadores = [];
  historico: boolean = false;
  //Resultados de la busqueda
  @Input() idArea;
  //Resultados de la busqueda
  @Input() modoEdicion: boolean = false;

  @ViewChild("table") table;
  @ViewChild("multiSelect") multiSelect: MultiSelect;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices, private translateService: TranslateService, private upperCasePipe: UpperCasePipe,
    private persistenceService: PersistenceService, private confirmationService: ConfirmationService,
    private commonsService: CommonsService) { }

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
    if (datos != null && datos != undefined && datos.fechabaja != undefined) {
      this.disableAll = true;
      this.historico = true;
    } else {
      this.historico = false;
    }

    if (this.persistenceService.getPermisos() != true) {
      this.disableAll = true;
    }


  }

  checkPermisosDelete(selectedDatos) {
    let msg = this.commonsService.checkPermisos(!this.disableAll, this.disableAll);

    if (msg != undefined) {
      this.msgs = msg;
    } else {

      if (((!this.selectMultiple && !this.selectAll) || this.nuevo) ||
        selectedDatos == undefined || selectedDatos.length == 0) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.confirmDelete(selectedDatos);
      }

    }
  }


  confirmDelete(selectedDatos) {

    let mess = this.translateService.instant(
      "messages.deleteConfirmation"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.delete(selectedDatos)
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
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
        //console.log(err);
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
          //console.log(err);
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

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(!this.disableAll, this.disableAll);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disabledSave()) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.save();
      }
    }
  }

  save() {
    this.progressSpinner = true;
    let url = "";
    if (this.datos[0].nombreMateria != undefined) {
      this.datos[0].nombreMateria = this.datos[0].nombreMateria.trim();
    }
    if (this.datos[0].contenido != undefined) {
      this.datos[0].contenido = this.datos[0].contenido.trim();
    }

    if (this.nuevo) {
      url = "fichaAreas_createMaterias";
      this.body = this.datos[0];
      this.validatenewMateria(url);

    } else {
      url = "fichaAreas_updateMaterias";
      this.body = new AreasObject();
      this.body.areasItems = this.updateAreas;
      this.body.areasItems = this.body.areasItems.map(it => {
        it.nombreMateria = it.nombreMateria.trim();
        if (it.contenido != null)
          it.contenido = it.contenido.trim();
        return it;
      })
      if (this.validateUpdate()) {
        this.callSaveService(url);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.censo.nombreExiste"));
        this.progressSpinner = false;
      }
    }

  }

  validateUpdate() {
    let check = true;

    this.updateAreas.forEach(dato => {

      let findDatos = this.datos.filter(item => item.nombreMateria === dato.nombreMateria);

      if (findDatos != undefined && findDatos.length > 1) {
        check = false;
      }

    });

    return check;
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
        this.table.sortOrder = 0;
        this.table.sortField = '';
        this.table.reset();
        this.selectedDatos = [];
        this.updateAreas = [];
        this.rest();

        this.progressSpinner = false;
      }
    );

  }

  checkPermisosNewMateria() {
    let msg = this.commonsService.checkPermisos(!this.disableAll, this.disableAll);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.selectMultiple || this.selectAll || this.nuevo) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.newMateria();
      }
    }
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
        // this.editarMateria(dato);
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

    if (this.selectMultiple || this.selectAll) {
      return true;
    }
    if (this.nuevo) {
      if (this.datos[0].nombreMateria != undefined && this.datos[0].nombreMateria.trim()) {
        return false;
      } else {
        return true;
      }

    } else {

      if ((this.updateAreas != undefined && this.updateAreas.length > 0)) {
        let val = true;
        this.updateAreas.forEach(it => {
          if (it.nombreMateria.trim() == "")
            val = false;
        });
        if (val) return false;
        else return true;
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

    let findDato = this.datosInicial.find(item => item.idMateria == dato.idMateria && item.idArea == dato.idArea);

    if (findDato != undefined) {
      if ((dato.contenido != undefined && findDato.contenido != undefined && dato.contenido != findDato.contenido) ||
        (dato.nombreMateria != findDato.nombreMateria)) {
        let findUpdate = this.updateAreas.find(item => item.idMateria == dato.idMateria && item.idArea == dato.idArea);

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

  delete(selectedDatos) {
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
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
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

  checkPermisosRest() {
    let msg = this.commonsService.checkPermisos(!this.disableAll, this.disableAll);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
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
    this.buscadores = this.buscadores.map(it => it = "")
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
    // //console.log(this.multiSelect);
    dato.onPanelShow;
    // this.multiSelect.show();
    // dato.overlayVisible = true;
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }
}


