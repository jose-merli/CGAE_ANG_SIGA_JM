import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { ModulosItem } from '../../../../../models/sjcs/ModulosItem';
import { UpperCasePipe } from '../../../../../../../node_modules/@angular/common';
import { PartidasObject } from '../../../../../models/sjcs/PartidasObject';
import { findIndex } from 'rxjs/operators';
import { MultiSelect, SortEvent } from 'primeng/primeng';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { TurnosObject } from '../../../../../models/sjcs/TurnosObject';
import { DatosDireccionesObject } from '../../../../../models/DatosDireccionesObject';
import { DatosDireccionesItem } from '../../../../../models/DatosDireccionesItem';


@Component({
  selector: 'app-gestion-turnos',
  templateUrl: './gestion-turnos.component.html',
  styleUrls: ['./gestion-turnos.component.scss']
})
export class TablaTurnosComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  colsPartidoJudicial;
  msgs;
  partidoJudicial;
  id;
  datosInicial = [];
  editMode: boolean = false;
  selectedBefore;

  updatePartidasPres = [];

  body;
  partidasJudiciales: any[] = [];

  selectedItem: number = 10;
  selectAll;
  selectedDatos: any[] = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  sortO: number = 1;
  message;
  public ascNumberSort = true;
  permisos: boolean = false;
  initDatos;
  nuevo: boolean = false;
  progressSpinner: boolean = false;
  selectionMode: string = "single";

  //Resultados de la busqueda
  @Input() datos;

  //Combo partidos judiciales
  comboPJ;

  @Output() searchPartidas = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;
  rows: any;
  sort: (compareFn?: (a: any, b: any) => number) => any[];

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService
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
    this.updatePartidasPres = [];
    this.nuevo = false;
    if (this.persistenceService.getPermisos()) {
      this.permisos = true;
    } else {
      this.permisos = false;
    }
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
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

  mySort(event: any, field: string) {
    if (event.order === 1) {
      this.rows.sort((a, b) => {
        if (typeof a[field] === 'string') {
          const sortDesc = a[field] < b[field] ? -1 : 0;
          return a[field] > b[field] ? 1 : sortDesc;
        }
        return a[field] - b[field];
      });
    } else {
      this.rows.sort((a, b) => {
        if (typeof a[field] === 'string') {
          const sortDesc = a[field] < b[field] ? 1 : 0;
          return a[field] > b[field] ? -1 : sortDesc;
        }
        return b[field] - a[field];
      });
    }
    this.rows = [...this.rows];
  }

  getId() {
    let seleccionados = [];
    seleccionados.push(this.selectedDatos);
    this.id = this.datos.findIndex(item => item.idpartidapresupuestaria === seleccionados[0].idpartidapresupuestaria);
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
      url = "gestionPartidasPres_createPartidasPres";
      let partidaPresupuestaria = this.datos[0];
      this.body = partidaPresupuestaria;
      this.body.importepartida = this.body.valorNum;
      this.body.importepartida = this.body.importepartida.replace(",", ".");
      this.body.importepartidaReal = +this.body.importepartida;
      if (this.body.importepartida == ".") {
        this.body.importepartida = 0;
      }
      this.callSaveService(url);

    } else {
      url = "gestionPartidasPres_updatePartidasPres";
      this.editMode = false;
      if (this.validateUpdate()) {
        this.body = new PartidasObject();
        this.body.partidasItem = this.updatePartidasPres;
        this.body.partidasItem.forEach(element => {
          element.importepartida = element.importepartida.replace(",", ".");
          element.importepartidaReal = +element.importepartida;
          if (element.importepartida == ".") {
            element.importepartida = 0;
          }
        });
        this.callSaveService(url);
      } else {
        err => {

          if (err.error != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          }
          this.progressSpinner = false;
        }
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

  // rest() {
  //   if (this.editMode) {
  //     if (this.datosInicial != undefined) this.datos = JSON.parse(JSON.stringify(this.datosInicial));
  //   } else {
  //     this.partidasItem = new PartidasItem();
  //   }
  // }

  newPartidaPresupuestaria() {
    this.nuevo = true;
    this.editMode = false;
    this.selectionMode = "single";
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    let partidaPresupuestaria = {
      nombrepartida: undefined,
      descripcion: undefined,
      importepartida: "0",
      importepartidaReal: 0,
      idpartidapresupuestaria: undefined,
      editable: true
    };
    if (this.datos.length == 0) {
      this.datos.push(partidaPresupuestaria);
    } else {
      this.datos = [partidaPresupuestaria, ...this.datos];
    }
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
  }

  disabledSave() {
    if (this.nuevo) {
      if (this.datos[0].nombrepartida != "" && this.datos[0].descripcion != "" && this.datos[0].nombrepartida != undefined && this.datos[0].descripcion != undefined
        && this.datos[0].valorNum != undefined) {
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

      let findDatos = this.datos.filter(item => item.nombrepartida === dato.nombrepartida && item.descripcion === dato.descripcion && item.importepartida === dato.importepartida);

      if (findDatos != undefined && findDatos.length > 1) {
        check = false;
      }

    });

    return check;
  }

  searchHistorical() {

    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.searchPartidas.emit(this.historico);
    this.selectAll = false
    // if (this.historico) {
    //   this.selectMultiple = true;
    //   this.selectionMode = "multiple";
    // }
  }


  delete() {
    let turnosDelete = new TurnosObject();
    turnosDelete.turnosItem = this.selectedDatos
    this.sigaServices.post("turnos_eliminateTurnos", turnosDelete).subscribe(
      data => {
        this.selectedDatos = [];
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
      { field: "abreviatura", header: "gratuita.definirTurnosIndex.literal.abreviatura" },
      { field: "nombre", header: "censo.usuario.nombre" },
      { field: "area", header: "menu.justiciaGratuita.maestros.Area" },
      { field: "materia", header: "menu.justiciaGratuita.maestros.Materia" },
      { field: "zona", header: "justiciaGratuita.maestros.zonasYSubzonas.grupoZona.cabecera" },
      { field: "subzona", header: "justiciaGratuita.maestros.zonasYSubzonas.zonas.cabecera" },
      { field: "grupofacturacion", header: "justiciaGratuita.oficio.turnos.grupofacturacion" },
      { field: "nletrados", header: "justiciaGratuita.oficio.turnos.nletrados" },

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

  openTab(evento) {
    if (!this.selectAll && !this.selectMultiple) {
      this.progressSpinner = true;
      this.persistenceService.setDatos(evento.data);
      this.router.navigate(["/gestionTurnos"], { queryParams: { idturno: evento.data.idturno } });
    } else {

      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }

    }
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
  obtenerPartidos(dato) {
    return dato.nombrepartidosjudiciales;
  }

}
