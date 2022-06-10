import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Message } from 'primeng/api';
import { BusquedaColegiadoExpressComponent } from '../../../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.component';
import { TranslateService } from '../../../../../../commons/translate';
import { CaracteristicasItem } from '../../../../../../models/guardia/CaracteristicasItem';
import { TarjetaAsistenciaItem } from '../../../../../../models/guardia/TarjetaAsistenciaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-asistencia-tarjeta-caracteristicas',
  templateUrl: './ficha-asistencia-tarjeta-caracteristicas.component.html',
  styleUrls: ['./ficha-asistencia-tarjeta-caracteristicas.component.scss']
})
export class FichaAsistenciaTarjetaCaracteristicasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  msgInfo: boolean = false;
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  @Input() modoLectura: boolean;
  @Input() asistencia : TarjetaAsistenciaItem;
  @Output() refreshTarjetas = new EventEmitter<string>();
  @Input() permisoEscritura : boolean;
  @Input() editable : boolean;
  comboOrigenContacto = [];
  comboProcedimientos = [];
  progressSpinner : boolean = false;
  textFilter = "Seleccionar";
  caracteristica : CaracteristicasItem = new CaracteristicasItem();
  caracteristicaAux : CaracteristicasItem = new CaracteristicasItem();
  comboJuzgados = [];
  constructor(private router: Router,
    private sigaServices : SigaServices,
    private commonServices : CommonsService, 
    private translateService : TranslateService) { }

  @ViewChild(BusquedaColegiadoExpressComponent) busqColegiado : BusquedaColegiadoExpressComponent;
  ngOnInit() {
    //sessionStorage.removeItem("volver");
    //sessionStorage.removeItem("modoBusqueda");
    this.checkLastRoute();
    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('usuarioBusquedaExpress')) {
      this.usuarioBusquedaExpress = JSON.parse(sessionStorage.getItem('usuarioBusquedaExpress'));
    }
    this.getComboOrigenContacto();
    this.getComboProcedimientos();
    this.getComboJuzgados();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.asistencia
        && changes.asistencia.currentValue){
      let currentAsistencia : TarjetaAsistenciaItem = changes.asistencia.currentValue;
      if(!this.caracteristica.nig){
        this.caracteristica.nig = currentAsistencia.nig;
      }
      if(!this.caracteristica.idProcedimiento){
        this.caracteristica.idProcedimiento = this.asistencia.idProcedimiento;
      }
      if(!this.caracteristica.numeroProcedimiento){
        this.caracteristica.numeroProcedimiento = this.asistencia.numProcedimiento;
      }
      if(!this.caracteristica.numColegiado){
        this.caracteristica.numColegiado = this.asistencia.numeroColegiado;
        this.usuarioBusquedaExpress.numColegiado = this.asistencia.numeroColegiado;
      }
      this.getCaracteristicas();
    }
  }

  getCaracteristicas(){
    //busquedaGuardias_searchCaracteristicas
    if(this.asistencia.anioNumero){
      this.progressSpinner = true;
      this.sigaServices.getParam("busquedaGuardias_searchCaracteristicas","?anioNumero="+this.asistencia.anioNumero).subscribe(
        n => {
          if(n.caracteristicasAsistenciaItems.length > 0){
            this.caracteristica = n.caracteristicasAsistenciaItems[0];
            this.caracteristicaAux = Object.assign({},this.caracteristica);
            if(this.caracteristica.asesoramiento != undefined && this.caracteristica.asesoramiento.toString() == '0'){
              this.caracteristica.asesoramiento = false;
            }else if(this.caracteristica.asesoramiento != undefined && this.caracteristica.asesoramiento.toString() == '1'){
              this.caracteristica.asesoramiento = true;
            }
          }
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
        }
      );
    }
  }
  saveCaracteristicas(){
    //busquedaGuardias_saveCaracteristicas
    if(this.asistencia){
        this.progressSpinner = true;
        this.sigaServices.postPaginado("busquedaGuardias_saveCaracteristicas","?anioNumero="+this.asistencia.anioNumero, this.caracteristica).subscribe(
          n => {
  
            let id = JSON.parse(n.body).id;
            let error = JSON.parse(n.body).error;
            this.progressSpinner = false;
  
            if (error != null && error.description != null) {
              this.showMsg("error", this.translateService.instant("general.message.informacion"), error.description);
            } else {
              this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
              this.refreshTarjetas.emit(id);
              this.caracteristicaAux = Object.assign({},this.caracteristica);
            }
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
          }, () => {
            this.progressSpinner = false;
          }
        );
      
    }
  }

  restablecer(){
    this.caracteristica = Object.assign({}, this.caracteristicaAux);
  }

  loadLetrado(){
    setTimeout(()=>{
      if(this.asistencia && this.usuarioBusquedaExpress.numColegiado && !this.usuarioBusquedaExpress.nombreAp){
        this.busqColegiado.isBuscar(this.usuarioBusquedaExpress);
      }
    }, 1000);
  }

  getComboOrigenContacto(){
    //combo_comboOrigenContacto
    this.sigaServices.get("combo_comboOrigenContacto").subscribe(
      n => {
        this.comboOrigenContacto = n.combooItems;
      },
      err => {
        //console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboOrigenContacto);
      }
    );
  }

  getComboProcedimientos(){

    this.sigaServices.get("combo_comboProcedimientosDesignaciones").subscribe(
      n => {
        this.comboProcedimientos = n.combooItems;
      },
      err => {
        //console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboProcedimientos);
      }
    );

  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  checkLastRoute() {

    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((event: any[]) => {
        if (event[0].urlAfterRedirects == "/pantallaBuscadorColegiados") {
          sessionStorage.setItem("esBuscadorColegiados", "true");
        } else {
          sessionStorage.setItem("esBuscadorColegiados", "false");
        }
      });
  }


  getComboJuzgados(){

    this.sigaServices.get("combo_comboJuzgado").subscribe(
      n => {
        this.comboJuzgados = n.combooItems;
      },
      err => {
        //console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboJuzgados);
      }
    );

  }


  onChangeJuzgado(event){
    this.caracteristica.idJuzgado = event.value;
  }
}
