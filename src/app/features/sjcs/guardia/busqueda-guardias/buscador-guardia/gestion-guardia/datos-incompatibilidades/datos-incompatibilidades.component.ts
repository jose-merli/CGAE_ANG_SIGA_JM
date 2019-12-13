import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { DataTable } from '../../../../../../../../../node_modules/primeng/primeng';

@Component({
  selector: 'app-datos-incompatibilidades',
  templateUrl: './datos-incompatibilidades.component.html',
  styleUrls: ['./datos-incompatibilidades.component.scss']
})
export class DatosIncompatibilidadesComponent implements OnInit {



  cols = [];
  openFicha;

  buscadores = [];
  rowsPerPage;
  selectedItem: number = 10
  progressSpinner: boolean = false;

  @Input() modoEdicion: boolean = false;
  @ViewChild("tabla") tabla;
  datos;




  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCols();

  }

  abreCierraFicha() {
    if (this.modoEdicion) {
      this.openFicha = !this.openFicha;
      if (this.openFicha)
        if (!this.datos) {
          this.progressSpinner = true;
          this.getDatosIncompatibilidades();
        } else this.onChangeRowsPerPages({ value: this.selectedItem })
    }
  }

  getCols() {

    this.cols = [
      { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
      { field: "nombre", header: "menu.justiciaGratuita.GuardiaMenu" },
      { field: "tipoDia", header: "dato.jgr.guardia.guardias.dias" },
      { field: "descripcion", header: "dato.jgr.guardia.guardias.motivos" },
      { field: "diasSeparacionGuardias", header: "dato.jgr.guardia.guardias.diasSeparacion" },

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

  getDatosIncompatibilidades() {
    this.sigaServices.post(
      "busquedaGuardias_tarjetaIncompatibilidades", this.persistenceService.getDatos()).subscribe(
        data => {
          this.datos = JSON.parse(data.body).guardiaItems;

          this.onChangeRowsPerPages({ value: 10 })
          this.progressSpinner = false;

        },
        err => {
          console.log(err);
        }
      )
  }

}
