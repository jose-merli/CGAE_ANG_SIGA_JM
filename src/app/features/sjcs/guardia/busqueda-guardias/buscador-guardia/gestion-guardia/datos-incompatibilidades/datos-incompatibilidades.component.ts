import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { DataTable } from '../../../../../../../../../node_modules/primeng/primeng';
import { GuardiaItem } from '../../../../../../../models/guardia/GuardiaItem';

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
  nombreTurno : string;
  nombreGuardia : string;
  tipoDia : string;
  descripcionIncomp : string;
  totalIncompatibilidades : string;
  diasSeparacion : string;


  @Input() tarjetaIncompatibilidades;
  @Input() modoEdicion: boolean = false;
  @ViewChild("tabla") tabla;
  datos : GuardiaItem [] = [];
  resumenIncompatibilidades = "";


  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCols();
    if (this.persistenceService.getDatos()){
      this.getDatosIncompatibilidades();
    }
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
            /*this.resumenIncompatibilidades = this.resumenParte1;
            this.resumenIncompatibilidades = this.resumenIncompatibilidades.concat(" ... " + JSON.parse(data.body).guardiaItems[0].incompatibilidades, " total");*/
            this.totalIncompatibilidades = JSON.parse(data.body).guardiaItems[0].incompatibilidades
          }

          this.onChangeRowsPerPages({ value: 10 });
          this.progressSpinner = false;

        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
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
      let idGuardia = this.persistenceService.getDatos().idGuardia;
      let idTurno = this.persistenceService.getDatos().idTurno;
      //idGuardia = 358; //borrar
      this.sigaServices.getParam(
        "busquedaGuardias_tarjetaIncompatibilidades", "?idGuardia="+idGuardia+"&idTurno="+idTurno).subscribe(
          data => {
            this.datos = data.guardiaItems
            if (this.datos && this.datos.length > 0){
              this.resumenIncompatibilidades = this.datos.length.toString();
              this.nombreTurno = this.datos[this.datos.length - 1].turno;
              this.nombreGuardia = this.datos[this.datos.length - 1].nombre;
              this.tipoDia = this.datos[this.datos.length - 1].tipoDia;
              this.descripcionIncomp = this.datos[this.datos.length - 1].descripcion;
              this.diasSeparacion = this.datos[this.datos.length - 1].diasSeparacionGuardias;
              this.onChangeRowsPerPages({ value: 10 });
              this.getResumenIncompatibilidades();
            }
            this.progressSpinner = false;
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
          },
          ()=>{
            this.progressSpinner = false;
          }
        );

    }
  }
  clear() { }
}
