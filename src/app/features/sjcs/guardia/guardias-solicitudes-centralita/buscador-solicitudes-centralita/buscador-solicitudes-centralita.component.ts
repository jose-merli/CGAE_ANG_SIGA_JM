import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
  textSelected: String = '{0} opciones seleccionadas';
  textFilter: string = "Seleccionar";
  @Output() searchByColegiado = new EventEmitter<boolean>();

  constructor(private commonServices : CommonsService,
    private translateService : TranslateService,
    private datepipe : DatePipe,
    private sigaStorageService : SigaStorageService,
    private router : Router,
    private sigaServices : SigaServices) { }

  @ViewChild(BusquedaColegiadoExpressComponent) buscadorColegiado;
  ngOnInit() {
    sessionStorage.removeItem("volver");
    sessionStorage.removeItem("modoBusqueda");
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
      {value: "0", label: this.translateService.instant("sjcs.solicitudescentralita.estado.pendiente").toUpperCase()},
      {value: "1", label: this.translateService.instant("sjcs.solicitudescentralita.estado.confirmada").toUpperCase()},
      {value: "2", label: this.translateService.instant("sjcs.solicitudescentralita.estado.denegada").toUpperCase()}
    ];
    this.getComboTurnos();
    this.getComboJuzgados();
    this.getComboComisarias();
    if(sessionStorage.getItem("volver") != "true"){
      this.filtro.estado = ["0"];
    }else{
      if(this.filtro.idTurno){
        this.onChangeTurno(this.filtro.idTurno);
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
      if(sessionStorage.getItem("origin") == "fichaColegial"){
        sessionStorage.removeItem("origin");
        this.searchByColegiado.emit(true);
      }
    }
  }

  clear() {
    this.msgs = [];
  }
  
  getComboTurnos(){

    if(this.isLetrado){
    //En el caso de los colegiados, los valores del combo deberán estar filtrados además por los turnos a los que esté inscrito.
      this.sigaServices.getParam("combo_turnos_inscritos","?idPersona="+this.idPersona).subscribe(
        n => {
          this.comboTurnos = n.combooItems;
        },
        err => {
          //console.log(err);

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
          //console.log(err);
  
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
        //console.log(err);

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
        //console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboJuzgados);
        this.comboJuzgados.sort( (a, b) => {
          return a.label.localeCompare(b.label);
        });
      }
    );

  }
  onChangeTurno(event){
    this.filtro.idTurno = event.value;
    //Si tenemos seleccionado un turno, cargamos las guardias correspondientes
    if(this.filtro.idTurno.length > 0){

      if(this.isLetrado){

        this.sigaServices.getParam("combo_guardiaPorTurnoInscritos","?idTurno="+this.filtro.idTurno.toString()+"&idPersona="+this.idPersona).subscribe(
          n => {
            this.comboGuardias = n.combooItems;
          },
          err => {
            //console.log(err);
    
          }, () => {
            this.commonServices.arregloTildesCombo(this.comboGuardias);
          }
        )

      }else{
        this.sigaServices.getParam("combo_guardiaPorTurno","?idTurno="+this.filtro.idTurno.toString()).subscribe(
          n => {
            this.comboGuardias = n.combooItems;
          },
          err => {
            //console.log(err);
    
          }, () => {
            this.commonServices.arregloTildesCombo(this.comboGuardias);
          }
      );
      }

    }
  }
  fillFechaDesde(event){
    if(event){
      this.filtro.fechaLlamadaDsd = this.datepipe.transform(new Date(event), 'dd/MM/yyyy HH:mm');
    }else{
      this.filtro.fechaLlamadaDsd = ''
    }
  }
  fillFechaHasta(event){
    if(event){
      this.filtro.fechaLlamadaHasta = this.datepipe.transform(new Date(event), 'dd/MM/yyyy HH:mm');
    }else{
      this.filtro.fechaLlamadaHasta = '';
    }
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
  onChangeComisaria(event){
    this.filtro.idComisaria = event.value;
    this.filtro.idJuzgado = "";
    if(this.filtro.idComisaria.length > 0){
      this.filtro.idTipoCentroDetencion = "10";
    }else{
      this.filtro.idTipoCentroDetencion = "";
    }
  }
  onChangeJuzgado(event){
    this.filtro.idJuzgado = event.value;
    this.filtro.idComisaria = "";
    if(this.filtro.idJuzgado.length > 0){
      this.filtro.idTipoCentroDetencion = "20";
    }else{
      this.filtro.idTipoCentroDetencion = "";
    }
  }

  onChangeEstado(event){
    this.filtro.estado = event.value;
  }

  onChangeGuardias(event){
    this.filtro.idGuardia = event.value;
  }

}
