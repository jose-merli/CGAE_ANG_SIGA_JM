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
import { SaltoCompItem } from '../../../../../../../models/guardia/SaltoCompItem';
import { CambioLetradoItem } from '../../../../../../../models/sjcs/CambioLetradoItem';

@Component({
  selector: 'app-ficha-cambio-letrado',
  templateUrl: './ficha-cambio-letrado.component.html',
  styleUrls: ['./ficha-cambio-letrado.component.scss']
})
export class FichaCambioLetradoComponent implements OnInit {

  msgs: Message[] = [];

  @Output() datosTarjetaResumen;

  progressSpinner: boolean = false;

  body;
  disableSave: boolean = false;

  tarjetaResumen = {
    nombre: 'Resumen Cambio Letrado',
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: false,
    opened: false,
    campos: [],
    enlaceCardClosed: {click: 'irFichaColegial()', title: this.translateService.instant('informesycomunicaciones.comunicaciones.fichaColegial')},
    letrado: {}
  };

  @ViewChild(LetradoEntranteComponent) entrante;
  @ViewChild(LetradoSalienteComponent) saliente;

  constructor(private location: Location,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private router: Router,
    private datepipe: DatePipe) { }

  ngOnInit() {

    //Para saber si el usuario es un letrado o no
    /* getLetrado() {
      let isLetrado: ComboItem;
      this.sigaServices.get('getLetrado').subscribe(
          (data) => {
              isLetrado = data;
              if (isLetrado.value == 'S') {
                  return true;
              } else {
                  return false;
              }
          },
          (err) => {
      return false;
          }
      );
  } */

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
      this.tarjetaResumen.letrado = data;
      sessionStorage.removeItem("letrado");
      this.body.numColegiado = data.nColegiado;
      this.body.nombre = data.apellidosNombre.split(", ")[1];
      this.body.apellidos = data.apellidosNombre.split(", ")[0];
      this.body.fechaDesignacion = data.fechaDesignacion;
      this.body.idPersona = data.idPersona;
      if (data.fechaSolRenuncia == null) this.body.fechaSolRenuncia = new Date();
    }



    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    this.tarjetaResumen.campos = [];
    this.tarjetaResumen.campos[0] = {
      key: this.translateService.instant(
        "censo.resultadosSolicitudesModificacion.literal.nColegiado"
      ), value: data.nColegiado
    };
    this.tarjetaResumen.campos[1] = {
      key: this.translateService.instant(
        "justiciaGratuita.justiciables.literal.colegiado"
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

    
    //Campos obligatorios rellenados?
    if (this.entrante.body.fechaDesignacion != null || this.entrante.body.fechaDesignacion != undefined ||
      this.saliente.body.motivoRenuncia != undefined || this.saliente.body.motivoRenuncia != null) {
      //Comprobar requisitos según art 27
      if ((this.entrante.body.numColegiado == undefined || this.entrante.body.numColegiado == "") && this.entrante.body.art27 == false) {
        this.confirmationService.confirm({
          key: "deletePlantillaDoc",
          message: "Se va a seleccionar un letrado automáticamente. ¿Desea continuar?",
          icon: "fa fa-save",
          accept: () => {
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
      else if (this.entrante.body.numColegiado != undefined && this.entrante.body.numColegiado != "") {
        this.save()
      }
      else this.showMessage("error", "Cancel", this.translateService.instant("general.message.camposObligatorios"))
    }
    else {
      this.showMessage("error", "Cancel", this.translateService.instant("general.message.camposObligatorios"))
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

    if (this.saliente.body.compensacion) {
      this.compensacion();
    }

    if (this.entrante.body.salto) {
      this.salto();
    }

    /* let item = new CambioLetradoItem(); */

    let request = [designa.ano, //0
      designa.idTurno, //1
      designa.numero,//2
      this.body.idPersona,//3
       this.saliente.body.observaciones, //4
       this.saliente.body.motivoRenuncia, //5
       sessionStorage.getItem("FDSaliente"), //6
       this.saliente.body.fechaSolRenuncia, //7
      this.entrante.body.fechaDesignacion, //8
       this.entrante.body.idPersona]; //9

    /* item.ano=request[0];
    item.idTurno=request[1];
    item.numero=request[2];
    item.idPersonaSaliente=request[3];
    item.observaciones=request[4];
    item.motivoRenuncia=request[5];
    item.fechaDesignacionSaliente=request[6];
    item.fechaSolRenuncia=request[7];
    item.fechaDesignacionEntrante=request[8];
    item.idPersonaEntrante=request[9]; */

    this.progressSpinner = true;

    this.sigaServices.post("designaciones_updateLetradoDesignacion", request).subscribe(
      n => {
        this.progressSpinner = false;
        //Si se comprueba que el turno no tiene cola de oficio
        /* if()
        else{
          this.router.navigate(['/busquedaGeneral']);
        } */
         this.router.navigate(['/fichaDesignaciones']);
      },
      err => {
        if (err.error!=null 
          /* || err != undefined && JSON.parse(err.error).error.description != "" */
          ) {
          if(JSON.parse(err.error).error.code == 100){
            this.confirmationService.confirm({
              key: "errorPlantillaDoc",
              message: this.translateService.instant("justiciaGratuita.oficio.designas.letrados.nocolaletrado"),
              icon: "fa fa-save",
              accept: () => {
              }
            });
          }
          else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
    this.progressSpinner = false;
  }

  compensacion() {
    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));

    let compensacion = new SaltoCompItem();
    let compensaciones =[];
    compensacion.fecha = this.formatDate(new Date());
    compensacion.idPersona = this.body.idPersona;
    compensacion.idTurno = designa.idTurno;
    compensacion.motivo = "";
    compensacion.saltoCompensacion = "C";
    compensaciones.push(compensacion);
    this.sigaServices.post("saltosCompensacionesOficio_guardar", compensaciones).subscribe(
      result => {

        const resp = JSON.parse(result.body);

        if (resp.status == 'KO' || (resp.error != undefined && resp.error != null)) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }

      },
      error => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  salto() {
    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));

    let salto = new SaltoCompItem();
    let saltos =[];
    salto.fecha = this.formatDate(new Date());
    salto.idPersona = this.entrante.body.idPersona;
    salto.idTurno = designa.idTurno;
    salto.motivo = "";
    salto.saltoCompensacion = "S";
    saltos.push(salto);

    this.sigaServices.post("saltosCompensacionesOficio_guardar", saltos).subscribe(
      result => {

        const resp = JSON.parse(result.body);

        if (resp.status == 'KO' || (resp.error != undefined && resp.error != null)) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }

      },
      error => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }
  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
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
