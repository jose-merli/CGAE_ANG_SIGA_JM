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



  msgs = [];
  cols = [];
  @Input() openFicha: boolean = false;
  resumenParte1 = "";
  buscadores = [];
  rowsPerPage;
  selectedItem: number = 10
  progressSpinner: boolean = false;

  @Input() tarjetaIncompatibilidades;
  @Input() modoEdicion: boolean = false;
  @ViewChild("tabla") tabla;
  datos;
  resumenIncompatibilidades = "";


  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCols();
    if (this.persistenceService.getDatos()){
      this.getDatosIncompatibilidades();
      this.getResumenIncompatibilidades();}
    else
      this.sigaServices.datosRedy$.subscribe(
        n => {
          this.persistenceService.getDatos();
          this.getResumenIncompatibilidades();
        });
  }

  getResumenIncompatibilidades() {
     this.sigaServices.post(
      "gestionGuardias_resumenIncompatibilidades", this.persistenceService.getDatos()).subscribe(
        data => {
          
          //this.datos = JSON.parse(data.body).guardiaItems;
          //this.resumenIncompatibilidades = JSON.parse(data.body).guardiaItems[0].incompatibilidades;
          if (this.datos && this.datos.length > 0){
            this.resumenIncompatibilidades = this.resumenParte1;
            this.resumenIncompatibilidades = this.resumenIncompatibilidades.concat(" ... " + JSON.parse(data.body).guardiaItems[0].incompatibilidades, " total");
          }

          this.onChangeRowsPerPages({ value: 10 });
          this.progressSpinner = false;

        },
        err => {
          console.log(err);
        }
      );
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
      { field: "turno", header: "dato.jgr.guardia.guardias.turno", width: "20%" },
      { field: "nombre", header: "menu.justiciaGratuita.GuardiaMenu", width: "15%" },
      { field: "tipoDia", header: "dato.jgr.guardia.guardias.dias", width: "15%" },
      { field: "descripcion", header: "dato.jgr.guardia.guardias.motivos", width: "40%" },
      { field: "diasSeparacionGuardias", header: "dato.jgr.guardia.guardias.diasSeparacion", width: "10%" },

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
    if (this.tabla) {
      this.selectedItem = event.value;
      this.changeDetectorRef.detectChanges();
      this.tabla.reset();
    }
  }

  getDatosIncompatibilidades() {
    if (this.persistenceService.getDatos().idGuardia) {
      let idGuardia = this.persistenceService.getDatos().idGuardia
      //idGuardia = 358; //borrar
      this.sigaServices.post(
        "busquedaGuardias_tarjetaIncompatibilidades", idGuardia).subscribe(
          data => {
            this.datos = JSON.parse(data.body).guardiaItems;
            this.resumenParte1 = this.datos[this.datos.length - 1].turno +  " " + this.datos[this.datos.length - 1].nombre + " " +  this.datos[this.datos.length - 1].tipoDia + " " + this.datos[this.datos.length - 1].descripcion + " " + this.datos[this.datos.length - 1].diasSeparacionGuardias;
            this.onChangeRowsPerPages({ value: 10 });
            this.progressSpinner = false;
          },
          err => {
            console.log(err);
          }
        );

    }
  }
  clear() { }
}
