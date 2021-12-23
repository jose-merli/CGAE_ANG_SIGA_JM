import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { ConfigEnviosMasivosItem } from '../../../../models/ConfiguracionEnviosMasivosItem';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-registro-envio-masivo',
  templateUrl: './ficha-registro-envio-masivo.component.html',
  styleUrls: ['./ficha-registro-envio-masivo.component.scss']
})
export class FichaRegistroEnvioMasivoComponent implements OnInit {

  idModelo: string;
  fichasPosibles: any[];
  progressSpinner: boolean = false;
  filtrosEnvioMasivo;
  idPlantillaEnvio;
  cuerpoPlantillas;
  nuevoCuerpoPlantilla;
  idEnvio;
  idEstado;
  idTipoEnvio;
  descripcion;
  asunto;
  msgs: Message[];
  body: ConfigEnviosMasivosItem = new ConfigEnviosMasivosItem();


  constructor(private sigaServices: SigaServices, private activatedRoute: ActivatedRoute, private location: Location, private translateService: TranslateService, ) { }

  ngOnInit() {
    if (sessionStorage.getItem("filtrosEnvioMasivo")) {
      this.filtrosEnvioMasivo = JSON.parse(sessionStorage.getItem("filtrosEnvioMasivo"));
      sessionStorage.setItem("filtrosEnvioMasivoMasivo", JSON.stringify(this.filtrosEnvioMasivo));
      sessionStorage.removeItem("filtrosEnvioMasivo");
    }


    this.fichasPosibles = [
      {
        key: "configuracion",
        activa: false
      },
      {
        key: "descripcion",
        activa: false
      },
      {
        key: "programacion",
        activa: false
      },
      {
        key: "destinatarios",
        activa: false
      },
      {
        key: "destinatariosIndv",
        activa: false
      },
      {
        key: "destinatariosList",
        activa: false
      },
      {
        key: "documentos",
        activa: false
      }
    ];
  }

  backTo() {
    let filtros = JSON.parse(sessionStorage.getItem("filtrosEnvioMasivoMasivo"));
    sessionStorage.setItem("filtrosEnvioMasivo", JSON.stringify(filtros));
    sessionStorage.removeItem("filtrosEnvioMasivoMasivo");
    this.location.back();
  }

  /*
  función para que no cargue primero las etiquetas de los idiomas*/

  isCargado(key) {
    if (key != this.translateService.instant(key)) {
      this.progressSpinner = false;
      return key
    } else {
      this.progressSpinner = true;
    }

  }

  emitOpenDescripcion(event) {
    if (event != undefined) {
      this.idPlantillaEnvio = event;
    }
  }
  cuerpoPlantilla(event) {
    if (event != undefined) {
      this.cuerpoPlantillas = event;
    }
  }
  emitCuerpo(event) {
    if (event != undefined) {
      this.nuevoCuerpoPlantilla = event;
    }
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  guardarDatos(event) {
    if (event != undefined) {
      this.idEnvio = event.idEnvio;
      this.idEstado = event.idEstado;
      this.idTipoEnvio = event.idTipoEnvio;
      this.descripcion = event.descripcion;
      this.asunto = event.asunto;
    }
  }

  clear() {
    this.msgs = [];
  }

  guardar(event) {
    if (event == true) {
      this.body.idEnvio = this.idEnvio;
      this.body.cuerpo = this.nuevoCuerpoPlantilla;
      this.body.idPlantillaEnvios = this.idPlantillaEnvio.value;
      this.body.idEstado = this.idEstado;
      this.body.idTipoEnvios = this.idTipoEnvio;
      this.body.descripcion = this.descripcion;
      this.body.asunto =  this.asunto;
      this.sigaServices.post("enviosMasivos_guardarConf", this.body).subscribe(
        data => {
          // this.body.idEstado = "4";
          let result = JSON.parse(data["body"]);
          // this.body.idEnvio = result.description;

          this.showSuccess(
            this.translateService.instant(
              "informesycomunicaciones.enviosMasivos.ficha.envioCorrect"
            )
          );
          // this.editarPlantilla = true;
        },
        err => {
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.enviosMasivos.ficha.envioError"
            )
          );
          //console.log(err);
        },
        () => {

        }
      );
    }
  }
}
