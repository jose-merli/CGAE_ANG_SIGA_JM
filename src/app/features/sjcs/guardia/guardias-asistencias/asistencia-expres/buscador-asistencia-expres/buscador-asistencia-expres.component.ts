import { DatePipe } from '@angular/common/';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RoutesRecognized } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { BusquedaColegiadoExpressComponent } from '../../../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.component';
import { TranslateService } from '../../../../../../commons/translate';
import { FiltroAsistenciaItem } from '../../../../../../models/guardia/FiltroAsistenciaItem';
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-buscador-asistencia-expres',
  templateUrl: './buscador-asistencia-expres.component.html',
  styleUrls: ['./buscador-asistencia-expres.component.scss']
})
export class BuscadorAsistenciaExpresComponent implements OnInit {
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  expanded = true;
  datos;
  aeForm = new FormGroup({
    numColegiado: new FormControl(''),
    nombreAp: new FormControl(''),
  });
  filtro : FiltroAsistenciaItem = new FiltroAsistenciaItem();
  @Input() modoBusqueda: string;
  modoBusquedaB: boolean = true;
  @Input() titulo: string;
  msgs: Message[] = [];
  rutas: string[] = ['SJCS', 'Guardia', 'Asistencias'];

  comboTurnos = [];
  comboGuardias = [];
  comboTiposAsistencia = [];
  comboLetradosGuardia = [];

