import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MultiSelect } from '../../../../../../../node_modules/primeng/primeng';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { CosteFijoItem } from '../../../../../models/sjcs/CosteFijoItem';
import { CosteFijoObject } from '../../../../../models/sjcs/CosteFijoObject';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_maestros } from '../../../../../permisos/procesos_maestros';
import { Router } from '@angular/router';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-gestion-costesfijos',
  templateUrl: './gestion-costesfijos.component.html',
  styleUrls: ['./gestion-costesfijos.component.scss']
})
export class GestionCostesfijosComponent implements OnInit {

  textSelected: String = "{label}";

  selectedItem: number = 10;
  selectAll: boolean = false;;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  cols;
  rowsPerPage;

  editMode: boolean = false;

  datos = [];

  historico: boolean = false;

  comboCostesFijos;
  comboAsistencias;
  comboActuacion;

  progressSpinner: boolean = false;
  msgs;
  body;
  nuevo: boolean = false;
  datosInicial = [];
  updateCosteFijo = [];

  idTipoAsistencia;
  selectedBefore;
  selectionMode: string = "single";
  id: any;
  permisoEscritura: boolean = false;
  maximaLong: any = 15;

  @ViewChild("table") table;
  @ViewChild("multiSelectPJ") multiSelect: MultiSelect;
  @ViewChild("importe") importe;

  constructor(private changeDetectorRef: ChangeDetectorRef, private persistenceService: PersistenceService,
    private sigaServices: SigaServices, private translateService: TranslateService, private commonsService: CommonsService, private router: Router) { }

  ngOnInit() {
    this.getCols();
    this.searchCostesFijos();
    this.getComboCostesFijos();
    this.getComboAsistencia();

    this.commonsService.checkAcceso(procesos_maestros.costesFijos)
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

  getComboCostesFijos() {
    this.progressSpinner = true;

    this.sigaServices.get("gestionCostesFijos_getCosteFijos").subscribe(
      n => {
        this.comboCostesFijos = n.combooItems;
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      }
    );
  }

  getComboAsistencia() {
    this.progressSpinner = true;

    this.sigaServices.get("gestionCostesFijos_getComboAsistencia").subscribe(
      n => {
        this.comboAsistencias = n.combooItems;
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      }
    );
  }

  getComboActuacion(index) {
    this.progressSpinner = true;

    this.sigaServices
      .getParam(
        "gestionCostesFijos_getComboActuacion",
        "?idTipoAsistencia=" + this.datos[index].idTipoAsistencia
      ).subscribe(
        n => {

          this.datos[index].opcionTipoActuacion = n.combooItems;
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;

        }
      );
  }

  searchCostesFijos() {

    this.selectAll = false;
    this.selectMultiple = false;

    this.sigaServices
      .getParam("gestionCostesFijos_searchCosteFijos", "?historico=" + this.historico)
      .subscribe(
        res => {
          this.datos = res.costeFijoItems;
          this.datos.forEach(element => {
            element.importeReal = + element.importe;
            element.importe = element.importe.replace(".", ",");
            if (element.importe[0] == ',')
              element.importe = '0'.concat(element.importe)
          });

          this.editElementDisabled();

          this.getTipoActuacion();
          this.progressSpinner = false;

        },
        err => {
          console.log(err);
          this.progressSpinner = false;

        }
      );
  }

  searchHistorical() {
    this.historico = !this.historico;
    this.searchCostesFijos();
    if (this.historico) {
      this.selectMultiple = true;
      this.selectionMode = "multiple";
    }

  }

  getTipoActuacion() {
    for (let index = 0; index < this.datos.length; index++) {
      this.getComboActuacion(index);
    }

    this.datosInicial = JSON.parse(JSON.stringify(this.datos));

  }

  save() {
    this.progressSpinner = true;
    let url = "";

    if (this.nuevo) {
      url = "gestionCostesFijos_createCosteFijo";
      let costeFijo = this.datos[0];
      this.body = costeFijo;
      this.body.importe = this.body.valorNum;
      this.body.importe = this.body.importe.replace(",", ".");
      this.body.importeReal = +this.body.importe;
      if (this.body.importe == ".") {
        this.body.importe = 0;
      }
      this.callSaveService(url);

    } else {
      url = "gestionCostesFijos_updateCostesFijos";
      this.editMode = false;
      if (this.validateUpdate()) {
        this.body = new CosteFijoObject();
        this.body.costeFijoItems = this.updateCosteFijo;
        this.callSaveService(url);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("messages.jgr.maestros.gestionCostesFijos.constesFijosModificadosYaRegistrados"));
        this.progressSpinner = false;
      }

    }

  }

