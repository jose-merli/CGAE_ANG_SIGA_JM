import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { TranslateService } from '../../../../../../commons/translate';
import { SigaServices } from '../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { PretensionObject } from '../../../../../../models/sjcs/PretensionObject';
import { PretensionItem } from '../../../../../../models/sjcs/PretensionItem';
import { ConfirmationService } from '../../../../../../../../node_modules/primeng/primeng';

@Component({
  selector: 'app-tabla-procedimientos',
  templateUrl: './tabla-procedimientos.component.html',
  styleUrls: ['./tabla-procedimientos.component.scss']
})
export class TablaProcedimientosComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  colsPartidoJudicial;
  msgs;

  comboJurisdiccion;
  datosInicial = [];
  editMode: boolean = false;
  selectedBefore;

  updatePartidasPres = [];

  body;

  selectedItem: number = 10;
  selectAll;
  selectedDatos: any[] = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;

  message;

  initDatos;
  nuevo: boolean = false;
  progressSpinner: boolean = false;
  selectionMode: string = "single";

  //Resultados de la busqueda
  @Input() datos;

  @Input() permisos;
  //Combo partidos judiciales
  @Input() comboPJ;

  @Output() search = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.selectedDatos = [];
    this.getCols();

    this.getComboJurisdiccion();
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.historico) {
      this.selectMultiple = true;
      this.selectionMode = "multiple"
    }
    this.selectedDatos = [];
    this.updatePartidasPres = [];
    this.nuevo = false;
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
  }

  confirmDelete() {
    let mess = this.translateService.instant(
      "messages.deleteConfirmation"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.delete()
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

  edit(evento) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = [];
    }
    if (!this.nuevo && this.permisos) {

      if (!this.selectAll && !this.selectMultiple && !this.historico) {

        this.datos.forEach(element => {
          element.editable = false;
          element.overlayVisible = false;
        });

        evento.data.editable = true;
        this.editMode = true;

        this.selectedDatos = [];
        this.selectedDatos.push(evento.data);

        let findDato = this.datosInicial.find(item => item.nombrepartida === this.selectedDatos[0].nombrepartida && item.descripcion === this.selectedDatos[0].descripcion && item.importepartida === this.selectedDatos[0].importepartida);

        this.selectedBefore = findDato;
      } else {
        if ((evento.data.fechabaja == null || evento.data.fechabaja == undefined) && this.historico) {
          if (this.selectedDatos[0] != undefined) {
            this.selectedDatos.pop();
          } else {
            this.selectedDatos = [];
          }
        }

      }

    }
  }

  getComboJurisdiccion() {
    this.sigaServices
      .get("busquedaProcedimientos_jurisdiccion")
      .subscribe(
        n => {
          this.comboJurisdiccion = n.combooItems;
        },
        error => { },
        () => { }
      );
  }

  changeDescripcion(dato) {
    let findDato = this.datosInicial.find(item => item.idPretension === dato.idPretension);

    if (findDato != undefined) {
      if (dato.descripcion.trim() != "") {
        if (dato.descripcion != findDato.descripcion) {

          let findUpdate = this.updatePartidasPres.find(item => item.descripcion === dato.descripcion);

          if (findUpdate == undefined) {
            this.updatePartidasPres.push(dato);
          }
        }
      } else {
        let findUpdate = this.updatePartidasPres.find(item => item.descripcion === dato.descripcion);
        if (findUpdate != undefined) {
          let cambios = [];
          this.updatePartidasPres.forEach(data => {
            if (data.idPretension != findUpdate.idPretension) {
              cambios.push(data);
            }
          });
          if (cambios != undefined) {
            this.updatePartidasPres = [];
            this.updatePartidasPres = cambios;
          }
        }
      }
    }
  }
  changeCodigoExt(dato) {

    let findDato = this.datosInicial.find(item => item.idPretension === dato.idPretension);

    if (findDato != undefined) {
      if (dato.codigoExt != findDato.codigoExt) {

        let findUpdate = this.updatePartidasPres.find(item => item.codigoExt === dato.codigoExt);

        if (findUpdate == undefined) {
          this.updatePartidasPres.push(dato);
        }
      }
    }

  }

  changeJurisdiccion(dato) {
    let findDato = this.datosInicial.find(item => item.idPretension === dato.idPretension);
    if (findDato != undefined) {
      if (dato.idJurisdiccion != findDato.idJurisdiccion) {
        let findUpdate = this.updatePartidasPres.find(item => item.idJurisdiccion === dato.idJurisdiccion);
        if (findUpdate == undefined) {
          this.updatePartidasPres.push(dato);
        }
      }
    }

  }

  callSaveService(url) {
    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (this.nuevo) {
          this.nuevo = false;
        }

        this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        this.search.emit(false);
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
        this.updatePartidasPres = [];
        this.progressSpinner = false;
      }
    );

  }


  save() {
    this.progressSpinner = true;
    let url = "";

    if (this.nuevo) {
      url = "gestionPretensiones_createPretension";
      let pretension: PretensionItem;
      pretension = this.datos[0];
      pretension.descripcionJurisdiccion = this.comboJurisdiccion[pretension.idJurisdiccion].label
      this.body = pretension;

      this.callSaveService(url);

    } else {
      url = "gestionPretensiones_updatePretension";
      if (this.validateUpdate()) {
        this.body = new PretensionObject();
        this.body.pretensionItems = this.updatePartidasPres;
        this.callSaveService(url);
      } else {

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.jgr.maestros.pretension.existeProcedimientoMismoNombre"));
        this.progressSpinner = false;
      }
    }

  }
  rest() {
    if (this.datosInicial != undefined) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }
    this.editElementDisabled();
    this.selectedDatos = [];
    this.updatePartidasPres = [];
    this.nuevo = false;
    this.editMode = false;
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
  }

  newPretension() {
    this.nuevo = true;
    this.editMode = false;
    this.selectionMode = "single";
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
    this.getComboJurisdiccion();

    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let pretension = {
      codigoExt: undefined,
      descripcion: undefined,
      descripcionJurisdiccion: undefined,
      idPretension: undefined,
      editable: true
    };
    if (this.datos.length == 0) {
      this.datos.push(pretension);
    } else {
      this.datos = [pretension, ...this.datos];
    }

  }

  disabledSave() {
    if (this.nuevo) {
      if (this.datos[0].descripcion != undefined && this.datos[0].idJurisdiccion != undefined && this.datos[0].idJurisdiccion != "") {
        return false;
      } else {
        return true;
      }

    } else {
      if (!this.historico && (this.updatePartidasPres != undefined && this.updatePartidasPres.length > 0) && this.permisos) {
        return false;
      } else {
        return true;
      }
    }
  }


  validateUpdate() {

    let check = true;

    this.updatePartidasPres.forEach(dato => {

      let findDatos = this.datos.filter(item => item.descripcion === dato.descripcion);

      if (findDatos != undefined && findDatos.length > 1) {
        check = false;
      }

    });

    return check;
  }


  delete() {
    let del = new PretensionObject();
    del.pretensionItems = this.selectedDatos
    let url;
    if (this.historico) url = "gestionProcedimientos_activateProcedimientos";
    else url = "gestionProcedimientos_deleteProcedimientos";
    this.sigaServices.post(url, del).subscribe(
      data => {
        this.selectedDatos = [];
        this.search.emit(false);
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
        this.historico = false;
        this.selectMultiple = false;
        this.selectAll = false;
        this.editMode = false;
        this.nuevo = false;
      }
    );
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      if (this.nuevo) this.datos.shift();
      this.nuevo = false;
      this.editMode = false;
      this.selectMultiple = false;
      this.editElementDisabled();

      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
        this.selectMultiple = true;
        this.selectionMode = "single";
      } else {
        this.selectedDatos = this.datos;
        this.selectMultiple = false;
        this.selectionMode = "single";
      }
      this.selectionMode = "multiple";
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      if (this.historico)
        this.selectMultiple = true;
      this.selectionMode = "multiple";
    }
  }

  isHistorico() {
    this.historico = !this.historico;
    if (this.historico) {

      this.editElementDisabled();
      this.editMode = false;
      this.nuevo = false;
      this.selectMultiple = true;

      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectionMode = "multiple";
    }
    else {
      this.selectMultiple = false;
      this.selectionMode = "single";
    }
    this.search.emit(this.historico);
    this.selectAll = false;
  }


  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    this.cols = [
      { field: "codigoExt", header: "general.codeext" },
      { field: "descripcion", header: "administracion.parametrosGenerales.literal.descripcion" },
      { field: "descripcionJurisdiccion", header: "menu.justiciaGratuita.maestros.Jurisdiccion" }

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

  editElementDisabled() {
    this.datos.forEach(element => {
      element.editable = false
      element.overlayVisible = false;
    });
  }

  isSelectMultiple() {
    if (this.permisos && !this.historico) {
      if (this.nuevo) this.datos.shift();
      this.editElementDisabled();
      this.editMode = false;
      this.nuevo = false;
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
