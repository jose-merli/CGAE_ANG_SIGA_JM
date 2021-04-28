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

  body;
  tarjetaFija = {
    nombre: this.translateService.instant("justiciaGratuita.oficio.turnos.inforesumen"),
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: true,
    campos: [],
    enlaces: []
  };

  @ViewChild(LetradoEntranteComponent) entrante;
  @ViewChild(LetradoSalienteComponent) saliente;

  constructor(private location: Location,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private router: Router) { }

  ngOnInit() {


    this.body = new CamposCambioLetradoItem();
    let data;
    if (sessionStorage.getItem("Oldletrado") != null) {
      data = JSON.parse(sessionStorage.getItem("Oldletrado"));
      sessionStorage.removeItem("Oldletrado");
      this.body = data;
      this.body.fechaSolRenuncia = new Date();
    }
    else {
      data = JSON.parse(sessionStorage.getItem("letrado"));
      sessionStorage.removeItem("letrado");
      this.body.numColegiado = data.nColegiado;
      this.body.nombre = data.apellidosNombre.split(", ")[1];
      this.body.apellidos = data.apellidosNombre.split(", ")[0];
      this.body.fechaDesignacion = data.fechaDesignacion;
      this.body.idPersona = data.idPersona;
      if (data.fechaSolRenuncia == null) this.body.fechaSolRenuncia = new Date();
    }



    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    this.tarjetaFija.campos = [];
    this.tarjetaFija.campos[0] = {
      label: this.translateService.instant(
        "justiciaGratuita.ejg.datosGenerales.annioNum"
      ), value: designa.ano
    };
    this.tarjetaFija.campos[1] = {
      label: this.translateService.instant(
        "justiciaGratuita.oficio.designas.interesados.apellidosnombre"
      ), value: data.apellidosNombre
    };
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

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }

  }
  goDown() {
    let down = document.getElementById("down");
    if (down) {
      down.scrollIntoView();
      down = null;
    }
  }

  clear() {
    this.msgs = [];
  }

  backTo() {
    this.location.back();
  }

  clickSave() {

    if (this.entrante.body.numColegiado != undefined && this.entrante.body.numColegiado != "" && this.entrante.body.art27 == false) {
      this.confirmationService.confirm({
        key: "deletePlantillaDoc",
        message: "Se va a seleccionar un letrado automáticamente. ¿Desea continuar?",
        icon: "fa fa-save",
        accept: () => {
          this.progressSpinner = true;
          this.save();
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

  save() {
    this.progressSpinner = true;
    //Definir parametros y construir servicio

    /* setAnio(designa.getAnio());
          key.setIdturno(designa.getIdturno());
          key.setNumero(designa.getNumero());
          key.setIdpersona(letradoSaliente.getIdpersona());
          key.setFechadesigna(letradoSaliente.getFechadesigna());
          oldLetrado.setObservaciones(letradoSaliente.getObservaciones());
          oldLetrado.setMotivosrenuncia(letradoSaliente.getMotivosrenuncia() 
          letradoEntrante.getFechadesigna()
          letradoEntrante.getIdpersona()*/

    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));

    

    let request = [designa.anio, designa.idTurno, designa.numero, 
      this.saliente.body.idPersona,  this.saliente.body.observaciones, this.saliente.body.motivoRenuncia, this.saliente.body.fechaDesigna,
      this.entrante.body.fechaDesigna, this.entrante.body.idPersona];

    this.sigaServices.post("designaciones_updateLetradoDesignacion", request).subscribe(
      n => {
        this.progressSpinner = false;
        //Si se comprueba que el turno no tiene cola de oficio
        /* if()
        else{
          this.router.navigate(['/busquedaGeneral']);
        } */
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
    );
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