  validateUpdate() {

    let check = true;

    this.updateCosteFijo.forEach(dato => {

      let findDatos = this.datos.filter(item => item.idCosteFijo === dato.idCosteFijo && item.idTipoAsistencia === dato.idTipoAsistencia && item.idTipoActuacion === dato.idTipoActuacion);

      if (findDatos != undefined && findDatos.length > 1) {
        check = false;
      }

    });

    return check;
  }


  callSaveService(url) {
    if (this.body.costeFijoItems != undefined) {
      this.body.costeFijoItems.forEach(element => {
        element.importe = element.importe.replace(",", ".");
        element.importeReal = +element.importe;
        if (element.importe == ".") {
          element.importe = 0;
        }
      });
    } else {
      this.body.importe = + this.body.importe.replace(",", ".");
    }

    this.sigaServices.post(url, this.body).subscribe(
      data => {

        if (this.nuevo) {
          this.nuevo = false;
        }

        this.datosInicial = JSON.parse(JSON.stringify(this.datos));
        this.searchCostesFijos();

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
        this.updateCosteFijo = [];
        this.progressSpinner = false;
      }
    );

  }

  newCosteFijo() {
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
    this.nuevo = true;
    this.editMode = false;

    this.selectionMode = "single";

    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let costeFijo = {
      idCosteFijo: undefined,
      idTipoAusencia: undefined,
      idTipoActuacion: undefined,
      importe: "0",
      importeReal: 0,
      editable: true
    };

    if (this.datos.length == 0) {
      this.datos.push(costeFijo);
    } else {
      this.datos = [costeFijo, ...this.datos];
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

  changeCosteFijo(dato) {

    let findDato = this.datosInicial.find(item => item.descripcion === dato.descripcion && item.tipoAsistencia === dato.tipoAsistencia && item.tipoActuacion === dato.tipoActuacion);

    if (findDato != undefined) {
      if (dato.idCosteFijo != findDato.idCosteFijo) {

        let findUpdate = this.updateCosteFijo.find(item => item.descripcion === dato.descripcion && item.tipoAsistencia === dato.tipoAsistencia && item.tipoActuacion === dato.tipoActuacion);

        if (findUpdate == undefined) {
          this.updateCosteFijo.push(dato);
        }
      }
    }

  }

  changeTipoAsistencia(dato) {

    let findIndex = this.datos.findIndex(item => item.descripcion === dato.descripcion && item.tipoAsistencia === dato.tipoAsistencia && item.tipoActuacion === dato.tipoActuacion);

    this.getComboActuacion(findIndex);
    dato.idTipoActuacion = undefined;

    let findDato = this.datosInicial.find(item => item.descripcion === dato.descripcion && item.tipoAsistencia === dato.tipoAsistencia && item.tipoActuacion === dato.tipoActuacion);

    if (findDato != undefined) {
      if (dato.idTipoAsistencia != findDato.idTipoAsistencia) {

        let findUpdate = this.updateCosteFijo.find(item => item.descripcion === dato.descripcion && item.tipoAsistencia === dato.tipoAsistencia && item.tipoActuacion === dato.tipoActuacion);

        if (findUpdate == undefined) {
          this.updateCosteFijo.push(dato);
        }
      }
    }

  }

  changeTipoActuacion(dato) {

    let findDato = this.datosInicial.find(item => item.descripcion === dato.descripcion && item.tipoAsistencia === dato.tipoAsistencia && item.tipoActuacion === dato.tipoActuacion);

    if (findDato != undefined) {
      if (dato.idTipoActuacion != findDato.idTipoActuacion) {

        let findUpdate = this.updateCosteFijo.find(item => item.descripcion === dato.descripcion && item.tipoAsistencia === dato.tipoAsistencia && item.tipoActuacion === dato.tipoActuacion);

        if (findUpdate == undefined) {
          this.updateCosteFijo.push(dato);
        }
      }
    }

  }

  changeImporte(dato) {
    dato.importe = dato.valorNum
    let findDato = this.datosInicial.find(item => item.descripcion === this.selectedBefore.descripcion && item.tipoAsistencia === this.selectedBefore.tipoAsistencia && item.tipoActuacion === this.selectedBefore.tipoActuacion);
    this.selectedBefore = this.datos.find(item => item.descripcion === this.selectedBefore.descripcion && item.tipoAsistencia === this.selectedBefore.tipoAsistencia && item.tipoActuacion === this.selectedBefore.tipoActuacion);

    if (findDato != undefined) {
      if (this.selectedBefore.importe != findDato.importe) {

        let findUpdate = this.updateCosteFijo.find(item => item.descripcion === this.selectedBefore.descripcion && item.tipoAsistencia === this.selectedBefore.tipoAsistencia && item.tipoActuacion === this.selectedBefore.tipoActuacion);

        if (findUpdate == undefined) {
          this.updateCosteFijo.push(this.selectedBefore);
        }
      }
    }

  }

  disabledSave() {
    if (this.nuevo) {
      if (this.datos[0].idCosteFijo != undefined && this.datos[0].idTipoAsistencia != undefined && this.datos[0].idTipoActuacion != undefined
        && this.datos[0].valorNum != undefined && this.datos[0].valorNum != "") {
        return false;
      } else {
        return true;
      }

    } else {
      if (!this.historico && (this.updateCosteFijo != undefined && this.updateCosteFijo.length > 0) && this.permisoEscritura) {
        return false;
      } else {
        return true;
      }
    }
  }

  edit(evento) {
    this.getId();
    if (!this.nuevo && this.permisoEscritura) {

      if (!this.selectAll && !this.selectMultiple) {

        this.datos.forEach(element => {
          element.editable = false;
          element.overlayVisible = false;
        });

        evento.data.editable = true;
        this.editMode = true;

        this.selectedDatos = [];
        this.selectedDatos.push(evento.data);

        let findDato = this.datosInicial.find(item => item.descripcion === this.selectedDatos[0].descripcion && item.tipoAsistencia === this.selectedDatos[0].tipoAsistencia
          && item.tipoActuacion === this.selectedDatos[0].tipoActuacion);

        this.selectedBefore = findDato;

      } else {
        if (evento.data.fechaBaja == undefined && this.historico) {
          this.selectedDatos.pop();
        }

      }

    }
  }

  delete() {
    this.progressSpinner = true;

    this.body = new CosteFijoObject();
    this.body.costeFijoItems = this.selectedDatos;

    this.sigaServices.post("gestionCostesFijos_deleteCostesFijos", this.body).subscribe(
      data => {

        this.nuevo = false;
        this.selectedDatos = [];
        this.selectMultiple = false;
        this.selectAll = false;
        this.searchCostesFijos();
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

  activate() {
    this.progressSpinner = true;
    let costesFijosActivate = new CosteFijoObject();
    costesFijosActivate.costeFijoItems = this.selectedDatos;

    this.sigaServices.post("gestionCostesFijos_activateCostesFijos", costesFijosActivate).subscribe(
      data => {

        this.selectedDatos = [];
        this.searchCostesFijos();
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


  rest() {
    if (this.datosInicial != undefined) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
      this.getTipoActuacion();
    } else {
      this.datos = [];
    }
    this.selectedDatos = [];
    this.updateCosteFijo = [];
    this.nuevo = false;
    this.editMode = false;
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
      { field: "descripcion", header: "justiciaGratuita.maestros.gestionCostesFijos.tipoCoste" },
      { field: "tipoAsistencia", header: "justiciaGratuita.maestros.gestionCostesFijos.tipoAsistencia" },
      { field: "tipoActuacion", header: "justiciaGratuita.maestros.gestionCostesFijos.tipoActuacion" },
      { field: "importeReal", header: "formacion.fichaCurso.tarjetaPrecios.importe" }

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
    if (dato.fechaBaja == null) return false;
    else return true;
  }

  onChangeSelectAll() {

    this.editElementDisabled();
    this.editMode = false;

    if (this.selectAll) {
      this.selectMultiple = true;

      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechaBaja != undefined && dato.fechaBaja != null);
        this.selectMultiple = true;
        this.selectionMode = "single";
      } else {
        this.selectedDatos = this.datos;
        this.selectMultiple = false;
        this.selectionMode = "single";
      }

      if (this.selectedDatos != undefined && this.selectedDatos.length > 0) {
        this.selectMultiple = true;
        this.numSelected = this.selectedDatos.length;
      }
      this.numSelected = this.datos.length;
      this.selectionMode = "multiple";
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      if (this.historico)
        this.selectMultiple = true;
      this.selectionMode = "multiple";
    }


  }

  isSelectMultiple() {

    if (this.permisoEscritura) {

      this.editElementDisabled();
      this.editMode = false;

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

  getId() {
    let seleccionados = [];
    seleccionados.push(this.selectedDatos);
    this.id = this.datos.findIndex(item => item.idTipoActuacion === seleccionados[0].idTipoActuacion);
  }

  validateAcreditacion() {
    if (this.selectedDatos == null || this.selectedDatos.length == 0) {
      this.selectedDatos = [];
      this.selectedDatos.push(this.datos.find(item => item.editable == true));
    }
    if (!this.nuevo) {
      let datoId = this.datos.findIndex(item => item.idTipoActuacion === this.selectedDatos[0].idTipoActuacion && item.idTipoAsistencia === this.selectedDatos[0].idTipoAsistencia && item.idCosteFijo === this.selectedDatos[0].idCosteFijo);
      let dato = this.datos[datoId];
      dato.importe = "" + dato.importe;
      if (dato.importe.split(",").length - 1 > 1) {
        let partePrimera = dato.importe.split(",");
        dato.importe = partePrimera[0];
      }
      if (dato.importe.includes(",")) {
        let partes = dato.importe.split(",");
        // if (partes[1].length > 2) {
        //   this.maximaLong = partes[0].length + 3;
        // } else {
        //   this.maximaLong = partes[0].length + 4;
        // }
        // if (this.maximaLong >= 15) {
        //   this.maximaLong = 15;
        // }
        let numero = + partes[0];
        if (partes[1].length > 2) {
          let segundaParte = partes[1].substring(0, 2);
          dato.importe = partes[0] + "," + segundaParte;
        }
      } else {
        // this.maximaLong = 15;
      }
      this.importe.nativeElement.value = dato.importe;

    } else {
      this.datos[0].importe = "" + this.datos[0].importe;
      if (this.datos[0].importe.includes(",")) {
        let partes = this.datos[0].importe.split(",");
        if (partes[1].length > 2) {
          let segundaParte = partes[1].substring(0, 2);
          this.datos[0].importe = partes[0] + "," + segundaParte;
          // this.importe.nativeElement.value = this.modulosItem.importe;
        }
        // this.maximaLong = 4;
        // if (partes[1].length > 2) {
        //   this.maximaLong = partes[0].length + 3;
        // } else {
        //   this.maximaLong = partes[0].length + 4;
        // } if (this.maximaLong >= 15) {
        //   this.maximaLong = 15;
        // }
        let numero = + partes[0];
        if (partes[1].length > 2) {
          let segundaParte = partes[1].substring(0, 2);
          this.datos[0].importe = partes[0] + "," + segundaParte;
        }
      }
      if (+this.datos[0].importe > 100) this.datos[0].importe = 100;
      this.importe.nativeElement.value = this.datos[0].importe;

    }

  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57 || (charCode == 44)) {
      if (charCode == 188) {
      }
      return true;
    }
    else {
      return false;

    }
  }

  actualizaSeleccionados(selectedDatos) {
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
    }
  }

  clear() {
    this.msgs = [];
  }

}
