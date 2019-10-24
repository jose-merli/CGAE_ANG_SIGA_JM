import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList, ChangeDetectorRef, SimpleChanges, Input } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { procesos_maestros } from '../../../../permisos/procesos_maestros';
import { Router } from '@angular/router';
import { MultiSelect } from '../../../../../../node_modules/primeng/primeng';
import { ConfirmationService } from "primeng/api";
import { TiposAsistenciaObject } from '../../../../models/sjcs/TiposAsistenciaObject';


@Component({
  selector: 'app-gestion-tiposasistencia',
  templateUrl: './tiposAsistencia.component.html',
  styleUrls: ['./tiposAsistencia.component.scss']
})
export class TiposAsistenciaComponent implements OnInit {
  textSelected: String = "{label}";

  selectedItem: number = 10;
  selectAll: boolean = false;;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  cols;
  rowsPerPage;
  esComa: boolean = false;
  filterStatusPrivatUser: boolean = false;
  id;
  updateTiposAsistencia = [];
  editMode: boolean = false;
  seleccion: boolean = false;
  datos = [];
  disableAll: boolean = false;
  historico: boolean = false;

  comboTiposGuardia;
  comboAsistencias;
  comboActuacion;
  maximaLong: any = 8;
  progressSpinner: boolean = false;
  msgs;
  body;
  nuevo: boolean = false;
  datosInicial = [];
  updateCosteFijo = [];

  messagesConfirmation: boolean = false;


  pordefectoanterior;
  idTipoAsistencia;
  selectedBefore;
  selectionMode: string = "single";
  pordefectotabla: boolean = false;
  permisoEscritura: boolean = false;

  @ViewChild("importe") importe;
  @ViewChild("check") check;
  @ViewChild("importeMax") importeMax;

  @ViewChild("table") table;
  @ViewChild("multiSelectPJ") multiSelect: MultiSelect;

