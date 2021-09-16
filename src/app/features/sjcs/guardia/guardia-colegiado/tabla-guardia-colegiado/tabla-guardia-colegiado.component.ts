import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-tabla-guardia-colegiado',
  templateUrl: './tabla-guardia-colegiado.component.html',
  styleUrls: ['./tabla-guardia-colegiado.component.scss']
})
export class TablaGuardiaColegiadoComponent implements OnInit {

  @Input() datos;

  @ViewChild("table") table: DataTable;
  initDatos: any;
  cols: any;
  buscadores = [];
  rowsPerPage: { label: number; value: number; }[];
  permisoEscritura: any;
  selectMultiple: boolean;
  selectedDatos: any[];
  numSelected: number;
  selectedItem: any;
  fechaValidacion;
  msgs: { severity: string; summary: string; detail: string; }[];

  constructor(private translateService: TranslateService,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
  }
  isSelectMultiple() {
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
  }


  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
  getCols() {
    this.cols = [
      { field: "fechaInicio", header: "facturacion.seriesFacturacion.literal.fInicio" },
      { field: "fechaFin", header: "censo.consultaDatos.literal.fechaFin" },
      { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
      { field: "idTipoGuardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      { field: "tipoDia", header: "dato.jgr.guardia.guardias.tipoDia" },
      { field: "nColegiado", header: "justiciaGratuita.justiciables.literal.colegiado" },
      { field: "ordenGrupo", header: "administracion.informes.literal.orden" },
      { field: "estado", header: "dato.jgr.guardia.inscripciones.estado" },

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

  fillFechaValidacion(event){
    this.fechaValidacion = event;
  }

  confirmValidar() {
    if (this.permisoEscritura) {

      /* let mess = this.translateService.instant(
        "messages.deleteConfirmation"
      ); */
      let mess = "¿Seguro que desea validar esta Guardia?"
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.validarGuardia();
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
  }

  validarGuardia(){

  }

  confirmDesvalidar() {
    if (this.permisoEscritura) {

      /* let mess = this.translateService.instant(
        "messages.deleteConfirmation"
      ); */
      let mess = "¿Seguro que desea desvalidar esta Guardia?"
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.desvalidarGuardia()
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
  }

  desvalidarGuardia(){

  }

  confirmDelete() {
    if (this.permisoEscritura) {

      let mess = this.translateService.instant(
        "messages.deleteConfirmation"
      );
      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          this.borrarTurno()
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
  }

  borrarTurno(){

  }

  navGuardiaColegiado(){
    this.router.navigate(['/gestionGuardiaColegiado']);
  }

}
