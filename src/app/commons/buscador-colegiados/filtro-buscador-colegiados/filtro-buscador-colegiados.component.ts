import { Component, Output, OnInit, EventEmitter, HostListener, Input } from '@angular/core';
import { ColegiadosSJCSItem } from '../../../models/ColegiadosSJCSItem';
import { CommonsService } from '../../../_services/commons.service';
import { SigaServices } from '../../../_services/siga.service';
import { TranslateService } from '../../translate';


export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-filtro-buscador-colegiados',
  templateUrl: './filtro-buscador-colegiados.component.html',
  styleUrls: ['./filtro-buscador-colegiados.component.scss']
})

export class FiltroBuscadorColegiadosComponent implements OnInit {

  institucionActual;
  msgs;

  filtro: ColegiadosSJCSItem = new ColegiadosSJCSItem();
  datosDesgina: any;
  expanded: boolean = true;
  progressSpinner: boolean = false;
  institucionGeneral: boolean = false;
  disabledEstado: boolean = false;
  fixedTurn: boolean = false;
  fixedGuard: boolean = false;

  comboColegios: any;
  comboTurno: any;
  comboguardiaPorTurno: any;
  comboEstadoColegial: any;

  noArt27: boolean = true;

  @Input('nuevaInscripcion') nuevaInscripcion;

  @Output() buscar = new EventEmitter<boolean>();

  constructor(private translateService: TranslateService, private sigaServices: SigaServices, private commonsService: CommonsService) { }

  ngOnInit() {
    this.progressSpinner = true;
    this.institucionGeneral = false;

    this.filtro = new ColegiadosSJCSItem();

    if (sessionStorage.getItem('usuarioBusquedaExpress')) {
      sessionStorage.removeItem('usuarioBusquedaExpress')
    }

    //Bloquear el desplegable del estado de colegiado a ejerciente
    if (this.nuevaInscripcion || (sessionStorage.getItem("pantalla") == "gestionEjg" && sessionStorage.getItem("tarjeta") == "ServiciosTramit")) {
      this.filtro.idEstado = "20";
      this.disabledEstado = true;
    }

    //Se comprueba si se aplica el articulo 27-28 para la busqueda de colegiados 
    //fuera de la institucion actual
    if (sessionStorage.getItem("art27") == "true") {
      this.noArt27 = false;
      this.institucionActual = "2000"
      this.getComboColegios();
    }

    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      this.filtro.idInstitucion = n.value;
      if(this.noArt27)this.getComboColegios();
      this.getComboTurno();
      this.getComboEstadoColegial();
    });

    //Comprobar si proviene de la tarjeta servicio de tramitacion de la ficha EJG y sin art 27.
    if (sessionStorage.getItem("pantalla") == "gestionEjg" && sessionStorage.getItem("tarjeta") == "ServiciosTramit" && this.noArt27) {
      if (sessionStorage.getItem("idTurno")) {
        this.filtro.idTurno = [];
        this.filtro.idTurno.push(sessionStorage.getItem("idTurno"));
        this.fixedTurn = true;
        this.getComboguardiaPorTurno({ value: this.filtro.idTurno[0] });
      }
    }


  }

  getComboColegios() {
    this.progressSpinner = true;

    this.sigaServices.getParam("busquedaCol_colegio", "?idInstitucion=" + this.institucionActual).subscribe(
      n => {
        this.comboColegios = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboColegios);

        if (this.institucionActual == "2000") {
          this.institucionGeneral = true;
        }

        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  getComboTurno() {
    this.progressSpinner = true;

    //si la pantalla viene de ejg, se cargan unos turnos
    this.sigaServices.getParam("componenteGeneralJG_comboTurnos", "?pantalla=" + sessionStorage.getItem("pantalla")).subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTurno);
        this.progressSpinner = false;
        // if((this.datosDesgina != null && this.datosDesgina != undefined) && (this.datosDesgina.idTurno != null && this.datosDesgina.idTurno != undefined)){
        //   this.filtro.idTurno = [this.datosDesgina.idTurno];
        // }
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  getComboguardiaPorTurno(evento) {
    this.progressSpinner = true;

    if (evento.value != undefined) {
      this.sigaServices.getParam("combo_guardiaPorTurno", "?idTurno=" + evento.value).subscribe(
        n => {
          this.comboguardiaPorTurno = n.combooItems;
          this.progressSpinner = false;
          if (sessionStorage.getItem("pantalla") == "gestionEjg" && sessionStorage.getItem("tarjeta") == "ServiciosTramit" && this.noArt27) {
            if (sessionStorage.getItem("idGuardia")) {
              this.filtro.idGuardia = [];
              this.filtro.idGuardia.push(sessionStorage.getItem("idGuardia"));
              this.fixedGuard = true;
            }
          }
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
    } else {
      this.progressSpinner = false;
    }
  }

  getComboEstadoColegial() {
    this.progressSpinner = true;

    this.sigaServices.get("busquedaColegiados_situacion").subscribe(
      n => {
        this.comboEstadoColegial = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboEstadoColegial);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
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

  clearFilters() {
    let colegio = this.filtro.idInstitucion;
    this.filtro = new ColegiadosSJCSItem();
    this.filtro.idInstitucion = colegio;
  }

  busquedaColegiado() {
    this.buscar.emit(false);
  }


  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.busquedaColegiado();
    }
  }

}
