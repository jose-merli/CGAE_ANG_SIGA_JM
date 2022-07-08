import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { CommonsService } from '../../../../../../../../_services/commons.service';
import { CamposCambioLetradoItem } from '../../../../../../../../models/sjcs/CamposCambioLetradoItem';
import { procesos_oficio } from '../../../../../../../../permisos/procesos_oficio';


@Component({
  selector: 'app-letrado-saliente',
  templateUrl: './letrado-saliente.component.html',
  styleUrls: ['./letrado-saliente.component.scss']
})
export class LetradoSalienteComponent implements OnInit {

  msgs: Message[] = [];
  body = new CamposCambioLetradoItem();
  datos;
  showTarjeta = true;
  progressSpinner = false;
  disableCheck = false;
  isLetrado: boolean;
  resaltadoDatos: boolean = false;
  @Input() saliente;

  comboRenuncia;

  constructor(private sigaServices: SigaServices,
    private commonsService: CommonsService, private persistenceService: PersistenceService, private translateService: TranslateService, private router: Router) { }

  ngOnInit() {
    this.resaltadoDatos = true;
    this.body = this.saliente;
    /* this.body.fechaDesignacion;
    this.body.fechaEfecRenuncia=new Date();
    this.body.fechaSolRenuncia=new Date();
    this.body.numColegiado;
    this.body.apellido1Colegiado;
    this.body.apellido2Colegiado;
    this.body.nombreColegiado;
    this.body.compensacion = false;
    this.body.motivoRenuncia = false;
    this.body.observaciones=""; */
    //SIGARNV-2213@DTT.JAMARTIN@06/07/2022@INICIO
    if(this.body.fechaSolRenuncia == null) this.body.fechaSolRenuncia = new Date();
    //SIGARNV-2213@DTT.JAMARTIN@06/07/2022@FIN

    this.motivosRenuncia();

    if (sessionStorage.getItem("isLetrado") == "true") this.disableCheck = true;

    this.sigaServices.get('getLetrado').subscribe(
      (data) => {
        if (data.value == 'S') {
          this.isLetrado = true;
        } else {
          this.isLetrado = false;
        }
      },
      (err) => {
      }
    );
  }

  motivosRenuncia() {
    this.progressSpinner = true;

    this.sigaServices.get("designaciones_motivosRenuncia").subscribe(
      n => {
        this.comboRenuncia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboRenuncia);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  incluirCompensacion() {
  }

  changeMotivo(event) {
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  clear() {
    this.msgs = [];
  }

  fillFechaDesignacion(event) { }

  fillFechaSolRenuncia(event) {
    this.body.fechaSolRenuncia = event;
  }


  styleObligatorio(resaltado) {
    if (this.body.motivoRenuncia == undefined || this.body.motivoRenuncia == null) {
      return "camposObligatorios";
    }
  }
}
