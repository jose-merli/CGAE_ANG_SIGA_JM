import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { SelectItem } from 'primeng/api';
import { saveAs } from "file-saver/FileSaver";
import { HttpClient, HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-formulario-busqueda-guardia',
  templateUrl: './formulario-busqueda-guardia.component.html',
  styleUrls: ['./formulario-busqueda-guardia.component.scss']
})
export class FormularioBusquedaGuardiaComponent implements OnInit {

  msgs: any[];
  progressSpinner: boolean = false;

	cargaMasivaI: string = "";
  cargaMasivaGC: string = "";
  cargaMasivaC: string = "";
  selectedTipoCarga: string;

  cargasMasivas : SelectItem[] = [];
	enableI: boolean = false;
  enableGC: boolean = false;
  enableC: boolean = false;
  disableGuardia: boolean = true;
  showTipo: boolean = false;
	showFicheroModelo: boolean = true;
  showCuerpoFicheroModelo: boolean = true;

  turnosSelected: String = null;
  turnos: any[];
  guardiasSelected: String = null;
  guardias: any[] ;

  @Output() tipoEvent = new EventEmitter<string>();

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
    this.showTipo = true;

    this.cargaMasivaI = this.translateService.instant('menu.justiciaGratuita.oficio.inscripciones');
    this.cargaMasivaGC = this.translateService.instant('justiciaGratuita.guardia.grupoCola');
    this.cargaMasivaC = this.translateService.instant('justiciaGratuita.Calendarios');
   
    //Se asignan las etiquetas constantes con sus valores asociados
    this.cargasMasivas = [
      {
        label: this.cargaMasivaI,
        value: 'I'
      },
      {
        label: this.cargaMasivaGC,
        value: 'GC'
      },
      {
        label: this.cargaMasivaC,
        value: 'C'
      }
    ];
    
    
    //Se buscan los turnos asociados a ese colegio/institucion
    this.sigaServices.get("busquedaGuardia_turno").subscribe(
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
        console.log(err);
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
      this.sigaServices.getParam("busquedaGuardia_guardiaNoBaja","?idTurno="+this.turnosSelected).subscribe(
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
          console.log(err);
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
		if (event == 'I') {
      this.enableI = true;
      this.enableGC = false;
      this.enableC = false;
      this.showFicheroModelo = true;
      this.showCuerpoFicheroModelo = true;
    } 
    //Selecciona "Inscripciones Turno" en "Tipo de carga"
    else if(event == 'GC'){
      this.enableI = false;
      this.enableGC = true;
      this.enableC = false
      this.showFicheroModelo =true;
      this.showCuerpoFicheroModelo = true;
    }
    else if(event == 'C'){
      this.enableI = false;
      this.enableGC = false;
      this.enableC = true
      this.showFicheroModelo =true;
      this.showCuerpoFicheroModelo = true;
    }
    //Elimina la eleccion y se queda en blanco en "Tipo de carga"
    else{
      this.enableI = false;
      this.enableGC = false;
      this.enableC = false
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
    this.sigaServices.getParam("busquedaGuardia_guardiaNoBaja","?idTurno="+this.turnosSelected).subscribe(
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
        console.log(err);
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
        "cargasMasivasGuardia_decargarModelo", 
               request
      )
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          if(this.selectedTipoCarga=="I")  
          saveAs(blob, "PlantillaCargaMasivaInscripciones.xls");
          else if(this.selectedTipoCarga=="GC")
          saveAs(blob, "PlantillaCargaMasivaGrupoCola.xls");
          else 
          saveAs(blob, "PlantillaCargaMasivaCalendarios.xls");
        },
        err => {
          console.log(err);
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
        else send+=","+elementCombo.label;
      }
      i++;
    }

    return send;
  }

}
