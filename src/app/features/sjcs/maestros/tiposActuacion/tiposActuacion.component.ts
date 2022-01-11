import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList, ChangeDetectorRef, SimpleChanges, Input } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';
import { Router } from '@angular/router';
import { MultiSelect, ConfirmationService } from '../../../../../../node_modules/primeng/primeng';
import { TiposActuacionObject } from '../../../../models/sjcs/TiposActuacionObject';


@Component({
  selector: 'app-gestion-tiposactuacion',
  templateUrl: './tiposActuacion.component.html',
  styleUrls: ['./tiposActuacion.component.scss']
})
export class TiposActuacionComponent implements OnInit {
  textSelected: String = "{label}";

  selectedItem: number = 10;
  selectAll: boolean = false;;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  cols;
  rowsPerPage;
  esComa: boolean = false;
  buscadores = [];
  updateTiposActuacion = [];
  editMode: boolean = false;
  seleccion: boolean = false;
  datos = [];
  disableAll: boolean = false;
  historico: boolean = false;
  permitirGuardar: boolean = false;
  comboTiposActuacion;
  comboAsistencias;
  comboActuacion;
  maximaLong: any = 3;
  progressSpinner: boolean = false;
  msgs;
  body;
  nuevo: boolean = false;
  datosInicial = [];
  updateCosteFijo = [];

  idTipoAsistencia;
  selectedBefore;
  selectionMode: string = "single";
  pordefectotabla: boolean = false;
  permisoEscritura: boolean = false;

  @ViewChild("importe") importe;
  @ViewChild("table") table;
  @ViewChild("multiSelectPJ") multiSelect: MultiSelect;
  @Input() origenBaremos;

