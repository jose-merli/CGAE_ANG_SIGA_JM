import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { BusquedaColegiadoExpressComponent } from '../../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.component';
import { TranslateService } from '../../../../../commons/translate';
import { PreAsistenciaItem } from '../../../../../models/guardia/PreAsistenciaItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-buscador-solicitudes-centralita',
  templateUrl: './buscador-solicitudes-centralita.component.html',
  styleUrls: ['./buscador-solicitudes-centralita.component.scss']
})
export class BuscadorSolicitudesCentralitaComponent implements OnInit, AfterViewInit {

  msgs: Message[] = [];
  expanded = true;
  filtro : PreAsistenciaItem = new PreAsistenciaItem();
  filtroAux : PreAsistenciaItem = new PreAsistenciaItem();
  comboEstadoAsistencias = [];
  comboTurnos = [];
  comboGuardias = [];
  comboComisarias = [];
  comboJuzgados = [];
  resaltadoDatos : boolean = false;
  titulo : string;
  isLetrado : boolean;
  idPersona : string;
  disabledBusqColegiado : boolean = false;

  constructor(private commonServices : CommonsService,
    private translateService : TranslateService,
    private datepipe : DatePipe,
    private sigaStorageService : SigaStorageService,
    private router : Router,
    private sigaServices : SigaServices) { }

  @ViewChild(BusquedaColegiadoExpressComponent) buscadorColegiado;
  ngOnInit() {
    this.titulo = this.translateService.instant("general.message.datos.generales");
    this.resaltadoDatos = true;
    this.checkLastRoute();
    if(this.sigaStorageService.idPersona
      && this.sigaStorageService.isLetrado){

      this.isLetrado = true;
      this.idPersona = this.sigaStorageService.idPersona;
      this.filtro.numeroColegiado = this.sigaStorageService.numColegiado;
      this.disabledBusqColegiado = true;
    }

    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('buscadorColegiados')) {
      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      this.filtro.nombreColegiado = `${apellidos}, ${nombre}`;
      this.filtro.numeroColegiado = nColegiado;
    }

    this.comboEstadoAsistencias = [
      {value: "0", label: this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente").toUpperCase()},
      {value: "1", label: "CONFIRMADA"},
      {value: "2", label: "DENEGADA"}
    ];
    this.getComboTurnos();
    this.getComboJuzgados();
    this.getComboComisarias();
    if(sessionStorage.getItem("volver") != "true"){
      this.filtro.estado = "0";
    }else{
      if(this.filtro.idTurno){
        this.onChangeTurno();
      }
      sessionStorage.removeItem("volver");
    }
  }

  ngAfterViewInit(): void {
    if(this.filtro.numeroColegiado){
      let usuarioBusquedaExpress = {
        numColegiado: this.filtro.numeroColegiado,
      };
      this.buscadorColegiado.isBuscar(usuarioBusquedaExpress);
    }
  }

  clear() {
    this.msgs = [];
  }
  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento==undefined || evento==null || evento=="")){
      return this.commonServices.styleObligatorio(evento);
    }
  }
  getComboTurnos(){

    if(this.isLetrado){
    //En el caso de los colegiados, los valores del combo deberán estar filtrados además por los turnos a los que esté inscrito.
      this.sigaServices.getParam("combo_turnos_inscritos","?idPersona="+this.idPersona).subscribe(
        n => {
          this.comboTurnos = n.combooItems;
        },
        err => {
          console.log(err);

        }, () => {
          this.commonServices.arregloTildesCombo(this.comboTurnos);
        }
      );
    }else{
      this.sigaServices.get("combo_turnos").subscribe(
        n => {
          this.comboTurnos = n.combooItems;
        },
        err => {
          console.log(err);
  
        }, () => {
          this.commonServices.arregloTildesCombo(this.comboTurnos);
        }
      );
    }
  }
  getComboComisarias(){

    this.sigaServices.get("combo_comboComisariaCdgoExt").subscribe(
      n => {
        this.comboComisarias = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboComisarias);
      }
    );
  }
  getComboJuzgados(){

    this.sigaServices.get("combo_comboJuzgadoCdgoExt").subscribe(
      n => {
        this.comboJuzgados = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboJuzgados);
      }
    );

  }
  onChangeTurno(){
    //Si tenemos seleccionado un turno, cargamos las guardias correspondientes
    if(this.filtro.idTurno){

      if(this.isLetrado){

        this.sigaServices.getParam("combo_guardiaPorTurnoInscritos","?idTurno="+this.filtro.idTurno+"&idPersona="+this.idPersona).subscribe(
          n => {
            this.comboGuardias = n.combooItems;
          },
          err => {
            console.log(err);
    
          }, () => {
            this.commonServices.arregloTildesCombo(this.comboGuardias);
          }
        )

      }else{
        this.sigaServices.getParam("combo_guardiaPorTurno","?idTurno="+this.filtro.idTurno).subscribe(
          n => {
            this.comboGuardias = n.combooItems;
          },
          err => {
            console.log(err);
    
          }, () => {
            this.commonServices.arregloTildesCombo(this.comboGuardias);
          }
      );
      }

    }
  }
  fillFechaDesde(event){
    this.filtro.fechaLlamadaDsd = this.datepipe.transform(new Date(event), 'dd/MM/yyyy HH:mm');
  }
  fillFechaHasta(event){
    this.filtro.fechaLlamadaHasta = this.datepipe.transform(new Date(event), 'dd/MM/yyyy HH:mm');
  }
  changeColegiado(event) {
    this.filtro.nombreColegiado = event.nombreAp;
    this.filtro.numeroColegiado = event.nColegiado;
  }
  checkLastRoute() {

    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((event: any[]) => {
        if (event[0].urlAfterRedirects == "/buscadorColegiados") {
          sessionStorage.setItem("esBuscadorColegiados", "true");
        } else {
          sessionStorage.setItem("esBuscadorColegiados", "false");
        }
      });
  }

  showMsg(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }
  onChangeComisaria(){
    this.filtro.idJuzgado = "";
    if(this.filtro.idComisaria){
      this.filtro.idTipoCentroDetencion = "10";
    }else{
      this.filtro.idTipoCentroDetencion = "";
    }
  }
  onChangeJuzgado(){
    this.filtro.idComisaria = "";
    if(this.filtro.idJuzgado){
      this.filtro.idTipoCentroDetencion = "20";
    }else{
      this.filtro.idTipoCentroDetencion = "";
    }
  }
}
