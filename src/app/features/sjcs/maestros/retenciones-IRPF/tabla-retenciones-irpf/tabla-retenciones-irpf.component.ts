import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { RetencionIrpfItem } from '../../../../../models/sjcs/RetencionIrpfItem';
import { RetencionIrpfObject } from '../../../../../models/sjcs/RetencionIrpfObject';
import { SortEvent, ConfirmationService } from '../../../../../../../node_modules/primeng/api';
import { truncateSync } from 'fs';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-tabla-retenciones-irpf',
  templateUrl: './tabla-retenciones-irpf.component.html',
  styleUrls: ['./tabla-retenciones-irpf.component.scss']
})
export class TablaRetencionesIrpfComponent implements OnInit {

  rowsPerPage: any = [];
  cols;

  msgs;
  id;
  comboSociedades;
  datosInicial = [];
  editMode: boolean = false;
  selectedBefore;

  updatePartidasPres = [];
  buscadores = [];
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
  maximaLong
  //Resultados de la busqueda
  @Input() datos;

  @Input() permisos;

  @Output() search = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;
  @ViewChild("retencion") retencion;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
    this.selectedDatos = [];
    this.getCols();

    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
    this.getComboSociedades();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.historico == false) {
      this.selectMultiple = false;
      this.selectionMode = "single"
    } else {
      this.selectMultiple = true;
      this.selectionMode = "multiple"
    }
    this.selectedDatos = [];
    this.updatePartidasPres = [];
    this.nuevo = false;
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
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

        let findDato = this.datosInicial.find(item => item.nombrepartida === this.selectedDatos[0].nombrepartida && item.descripcion === this.selectedDatos[0].descripcion && item.retencion === this.selectedDatos[0].retencion);

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

  getComboSociedades() {
    this.sigaServices
      .get("busquedaRetencionesIRPF_sociedades")
      .subscribe(
        n => {
          this.comboSociedades = n.combooItems;

        },
        error => { },
        () => { }
      );


  }

  changeDescripcion(dato) {

    let findDato = this.datosInicial.find(item => item.idRetencion === dato.idRetencion);
    if (dato.descripcion != undefined)
      dato.descripcion = dato.descripcion.trim();
    if (findDato != undefined) {
      if (dato.descripcion != findDato.descripcion) {

        let findUpdate = this.updatePartidasPres.find(item => item.idRetencion === dato.idRetencion);

        if (findUpdate == undefined) {
          this.updatePartidasPres.push(dato);
        }
      }
    }

  }

  changeClaveModelo(dato) {

    let findDato = this.datosInicial.find(item => item.idRetencion === dato.idRetencion);

    if (dato.claveModelo != undefined)
      dato.claveModelo = dato.claveModelo.trim();
    if (findDato != undefined) {
      if (dato.claveModelo != findDato.claveModelo) {

        let findUpdate = this.updatePartidasPres.find(item => item.idRetencion === dato.idRetencion);

        if (findUpdate == undefined) {
          this.updatePartidasPres.push(dato);
        }
      }
    }

  }

  changeRetencion(dato) {
    dato.retencion = dato.valorNum;
    let findDato = this.datosInicial.find(item => item.idRetencion === dato.idRetencion);

    if (findDato != undefined) {
      if (dato.retencion != findDato.retencion) {

        let findUpdate = this.updatePartidasPres.find(item => item.idRetencion === dato.idRetencion);

        if (findUpdate == undefined) {
          this.updatePartidasPres.push(dato);
        }
      }
    }

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57 || (charCode == 44)) {
      return true;
    }
    else {
      return false;

    }
  }

  changeSociedad(dato) {

    let sociedad = this.comboSociedades.find(item => item.value === dato.tipoSociedad);
    dato.descripcionSociedad = sociedad.label;
    let findDato = this.datosInicial.find(item => item.idRetencion === dato.idRetencion);
    if (findDato != undefined) {
      if (dato.tipoSociedad != findDato.tipoSociedad) {

        let findUpdate = this.updatePartidasPres.find(item => item.idRetencion === dato.idRetencion);

        if (findUpdate == undefined) {
          this.updatePartidasPres.push(dato);
        }
      }
    }
  }

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisos, undefined);

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
      url = "busquedaRetencionesIRPF_createRetencionesIRPF";
      let retencion;
      retencion = this.datos[0];
      retencion.retencion = retencion.valorNum;

      // retencion.descripcion = this.comboSociedades[retencion.idRetencion].label
      if (retencion.retencion != null && retencion.retencion != undefined && retencion.retencion != "") {
        this.body = retencion;
        this.body.descripcion = this.body.descripcion.trim();
        this.body.retencion = this.body.retencion.replace(",", ".");
        if (this.body.retencion == ".") {
          this.body.retencion = 0;
        }

        this.callSaveService(url);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.jgr.maestros.documentacionIRPF.retencionNula"));
        this.progressSpinner = false;

      }
    } else {
      url = "busquedaRetencionesIRPF_updateRetencionesIRPF";
      this.editMode = false;
      if (this.validateUpdate()) {
        this.body = new RetencionIrpfItem();
        this.body.retencionItems = this.updatePartidasPres;
        this.body.retencionItems = this.body.retencionItems.map(it => {
          it.descripcion = it.descripcion.trim();
          return it;
        })
        this.body.retencionItems.forEach(element => {
          element.retencion = element.retencion.replace(",", ".");
          element.retencionReal = +element.retencion;
          if (element.retencion == ".") {
            element.retencion = 0;
          }
        });

        this.callSaveService(url);
      } else {

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.jgr.maestros.documentacionIRPF.existeRetencionMismoNombre"));
        this.progressSpinner = false;
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
        this.getComboSociedades();
        this.datos.forEach(element => {
          element.retencionReal = + element.retencion;
          element.retencion = element.retencion.replace(".", ",");
        });

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {
        this.editMode = true;
        if (err != undefined && err.error != null && JSON.parse(err.error).error.description != "") {
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

  checkPermisosRest() {
    let msg = this.commonsService.checkPermisos(this.permisos, undefined);

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
    this.editElementDisabled();
    this.selectedDatos = [];
    this.updatePartidasPres = [];
    this.nuevo = false;
    this.editMode = false;
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
    this.buscadores = this.buscadores.map(it => it = "");


  }

  checkPermisosNewRetencion() {
    let msg = this.commonsService.checkPermisos(this.permisos, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.selectMultiple || this.selectAll || this.nuevo || this.historico || this.editMode || !this.permisos) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.newRetencion();
      }
    }
  }

  newRetencion() {
    this.nuevo = true;
    this.editMode = false;
    this.selectionMode = "single";
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
    this.getComboSociedades();

    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let retencion = {
      descripcion: undefined,
      retencion: "",
      retencionReal: undefined,
      claveModelo: undefined,
      tipoSociedad: undefined,
      editable: true
    };
    if (this.datos.length == 0) {
      this.datos.push(retencion);
    } else {
      this.datos = [retencion, ...this.datos];
    }

  }

  disabledSave() {
    if (this.nuevo) {
      if (this.datos[0].descripcion != undefined && this.datos[0].descripcion.trim() &&
        this.datos[0].valorNum != undefined && this.datos[0].valorNum.trim()) {
        return false;
      } else {
        return true;
      }

    } else {
      if (!this.historico && (this.updatePartidasPres != undefined && this.updatePartidasPres.length > 0) && this.permisos) {
        let val = true;
        this.updatePartidasPres.forEach(it => {
          if (!it.descripcion.trim() || !it.retencion)
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

  checkPermisosDelete(selectedDatos) {
    let msg = this.commonsService.checkPermisos(this.permisos, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (!this.permisos || (!this.selectMultiple && !this.selectAll) || selectedDatos.length == 0) {
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

  checkPermisosActivate(selectedDatos) {
    let msg = this.commonsService.checkPermisos(this.permisos, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (!this.permisos || (!this.selectMultiple || !this.selectAll) && (selectedDatos == undefined || selectedDatos.length == 0)) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.delete(selectedDatos);
      }
    }
  }

  delete(selectedDatos) {
    let del = new RetencionIrpfObject();
    del.retencionItems = this.selectedDatos
    let url;
    if (this.historico) url = "busquedaRetencionesIRPF_activateRetencionesIRPF";
    else url = "busquedaRetencionesIRPF_deleteRetencionesIRPF";
    this.sigaServices.post(url, del).subscribe(
      data => {
        this.selectedDatos = [];
        this.search.emit(this.historico);
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

  checkPermisosIsHistorico() {
    if ((this.nuevo && this.historico) || ((this.nuevo || this.editMode) && !this.historico)) {
      this.msgs = this.commonsService.checkPermisoAccion();
    } else {
      this.isHistorico();
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

  getId() {
    let seleccionados = [];
    seleccionados.push(this.selectedDatos);
    this.id = this.datos.findIndex(item => item.idRetencion === seleccionados[0].idRetencion);
  }

  getCols() {

    this.cols = [
      { field: "descripcion", header: "administracion.parametrosGenerales.literal.descripcion", width: "30%" },
      { field: "retencionReal", header: "FactSJCS.mantRetencionesJ.literal.tramoLec", width: "15%" },
      { field: "claveModelo", header: "dato.jgr.maestros.documentacionIRPF.claveModelo", width: "15%" },
      { field: "descripcionSociedad", header: "dato.jgr.maestros.documentacionIRPF.tipoSociedad", width: "40%" }

    ];
    this.cols.forEach(it => this.buscadores.push(""));
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

