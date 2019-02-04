import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ControlAccesoDto } from "./../../../../../../app/models/ControlAccesoDto";
import { TranslateService } from "./../../../../../commons/translate/translation.service";
import { SigaServices } from "./../../../../../_services/siga.service";
import { DatosGeneralesFicha } from "../../../../../models/DatosGeneralesFichaItem";
import { Message, ConfirmationService } from "primeng/components/common/api";

@Component({
  selector: "app-datos-generales-ficha",
  templateUrl: "./datos-generales-ficha.component.html",
  styleUrls: ["./datos-generales-ficha.component.scss"]
})
export class DatosGeneralesFichaComponent implements OnInit {
  openFicha: boolean = true;
  activacionEditar: boolean = true;
  derechoAcceso: any;
  permisos: any;
  permisosArray: any[];
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  clasesComunicaciones: any[];
  colegios: any[];
  bodyInicial: DatosGeneralesFicha = new DatosGeneralesFicha();
  body: DatosGeneralesFicha = new DatosGeneralesFicha();
  msgs: Message[];
  preseleccionar: any = [];
  visible: any = [];
  institucionActual: any = [];

  fichasPosibles = [
    {
      key: "generales",
      activa: true
    },
    {
      key: "informes",
      activa: false
    },
    {
      key: "comunicacion",
      activa: false
    }
  ];

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {


    this.preseleccionar = [
      { label: '', value: '' },
      { label: 'Sí', value: 'SI' },
      { label: 'No', value: 'NO' }
    ];

    this.visible = [
      { label: '', value: '' },
      { label: 'Sí', value: 1 },
      { label: 'No', value: 0 }
    ];

    this.getInstitucion()

    this.getClasesComunicaciones();
    this.getComboColegios();
    this.getDatos();
  }

  abreCierraFicha() {
    // let fichaPosible = this.getFichaPosibleByKey(key);
    if (this.activacionEditar == true) {
      // fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  checkAcceso() {
    this.controlAcceso = new ControlAccesoDto();
    this.controlAcceso.idProceso = "110";
    this.sigaServices.post("acces_control", this.controlAcceso).subscribe(
      data => {
        this.permisos = JSON.parse(data.body);
        this.permisosArray = this.permisos.permisoItems;
        this.derechoAcceso = this.permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        // if (this.derechoAcceso == 3) {
        //   this.activacionEditar = true;
        // } else if (this.derechoAcceso == 2) {
        //   this.activacionEditar = false;
        // } else {
        //   sessionStorage.setItem("codError", "403");
        //   sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        //   this.router.navigate(["/errorAcceso"]);
        // }
      }
    );
  }

  getDatos() {
    if (sessionStorage.getItem("modelosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("modelosSearch"));
      this.bodyInicial = JSON.parse(sessionStorage.getItem("modelosSearch"));
    } else {
      this.body.visible = 1;
    }
  }

  guardar() {

    this.sigaServices.post("modelos_detalle_datosGenerales", this.body).subscribe(
      data => {
        this.showSuccess("Datos generales guardados correctamente");
        this.body.idModeloComunicacion = JSON.parse(data.body).data;
        sessionStorage.setItem("modelosSearch", JSON.stringify(this.body));
        sessionStorage.removeItem("crearNuevoModelo");
      },
      err => {
        console.log(err);
        this.showFail("Error al guardar los datos generales");
      }
    );
  }


  getInstitucion() {
    this.sigaServices.get('institucionActual').subscribe((n) => {
      this.institucionActual = n.value;
      this.body.idInstitucion = this.institucionActual;
    });
  }


  getComboColegios() {
    this.sigaServices.get("modelos_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;
        this.colegios.unshift({ label: 'Seleccionar', value: '' });
        for (let e of this.colegios) {
          if (e.value == '2000') {
            e.label = 'POR DEFECTO';
          }

        }

      },
      err => {
        console.log(err);
      }
    );
  }

  getClasesComunicaciones() {
    this.sigaServices.get("comunicaciones_claseComunicaciones").subscribe(
      data => {
        this.clasesComunicaciones = data.combooItems;
        this.clasesComunicaciones.unshift({ label: 'Seleccionar', value: '' });
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.clasesComunicaciones.map(e => {
          let accents =
            "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
          let accentsOut =
            "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  restablecer() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }
}
