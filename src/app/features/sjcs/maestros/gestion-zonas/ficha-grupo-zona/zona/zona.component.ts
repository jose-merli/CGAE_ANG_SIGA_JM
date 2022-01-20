import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { ZonasItem } from '../../../../../../models/sjcs/ZonasItem';
import { UpperCasePipe } from '@angular/common';
import { ZonasObject } from '../../../../../../models/sjcs/ZonasObject';
import { findIndex } from 'rxjs/operators';
import { MultiSelect, ConfirmationService } from 'primeng/primeng';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../_services/commons.service';

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
  fechaEvento;
  datos = [];
  buscador = [];
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

  permisoEscritura: boolean = true;

  //Resultados de la busqueda
  @Input() idZona;
  //Resultados de la busqueda
  @Input() modoEdicion: boolean;

  @ViewChild("table") table;
  @ViewChild("multiSelectPJ") multiSelect: MultiSelect;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices, private translateService: TranslateService,
    private upperCasePipe: UpperCasePipe, private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService, private commonsService: CommonsService
  ) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()
    }

    this.getCols();
    this.getComboPartidosJudiciales();

    if (this.idZona != undefined) {
      this.modoEdicion = true;
    } else {
      this.modoEdicion = false;
    }
    this.validateHistorical();
  }

  getComboPartidosJudiciales() {
    this.progressSpinner = true;

    this.sigaServices.get("fichaZonas_getPartidosJudiciales").subscribe(
      n => {
        this.comboPJ = n.combooItems;

        if (this.idZona != undefined) {
          this.getZonas();
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
  validateHistorical() {
    this.sigaServices.sendFechaBaja$.subscribe(
      fecha => {
        this.fechaEvento = fecha;
        if (this.fechaEvento != null) {
          this.historico = true;
        } else {
          this.historico = false;
        }
      });
    // if (this.datos != undefined && this.datos.length > 0) {

    //   if (this.datos[0].fechabaja != null) {
    //     this.historico = true;
    //   } else {
    //     this.historico = false;
    //   }

    //   this.persistenceService.setHistorico(this.historico);

    // }
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



          this.datos.forEach(element => {
            element.editable = false
            element.overlayVisible = false;
          });

          this.progressSpinner = false;

          this.getPartidosJudiciales();
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;

        }
      );
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

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

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

    if (this.nuevo) {
      url = "fichaZonas_createZone";
      this.body = this.datos[0];
      this.body.descripcionsubzona = this.body.descripcionsubzona.trim();

      this.validateNewZone(url);

    } else {
      url = "fichaZonas_updateZones";
      this.body = new ZonasObject();
      this.body.zonasItems = this.updateZonas;
      this.body.zonasItems = this.body.zonasItems.map(it => {
        it.descripcionsubzona = it.descripcionsubzona.trim();
        return it;
      })
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
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
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

  checkPermisosNewZone() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (!this.permisoEscritura || this.selectMultiple || this.selectAll || this.nuevo || this.historico) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.newZone();
      }
    }
  }

  newZone() {
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
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.jgr.maestros.gestionZonasySubzonas.existeZonaMismaDescripcion"));
        this.progressSpinner = false;
        this.datos[datoId].descripcionsubzona = this.selectedBefore.descripcionsubzona;

      } else {
        let dato = this.datos.find(item => this.upperCasePipe.transform(item.descripcionsubzona.trim()) === this.upperCasePipe.transform(e.srcElement.value.trim()));
        this.editarDescripcionZona(dato);
      }

      this.seleccion = false;
    }
  }

  validateZoneChange(e) {

    if (!this.nuevo) {
      let datoId = this.datos.findIndex(item => item.idsubzona === this.selectedBefore.idsubzona);

      let findDato = this.datos.filter(item => this.upperCasePipe.transform(item.descripcionsubzona) === this.upperCasePipe.transform(e.trim()));

      if (findDato.length > 1) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.jgr.maestros.gestionZonasySubzonas.existeZonaMismaDescripcion"));
        this.progressSpinner = false;
        this.datos[datoId].descripcionsubzona = this.selectedBefore.descripcionsubzona;

      } else {
        let dato = this.datos.find(item => this.upperCasePipe.transform(item.descripcionsubzona.trim()) === this.upperCasePipe.transform(e.trim()));
        this.editarDescripcionZona(dato);
      }

    }
  }

  validateNewZone(url) {
    let zona = this.datos[0];

    let findDato = this.datosInicial.find(item => item.idzona === zona.idzona && item.descripcionsubzona.trim() === zona.descripcionsubzona.trim());

    if (findDato != undefined) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.jgr.maestros.gestionZonasySubzonas.existeZonaMismaDescripcion"));
      this.progressSpinner = false;
    } else {
      zona.descripcionsubzona = zona.descripcionsubzona.trim();
      this.body = zona;
      this.callSaveZoneService(url);
    }

  }

  disabledSave() {
    let guardar = true;
    this.datos.forEach(element => {
      if (element.partidosJudiciales.length == 0) {
        guardar = false;
      }
    });
    if (guardar) {
      if (this.nuevo) {
        if (this.datos[0].descripcionsubzona != undefined && this.datos[0].descripcionsubzona.trim()
          && this.datos[0].partidosJudiciales != undefined && this.datos[0].partidosJudiciales.length > 0) {
          return false;
        } else {
          return true;
        }

      } else {
        if (!this.historico && (this.updateZonas != undefined && this.updateZonas.length > 0)) {
          let val = true;
          this.updateZonas.forEach(it => {
            if ((it.descripcionsubzona == undefined || !it.descripcionsubzona.trim()) || (it.partidosJudiciales == undefined || it.partidosJudiciales.length == 0))
              val = false;
          });
          if (val)
            return false;
          else
            return true;
        } else {
          return true;
        }
      }
    } else {
      return true;
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

    dato.descripcionsubzona = dato.descripcionsubzona.trim();
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

  checkPermisosDelete(selectedDatos) {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (!this.permisoEscritura || (!this.selectMultiple && !this.selectAll) || selectedDatos.length == 0 || this.nuevo || this.historico) {
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

  delete(selectedDatos) {
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
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
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
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.updateZonas.length == 0 && !this.nuevo) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.rest();
      }
    }
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
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
    this.buscador = this.buscador.map(it => it = "");
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
    this.cols.forEach(it => this.buscador.push(""))
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

    if (!this.nuevo) {
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

  }

  isSelectMultiple() {

    if (this.permisoEscritura) {
      if (!this.nuevo) {
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
      }
    }

  }


  actualizaSeleccionados(selectedDatos) {
    if (selectedDatos != null) {
      this.numSelected = selectedDatos.length;
      this.seleccion = false;
    }
  }

  clear() {
    this.msgs = [];
  }

  openMultiSelect(dato) {
    // //console.log(this.multiSelect);
    dato.onPanelShow;
    // dato.show();
    // dato.overlayVisible = true;
  }

}