  @ViewChild(BusquedaColegiadoExpressComponent) busquedaColegiado: BusquedaColegiadoExpressComponent;

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private commonServices: CommonsService,
    private sigaStorageService: SigaStorageService,
    private datepipe: DatePipe,
    private translateService: TranslateService) {
    this.datos = {
      radios: [],
      dropdowns: [
        {
          label: "Turno",
          options: [
            { value: "2005,1511", label: 'ARTICULO 27/28 ALICANTE' },
            { value: "2005,1516", label: 'ARTICULO 27/28 BENIDORM' },
            { value: "2005,1512", label: 'ARTICULO 27/28 DENIA' },
            { value: "2005,1513", label: 'ARTICULO 27/28 ELDA' },
            { value: "2005,1514", label: 'ARTICULO 27/28 IBI' },
            { value: "2005,1515", label: 'ARTICULO 27/28 NOVELDA' },
            { value: "2005,1517", label: 'ARTICULO 27/28 VILLENA' },
            { value: "2005,4271", label: 'BOLSA ESPECIALISTAS EN ASILO BENIDORM' },
            { value: "2005,4272", label: 'BOLSA ESPECIALISTAS EN ASILO DENIA' },
            { value: "2005,3510", label: 'INSTITUTO MEDIACION ICALI - LISTADO GENERAL' },
            { value: "2005,3675", label: 'INSTITUTO MEDIACION ICALI - MEDIACION CIVIL Y MERCANTIL' },
            { value: "2005,4115", label: 'INSTITUTO MEDIACION ICALI - MEDIACION CON LA ADMINISTRACION PUBLICA' },
            { value: "2005,3677", label: 'INSTITUTO MEDIACION ICALI - MEDIACION CONCURSAL' },
            { value: "2005,3679", label: 'INSTITUTO MEDIACION ICALI - MEDIACION FAMILIAR' },
            { value: "2005,3676", label: 'INSTITUTO MEDIACION ICALI - MEDIACION ORGANIZACIONES COMPLEJAS' },
            { value: "2005,3678", label: 'INSTITUTO MEDIACION ICALI - MEDIACION PENAL Y PENITENCIARIA' },
            { value: "2005,3931", label: 'INSTITUTO MEDIACION ICALI - MEDIACION TRAFICO' },

          ]
        },
        {
          label: "Guardia",
          options: [
            { value: "694", label: 'C. Provincial-Benalúa' },
            { value: "1494", label: 'C. Provincial-Benalúa(FS/Fest)' },
            { value: "695", label: 'C.Norte/Pascual Pérez' },
            { value: "1495", label: 'C.Norte/Pascual Pérez(FS/Fest)' },
            { value: "1316", label: 'G. dobles PENAL ant. a 2010' },
            { value: "699", label: 'G.C/Pol. Local Alic' },
            { value: "1496", label: 'G.C/Pol. Local Alic (FS/Fest)' },
            { value: "700", label: 'G.C/Pol. Local S.V' },
            { value: "1497", label: 'G.C/Pol. Local S.V (FS/Fest)' },
            { value: "1325", label: 'Guard. Refuerzo Penal Alicante' },
            { value: "697", label: 'Juz. Alicante (Inc)' },
            { value: "1498", label: 'Juz. Alicante (Inc) (FS/Fest)' },
            { value: "698", label: 'Juz.San Vicente(Inc)' },
            { value: "1499", label: 'Juz.San Vicente(Inc) (FS/Fest)' },
            { value: "767", label: 'L.Re2(Pref. Inv V.G)' },
            { value: "1501", label: 'L.Re2(Pref. Inv V.G) (FS/Fest)' },
            { value: "701", label: 'Letrado Reserva' },
            { value: "1500", label: 'Letrado Reserva (FS/Fest)' },
          ]
        },
        {
          label: "Tipo Asistencia Colegio",
          options: [{ label: 'XXXXXXXXXXX', value: 1 },
          { label: 'XXXXXXXXXXX', value: 2 },
          { label: 'XXXXXXXXXXX', value: 3 },]
        },
      ],
      dropdowns2: [
        {
          label: "Letrado de Guardia",
          options: [{ label: 'XXXXXXXXXXX', value: 1 },
          { label: 'XXXXXXXXXXX', value: 2 },
          { label: 'XXXXXXXXXXX', value: 3 },]
        }
      ]
    };
  }

  ngOnInit(): void {
    this.checkLastRoute();
    if(this.sigaStorageService.idPersona
      && this.sigaStorageService.isLetrado){

      this.filtro.idPersona = this.sigaStorageService.idPersona;

    }
    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('buscadorColegiados')) {
      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
    }
    this.titulo = 'Datos Comunes';
    //this.getComboTurno();
  }
  opcionSeleccionado: string = '0';
  verSeleccion: string = '';

  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado;

  }

  showMsg(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }

  clear() {
    this.msgs = [];
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

  fillFechaFiltro(event) {

    this.filtro.diaGuardia = this.datepipe.transform(new Date(event), 'dd/MM/yyyy');

    this.getTurnosByColegiadoFecha();
    
  }

  getTurnosByColegiadoFecha(){

    this.comboTurnos = [];
    this.filtro.idTurno = "";
    this.sigaServices.getParam("busquedaGuardias_getTurnosByColegiadoFecha", this.fillParams()).subscribe(
      n => {
        this.clear();
        if(n.error !== null
          && n.error.code === 500){
          this.showMsg("error", "Error", n.error.description.toString());
        }else if(n.error !== null
          && n.error.code === 200){
          this.showMsg("error", "No hay guardias", this.translateService.instant(n.error.description.toString()));
        }else{

          this.comboTurnos = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboTurnos);
        }
      },
      err => {
        console.log(err);
      }
    );

  }

  fillParams(){
    let parametros = '?guardiaDia=' + this.filtro.diaGuardia;
      
    if(this.filtro.idPersona !== null
        && this.filtro.idPersona !== undefined
        && this.sigaStorageService.isLetrado){
        
        parametros += "&idPersona="+this.filtro.idPersona;

    }

    return parametros;
  }

  onChangeTurno() {
    //this.filtros.idGuardia = "";
    this.comboGuardias = [];

    if (this.filtro.idTurno) {
      this.getComboGuardia();
    }
  }

  getComboGuardia() {
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + this.filtro.idTurno).subscribe(
        data => {
          this.comboGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardias);
        },
        err => {
          console.log(err);
        }
      );
  }

  //Crear servicio para traer tipos asistencia segun idtipoguardia e institución
  onChangeGuardia(){

    this.filtro.idTipoAsistenciaColegiado = '';
    this.filtro.idLetradoGuardia = '';
    this.usuarioBusquedaExpress.nombreAp = '';
    this.usuarioBusquedaExpress.numColegiado = '';
    this.comboTiposAsistencia = [];
    this.comboLetradosGuardia = [];
    this.sigaServices.getParam(
      "busquedaGuardias_getTiposAsistencia", "?idTurno=" + this.filtro.idTurno + "&idGuardia=" + this.filtro.idGuardia).subscribe(
        data => {
          
          this.comboTiposAsistencia = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboTiposAsistencia);
          this.setDefaultValueOnComboTiposAsistencia();

        },
        err => {
          console.log(err);
        }
      );

      this.sigaServices.getParam(
        "busquedaGuardias_getLetradosGuardiaDia", "?idTurno=" + this.filtro.idTurno + "&idGuardia=" + this.filtro.idGuardia + "&guardiaDia="+this.filtro.diaGuardia).subscribe(
          data => {
            
            this.comboLetradosGuardia = data.combooItems;
            this.commonServices.arregloTildesCombo(this.comboLetradosGuardia);

            if(this.comboLetradosGuardia !== null
              && this.comboLetradosGuardia.length > 0){
                this.filtro.idLetradoGuardia = this.comboLetradosGuardia[0].value;
                this.onChangeLetradoGuardia();
              }
  
          },
          err => {
            console.log(err);
          }
        );
    
    

  }

  //Setea el valor por defecto del combo
  setDefaultValueOnComboTiposAsistencia(){

    this.comboTiposAsistencia.forEach(comboItem => {
      
      
      if(comboItem.value.charAt(comboItem.value.length - 1) === '1'){
        comboItem.value = comboItem.value.slice(0,comboItem.value.length - 1);
        this.filtro.idTipoAsistenciaColegiado = comboItem.value;
      }else{
        comboItem.value = comboItem.value.slice(0,comboItem.value.length - 1);
      }

    });

  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
  }

  onChangeLetradoGuardia(){

    if(this.filtro.idLetradoGuardia){

      this.sigaServices
      .post("busquedaPer", this.filtro.idLetradoGuardia)
      .subscribe(
        n => {
          let persona = JSON.parse(n["body"]);
          if (persona && persona.colegiadoItem) {
            
            this.usuarioBusquedaExpress.numColegiado = persona.colegiadoItem[0].numColegiado;
            this.busquedaColegiado.isBuscar(this.usuarioBusquedaExpress);

          } 
        },
        err => {
          console.log(err);
        }
      );

    }
  }

  onChangeSustitutoCheck() {
    this.filtro.isSustituto = !this.filtro.isSustituto;
  }
}
