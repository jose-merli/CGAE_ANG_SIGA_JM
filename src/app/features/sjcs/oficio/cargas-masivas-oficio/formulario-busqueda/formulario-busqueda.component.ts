import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-formulario-busqueda',
  templateUrl: './formulario-busqueda.component.html',
  styleUrls: ['./formulario-busqueda.component.scss']
})
export class FormularioBusquedaComponent implements OnInit {

  msgs: any[];
  progressSpinner: boolean = false;

  cargasMasivas: SelectItem[];
	cargaMasivaBT: string = this.translateService.instant('menu.sjcs.bajasTemporales');
  cargaMasivaIT: string = this.translateService.instant('justiciaGratuita.oficio.turnos.inscripcionesturno');
  selectedTipoCarga: string;
  
	enableIT: boolean = false;
  enableBT: boolean = false;
  disableDescargar: boolean = true;
  showTipo: boolean = false;
	showFicheroModelo: boolean = false;
  showCuerpoFicheroModelo: boolean = false;

  filtros: any;
  turnos: any[];
  guardias: any[];

  file: File = undefined;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
    this.showTipo = true;

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
              this.filtros.idturno = turnoCombo;
            }
          });
				}
      },
      err => {
        console.log(err);
      },()=>{
        if (sessionStorage.getItem("idTurno") != undefined) {
          this.filtros.idturno = JSON.parse(
            sessionStorage.getItem("idTurno")
          );
          sessionStorage.setItem("idTurno",undefined);
        }
      }
    );
    
    //Se buscan las guardias asociadas a ese colegio/institucion y a los turnos seleccionados.
    //No funcional todavia. Se requiere filtrado de las guardias en base a los turnos en el back.
    //Posible creacion de servicio.
    this.sigaServices.getParam("busquedaGuardia_guardia?idTurno=",this.filtros.idturno).subscribe(
      n => {
        this.guardias = n.combooItems;
        let guardiaSession = JSON.parse(sessionStorage.getItem("idGuardia"));
				if(guardiaSession != null && guardiaSession != undefined){
          this.guardias.forEach(guardiaCombo =>{ 
            if(guardiaCombo.value == guardiaSession){
              this.filtros.idguardia = guardiaCombo;
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
          this.filtros.idguardia = JSON.parse(
            sessionStorage.getItem("idGuardia")
          );
          sessionStorage.setItem("idGuardia",undefined);
        }
      }
    );


    //Comprobamos si el filtro de turno tiene algún valor seleccionado para dar acceso al botón o no
    this.checkButton();
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

    //Comprobamos si el filtro de turno tiene algún valor seleccionado para dar acceso al botón o no
    this.checkButton();
  }

  abreCierraTipo(){
    this.showTipo=!this.showTipo;
  }

  abreCierraCuerpoFicheroModelo(){
    this.showCuerpoFicheroModelo=!this.showCuerpoFicheroModelo;
  }

  checkButton(){
    //Comprobamos si el filtro de turno tiene algún valor seleccionado para dar acceso al botón o no
    if(!this.filtros.idturno.isEmpty) this.disableDescargar=false;
    else this.disableDescargar=true;
  }

  /* descargarModelo(){
    //
    this.progressSpinner = true;
    this.sigaServices
      .postDownloadFiles(
        "cargaMasivaDatosCurriculares_generateExcelCV",
        this.filtros
      )
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          if (this.filtros.nombreFichero == undefined) {
            saveAs(blob, "PlantillaMasivaDatosCV.xls");
          } else {
            saveAs(blob, this.body.nombreFichero);
          }
          this.progressSpinner = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  } */
  
	clear() {
		this.msgs = [];
	}
}
