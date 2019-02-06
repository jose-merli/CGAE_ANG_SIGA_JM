import { Component, OnInit } from "@angular/core";
import { DatosGeneralesPlantillaItem } from "../../../../../models/DatosGeneralesPlantillaItem";
import { SigaServices } from "./../../../../../_services/siga.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";

@Component({
  selector: "app-datos-generales-plantilla",
  templateUrl: "./datos-generales-plantilla.component.html",
  styleUrls: ["./datos-generales-plantilla.component.scss"]
})
export class DatosGeneralesPlantillaComponent implements OnInit {
  openFicha: boolean = false;
  activacionEditar: boolean = true;
  body: DatosGeneralesPlantillaItem = new DatosGeneralesPlantillaItem();
  bodyInicial: DatosGeneralesPlantillaItem = new DatosGeneralesPlantillaItem();
  tiposEnvio: any[];
  msgs: Message[];
  editar: boolean = false;
  nuevo: boolean = false;

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "consultas",
      activa: false
    },
    {
      key: "remitente",
      activa: false
    }
  ];

  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.getTipoEnvios();
    this.getDatos();
    if (sessionStorage.getItem("crearNuevaPlantilla") != undefined) {
      this.nuevo = JSON.parse(sessionStorage.getItem("crearNuevaPlantilla"));
    }

    this.tiposEnvio = [
      {
        label: "seleccione..",
        value: null
      },
      {
        label: "Email",
        value: "1"
      },
      {
        label: "SMS",
        value: "2"
      }
    ];
  }

  // Mensajes
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

  abreCierraFicha() {
    if (this.activacionEditar == true) {
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

  getDatos() {
    if (sessionStorage.getItem("plantillasEnvioSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("plantillasEnvioSearch"));
      console.log(this.body);
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      this.editar = true;
    } else {
      this.editar = false;
    }
  }

  getTipoEnvios() {
    this.sigaServices.get("enviosMasivos_tipo").subscribe(
      n => {
        this.tiposEnvio = n.combooItems;
        this.tiposEnvio.unshift({ label: "Seleccionar", value: "" });
        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
        this.tiposEnvio.map(e => {
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

  guardar() {
    this.sigaServices
      .postPaginado(
        "plantillasEnvio_guardarDatosGenerales",
        "?numPagina=1",
        this.body
      )
      .subscribe(
        data => {
          let result = JSON.parse(data["body"]);
          this.body.idPlantillaEnvios = result.message;
          sessionStorage.setItem(
            "plantillasEnvioSearch",
            JSON.stringify(this.body)
          );
          this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          sessionStorage.removeItem("crearNuevaPlantilla");

          this.showSuccess(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.correctPlantillaGuardada"
            )
          );
        },
        err => {
          console.log(err);
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.errorPlantillaGuardada"
            )
          );
        },
        () => {}
      );
  }

  isGuardarDisabled() {
    if (
      this.body.idTipoEnvios != "" &&
      this.body.idTipoEnvios != null &&
      this.body.descripcion != "" &&
      this.body.descripcion != null &&
      this.body.nombre != "" &&
      this.body.nombre != null
    ) {
      return false;
    }
    return true;
  }

  restablecer() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }
}
