import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { DatePipe, Location } from '@angular/common';
import { LetradoEntranteComponent } from "./letrado-entrante/letrado-entrante.component";
import { LetradoSalienteComponent } from "./letrado-saliente/letrado-saliente.component";
import { ConfirmationService } from '../../../../../../../../../node_modules/primeng/primeng';
import { CamposCambioLetradoItem } from '../../../../../../../models/sjcs/CamposCambioLetradoItem';

@Component({
  selector: 'app-ficha-cambio-letrado',
  templateUrl: './ficha-cambio-letrado.component.html',
  styleUrls: ['./ficha-cambio-letrado.component.scss']
})
export class FichaCambioLetradoComponent implements OnInit {

  msgs: Message[] = [];

  @Output() datosTarjetaResumen;

  progressSpinner = false;

  entrante;
  body;

  @ViewChild('entrante') LetradoEntranteComponent;
  @ViewChild('saliente') LetradoSalienteComponent;

  constructor(private location: Location,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private router: Router) { }

  ngOnInit() {

    this.body = new CamposCambioLetradoItem();

    let data = JSON.parse(sessionStorage.getItem("letrado"));
    sessionStorage.removeItem("letrado");
    this.body.numColegiado = data.nColegiado;
    this.body.nombre = data.apellidosNombre.split(", ")[1];
    this.body.apellidos = data.apellidosNombre.split(", ")[0];
    this.body.fechaDesignacion = data.fechaDesignacion;
    if(data.fechaSolRenuncia==null ) this.body.fechaSolRenuncia = new Date();

    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    this.datosTarjetaResumen=[];
		this.datosTarjetaResumen[0] = {label: "Año/Número de la designación", value: designa.ano};
		this.datosTarjetaResumen[1] = {label: "Apellidos, Nombre ", value: data.apellidosNombre};
    /* this.datosTarjetaResumen = [];

    this.datosTarjetaResumen.designacion;
    this.datosTarjetaResumen.fechaDesignacion;
    this.datosTarjetaResumen.fechaEfecRenuncia;
    this.datosTarjetaResumen.fechaSolRenuncia;
    this.datosTarjetaResumen.numColegiado;
    this.datosTarjetaResumen.apellido1Colegiado;
    this.datosTarjetaResumen.apellido2Colegiado;
    this.datosTarjetaResumen.nombreColegiado; */
  }

  clear() {
    this.msgs = [];
  }

  backTo() {
    this.location.back();
  }

  save() {

    if (this.entrante.body.numColegiado != undefined && this.entrante.body.numColegiado != "" && this.entrante.body.art27 == false) {
      this.confirmationService.confirm({
        key: "deletePlantillaDoc",
        message: "Se va a seleccionar un letrado automáticamente. ¿Desea continuar?",
        icon: "fa fa-save",
        accept: () => {
          this.progressSpinner = true;
          //Definir parametros y construir servicio
          /* this.sigaServices.post("designaciones_updateLetradoDesignacion", designa, entrante, saliente).subscribe(
            n => {
              this.progressSpinner = false;
              //Si se comprueba que el turno no tiene cola de oficio
              if()
              else{
                this.router.navigate(['/busquedaGeneral']);
              }
            },
            err => {
              if (err != undefined && JSON.parse(err.error).error.description != "") {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
              } else {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
              }
              this.progressSpinner = false;
            },
            () => {
              this.progressSpinner = false;
            }
            ); */
        },
        reject: () => {
          this.msgs = [
            {
              severity: "info",
              summary: "Cancel",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }


}
