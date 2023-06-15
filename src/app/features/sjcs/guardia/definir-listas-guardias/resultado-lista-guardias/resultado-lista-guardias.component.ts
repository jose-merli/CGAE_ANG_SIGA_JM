import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataTable, Message } from 'primeng/primeng';
import { ListaGuardiasItem } from '../../../../../models/guardia/ListaGuardiasItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-resultado-lista-guardias',
  templateUrl: './resultado-lista-guardias.component.html',
  styleUrls: ['./resultado-lista-guardias.component.scss']
})
export class ResultadoListaGuardiasComponent implements OnInit, AfterViewInit {

  msgs : Message [] = [];
  rows : number = 10;
  rowsPerPage = [
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
  columnas = [];
  seleccionMultiple : boolean = false;
  seleccionarTodo : boolean = false;
  progressSpinner : boolean = false;
  numSeleccionado : number = 0;
  selectedDatos : ListaGuardiasItem [] = [];
  @Input() filtro : ListaGuardiasItem;
  @ViewChild("table") table: DataTable;
  @Input() listas : ListaGuardiasItem [] = [];
  @Input() permisosEscritura : boolean = false;
  currentRoute : string;
  idClaseComunicacion : string;
  keys: any[] = [];
  institucionActual : string ;
  constructor(private changeDetectorRef : ChangeDetectorRef,
    private router : Router,
    private sigaServices : SigaServices,
    private commonsService : CommonsService) { }
  ngOnInit() {
    this.table.selectionMode = 'multiple';
    this.currentRoute = this.router.url.toString();
    this.getInstitucion();
  }

  ngAfterViewInit(): void {
    this.commonsService.scrollTablaFoco('tablaFoco');
  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });

  }
  onChangeRowsPerPages(event) {
    this.rows = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSeleccionMultiple(){
    if(this.table.selectionMode == 'single'){
      this.table.selectionMode = 'multiple';
      this.seleccionMultiple = true;
    }else{
      this.table.selectionMode = 'single';
      this.seleccionMultiple = false;
    }
    this.selectedDatos = [];
    this.numSeleccionado = 0;
  }

  onChangeSeleccionarTodo(){
    if(this.seleccionarTodo){
      this.selectedDatos = this.listas;
      this.numSeleccionado = this.selectedDatos.length;
    }else{
      this.selectedDatos = [];
      this.numSeleccionado = 0;

    }
  }

  onSelectRow(lista : ListaGuardiasItem){

    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 1;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
    }
  }

  onClickEnlace(lista : ListaGuardiasItem){
    //REDIRECCION FICHA LISTA GUARDIA
    sessionStorage.setItem("filtroListaGuardia",JSON.stringify(this.filtro));
    sessionStorage.setItem("lista",JSON.stringify(lista));
    this.router.navigate(["/fichaListaGuardias"]);
  }

  navigateToComunicar(){

    sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
    //IDMODULO de SJCS es 10
    sessionStorage.setItem("idModulo", '10');
    let datosSeleccionados = [];
    let rutaClaseComunicacion = this.currentRoute.toString();

    this.sigaServices
      .post("dialogo_claseComunicacion", rutaClaseComunicacion)
      .subscribe(
        data => {
          this.idClaseComunicacion = JSON.parse(
            data["body"]
          ).clasesComunicaciones[0].idClaseComunicacion;
          this.sigaServices
            .post("dialogo_keys", this.idClaseComunicacion)
            .subscribe(
              data => {
                this.keys = JSON.parse(data["body"]).keysItem;
                this.selectedDatos.forEach(element => {
                  let keysValues = [];
                  keysValues.push(this.institucionActual);
                  this.keys.forEach(key => {
                    if (element[key.nombre] != undefined) {
                      keysValues.push(element[key.nombre]);
                    }else if(key.nombre == "idconjuntoguardia" && element["idLista"] != undefined){
                      keysValues.push(element["idLista"]);
                    }

                  });
                  datosSeleccionados.push(keysValues);
                });

                sessionStorage.setItem(
                  "datosComunicar",
                  JSON.stringify(datosSeleccionados)
                );
                this.router.navigate(["/dialogoComunicaciones"]);
              },
              err => {
                //console.log(err);
              }
            );
        },
        err => {
          //console.log(err);
        }
      );

  }

  actualizaSeleccionados(){
    if(this.table.selectionMode == 'single'){
      this.numSeleccionado = 0;
    }else{
      this.numSeleccionado = this.selectedDatos.length;
    }
  }

  clear() {
    this.msgs = [];
  }

  showMsg(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }
}