  constructor(private changeDetectorRef: ChangeDetectorRef, private persistenceService: PersistenceService,
    private sigaServices: SigaServices, private translateService: TranslateService,
    private commonsService: CommonsService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {

    this.getComboTiposAsistencia();
    this.getCols();
    this.commonsService.checkAcceso(procesos_maestros.tiposAsistencias)
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
    this.searchTiposAsistencias();
    this.selectedDatos = [];
    this.updateTiposAsistencia = [];
    this.nuevo = false;
    this.pordefectoanterior = undefined;
  }

  getId() {
    let seleccionados = [];
    seleccionados.push(this.selectedDatos);
    this.id = this.datos.findIndex(item => item.idTipoAsistencia === seleccionados[0].idTipoAsistencia);
  }
  validateAcreditacionMaximo(e) {
    if (this.selectedDatos == null || this.selectedDatos.length == 0) {
      this.selectedDatos = [];
      this.selectedDatos.push(this.datos.find(item => item.editable == true));
    }
    if (!this.nuevo) {
      let datoId = this.datos.findIndex(item => item.idtipoasistenciacolegio === this.selectedDatos[0].idtipoasistenciacolegio);
      let dato = this.datos[datoId];
      dato.importemaximo = "" + dato.importemaximo;


      if (dato.importemaximo.split(",").length - 1 > 1) {
        let partePrimera = dato.importemaximo.split(",");
        dato.importemaximo = partePrimera[0];
      }
      if (this.datos[0].importe == ",") this.datos[0].importe = "0";
      if (dato.importemaximo.includes(",")) {
        this.maximaLong = 11;
        let partes = dato.importemaximo.split(",");
        let numero = + partes[0];
        if (partes[1].length > 2) {
          let segundaParte = partes[1].substring(0, 2);
          dato.importemaximo = partes[0] + "," + segundaParte;
        }
        if (numero >= 100) {
          // dato.importemaximo = 100;
        } else if (numero < 0) {
          dato.importemaximo = 0;
        }
      } else {
        this.maximaLong = 9;
        dato.importemaximo = dato.importemaximo.substring(0, 8);
        let numero = + dato.importemaximo;
        if (numero < 0) {
          dato.importemaximo = 0;
        }
      }
      this.importeMax.nativeElement.value = dato.importemaximo;

      this.editarTipoAsistencia(dato);

    } else {
      if (this.datos[0].importemaximo == undefined || this.datos[0].importemaximo == "") {
        this.datos[0].importemaximo = "0";
      }
      if (this.datos[0].importemaximo.split(",").length - 1 > 1) {
        let partePrimera = this.datos[0].importemaximo.split(",");
        this.datos[0].importemaximo = partePrimera[0];
      }
      if (this.datos[0].importe == ",") this.datos[0].importe = "0";
      if (this.datos[0].importemaximo.includes(",")) {
        this.maximaLong = 11;
        let partes = this.datos[0].importemaximo.split(",");
        if (partes[1].length > 2) {
          let segundaParte = partes[1].substring(0, 2);
          this.datos[0].importemaximo = partes[0] + "," + segundaParte;
          // this.importe.nativeElement.value = this.modulosItem.importe;
        }
        let numero = + partes[0];
        if (partes[1].length > 2) {
          let segundaParte = partes[1].substring(0, 2);
          this.datos[0].importemaximo = partes[0] + "," + segundaParte;
        }
      } else {
        this.maximaLong = 9;
        this.datos[0].importemaximo = this.datos[0].importemaximo.substring(0, 8);
      }
      if (+this.datos[0].importemaximo > 999999999) this.datos[0].importemaximo = 99999999;
      this.importeMax.nativeElement.value = this.datos[0].importemaximo;

    }
  }

  validateAcreditacion(e) {
    if (this.selectedDatos == null || this.selectedDatos.length == 0) {
      this.selectedDatos = [];
      this.selectedDatos.push(this.datos.find(item => item.editable == true));
    }
    if (!this.nuevo) {
      let datoId = this.datos.findIndex(item => item.idtipoasistenciacolegio === this.selectedDatos[0].idtipoasistenciacolegio);
      let dato = this.datos[datoId];
      dato.importe = "" + dato.importe;


      if (dato.importe.split(",").length - 1 > 1) {
        let partePrimera = dato.importe.split(",");
        dato.importe = partePrimera[0];
      }
      if (this.datos[0].importe == ",") this.datos[0].importe = "0";
      if (dato.importe.includes(",")) {
        this.maximaLong = 11;
        let partes = dato.importe.split(",");
        let numero = + partes[0];
        if (partes[1].length > 2) {
          let segundaParte = partes[1].substring(0, 2);
          dato.importe = partes[0] + "," + segundaParte;
        }
        if (numero < 0) {
          dato.importe = 0;
        }
      } else {
        this.maximaLong = 9;
        dato.importe = dato.importe.substring(0, 8);

        let numero = + dato.importe;
        if (numero < 0) {
          dato.importe = 0;

        }
      }
      this.importe.nativeElement.value = dato.importe;

      this.editarTipoAsistencia(dato);

    } else {
      if (this.datos[0].importe == undefined || this.datos[0].importe == "") {
        this.datos[0].importe = "0";
      }
      if (this.datos[0].importe.split(",").length - 1 > 1) {

        let partePrimera = this.datos[0].importe.split(",");
        this.datos[0].importe = partePrimera[0];
      }
      if (this.datos[0].importe == ",") this.datos[0].importe = "0";

      if (this.datos[0].importe.includes(",")) {
        this.maximaLong = 11;
        let partes = this.datos[0].importe.split(",");
        if (partes[1].length > 2) {
          let segundaParte = partes[1].substring(0, 2);
          this.datos[0].importe = partes[0] + "," + segundaParte;
          // this.importe.nativeElement.value = this.modulosItem.importe;
        }
        let numero = + partes[0];
        if (partes[1].length > 2) {
          let segundaParte = partes[1].substring(0, 2);
          this.datos[0].importe = partes[0] + "," + segundaParte;
        }
      } else {
        this.maximaLong = 9;
        this.datos[0].importe = this.datos[0].importe.substring(0, 8);

      }
      if (+this.datos[0].importe > 999999999) this.datos[0].importe = 99999999;
      this.importe.nativeElement.value = this.datos[0].importe;

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


  getComboTiposAsistencia() {
    this.progressSpinner = true;

    this.sigaServices.get("gestionTiposAsistencia_ComboTiposAsistencia").subscribe(
      n => {

        this.comboTiposGuardia = n.combooItems;
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
   para poder filtrar el dato con o sin estos caracteres*/
        this.comboTiposGuardia.map(e => {
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
        this.searchTiposAsistencias();
      }

    );

  }
  searchTiposAsistencias() {
    this.sigaServices
      .getParam("gestionTiposAsistencia_busquedaTiposAsistencia", "?historico=" + this.historico)
      .subscribe(
        res => {
          this.datos = res.tiposAsistenciasItem;
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          this.datos.forEach(element => {
            let seleccionados = [];
            element.editable = false
            element.overlayVisible = false;
            element.importeReal = +element.importe;
            element.importemaximoReal = +element.importemaximo;

            element.importe = element.importe.replace(".", ",");
            element.importemaximo = element.importemaximo.replace(".", ",");

            if (element.visiblemovil == 1) {
              element.visibleMovilBoolean = true;
            } else {
              element.visibleMovilBoolean = false;
            }
            if (element.pordefecto == 1) {
              element.porDefectoBoolean = true;
            } else {
              element.porDefectoBoolean = false;
            }
            let prueba = [];
            let misseleccionados = element.idtiposguardia.split(',');
            misseleccionados = misseleccionados.map(function (el) {
              return el.trim();
            });
            if (misseleccionados != null && misseleccionados != undefined) {
              misseleccionados.forEach(element => {
                if (seleccionados != undefined) {
                  seleccionados.push(this.comboTiposGuardia.find(x => x.value == element));
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
          this.progressSpinner = false;

          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        },
        err => {
          console.log(err);
          this.progressSpinner = false;

        }
      );

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
    this.searchTiposAsistencias();
    this.selectAll = false;
  }

  save() {
    this.progressSpinner = true;
    let url = "";

    if (this.nuevo) {
      url = "gestionTiposAsistencia_createTipoAsistencia";
      let dato2 = this.datos[0];
      let tiposAsistenciaString = "";
      for (let i in dato2.seleccionadosReal) {
        tiposAsistenciaString += "," + dato2.seleccionadosReal[i].value;
      }
      this.datos[0].idtiposguardia = tiposAsistenciaString.substring(1, tiposAsistenciaString.length);
      let tipoAsistencia = this.datos[0];
      this.body = tipoAsistencia;
      this.body.tiposAsistenciasItem.forEach(element => {
        element.importe = element.importe.replace(",", ".");
        element.importeReal = +element.importe;
        element.importemaximo = element.importemaximo.replace(",", ".");
        element.importemaximoReal = +element.importemaximo;
        if (element.importe == ".") {
          element.importe = 0;
        }
        if (element.importemaximo == ".") {
          element.importemaximo = 0;
        }
      });

      this.callSaveService(url);

    } else {
      if (!this.pordefectotabla) {
        url = "gestionTiposAsistencia_updateTiposAsistencias";
        this.editMode = false;
        if (this.validateUpdate()) {
          this.body = new TiposAsistenciaObject();
          this.body.tiposAsistenciasItem = this.updateTiposAsistencia;
          this.body.tiposAsistenciasItem.forEach(element => {
            element.importe = element.importe.replace(",", ".");
            element.importeReal = +element.importe;
            element.importemaximo = element.importemaximo.replace(",", ".");
            element.importemaximoReal = +element.importemaximo;
            if (element.importe == ".") {
              element.importe = 0;
            }
            if (element.importemaximo == ".") {
              element.importemaximo = 0;
            }
          });
          this.callSaveService(url);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.jgr.maestros.gestionFundamentosResolucion.existeTipoAsistenciaMismaDescripcion"));
          this.progressSpinner = false;
        }

      }
      else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("censo.datosBancarios.mensaje.seleccionar.almenosUnoPorDefecto"));
        this.progressSpinner = false;
      }

    }

  }

  validateUpdate() {

    let check = true;

    this.updateTiposAsistencia.forEach(dato => {

      let findDatos = this.datos.filter(item => item.tipoasistencia === dato.tipoasistencia && item.importe === dato.importe && item.importemaximo === dato.importemaximo && item.visiblemovil === dato.visiblemovil && item.pordefecto === dato.pordefecto);

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
        }

        this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        this.datos.forEach(element => {

          element.importeReal = + element.importe;
          element.importe = element.importe.replace(".", ",");
          element.importemaximoReal = + element.importemaximo;
          element.importemaximo = element.importemaximo.replace(".", ",");
        });
        this.searchTiposAsistencias();

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
        this.updateTiposAsistencia = [];
        this.progressSpinner = false;
      }
    );

  }

  newTipoAsistencia() {
    this.nuevo = true;
    this.editMode = false;
    this.seleccion = false;
    this.selectionMode = "single";
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();

    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let tipoAsistencia = {
      idtipoasistenciacolegio: undefined,
      tipoasistencia: undefined,
      importe: "0",
      importemaximo: "0",
      visiblemovil: "0",
      pordefecto: "0",
      seleccionadosReal: undefined,
      idtiposguardia: undefined,
      editable: true,
      acreditacionNueva: true
    };

    if (this.datos.length == 0) {
      this.datos.push(tipoAsistencia);
    } else {
      this.datos = [tipoAsistencia, ...this.datos];
    }

  }

  onChangeTipoAsistencia(dato) {
    this.progressSpinner = true;

    this.sigaServices
      .getParam(
        "gestionCostesFijos_getComboActuacion",
        "?idTipoAsistencia=" + dato.idTipoAsistencia
      ).subscribe(
        n => {

          dato.opcionTipoActuacion = n.combooItems;
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;

        }
      );
  }

  editarPorDefecto(dato) {
    let unico;
    let existente;
    this.datos.forEach(element => {
      if (element.idtipoasistenciacolegio == dato.idtipoasistenciacolegio) {
        if (dato.editable == true && dato.porDefectoBoolean == false) {
          unico = true;
          dato.pordefecto = "0";
          dato.porDefectoBoolean = false;
        } else {
          existente = true;
          this.pordefectotabla = false;
          dato.pordefecto = "1";
          dato.porDefectoBoolean = true;
          this.messagesConfirmation = true;
          this.confirmEdit(dato);
        }
      }
      else {
        if (element.porDefectoBoolean = true) {
          if (element.pordefecto == "1") {
            this.pordefectoanterior = element.idtipoasistenciacolegio;
          }
          // this.confirmEdit(dato);
          element.porDefectoBoolean = false;
          element.pordefecto = "0";
          element.overlayVisible = false;
          let dato2 = element;
          let tiposAsistenciaString = "";
          for (let i in dato2.seleccionadosReal) {
            tiposAsistenciaString += "," + dato2.seleccionadosReal[i].value;
          }
          dato2.idtiposguardia = tiposAsistenciaString.substring(1, tiposAsistenciaString.length);
          dato2.seleccionados = "";

        }
      }
    });
    if (unico && !existente) {
      // dato.pordefecto = "1";
      // dato.porDefectoBoolean = true;
      // FORZAMOS POR DEFECTO QUE HAYA UNO POR DEFECTO
      this.pordefectotabla = true;
      this.messagesConfirmation = false;
      this.confirmEdit(dato);
    } else {
      let dato2 = dato;
      let tiposAsistenciaString = "";
      for (let i in dato2.seleccionadosReal) {
        tiposAsistenciaString += "," + dato2.seleccionadosReal[i].value;
      }
      dato2.idtiposguardia = tiposAsistenciaString.substring(1, tiposAsistenciaString.length);
      dato2.seleccionados = "";
      this.updateTiposAsistencia.push(dato2);
    }
  }

  confirmEdit(dato) {
    if (this.messagesConfirmation) {
      let mess = this.translateService.instant(
        "general.message.confirmacionpordefecto"
      );
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.pordefectotabla = false
        },
        reject: () => {
          dato.porDefectoBoolean = false
          dato.pordefecto = "0";
          this.pordefectotabla = true;
          if (this.pordefectoanterior != undefined) {
            let findDato = this.datos.findIndex(item => item.idtipoasistenciacolegio === this.pordefectoanterior);

            if (findDato != undefined) {
              this.datos[findDato].pordefecto = "1";
              this.datos[findDato].porDefectoBoolean = "true";
            }
          }
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
    } else {
      let mess = this.translateService.instant(
        "general.message.confirmacionespordefecto"
      );
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.pordefectotabla = false
          dato.pordefecto = "1";
          dato.porDefectoBoolean = true;
        },
        reject: () => {
          dato.porDefectoBoolean = false
          dato.pordefecto = "0";
          this.pordefectotabla = true;

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
  }



  editarTipoAsistencia(dato) {

    let findDato = this.datosInicial.find(item => item.idtipoasistenciacolegio === dato.idtipoasistenciacolegio);

    if (findDato != undefined) {
      let dato2 = dato;
      let tiposAsistenciaString = "";
      for (let i in dato2.seleccionadosReal) {
        tiposAsistenciaString += "," + dato2.seleccionadosReal[i].value;
      }
      dato2.idtiposguardia = tiposAsistenciaString.substring(1, tiposAsistenciaString.length);
      dato2.seleccionados = "";
      this.updateTiposAsistencia.push(dato2);

      if (dato.tipoasistencia != findDato.tipoasistencia || dato.importe != findDato.importe ||
        dato.importemaximo != findDato.importemaximo || dato.visibleMovilBoolean != findDato.visibleMovilBoolean
        || dato.porDefectoBoolean != findDato.porDefectoBoolean) {

        if (dato.visibleMovilBoolean == false) {
          dato.visiblemovil = "0";
        }
        else {
          dato.visiblemovil = "1";
        }

        let findUpdate = this.updateTiposAsistencia.find(item => item.tipoasistencia === dato.tipoasistencia && item.importe === dato.importe && item.visiblemovil === dato.visiblemovil && item.importemaximo === dato.importemaximo && item.pordefecto === dato.pordefecto);

        if (findUpdate == undefined) {
          this.updateTiposAsistencia.push(dato);
        }
      }
    }
  }

  editarImporte(dato) {
    dato.importe = dato.valorNum;

    let findDato = this.datosInicial.find(item => item.idtipoasistenciacolegio === dato.idtipoasistenciacolegio);

    if (findDato != undefined) {
      let dato2 = dato;
      let tiposAsistenciaString = "";
      for (let i in dato2.seleccionadosReal) {
        tiposAsistenciaString += "," + dato2.seleccionadosReal[i].value;
      }
      dato2.idtiposguardia = tiposAsistenciaString.substring(1, tiposAsistenciaString.length);
      dato2.seleccionados = "";
      this.updateTiposAsistencia.push(dato2);

      if (dato.tipoasistencia != findDato.tipoasistencia || dato.importe != findDato.importe ||
        dato.importemaximo != findDato.importemaximo || dato.visibleMovilBoolean != findDato.visibleMovilBoolean
        || dato.porDefectoBoolean != findDato.porDefectoBoolean) {

        if (dato.visibleMovilBoolean == false) {
          dato.visiblemovil = "0";
        }
        else {
          dato.visiblemovil = "1";
        }

        let findUpdate = this.updateTiposAsistencia.find(item => item.tipoasistencia === dato.tipoasistencia && item.importe === dato.importe && item.visiblemovil === dato.visiblemovil && item.importemaximo === dato.importemaximo && item.pordefecto === dato.pordefecto);

        if (findUpdate == undefined) {
          this.updateTiposAsistencia.push(dato);
        }
      }
    }
  }

  editarImporteMaximo(dato) {
    dato.importemaximo = dato.valorNum;
    let findDato = this.datosInicial.find(item => item.idtipoasistenciacolegio === dato.idtipoasistenciacolegio);

    if (findDato != undefined) {
      let dato2 = dato;
      let tiposAsistenciaString = "";
      for (let i in dato2.seleccionadosReal) {
        tiposAsistenciaString += "," + dato2.seleccionadosReal[i].value;
      }
      dato2.idtiposguardia = tiposAsistenciaString.substring(1, tiposAsistenciaString.length);
      dato2.seleccionados = "";
      this.updateTiposAsistencia.push(dato2);

      if (dato.tipoasistencia != findDato.tipoasistencia || dato.importe != findDato.importe ||
        dato.importemaximo != findDato.importemaximo || dato.visibleMovilBoolean != findDato.visibleMovilBoolean
        || dato.porDefectoBoolean != findDato.porDefectoBoolean) {

        if (dato.visibleMovilBoolean == false) {
          dato.visiblemovil = "0";
        }
        else {
          dato.visiblemovil = "1";
        }

        let findUpdate = this.updateTiposAsistencia.find(item => item.tipoasistencia === dato.tipoasistencia && item.importe === dato.importe && item.visiblemovil === dato.visiblemovil && item.importemaximo === dato.importemaximo && item.pordefecto === dato.pordefecto);

        if (findUpdate == undefined) {
          this.updateTiposAsistencia.push(dato);
        }
      }
    }
  }

  editTiposAsistencia(dato) {

    if (!this.nuevo) {

      // if (dato.jurisdicciones.length == 0) {
      //   this.showMessage("info", "Informacion", "Debe seleccionar al menos un partido judicial");
      //   let findUpdate = this.updateZonas.findIndex(item => item.idArea === dato.idArea && item.idMateria === dato.idMateria);

      //   if (findUpdate != undefined) {
      //     this.updateZonas.splice(findUpdate);
      //   }

      // } else {
      let findUpdate = this.updateTiposAsistencia.find(item => item.idtipoasistenciacolegio === dato.idtipoasistenciacolegio);

      if (findUpdate == undefined) {
        let dato2 = dato;
        let tiposAsistenciaString = "";
        for (let i in dato2.seleccionadosReal) {
          tiposAsistenciaString += "," + dato2.seleccionadosReal[i].value.trim();
        }

        dato2.idtiposguardia = tiposAsistenciaString.substring(1, tiposAsistenciaString.length);
        dato2.seleccionados = "";
        this.updateTiposAsistencia.push(dato2);
      } else {
        let updateFind = this.updateTiposAsistencia.findIndex(item => item.idtipoasistenciacolegio === dato.idtipoasistenciacolegio);
        let tiposAsistenciaString = "";
        for (let i in findUpdate.seleccionadosReal) {
          tiposAsistenciaString += "," + dato.seleccionadosReal[i].value.trim();
        }
        this.updateTiposAsistencia[updateFind].seleccionadosReal = dato.seleccionadosReal;
        this.updateTiposAsistencia[updateFind].idtiposguardia = tiposAsistenciaString.substring(1, tiposAsistenciaString.length);
        this.updateTiposAsistencia[updateFind].seleccionados = "";
      }
      // }
    } else {
      this.selectedDatos = [];
    }
  }

  disabledSave() {
    if (this.nuevo) {
      if (this.datos[0].tipoasistencia != undefined && this.datos[0].importe != undefined && this.datos[0].importemaximo != undefined
        && this.datos[0].seleccionadosReal != undefined) {
        return false;
      } else {
        return true;
      }

    } else {
      if (!this.historico && (this.updateTiposAsistencia != undefined && this.updateTiposAsistencia.length > 0) && this.permisoEscritura) {
        return false;
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
        let findDato = this.datosInicial.find(item => item.tipoasistencia === this.selectedDatos[0].tipoasistencia && item.importe === this.selectedDatos[0].importe
          && item.importemaximo === this.selectedDatos[0].importemaximo && item.visibleMovilBoolean === this.selectedDatos[0].visibleMovilBoolean && item.porDefectoBoolean === this.selectedDatos[0].porDefectoBoolean);

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

    this.body = new TiposAsistenciaObject();
    this.body.tiposAsistenciasItem = this.selectedDatos;
    let pordefectoactivado;
    this.body.tiposAsistenciasItem.forEach(element => {
      if (element.pordefecto == "1") {
        pordefectoactivado = true;
      }
    });
    if (!pordefectoactivado) {
      this.sigaServices.post("gestionTiposAsistencia_deleteTipoAsitencia", this.body).subscribe(
        data => {

          this.nuevo = false;
          this.selectedDatos = [];
          this.selectMultiple = false;
          this.selectAll = false;
          this.searchTiposAsistencias();
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
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.nosepuedeeliminarpordefecto"));
      this.progressSpinner = false;
    }


  }

  activate() {
    this.progressSpinner = true;
    this.body = new TiposAsistenciaObject();
    this.body.tiposAsistenciasItem = this.selectedDatos;
    this.historico = false;

    this.sigaServices.post("gestionTiposAsistencia_activateTipoAsitencia", this.body).subscribe(
      data => {

        this.selectedDatos = [];
        this.searchTiposAsistencias();
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


  rest() {
    if (this.datosInicial != undefined) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }
    this.editElementDisabled();
    this.selectedDatos = [];
    this.updateTiposAsistencia = [];
    this.nuevo = false;
    this.editMode = false;
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
      { field: "tipoasistencia", header: "censo.usuario.nombre" },
      { field: "importeReal", header: "formacion.fichaCurso.tarjetaPrecios.importe" },
      { field: "importemaximoReal", header: "formacion.fichaCurso.tarjetaPrecios.importeMaximo" },
      { field: "tiposguardia", header: "maestros.tiposasistencia.tipoGuardia" },
      { field: "visiblemovil", header: "administracion.informes.literal.visibleMovil" },
      { field: "pordefecto", header: "informesycomunicaciones.modelosdecomunicacion.ficha.porDefecto" }
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