  constructor(private changeDetectorRef: ChangeDetectorRef, private persistenceService: PersistenceService,
    private sigaServices: SigaServices, private translateService: TranslateService,
    private commonsService: CommonsService, private router: Router,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.getComboTiposAsistencia();
    this.getCols();
    this.commonsService.checkAcceso(procesos_maestros.tiposActuaciones)
      .then(respuesta => {
        this.permisoEscritura = respuesta;

        this.persistenceService.setPermisos(this.permisoEscritura);


        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
      ).catch(error => console.error(error));
  }

  ngOnChanges(changes: SimpleChanges) {
    this.searchTiposActuaciones();
    this.selectedDatos = [];
    this.updateTiposActuacion = [];
    this.nuevo = false;
  }

  checkPermisosDelete() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (((!this.selectMultiple || !this.selectAll) && (this.selectedDatos == undefined || this.selectedDatos.length == 0)) || this.editMode || !this.permisoEscritura || this.nuevo) {
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
    if (charCode >= 48 && charCode <= 57 || (charCode == 44)) {
      return true;
    }
    else {
      return false;

    }
  }


  getComboTiposAsistencia() {
    this.progressSpinner = true;

    this.sigaServices.get("gestionTiposAsistencia_ComboTiposActuacion").subscribe(
      n => {

        this.comboTiposActuacion = n.combooItems;
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
   para poder filtrar el dato con o sin estos caracteres*/
        this.comboTiposActuacion.map(e => {
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
        //console.log(err);
      }
      , () => {
        this.progressSpinner = false;
        this.searchTiposActuaciones();
      }

    );

  }

  searchTiposActuaciones() {
    this.sigaServices
      .getParam("gestionTiposActuacion_busquedaTiposActuacion", "?historico=" + this.historico)
      .subscribe(
        res => {
          this.datos = res.tiposActuacionItem;
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          this.datos.forEach(element => {
            let seleccionados = [];
            element.editable = false
            element.overlayVisible = false;
            element.importeReal = +element.importe;
            element.importemaximoReal = +element.importemaximo;
            this.beautifyData(element)

            let prueba = [];
            let misseleccionados = element.idtipoasistencia.split(',');
            misseleccionados = misseleccionados.map(function (el) {
              return el.trim();
            });
            if (misseleccionados != null && misseleccionados != undefined) {
              misseleccionados.forEach(element => {
                if (seleccionados != undefined) {
                  seleccionados.push(this.comboTiposActuacion.find(x => x.value == element));
                  prueba = seleccionados.filter(function (el) {
                    return el != undefined;
                  });
                }
              });
              element.seleccionadosReal = prueba;
            } else {
              element.seleccionadosReal = [];
            }
          });
          this.editElementDisabled();
          if (this.table != undefined) {
            this.table.sortOrder = 0;
            this.table.sortField = '';
            this.table.reset();
            this.buscadores = this.buscadores.map(it => it = "");
          }
          this.progressSpinner = false;

          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;

        }
      );

  }

  beautifyData(element) {
    if (element.importe != null) {
      element.importe = element.importe.replace(".", ",");
      if (element.importe[0] == "," && element.importe.length > 1)
        element.importe = "0".concat(element.importe);
      else if (element.importe[0] == "," && element.importe.length == 1)
        element.importe = "0"
    } else
      element.importe = "0"

    if (element.importemaximo != null) {
      element.importemaximo = element.importemaximo.replace(".", ",");
      if (element.importemaximo[0] == "," && element.importemaximo.length > 1)
        element.importemaximo = "0".concat(element.importemaximo);
      else if (element.importemaximo[0] == "," && element.importemaximo.length == 1)
        element.importemaximo = "0"
    } else
      element.importemaximo = "0"
  }


  checkPermisosSearchHistorical() {
    if ((this.nuevo && this.historico) || ((this.nuevo || this.editMode) && !this.historico)) {
      this.msgs = this.commonsService.checkPermisoAccion();
    } else {
      this.searchHistorical();
    }
  }

  searchHistorical() {
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
    this.searchTiposActuaciones();
    this.selectAll = false;
  }

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

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
      url = "gestionTiposActuacion_createTipoActuacion";
      let dato2 = this.datos[0];
      let tiposAsistenciaString = "";
      for (let i in dato2.seleccionadosReal) {
        tiposAsistenciaString += "," + dato2.seleccionadosReal[i].value;
      }
      this.datos[0].idtipoasistencia = tiposAsistenciaString.substring(1, tiposAsistenciaString.length);
      let tipoAsistencia = this.datos[0];
      this.body = tipoAsistencia;
      this.body.descripciontipoactuacion = this.body.descripciontipoactuacion.trim();
      this.callSaveService(url);

    } else {
      url = "gestionTiposActuacion_updateTiposActuacion";
      this.editMode = false;
      if (this.validateUpdate()) {
        this.body = new TiposActuacionObject();
        this.body.tiposActuacionItem = this.updateTiposActuacion;
        this.body.tiposActuacionItem = this.body.tiposActuacionItem.map(it => {
          it.descripciontipoactuacion = it.descripciontipoactuacion.trim();
          return it;
        })
        let findDato;
        this.body.tiposActuacionItem.forEach(element => {
          findDato = this.datosInicial.find(item => item.descripciontipoactuacion === element.descripciontipoactuacion && item.idtipoactuacion != element.idtipoactuacion);
        });
        if (findDato != undefined) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.censo.nombreExiste"));
          this.progressSpinner = false;
        } else {
          this.callSaveService(url);
        }
      }
    }

  }

  validateUpdate() {

    let check = true;

    this.updateTiposActuacion.forEach(dato => {

      let findDatos = this.datos.filter(item => item.descripciontipoactuacion === dato.descripciontipoactuacion && item.importe === dato.importe && item.importemaximo === dato.importemaximo);

      if (findDatos != undefined && findDatos.length > 1) {
        check = false;
      }

    });

    return check;
  }

