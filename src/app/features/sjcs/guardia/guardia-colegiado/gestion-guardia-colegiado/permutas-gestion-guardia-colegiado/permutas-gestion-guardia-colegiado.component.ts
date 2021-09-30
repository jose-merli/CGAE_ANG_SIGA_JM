import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-permutas-gestion-guardia-colegiado',
  templateUrl: './permutas-gestion-guardia-colegiado.component.html',
  styleUrls: ['./permutas-gestion-guardia-colegiado.component.scss']
})
export class PermutasGestionGuardiaColegiadoComponent implements OnInit {
  cols: any;
  buscadores = [];
  rowsPerPage: any = [];
  selectMultiple: boolean;
  selectedDatos = [];
  selectAll;
  numSelected: number = 0;
  selectedItem: number = 10;
  permisoEscritura;
  progressSpinner;
  msgs;
  permutas;
  constructor(private translateService: TranslateService,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCols()
  }

  getCols() {
    this.cols = [
      { field: "fechadesde", header: "formacion.busquedaInscripcion.fechaSolicitud" },
      { field: "fechahasta", header: "general.cabecera.confirmacion" },//cambiar
      { field: "tipoTurno", header: "dato.jgr.guardia.guardias.turno" },
      { field: "tipoGuardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      { field: "tipoDiasGuardia", header: "dato.jgr.guardia.guardias.motivos" },

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
    //this.table.reset();
  }

  validar(){}

  permutar(){}
  clear(){}
}
