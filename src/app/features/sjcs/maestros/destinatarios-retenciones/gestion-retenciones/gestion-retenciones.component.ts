import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { ModulosItem } from '../../../../../models/sjcs/ModulosItem';
import { UpperCasePipe } from '../../../../../../../node_modules/@angular/common';
import { PartidasObject } from '../../../../../models/sjcs/PartidasObject';
import { findIndex } from 'rxjs/operators';
import { MultiSelect, ConfirmationService } from 'primeng/primeng';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { DestinatariosRetencObject } from '../../../../../models/sjcs/DestinatariosRetencObject';
import { CommonsService } from '../../../../../_services/commons.service';


@Component({
  selector: 'app-gestion-retenciones',
  templateUrl: './gestion-retenciones.component.html',
  styleUrls: ['./gestion-retenciones.component.scss']
})
export class TablaDestinatariosComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  colsPartidoJudicial;
  msgs;

  datosInicial = [];
  editMode: boolean = false;
  selectedBefore;

  updateDestinatariosRet = [];

  body;
  buscadores = []
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

  @Output() searchPartidas = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.selectedDatos = [];
    this.getCols();
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.historico == false) {
      this.selectMultiple = false;
      this.selectionMode = "single"
    }
    this.selectedDatos = [];
    this.updateDestinatariosRet = [];
    this.nuevo = false;
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    this.disabledSave();
  }

  checkPermisosDelete() {
    let msg = this.commonsService.checkPermisos(this.permisos, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {

      if (!this.permisos || (!this.selectMultiple && !this.selectAll) || this.selectedDatos.length == 0) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.confirmDelete();
      }
    }
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode >= 44 && charCode <= 57) {
      return true;
    }
    else {
      return false;
    }

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

        let findDato = this.datosInicial.find(item => item.nombre === this.selectedDatos[0].nombre && item.orden === this.selectedDatos[0].orden && item.cuentacontable === this.selectedDatos[0].cuentacontable);

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

  // changeImporte(dato) {
  //   let findDato = this.datosInicial.find(item => item.idpartidapresupuestaria === dato.idpartidapresupuestaria);

  //   if (findDato != undefined) {

  //     if (dato.importepartida != findDato.importepartida) {
  //       if (dato.importepartida > 99999999.99) {
  //         dato.importepartida = 99999999;
  //       }
  //       let findUpdate = this.updateDestinatariosRet.find(item => item.importepartida === dato.importepartida);

  //       if (findUpdate == undefined) {
  //         this.updateDestinatariosRet.push(dato);
  //       }
  //     }
  //   }
  // }
  changeCuentaContable(dato) {

    let findDato = this.datosInicial.find(item => item.iddestinatario === dato.iddestinatario);

    if (findDato != undefined) {
      if (dato.cuentacontable != findDato.cuentacontable) {

        let findUpdate = this.updateDestinatariosRet.find(item => item.iddestinatario === dato.iddestinatario);

        if (findUpdate == undefined) {
          this.updateDestinatariosRet.push(dato);
        }
      }
    }

  }

  changeNombre(dato) {

    let findDato = this.datosInicial.find(item => item.iddestinatario === dato.iddestinatario);
    dato.nombre = dato.nombre.trim();

    if (findDato != undefined) {
      if (dato.nombre != findDato.nombre) {

        let findUpdate = this.updateDestinatariosRet.find(item => item.iddestinatario === dato.iddestinatario);

        if (findUpdate == undefined) {
          this.updateDestinatariosRet.push(dato);
        }
      }
    }

  }
  changeOrden(dato) {

    let findDato = this.datosInicial.find(item => item.iddestinatario === dato.iddestinatario);

    if (findDato != undefined) {
      if (dato.orden != findDato.orden) {

        let findUpdate = this.updateDestinatariosRet.find(item => item.iddestinatario === dato.iddestinatario);

        if (findUpdate == undefined) {
          this.updateDestinatariosRet.push(dato);
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
        this.searchPartidas.emit(false);
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
        this.editMode = true;
        this.nuevo = false;
      },
      () => {
        this.selectedDatos = [];
        this.updateDestinatariosRet = [];
        this.progressSpinner = false;
      }
    );

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
      url = "gestionDestinatariosRetenc_createDestinatarioRetenc";
      let destinatariosRetenc = this.datos[0];
      this.body = destinatariosRetenc;
      this.body.nombre = this.body.nombre.trim();
      this.callSaveService(url);

    } else {
      url = "gestionDestinatariosRetenc_updateDestinatariosRetenc";
      this.editMode = false;
      if (this.validateUpdate()) {
        this.body = new DestinatariosRetencObject();
        this.body.destinatariosItem = this.updateDestinatariosRet;
        this.body.destinatariosItem = this.body.destinatariosItem.map(it => {
          it.nombre = it.nombre.trim();
          return it;
        })
        this.callSaveService(url);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Uno o varios de las partidas presupuestrias ya se encuentran registrados");
        this.progressSpinner = false;
      }
    }

  }

  checkPermisosRest() {
    let msg = this.commonsService.checkPermisos(this.permisos, this.historico);

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
    this.updateDestinatariosRet = [];
    this.nuevo = false;
    this.editMode = false;
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
    this.buscadores = this.buscadores.map(it => it = "");

  }

  // rest() {
  //   if (this.editMode) {
  //     if (this.datosInicial != undefined) this.datos = JSON.parse(JSON.stringify(this.datosInicial));
  //   } else {
  //     this.destinatariosItem = new destinatariosItem();
  //   }
  // }

  checkPermisosNewDestinatariosRetenc() {
    let msg = this.commonsService.checkPermisos(this.permisos, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {

      if (this.selectMultiple || this.selectAll || this.nuevo || this.historico || this.editMode || !this.permisos) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.newDestinatariosRetenc();
      }

    }
  }

  newDestinatariosRetenc() {
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
    this.nuevo = true;
    this.editMode = false;
    this.selectionMode = "single";
    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let destinatariosRetenc = {
      nombre: undefined,
      orden: undefined,
      cuentacontable: undefined,
      iddestinatario: undefined,
      editable: true
    };
    if (this.datos.length == 0) {
      this.datos.push(destinatariosRetenc);
    } else {
      this.datos = [destinatariosRetenc, ...this.datos];
    }

  }

  disabledSave() {
    if (this.nuevo) {
      if (this.datos[0].nombre != undefined && this.datos[0].nombre.trim()) {
        return false;
      } else {
        return true;
      }

    } else {
      this.updateDestinatariosRet = this.updateDestinatariosRet.filter(it => {
        if (it.nombre != undefined && it.nombre.trim() != "")
          return true;
        else false;
      })
      if (!this.historico && (this.updateDestinatariosRet != undefined && this.updateDestinatariosRet.length > 0) && this.permisos) {
        return false;
      } else {
        return true;
      }
    }
  }


  validateUpdate() {

    let check = true;

    this.updateDestinatariosRet.forEach(dato => {

      let findDatos = this.datos.filter(item => item.nombre === dato.nombre && item.orden === dato.orden && item.cuentacontable === dato.importepartida);

      if (findDatos != undefined && findDatos.length > 1) {
        check = false;
      }

    });

    return check;
  }

  checkPermisosActivate() {
    let msg = this.commonsService.checkPermisos(this.permisos, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {

      if (!this.permisos || (!this.selectMultiple && !this.selectAll) || this.selectedDatos.length == 0) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.delete();
      }
    }
  }

  delete() {
    let DestinatariosRetencDelete = new DestinatariosRetencObject();
    DestinatariosRetencDelete.destinatariosItem = this.selectedDatos
    this.sigaServices.post("gestionDestinatariosRetenc_eliminateDestinatariosRetenc", DestinatariosRetencDelete).subscribe(
      data => {
        this.selectedDatos = [];
        if (this.historico) {
          this.searchPartidas.emit(true);
        } else {
          this.searchPartidas.emit(false);
        }
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
        if (this.historico) {
          this.selectMultiple = true;
          this.selectionMode = "multiple";
          this.progressSpinner = false;
        } else {
          this.progressSpinner = false;
          this.historico = false;
          this.selectMultiple = false;
          this.selectAll = false;
          this.editMode = false;
          this.nuevo = false;
        }
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

  checkPermisosSearchPartida() {
    if ((this.nuevo && this.historico) || ((this.nuevo || this.editMode) && !this.historico)) {
      this.msgs = this.commonsService.checkPermisoAccion();
    } else {
      this.searchPartida();
    }
  }

  searchPartida() {
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
    this.searchPartidas.emit(this.historico);
    this.selectAll = false;
  }


  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {

    this.cols = [
      { field: "nombre", header: "censo.usuario.nombre" },
      { field: "orden", header: "administracion.informes.literal.orden" },
      { field: "cuentacontable", header: "censo.consultaDatosGenerales.literal.cuentaContable" }

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
