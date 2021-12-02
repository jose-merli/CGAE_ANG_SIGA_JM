import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { SigaServices } from "./../../../../_services/siga.service";
import { SigaWrapper } from "../../../../wrapper/wrapper.class";
import { esCalendar } from "./../../../../utils/calendar";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../../properties/val-properties";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { ContadorItem } from "../../../../../app/models/ContadorItem";
import { ControlAccesoDto } from "../../../../../app/models/ControlAccesoDto";
import { CommonsService } from '../../../../_services/commons.service';

@Component({
  selector: "app-gestion-contadores",
  templateUrl: "./gestion-contadores.component.html",
  styleUrls: ["./gestion-contadores.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class GestionContadoresComponent extends SigaWrapper implements OnInit {
  contadores_modo: any[];
  msgs: Message[] = [];
  body: ContadorItem = new ContadorItem();
  bodyPermanente: ContadorItem = new ContadorItem();
  pButton;
  editar: boolean = false;
  disabled: boolean = false;
  correcto: boolean = false;
  checkmodificable: boolean = false;
  fechareconfiguracion: Date;
  showDatosGenerales: boolean = true;
  showReconfiguracion: boolean = true;
  es: any = esCalendar;
  jsonDate: string;
  rawDate: string;
  splitDate: any[];
  arrayDate: string;

  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisos: any;
  permisosArray: any[];
  derechoAcceso: any;
  comparacion: boolean;

  resaltadoDatos: boolean = false;

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("table")
  table;
  ngOnInit() {
    this.resaltadoDatos = true;

    //console.log(sessionStorage);
    this.checkAcceso();
    this.sigaServices.get("contadores_modo").subscribe(
      n => {
        this.contadores_modo = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );

    this.body = new ContadorItem();
    this.bodyPermanente = new ContadorItem();
    this.body = JSON.parse(sessionStorage.getItem("contadorBody"));
    if (this.body.fechareconfiguracion != undefined) {
      this.arreglarDate(this.body.fechareconfiguracion);
    }
    this.bodyPermanente = JSON.parse(JSON.stringify(this.body));
    this.bodyToModificable();
  }
  checkAcceso() {
    let proceso = sessionStorage.getItem("permisoContadores");
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = proceso;
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        //console.log(err);
      },
      () => {
        if (this.derechoAcceso == 3) {
          this.editar = true;
        } else if (this.derechoAcceso == 2) {
          this.editar = false;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    );
  }

  onChangeCheck(event) {
    this.checkmodificable = event;

    this.modificableToBody();
  }

  checkEditar() {
    this.onlyCheckDatos();
    this.body.fechareconfiguracion = this.arreglarDate(this.fechareconfiguracion);
    this.comparacion =
      JSON.stringify(this.bodyPermanente) == JSON.stringify(this.body);
    if (this.editar == true && !this.comparacion) {
      return false;
    } else {
      if (this.body.modo != undefined) {
        return true;
      }
      return true;
    }
  }

  checkEditarGuardar() {
    this.onlyCheckDatos();
    this.body.fechareconfiguracion = this.arreglarDate(this.fechareconfiguracion);
    this.comparacion =
      JSON.stringify(this.bodyPermanente) == JSON.stringify(this.body);
    if (this.editar == true && !this.comparacion && this.body.modo != undefined) {
      return false;
    } else {
      return true;
    }
  }

  isRestablecer() {
    this.body = JSON.parse(sessionStorage.getItem("contadorBody"));
    this.bodyToModificable();
    this.resaltadoDatos = false;
  }

  bodyToModificable() {
    if (this.body.fechareconfiguracion != undefined) {
      this.arreglarDate(this.body.fechareconfiguracion);
    }
    this.fechareconfiguracion = this.body.fechareconfiguracion;
    if (this.body.modificablecontador == "1") {
      this.checkmodificable = true;
    } else {
      this.checkmodificable = false;
    }
  }

  //Arreglo el fomato de la fecha añadiendole horas, minutos y segundos para que se guarde en el back correctamente, además lo separo para reordenar dia mes y año según debe estar escrito en el update.
  arreglarDate(fecha) {
    this.jsonDate = JSON.stringify(fecha);
    this.rawDate = this.jsonDate.slice(1, -1);
    if (this.rawDate.length < 14) {
      this.splitDate = this.rawDate.split("-");
      this.arrayDate =
        this.splitDate[2] + "-" + this.splitDate[1] + "-" + this.splitDate[0];
      this.body.fechareconfiguracion = new Date(
        (this.arrayDate += "T00:00:00.001Z")
      );
      this.body.fechareconfiguracion = new Date(this.arrayDate);
    } else {
      this.body.fechareconfiguracion = new Date(this.rawDate);
    }
    return this.body.fechareconfiguracion;
  }

  modificableToBody() {
    this.arreglarDate(this.fechareconfiguracion);
    if (this.checkmodificable == true) {
      this.body.modificablecontador = "1";
    } else {
      this.body.modificablecontador = "0";
    }
  }

  isEditar() {
    this.onlyCheckDatos();
    this.modificableToBody();
    if (this.body.nombre != null) {
      this.body.nombre = this.body.nombre.trim();
    }
    if (this.body.descripcion != null) {
      this.body.descripcion = this.body.descripcion.trim();
    }
    if (this.body.prefijo != null) {
      this.body.prefijo = this.body.prefijo.trim();
    }
    if (this.body.idcontador != null) {
      this.body.idcontador = this.body.idcontador.trim();
    }
    if (this.body.reconfiguracionprefijo != null) {
      this.body.reconfiguracionprefijo = this.body.reconfiguracionprefijo.trim();
    }
    if (this.body.reconfiguracionsufijo != null) {
      this.body.reconfiguracionsufijo = this.body.reconfiguracionsufijo.trim();
    }
    if (this.body.reconfiguracioncontador != null) {
      this.body.reconfiguracioncontador = this.body.reconfiguracioncontador.trim();
    }
    this.sigaServices.post("contadores_update", this.body).subscribe(
      data => {
        this.showSuccess();
        //console.log(data);
        this.correcto = true;
      },
      err => {
        this.showFail();
        this.correcto = false;
        //console.log(err);
      },
      () => {
        if (this.correcto) {
          this.volver();
        }
      }
    );
  }

  confirmEdit() {
    this.onlyCheckDatos();
    let mess = this.translateService.instant(
      "general.message.aceptar.y.volver"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.isEditar();
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

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  onHideReconfiguracion() {
    this.showReconfiguracion = !this.showReconfiguracion;
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  volver() {
    this.router.navigate([JSON.parse(sessionStorage.getItem("url"))]);
  }

  clear() {
    this.msgs = [];
  }

  fillFechaReconfiguracion(event) {
    this.fechareconfiguracion = event;
  }

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento === "")) {
      return this.commonsService.styleObligatorio(evento);
    }
  }
  muestraCamposObligatorios() {
    if ((this.body.nombre == undefined || this.body.nombre == null || this.body.nombre == "") ||
        (this.body.modo == undefined || this.body.modo == null || this.body.modo == "") ||
        (this.body.contador == undefined || this.body.contador == null || this.body.contador == "") ||
        (this.body.longitudcontador == undefined || this.body.longitudcontador == null || this.body.longitudcontador == "") ||
        (this.body.reconfiguracioncontador == undefined || this.body.reconfiguracioncontador == null || this.body.reconfiguracioncontador == "")) {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatos = true;
        }
  }



  checkDatos() {
    if (this.checkEditar()) {
      this.confirmEdit();
    } else {
      if ((this.body.nombre == undefined || this.body.nombre == null || this.body.nombre == "") ||
        (this.body.modo == undefined || this.body.modo == null || this.body.modo == "") ||
        (this.body.contador == undefined || this.body.contador == null || this.body.contador == "") ||
        (this.body.longitudcontador == undefined || this.body.longitudcontador == null || this.body.longitudcontador == "") ||
        (this.body.reconfiguracioncontador == undefined || this.body.reconfiguracioncontador == null || this.body.reconfiguracioncontador == "")) {
        this.muestraCamposObligatorios();
      } else {
        this.confirmEdit();
      }
    }
    /*if(this.permisoTarjeta != '2' && !this.disabledGuardar){
      if((this.body.idColegio==undefined || this.body.idColegio==null || this.body.idColegio=="") || (this.body.tipoSancion==undefined || this.body.tipoSancion==null || this.body.tipoSancion=="") || (this.body.fechaAcuerdoDate==undefined || this.body.fechaAcuerdoDate==null)){
        this.muestraCamposObligatorios();
      }else{
        this.save();
      }
    }else{
      this.muestraCamposObligatorios();
    }*/
  }

  onlyCheckDatos() {
      if ((this.body.nombre == undefined || this.body.nombre == null || this.body.nombre == "") ||
        (this.body.modo == undefined || this.body.modo == null || this.body.modo == "") ||
        (this.body.contador == undefined || this.body.contador == null || this.body.contador == "") ||
        (this.body.longitudcontador == undefined || this.body.longitudcontador == null || this.body.longitudcontador == "") ||
        (this.body.reconfiguracioncontador == undefined || this.body.reconfiguracioncontador == null || this.body.reconfiguracioncontador == "")) {
          this.resaltadoDatos=true;
      } 
    }
}