  callSaveService(url) {
    if (this.body.tiposActuacionItem != undefined) {
      this.body.tiposActuacionItem.forEach(element => {
        element.importe = + (element.importe + "").replace(",", ".");
        element.importemaximo = + (element.importemaximo + "").replace(",", ".");
      });
    } else {
      this.body.importe = + (this.body.importe + "").replace(",", ".");
      this.body.importemaximo = + (this.body.importemaximo + "").replace(",", ".");
    }
    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (this.nuevo) {
          this.nuevo = false;
        }

        this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        this.searchTiposActuaciones();
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.selectedDatos = [];
        this.updateTiposActuacion = [];
        this.nuevo = false;
        this.editMode = false;
        this.progressSpinner = false;
      },
      err => {
        let message = JSON.parse(err.error).error.message;
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        if (err != undefined && JSON.parse(err.error).error.message != null) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description) + " " + message);
        }
        this.progressSpinner = false;
        this.editMode = true;
        if (this.nuevo)
          this.nuevo = true;
        this.updateTiposActuacion = [];
        this.selectedDatos = [];
      },
      () => {
        this.selectedDatos = [];
        this.updateTiposActuacion = [];
        this.progressSpinner = false;
      }
    );

  }

  checkPermisosNewTipoActuacion() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.selectMultiple || this.selectAll || this.nuevo || this.historico || this.editMode || !this.permisoEscritura) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.newTipoActuacion();
      }
    }
  }

  newTipoActuacion() {
    this.nuevo = true;
    this.editMode = false;
    this.seleccion = false;
    this.selectionMode = "single";

    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let tipoActuacion = {
      idtipoactuacion: undefined,
      descripciontipoactuacion: undefined,
      importe: "0",
      importemaximo: "0",
      importeReal: undefined,
      importemaximoReal: undefined,
      seleccionadosReal: undefined,
      idtipoasistencia: undefined,
      editable: true
    };

    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
    if (this.datos.length == 0) {
      this.datos.push(tipoActuacion);
    } else {
      this.datos = [tipoActuacion, ...this.datos];
    }

  }

  changeImporte(dato) {
    dato.importe = dato.valorNum;
    let findDato = this.datosInicial.find(item => item.idtipoactuacion === dato.idtipoactuacion);

    if (findDato != undefined) {
      let tiposAsistenciaString = "";
      for (let i in dato.seleccionadosReal) {
        tiposAsistenciaString += "," + dato.seleccionadosReal[i].value;
      }
      dato.idtipoasistencia = tiposAsistenciaString.substring(1, tiposAsistenciaString.length);
      dato.seleccionados = "";
      // this.updateTiposActuacion.push(dato);
      if (dato.importe != findDato.importe) {

        let findUpdate = this.updateTiposActuacion.find(item => item.idtipoactuacion === dato.idtipoactuacion);
        this.permitirGuardar = true

        if (findUpdate == undefined) {
          this.updateTiposActuacion.push(dato);
        }
      }
    }

  }

  changeImporteMaximo(dato) {
    dato.importemaximo = dato.valorNum;
    let findDato = this.datosInicial.find(item => item.idtipoactuacion === dato.idtipoactuacion);

    if (findDato != undefined) {
      let tiposAsistenciaString = "";
      for (let i in dato.seleccionadosReal) {
        tiposAsistenciaString += "," + dato.seleccionadosReal[i].value;
      }
      dato.idtipoasistencia = tiposAsistenciaString.substring(1, tiposAsistenciaString.length);
      dato.seleccionados = "";
      // this.updateTiposActuacion.push(dato);
      if (dato.importemaximo != findDato.importemaximo) {

        let findUpdate = this.updateTiposActuacion.find(item => item.idtipoactuacion === dato.idtipoactuacion);
        this.permitirGuardar = true
        if (findUpdate == undefined) {
          this.updateTiposActuacion.push(dato);
        }
      }
    }


  }

  editarTipoAsistencia(dato) {

    let findDato = this.datosInicial.find(item => item.idtipoactuacion === dato.idtipoactuacion);


    if (findDato != undefined) {
      let tiposAsistenciaString = "";
      for (let i in dato.seleccionadosReal) {
        tiposAsistenciaString += "," + dato.seleccionadosReal[i].value;
      }
      dato.idtipoasistencia = tiposAsistenciaString.substring(1, tiposAsistenciaString.length);
      dato.seleccionados = "";
      // this.updateTiposActuacion.push(dato);
      if (dato.seleccionadosReal != findDato.seleccionadosReal) {
        dato.descripciontipoasistencia = "";
        dato.idtipoasistencia.split(",").forEach(element => {
          let asistencia = this.comboTiposActuacion.find(it => {
            return it.value == element.trim()
          })
          dato.descripciontipoasistencia += asistencia.label + ", ";
        });
        dato.descripciontipoasistencia = dato.descripciontipoasistencia.substring(0, dato.descripciontipoasistencia.length - 2);
        let findUpdate = this.updateTiposActuacion.find(item => item.idtipoactuacion === dato.idtipoactuacion);
        this.permitirGuardar = true
        if (findUpdate == undefined) {
          this.updateTiposActuacion.push(dato);
        }
      }
    }
  }

  editarTipoActuacion(dato) {
    let findDato = this.datosInicial.find(item => item.idtipoactuacion === dato.idtipoactuacion && item.idtipoasistencia === dato.idtipoasistencia);

    dato.descripciontipoactuacion = dato.descripciontipoactuacion.trim();
    if (findDato != undefined) {
      let tiposAsistenciaString = "";
      for (let i in dato.seleccionadosReal) {
        tiposAsistenciaString += "," + dato.seleccionadosReal[i].value;
      }
      dato.idtipoasistencia = tiposAsistenciaString.substring(1, tiposAsistenciaString.length);
      dato.seleccionados = "";
      if (dato.descripciontipoactuacion != findDato.descripciontipoactuacion) {

        let findUpdate = this.updateTiposActuacion.find(item => item.idtipoactuacion === dato.idtipoactuacion);
        this.permitirGuardar = true
        if (findUpdate == undefined) {
          this.updateTiposActuacion.push(dato);
        }
      }
    }
  }

  disabledSave() {
    if (this.nuevo) {
      if (this.datos[0].descripciontipoactuacion != undefined && this.datos[0].descripciontipoactuacion.trim() &&
        this.datos[0].importe != undefined && this.datos[0].importe + "" != ""
        && this.datos[0].importemaximo != undefined && this.datos[0].importemaximo + "" != ""
        && this.datos[0].seleccionadosReal != undefined && this.datos[0].seleccionadosReal.length > 0) {

        return false;
      } else {
        return true;
      }

    } else {

      if (!this.historico && (this.updateTiposActuacion != undefined && this.updateTiposActuacion.length > 0) && this.permisoEscritura && this.permitirGuardar) {
        let val = true;
        this.updateTiposActuacion.forEach(it => {
          if ((it.descripciontipoactuacion == undefined || !it.descripciontipoactuacion.trim()) || (it.seleccionadosReal == undefined || it.seleccionadosReal.length == 0)
            || (it.importemaximo == undefined || it.importemaximo + "" == "") || (it.importe == undefined || it.importe + "" == ""))
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

  edit(evento) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = [];
    }
    if (!this.nuevo && this.permisoEscritura) {

      if (!this.selectAll && !this.selectMultiple && !this.historico) {

        this.datos.forEach(element => {
          element.editable = false;
          element.overlayVisible = false;
        });

        evento.data.editable = true;
        this.editMode = true;

        this.selectedDatos = [];
        this.selectedDatos.push(evento.data);
        let findDato = this.datosInicial.find(item => item.descripciontipoactuacion === this.selectedDatos[0].descripciontipoactuacion && item.importe === this.selectedDatos[0].importe
          && item.importemaximo === this.selectedDatos[0].importemaximo);

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

  delete() {
    this.progressSpinner = true;

    this.body = new TiposActuacionObject();
    this.body.tiposActuacionItem = this.selectedDatos;

    this.sigaServices.post("gestionTiposActuacion_deleteTipoActuacion", this.body).subscribe(
      data => {

        this.nuevo = false;
        this.selectedDatos = [];
        this.selectMultiple = false;
        this.selectAll = false;
        this.searchTiposActuaciones();
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

  checkPermisosActivate() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (!this.permisoEscritura || ((!this.selectMultiple || !this.selectAll) && (this.selectedDatos == undefined || this.selectedDatos.length == 0))) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.activate();
      }
    }
  }

  activate() {
    this.progressSpinner = true;
    this.body = new TiposActuacionObject();
    this.body.tiposActuacionItem = this.selectedDatos;
    this.historico = true;

    this.sigaServices.post("gestionTiposActuacion_activateTipoActuacion", this.body).subscribe(
      data => {

        this.selectedDatos = [];
        this.searchTiposActuaciones();
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
          this.progressSpinner = false;
          this.selectMultiple = true;
          this.selectionMode = "multiple";
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

  checkPermisosRest() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

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
    this.updateTiposActuacion = [];
    this.nuevo = false;
    this.editMode = false;
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
    this.buscadores = this.buscadores.map(it => it = "");

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
      { field: "descripciontipoactuacion", header: "censo.usuario.nombre", width: "20%" },
      { field: "importeReal", header: "formacion.fichaCurso.tarjetaPrecios.importe", width: "10%" },
      { field: "importemaximoReal", header: "formacion.fichaCurso.tarjetaPrecios.importeMaximo", width: "10%" },
      { field: "descripciontipoasistencia", header: "menu.sjcs.tiposAsistencia", width: "60%" },
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

  editElementDisabled() {
    this.datos.forEach(element => {
      element.editable = false
      element.overlayVisible = false;
    });
  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
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

  isSelectMultiple() {
    if (this.permisoEscritura && !this.historico) {
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

  clear() {
    this.msgs = [];
  }

  openMultiSelect(dato) {
    dato.onPanelShow;
    // dato.overlayVisible = true;

  }

}