import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { TarjetaAsistenciaItem } from '../../../../../../models/guardia/TarjetaAsistenciaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-asistencia-tarjeta-datos-generales',
  templateUrl: './ficha-asistencia-tarjeta-datos-generales.component.html',
  styleUrls: ['./ficha-asistencia-tarjeta-datos-generales.component.scss']
})
export class FichaAsistenciaTarjetaDatosGeneralesComponent implements OnInit {

  @Input() datos;
  msgs: Message[] = [];
  permisoEscritura : boolean;
  progressSpinner : boolean = false;
  asistencia : TarjetaAsistenciaItem = new TarjetaAsistenciaItem();
  isNuevaAsistencia : boolean = false;
  comboTurnos = [];
  comboGuardias = [];

  constructor(private datepipe : DatePipe,
    private translate : TranslateService,
    private sigaServices : SigaServices,
    private commonServices : CommonsService) { }

  ngOnInit() {

    let preasistencia = JSON.parse(sessionStorage.getItem("preasistenciaItemLink"));
    if(preasistencia){
      this.isNuevaAsistencia = true;
    }
    this.getComboTurnos();

  }

  getComboTurnos(){
      this.sigaServices.get("combo_turnos").subscribe(
        n => {
          this.comboTurnos = n.combooItems;
        },
        err => {
          console.log(err);
  
        }, () => {
          this.commonServices.arregloTildesCombo(this.comboTurnos);
        }
      );
  }

  onChangeTurno(){
    //Si tenemos seleccionado un turno, cargamos las guardias correspondientes
    if(this.asistencia.idTurno){

        this.sigaServices.getParam("combo_guardiaPorTurno","?idTurno="+this.asistencia.idTurno).subscribe(
          n => {
            this.comboGuardias = n.combooItems;
          },
          err => {
            console.log(err);
    
          }, () => {
            this.commonServices.arregloTildesCombo(this.comboGuardias);
          }
      );

    }
  }

  fillFechaDesde(event){
    this.asistencia.fechaAsistencia = this.datepipe.transform(new Date(event), 'dd/MM/yyyy HH:mm');
  }

  styleObligatorio(evento){
    if((evento==undefined || evento==null || evento=="")){
      return this.commonServices.styleObligatorio(evento);
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
