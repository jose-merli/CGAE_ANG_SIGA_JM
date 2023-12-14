import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TreeNode } from '../../../../../../../utils/treenode';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { TranslateService } from '../../../../../../../commons/translate';
import { BaremosGuardiaItem } from '../../../../../../../models/sjcs/BaremosGuardiaItem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos-baremos',
  templateUrl: './datos-baremos.component.html',
  styleUrls: ['./datos-baremos.component.scss']
})
export class DatosBaremosComponent implements OnInit {

  rowsPerPage: any = [];
  cols = [];
  colsPartidoJudicial;
  msgs;
  @Input() modoEdicion: boolean = false;
  selectedFile
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  message;
  textoResumenBaremos;
  permisos: boolean = false;
  datos;
  nuevo: boolean = false;
  progressSpinner: boolean = false;
  //Resultados de la busqueda
  @Input() openFicha: boolean = false;
  @Input() tarjetaBaremos;
  @Input() modoVinculado: boolean = false;
  @ViewChild("tabla") tabla;
  buscadores = [];
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private router: Router) { }

  ngOnInit() {

    this.getCols();
    if (this.persistenceService.getDatos()){
      this.getDatosBaremos();
    }
    this.sigaServices.datosRedy$.subscribe(
      data => {
        this.modoEdicion = true;
        //this.getBaremos();
        if(this.persistenceService.getDatos() != null || this.persistenceService.getDatos() != undefined){
          this.datos = this.persistenceService.getDatos();
          this.getResumenBaremos();
        }

      });
  }

  getResumenBaremos() {
    if (JSON.parse(this.persistenceService.getDatos()).idGuardia) {
      let idGuardia = JSON.parse(this.persistenceService.getDatos()).idGuardia;

      this.sigaServices.getParam(
        "busquedaGuardias_resumenBaremosGuardias", "?idGuardia="+idGuardia).subscribe(
          data => {
            this.textoResumenBaremos = data.valor;
          },
          err => {
          },
          ()=>{
          }
        );

    }
  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  /* getBaremos() {
    //let idGuardiaProvisional =362; //borrar
    this.sigaServices.post(
      //"busquedaGuardias_getBaremos", idGuardiaProvisional).subscribe(
      "busquedaGuardias_getBaremos", this.persistenceService.getDatos().idGuardia).subscribe(
        data => {
          let comboItems = JSON.parse(data.body).combooItems;
          comboItems.forEach(it => {
             it.value = it.value + "€";
          });
          this.datos = comboItems;

        },
        err => {
          //console.log(err);
        },
    )
  } */
  goToFichaBaremos(){
   
   let goBaremos:BaremosGuardiaItem = new BaremosGuardiaItem();

   if (typeof this.persistenceService.getDatos() === 'string') {
    goBaremos.idTurno = JSON.parse(this.persistenceService.getDatos()).idTurno;
    goBaremos.idGuardia = JSON.parse(this.persistenceService.getDatos()).idGuardia;
   } else {
    goBaremos.idTurno = this.persistenceService.getDatos().idTurno;
    goBaremos.idGuardia = this.persistenceService.getDatos().idGuardia;
   }

   sessionStorage.setItem("tarjetaBaremosFichaGuardia",JSON.stringify(goBaremos));
   sessionStorage.setItem("idGuardiaFromFichaGuardia",goBaremos.idGuardia);

   this.router.navigate(["/baremosDeGuardia"]);


  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }

  clear() {
    this.msgs = [];
  }
  
  getCols() {

    this.cols = [
      { field: "guardias", header: "facturacionSJCS.baremosDeGuardia.turnoguardia", width: '20%' },
      { field: "ndias", header: "facturacionSJCS.baremosDeGuardia.nDias", width: '5%' },
      { field: "baremo", header: "facturacionSJCS.baremosDeGuardia.tipoBaremo", width: '15%' },
      { field: "dias", header: "facturacionSJCS.baremosDeGuardia.diasAplicar", width: '5%' },
      { field: "numMinimoSimple", header: "facturacionSJCS.baremosDeGuardia.minimo", width: '5%' },
      { field: "simpleOImporteIndividual", header: "facturacionSJCS.baremosDeGuardia.dispImporte", width: '5%' },
      { field: "naPartir", header: "facturacionSJCS.baremosDeGuardia.naPartir", width: '5%' },
      { field: "maximo", header: "facturacionSJCS.baremosDeGuardia.maximo", width: '5%' },
      { field: "naPartir", header: "facturacionSJCS.baremosDeGuardia.naPartir", width: '5%' },
      { field: "porDia", header: "facturacionSJCS.baremosDeGuardia.porDia", width: '5%' }
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

  getDatosBaremos() {
    if (JSON.parse(this.persistenceService.getDatos()).idGuardia) {
      let idGuardia = JSON.parse(this.persistenceService.getDatos()).idGuardia;
      //this.progressSpinner = true;
      this.sigaServices.getParam(
        "busquedaGuardias_baremosGuardias", "?idGuardia="+idGuardia).subscribe(
          data => {
            this.datos = data.baremosRequestItems;
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
  
 abreCierraFicha() {
  if(this.modoVinculado){
    this.modoEdicion=false
}
   if (this.modoEdicion) {
     this.openFicha = !this.openFicha;
     if (this.openFicha)
       if (!this.datos) {
         this.getDatosBaremos();
       } else this.onChangeRowsPerPages({ value: this.selectedItem })
   }
 }

 onChangeRowsPerPages(event) {
  if (this.tabla) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }
}

}
