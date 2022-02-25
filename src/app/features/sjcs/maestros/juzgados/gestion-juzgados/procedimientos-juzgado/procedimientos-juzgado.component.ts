import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DataTable, ConfirmationService } from 'primeng/primeng';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { ProcedimientoObject } from '../../../../../../models/sjcs/ProcedimientoObject';
import { exists } from 'fs';
import { element } from '../../../../../../../../node_modules/protractor';
import { CommonsService } from '../../../../../../_services/commons.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-procedimientos-juzgado',
  templateUrl: './procedimientos-juzgado.component.html',
  styleUrls: ['./procedimientos-juzgado.component.scss']
})
export class ProcedimientosJuzgadoComponent implements OnInit {


  //Resultados de la busqueda
  @Input() datos;
  @Input() modoEdicion;

  @ViewChild("table") table: DataTable;

  rowsPerPage: any = [];
  cols;
  msgs;
  selectedProcedimiento;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  errorRep: boolean = false;
  selectMultiple: boolean = false;
  historico: boolean = false;
  openFicha: boolean = false;
  nuevo: boolean = false;
  selectionMode = "multiple";
  procItems = [];
  prItems = [];
  permisoEscritura;
  buscadores = [];
  procedimientos = [];
  procedimientosElegir = [];

  initSelectedDatos;
  progressSpinner: boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, private persistenceService: PersistenceService,
    private sigaServices: SigaServices, private translateService: TranslateService,
    private confirmationService: ConfirmationService, private commonsService: CommonsService, private router: Router
  ) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()

    }

    this.validateHistorical();
    this.getCols();
    if (this.modoEdicion) {
      this.getProcJuged();
    }

    // this.getProcess();

  }

  // ngAfterViewInit(): void {
  //   if (this.modoEdicion) {
  //     this.getProcJuged();
  //   }
  // }

  getProcess() {
    this.sigaServices.get("gestionJuzgados_searchProcess").subscribe(
      n => {
        // this.procedimientosElegir = n.procedimientosItems;
        n.procedimientosItems.forEach(element => {
          // //console.log(this.procedimientos.indexOf(element));
          // if (this.procedimientos.indexOf(element) == -1) {
          this.procedimientosElegir.push({ label: element.nombre, value: element.idProcedimiento });
          // }
        });
        this.procItems = n.procedimientosItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  getProcJuged() {

    this.sigaServices
      .getParam("gestionJuzgados_searchProcCourt", "?idJuzgado=" + this.datos.idJuzgado).subscribe(
        n => {
          this.procedimientos = n.procedimientosItems;
          this.initSelectedDatos = JSON.parse(JSON.stringify((this.procedimientos)));

          if (this.procedimientos != undefined && this.procedimientos.length > 0) {
            this.selectMultiple = true;
          }

        },
        err => {
          //console.log(err);
        }
      );
  }

  checkPermisosRest() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
  }

  rest() {
    this.nuevo = false;
    if (this.initSelectedDatos != undefined) {
      this.procedimientos = JSON.parse(JSON.stringify(this.initSelectedDatos));
    } else {
      this.procedimientos = [];
    }
    this.selectionMode = "multiple";
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
    this.buscadores = this.buscadores.map(it => it = "");
  }

  setItalic(dato) {
    if (dato.fechaBaja == null) return false;
    else return true;
  }

  disableGuardar() {
    // if ((JSON.stringify(this.selectedDatos) != JSON.stringify(this.initSelectedDatos)) && this.initSelectedDatos != undefined && !this.nuevo) {
    if (this.nuevo && this.selectedProcedimiento != null && !this.errorRep) {
      return false;
    } else {
      return true;
    }
  }

  searchProc() {
    this.errorRep = false;
    this.prItems = this.procItems.filter(it => this.selectedProcedimiento == it.idProcedimiento)
    this.procedimientos.forEach(element => {
      if (element.idProcedimiento == this.prItems[0].idProcedimiento) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.maestros.modulos.moduloAsociado"));
        this.errorRep = true;

        this.procedimientos[0].editable = true;
        this.disableGuardar();
        this.selectionMode = "multiple";
        // this.selectedProcedimiento = [];
      }
    })
    if (this.prItems[0] != null && !this.errorRep)
      this.procedimientos[0] = this.prItems[0];
  }

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disableGuardar()) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.save();
      }
    }
  }

  save() {
    this.progressSpinner = true;
    let procedimientoDTO = new ProcedimientoObject();

    // if (this.procedimientos[0] != null && this.procedimientos[0] != undefined && this.nuevo)
    //   this.selectedDatos.push(this.procedimientos[0]);

    procedimientoDTO.procedimientosItems = this.procedimientos;
    procedimientoDTO.idJuzgado = this.datos.idJuzgado;

    if (!this.errorRep) {
      this.sigaServices.post("gestionJuzgados_associateProcess", procedimientoDTO).subscribe(
        data => {
          this.initSelectedDatos = JSON.parse(JSON.stringify((this.procedimientos)));
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.progressSpinner = false;
          this.nuevo = false;
          this.errorRep = false;
        },
        err => {

          if (err.error != undefined && JSON.parse(err.error).error.description != "") {
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
    this.selectedProcedimiento = null;
    this.selectedDatos = []
    this.selectionMode = "multiple";
  }

  validateHistorical() {
    if (this.persistenceService.getDatos() != undefined) {

      if (this.persistenceService.getDatos().fechabaja != null || this.persistenceService.getDatos().institucionVal != undefined) {
        this.historico = true;
        this.selectionMode = "null";
      } else {
        this.historico = false;
        this.selectionMode = "multiple";

      }
    }
  }

  getCols() {

    this.cols = [
      { field: "codigo", header: "administracion.parametrosGenerales.literal.codigo" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre" },
      { field: "importe", header: "formacion.fichaCurso.tarjetaPrecios.importe" },
      { field: "jurisdiccion", header: "menu.justiciaGratuita.maestros.Jurisdiccion" }

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
    if (this.selectAll) {
      if (this.nuevo) this.datos.shift();
      this.nuevo = false;
      this.selectMultiple = true;
      this.selectedDatos = this.procedimientos;
      this.numSelected = this.procedimientos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }
  }

  isSelectMultiple() {

    if (!this.historico && this.permisoEscritura) {
      if (this.nuevo) this.datos.shift();
      this.nuevo = false;
      // if (this.selectedDatos != undefined && this.selectedDatos.length == 0) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      }
      // }
    }
  }


  actualizaSeleccionados() {
    if (this.initSelectedDatos == undefined) {
      this.initSelectedDatos = [];
    }
    if (this.permisoEscritura) {
      if (this.selectedDatos == undefined || this.selectedDatos.length == 0) {
        this.numSelected = 0;
        this.selectMultiple = false;
      } else {
        this.numSelected = this.selectedDatos.length;
        this.selectMultiple = true;
      }
    } else {
      this.selectedDatos = [];
      this.selectionMode = "null";
      this.selectedDatos = JSON.parse(JSON.stringify(this.initSelectedDatos));
      this.table.reset();
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

  abreCierraFicha() {
    if (this.modoEdicion) {
      this.openFicha = !this.openFicha;

    }
  }

  checkPermisosNewProcedimiento() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.selectAll || this.historico || !this.permisoEscritura || !this.disableGuardar() || this.nuevo) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.newProcedimiento();
      }
    }
  }

  aniadirModulos(){
    sessionStorage.setItem("vieneDeFichaJuzgado", "true");
    this.router.navigate(["maestrosModulos"]);
  }

  newProcedimiento() {
    this.getProcess();

    this.selectedDatos = [];

    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();
    this.nuevo = true;
    this.modoEdicion = false;
    this.selectionMode = "single";
    this.selectMultiple = false;
    // if (this.datosInicial != undefined && this.datosInicial != null) {
    //   this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    // } else {
    //   this.datos = [];
    // }
    let nuevoProcedimiento = {
      codigo: undefined,
      nombre: undefined,
      importe: undefined,
      jurisdiccion: undefined,
      editable: true
    };
    if (this.procedimientos.length == 0) {
      this.procedimientos.push(nuevoProcedimiento);
    } else {
      this.procedimientos = [nuevoProcedimiento, ...this.procedimientos];
    }

  }

  checkPermisosDelete() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.historico || this.nuevo || !this.permisoEscritura || ((!this.selectMultiple || !this.selectAll) && this.selectedDatos.length == 0)) {
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
  delete() {
    let procedimientoDelete = new ProcedimientoObject();
    procedimientoDelete.procedimientosItems = this.selectedDatos;
    this.procedimientos = this.procedimientos.filter(it => this.selectedDatos.indexOf(it) == -1);
    this.nuevo = false;
    this.save();

  }
}
