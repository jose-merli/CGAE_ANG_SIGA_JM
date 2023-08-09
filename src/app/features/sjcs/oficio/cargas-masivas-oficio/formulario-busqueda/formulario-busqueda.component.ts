import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { SelectItem } from 'primeng/api';
import { saveAs } from "file-saver/FileSaver";
import { HttpClient, HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-formulario-busqueda',
  templateUrl: './formulario-busqueda.component.html',
  styleUrls: ['./formulario-busqueda.component.scss']
})
export class FormularioBusquedaComponent implements OnInit {

  msgs: any[];
  progressSpinner: boolean = false;

	cargaMasivaBT: string = "";
  cargaMasivaIT: string = "";
  selectedTipoCarga: string;

  cargasMasivas : SelectItem[] = [];
	enableIT: boolean = false;
  enableBT: boolean = false;
  disableGuardia: boolean = true;
  showTipo: boolean = false;
	showFicheroModelo: boolean = false;
  showCuerpoFicheroModelo: boolean = false;

  turnosSelected: String = null;
  turnos: any[];
  guardiasSelected: String = null;
  guardias: any[] ;

  @Output() tipoEvent = new EventEmitter<string>();

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
    this.showTipo = true;

    this.cargaMasivaBT = this.translateService.instant('oficio.cargasMasivas.bajasTemporales');
    this.cargaMasivaIT = this.translateService.instant('oficio.cargasMasivas.inscripcionesTurno');
   
    //Se asignan las etiquetas constantes con sus valores asociados
    this.cargasMasivas = [
      {
        label: this.cargaMasivaIT,
        value: 'IT'
      },
      {
        label: this.cargaMasivaBT,
        value: 'BT'
      },
    ];
    
    
    //Se buscan los turnos asociados a ese colegio/institucion
    this.sigaServices.get("inscripciones_comboTurnos").subscribe(
      n => {
        this.turnos = n.combooItems;
        let turnoSession = JSON.parse(sessionStorage.getItem("idTurno"));
				if(turnoSession != null && turnoSession != undefined){
          this.turnos.forEach(turnoCombo =>{ 
            if(turnoCombo.value == turnoSession){
              this.turnosSelected = turnoCombo;
            }
          });
				}
      },
      err => {
        //console.log(err);
      },()=>{
        if (sessionStorage.getItem("idTurno") != undefined) {
          this.turnosSelected = JSON.parse(
            sessionStorage.getItem("idTurno")
          );
          sessionStorage.setItem("idTurno",undefined);
        }
      }
    );
    
    if(this.turnosSelected!=null){
      //Se buscan las guardias asociadas a ese colegio/institucion y a los turnos seleccionados.
      this.sigaServices.getParam("busquedaGuardia_guardia","?idTurno="+this.turnosSelected).subscribe(
        n => {
          this.guardias = n.combooItems;
          let guardiaSession = JSON.parse(sessionStorage.getItem("idGuardia"));
          if(guardiaSession != null && guardiaSession != undefined){
            this.guardias.forEach(guardiaCombo =>{ 
              if(guardiaCombo.value == guardiaSession){
                this.guardiasSelected = guardiaCombo;
              }
            });
          }
          else{
            this.guardias.forEach(guardiaCombo =>{
              if(guardiaCombo.value){}
            });
          }
        },
        err => {
          //console.log(err);
        },()=>{
          if (sessionStorage.getItem("idGuardia") != undefined) {
            this.guardiasSelected = JSON.parse(
              sessionStorage.getItem("idGuardia")
            );
            sessionStorage.setItem("idGuardia",undefined);
          }
        }
      );
    }


