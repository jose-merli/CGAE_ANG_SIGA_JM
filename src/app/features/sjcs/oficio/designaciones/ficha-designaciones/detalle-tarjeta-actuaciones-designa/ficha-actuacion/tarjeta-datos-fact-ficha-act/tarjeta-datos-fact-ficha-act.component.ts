import { Component, Input, OnInit, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../../../_services/commons.service';
import { Actuacion } from '../../detalle-tarjeta-actuaciones-designa.component';
import { DesignaItem } from '../../../../../../../../models/sjcs/DesignaItem';
import { TranslateService } from '../../../../../../../../commons/translate/translation.service';
import { procesos_oficio } from '../../../../../../../../permisos/procesos_oficio';
import { PersistenceService } from '../../../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { SigaStorageService } from '../../../../../../../../siga-storage.service';
import { ColegiadoItem } from '../../../../../../../../models/ColegiadoItem';

@Component({
  selector: 'app-tarjeta-datos-fact-ficha-act',
  templateUrl: './tarjeta-datos-fact-ficha-act.component.html',
  styleUrls: ['./tarjeta-datos-fact-ficha-act.component.scss']
})
export class TarjetaDatosFactFichaActComponent implements OnInit, OnDestroy {

  selector =
    {
      nombre: "Partida Presepuestaria",
      opciones: [],
      value: ''
    };

  msgs: Message[] = [];
  permisoEscritura: boolean;
  isLetrado: boolean;
  usuarioLogado: any;
  @Input() isAnulada: boolean;
  @Input() actuacionDesigna: Actuacion;

  @Output() changeDataEvent = new EventEmitter<any>();
  progressSpinner: boolean = false;
  datosMod: boolean = true;

  constructor(private sigaServices: SigaServices, 
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private router: Router,
    private localStorageService: SigaStorageService) { }

  ngOnInit() {
    this.getComboPartidaPresupuestaria();

    this.commonsService.checkAcceso(procesos_oficio.designaTarjetaActuacionesFacturacion)
          .then(respuesta => {
            this.permisoEscritura = respuesta;
            this.persistenceService.setPermisos(this.permisoEscritura);
     
            if (this.permisoEscritura == undefined) {
              sessionStorage.setItem("codError", "403");
              sessionStorage.setItem(
                "descError",
                this.translateService.instant("generico.error.permiso.denegado")
              );
              this.router.navigate(["/errorAcceso"]);
            }
            
          }
          ).catch(error => console.error(error)); 
    

    this.isLetrado = this.localStorageService.isLetrado ;

    // //si isLetrado == true ->>
    // if(this.isLetrado == true){

    // //Obtener usuario logueado
    //   this.sigaServices.get("usuario_logeado").subscribe(n => {
    //   const usuario = n.usuarioLogeadoItem;
    //   const colegiadoItem = new ColegiadoItem();
    //   colegiadoItem.nif = usuario[0].dni;
    //   this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
    //   usr => {
    //   this.usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
      
    //    });
    //    });
       
    //   //si la actuacion tiene el mismo usumodificacion que usuario logueado -> isLetrado= false;
    //   if (this.actuacionDesigna.actuacion.usuModificacion  == this.usuarioLogado.idPersona){
    //     this.isLetrado = false;
    //   }

    // }
 }

  compararSelector(){
    let valorIni = JSON.parse(sessionStorage.getItem("datosIniActuDesignaDatosFact"));
    if(this.selector.value != valorIni.value){
      this.datosMod = false;
    }
  }

  getComboPartidaPresupuestaria() {

    this.progressSpinner = true;

    this.sigaServices.get("designaciones_comboPartidaPresupuestaria").subscribe(
      n => {
        this.selector.opciones = n.combooItems;
        this.commonsService.arregloTildesCombo(this.selector.opciones);
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        this.progressSpinner = false;
        this.getIdPartidaPresupuestaria();
      }
    );
  }

  getIdPartidaPresupuestaria() {

    this.progressSpinner = true;

    let factAct = new DesignaItem();
    factAct.idTurno = Number(this.actuacionDesigna.actuacion.idTurno);
    factAct.ano = Number(this.actuacionDesigna.actuacion.anio);
    factAct.numero = this.actuacionDesigna.designaItem.numero;

    this.sigaServices.post("designaciones_getDatosFacturacion", factAct).subscribe(
      n => {
        let resp = JSON.parse(n.body).combooItems;
        if (resp.length > 0) {
          this.selector.value = resp[0].value;
          this.changeDataEvent.emit({ tarjeta: 'sjcsDesigActuaOfiDatFac', partida: resp[0].label });
          sessionStorage.setItem("datosIniActuDesignaDatosFact", JSON.stringify(resp[0]));
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        this.progressSpinner = false;
      }
    );
  }

  guardar() {

    this.progressSpinner = true;

    let factAct = new DesignaItem();
    factAct.idTurno = Number(this.actuacionDesigna.actuacion.idTurno);
    factAct.ano = Number(this.actuacionDesigna.actuacion.anio);
    factAct.numero = this.actuacionDesigna.designaItem.numero;
    factAct.idPartidaPresupuestaria = Number(this.selector.value);

    this.sigaServices.post("designaciones_updateDatosFacturacion", factAct).subscribe(
      n => {
        this.progressSpinner = false;
        const resp = JSON.parse(n.body);

        if (resp.error != null && resp.error.code == 200) {
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          this.changeDataEvent.emit({ tarjeta: 'sjcsDesigActuaOfiDatFac', partida: this.selector.opciones.find(el => el.value == this.selector.value).label });
          sessionStorage.setItem("datosIniActuDesignaDatosFact", JSON.stringify({ label: this.selector.opciones.find(el => el.value == this.selector.value).label, value: this.selector.value }));
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', resp.error.descripcion);
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        this.progressSpinner = false;
      }
    );
  }

  restablecer() {

    if (sessionStorage.getItem("datosIniActuDesignaDatosFact")) {
      let valorIni = JSON.parse(sessionStorage.getItem("datosIniActuDesignaDatosFact"));
      this.selector.value = valorIni.value;
      this.changeDataEvent.emit({ tarjeta: 'sjcsDesigActuaOfiDatFac', partida: valorIni.label });
      this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
    }
    this.compararSelector();
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

  ngOnDestroy(): void {
    sessionStorage.removeItem("datosIniActuDesignaDatosFact");
  }

}