    //Enviar valor de tipo al componente padre
    this.sendTipo();
  }

  onChange(event) {
    //Selecciona "Bajas temporales" en "Tipo de carga"
		if (event == 'BT') {
      this.enableBT = true;
      this.enableIT = false;
      this.showFicheroModelo = true;
      this.showCuerpoFicheroModelo = true;
    } 
    //Selecciona "Inscripciones Turno" en "Tipo de carga"
    else if(event == 'IT'){
      this.enableIT = true;
      this.enableBT = false;
      this.showFicheroModelo =true;
      this.showCuerpoFicheroModelo = true;
    }
    //Elimina la eleccion y se queda en blanco en "Tipo de carga"
    else{
      this.enableBT = false;
      this.enableIT = false;
      this.showFicheroModelo =false;
      this.showCuerpoFicheroModelo = false;
    }


    //Enviar valor de tipo al componente padre
    this.sendTipo();

    this.turnosSelected = null;
    this.guardiasSelected = null;
    this.guardias=[];
    this.disableGuardia=true;
  }

  onChangeTurno(){
    //Se buscan las guardias asociadas a ese colegio/institucion y a los turnos seleccionados.
    //No funcional todavia. Se requiere filtrado de las guardias en base a los turnos en el back.
    this.sigaServices.getParam("busquedaGuardia_guardia","?idTurno="+this.turnosSelected).subscribe(
      n => {
        this.guardias = n.combooItems;
        let guardiaSession = JSON.parse(sessionStorage.getItem("idGuardia"));
				if(guardiaSession != null && guardiaSession != undefined){
          this.guardias.forEach(guardiaCombo =>{ 
            if(guardiaCombo.value == guardiaSession){
              this.guardiasSelected = guardiaCombo;
            }
          });
        }
        else{
          this.guardias.forEach(guardiaCombo =>{
            if(guardiaCombo.value){}
          });
        }
        //Comprobamos seleccionados para boton y desplegable
        if(this.guardias != undefined && this.guardias.length >0) {
          if(this.guardias!=[]) this.disableGuardia=false;
          else this.guardiasSelected = null;
        }
        else{
          this.disableGuardia=true;
          this.guardiasSelected = null;
        }
      },
      err => {
        //console.log(err);
      },()=>{
        if (sessionStorage.getItem("idGuardia") != undefined) {
          this.guardiasSelected = JSON.parse(
            sessionStorage.getItem("idGuardia")
          );
          sessionStorage.setItem("idGuardia",undefined);
        }
      }
    );

    
  }
  abreCierraTipo(){
    this.showTipo=!this.showTipo;
  }

  abreCierraCuerpoFicheroModelo(){
    this.showCuerpoFicheroModelo=!this.showCuerpoFicheroModelo;
  }

  descargarModelo(){
    this.progressSpinner = true;
    let turn : String = "";
    if(this.turnosSelected!=null){
      turn = this.EncontrarLabels(this.turnos, this.turnosSelected);
    }
    let guard : String = "";
    if(this.guardiasSelected!=null){
      guard = this.EncontrarLabels(this.guardias, this.guardiasSelected);
    }
    let request : String[] = [turn, guard, this.selectedTipoCarga]; 
    this.sigaServices
      .postDownloadFiles(
        "cargasMasivasOficio_decargarModelo", 
               request
      )
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          if(this.selectedTipoCarga=="IT")  saveAs(blob, "PlantillaCargaMasivaDatosIT.xls");
          else saveAs(blob, "PlantillaCargaMasivaDatosBT.xls");
        },
        err => {
          //console.log(err);
        },
        () => {
          this.progressSpinner = false;
        }
      );
      this.progressSpinner = false;
  } 

  sendTipo() {
    this.tipoEvent.emit(this.selectedTipoCarga);
  }
  
	clear() {
		this.msgs = [];
  }

  EncontrarLabels(combo : any[], values : any ){
    let send: String ="";
    let i = 0;
    let select = values;
    while(i<combo.length 
     // && select.length>0
      ){
      let elementCombo = combo[i];
      let eleValue:String = elementCombo.value;
      if((select.indexOf(eleValue) > -1)) {
      //  select.splice(select.indexOf(eleValue), 1);
        if(send == "")send+=elementCombo.label;
        else send+="#"+elementCombo.label;
      }
      i++;
    }

    return send;
  }

}
