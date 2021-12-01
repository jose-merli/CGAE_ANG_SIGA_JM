import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { ExpedienteItem } from '../../../../../models/ExpedienteItem';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';
import { ParametroItem } from '../../../../../models/ParametroItem';
import { ParametroRequestDto } from '../../../../../models/ParametroRequestDto';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-expedientes-ficha-colegial',
  templateUrl: './expedientes-ficha-colegial.component.html',
  styleUrls: ['./expedientes-ficha-colegial.component.scss']
})
export class ExpedientesFichaColegialComponent implements OnInit, OnChanges {

  tarjetaExpedientesNum : number;

  //TABLA EXPEDIENTES SIGA
  rowsPerPage: any = [];
  cols;
  selectedItem: number = 10;
  selectAll;
  selectedDatos : ExpedienteItem [] = [];
  buscadores = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  expedientesSiga : ExpedienteItem [] = [];

  //TABLA EXPEDIENTES EXEA
  colsEXEA;
  selectedItemEXEA: number = 10;
  selectAllEXEA;
  selectedDatosEXEA : ExpedienteItem [] = [];
  buscadoresEXEA = [];
  numSelectedEXEA = 0;
  selectMultipleEXEA: boolean = false;
  seleccionEXEA: boolean = false;
  expedientesEXEA : ExpedienteItem [] = [];

  openSigaTable : boolean = false;
  openEXEATable : boolean = false;

  @Input() tarjetaExpedientes;
  @Input() openExp : boolean;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  fichasPosibles = [
    {
      key: "expedientes",
      activa: false
    },
  ];
  activacionTarjeta: boolean = false;
  emptyLoadFichaColegial: boolean = false;
  openFicha: boolean = false;
  expSIGA : boolean = false;
  expEXEA : boolean = false;
  isActivoEXEA : boolean = false;
  generalBody : FichaColegialGeneralesItem;
  msgs : Message [] = [];

  @ViewChild("table") table: Table;
  @ViewChild("tableEXEA") tableEXEA: Table;

  constructor(private changeDetectorRef : ChangeDetectorRef,
    private sigaServices : SigaServices,
    private router : Router,
    private authenticationService : AuthenticationService,
    private sigaStorageService : SigaStorageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openExp == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('expedientes')
      }
    }

    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.emptyLoadFichaColegial = false;
      this.activacionTarjeta = false;
    } else {
      this.activacionTarjeta = true;
    }
  }

  ngOnInit() {
    this.isActivoEXEAInstitucion();
    this.setUpTable();
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.emptyLoadFichaColegial = false;
      this.activacionTarjeta = false;
    } else {
      this.activacionTarjeta = true;
    }

    if (sessionStorage.getItem("personaBody") && JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true) {
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
      this.getExpedientesSigaColegiado();
    }

  }

  isActivoEXEAInstitucion(){
    this.sigaServices.get("expedientesEXEA_isActivo").subscribe(
      n => {
        let stringActivoEXEA = n.valor;

        this.isActivoEXEA = stringActivoEXEA == "1" ? true : false;
      },
      err => {
        console.log(err);
      }, () => {
      }
    );
  }

  getExpedientesSigaColegiado(){
    if(this.generalBody && this.generalBody.idPersona){
      this.sigaServices.getParam(
        "expedientesEXEA_getExpedientesSIGAColegiado", "/"+this.generalBody.idPersona).subscribe(
          data => {
            
            if(!data.error){
              this.expedientesSiga = data.expedienteItem;
              this.expSIGA = true;
            }else if(data.error.code == 500){
                this.showMessage('error','Error',data.error.description);
            }
  
          },
          err => {
            console.log(err);
          }
        );
    }
  }

  getExpedientesEXEA(){
    let expedientes;
    if(this.sigaStorageService.isLetrado && this.sigaStorageService.idPersona){
      //Obtenemos token login por SOAP de EXEA y hacemos llamada REST

      this.sigaServices.get("expedientesEXEA_getTokenEXEA").subscribe(
        n => {
          let tokenEXEA : string = n.valor;
  
          if(tokenEXEA){
            this.getURLExpedientesEXEA(tokenEXEA);
          }else{
            this.showMessage('error','Error','Error al obtener el token de login a EXEA');
          }
          
        },
        err => {
          console.log(err);
        }
      );
      
    }else{
      //Llamada por jar addin
    }
  }

  getURLExpedientesEXEA(token : string){
    let parametro = new ParametroRequestDto();
    parametro.idInstitucion = this.sigaStorageService.institucionActual;
    parametro.modulo = "EXEA";
    parametro.parametrosGenerales = "URL_EXEA_EXPEDIENTES";

    this.sigaServices.postPaginado("parametros_search", "?numPagina=1", parametro).subscribe(
      data => {
        let resp: ParametroItem[] = JSON.parse(data.body).parametrosItems;
        let url = resp.find(element => element.parametro == "URL_EXEA_EXPEDIENTES" && element.idInstitucion == element.idinstitucionActual);
        
        if(!url){
          url = resp.find(element => element.parametro == "URL_EXEA_EXPEDIENTES" && element.idInstitucion == '0');
        }

        if(url){
          this.sigaServices.getWithAuthHeader(String(url.valor), token).subscribe(
            n => {
              let expedientesEXEA  = n;
              
            },
            err => {
              console.log(err);
            }
          );
        }
      },
      err => {
        console.log(err);
      },
      () => {}
    );
  }

  setUpTable(){
    this.cols = [
      { field: "tipoExpediente", header: "justiciaGratuita.ejg.datosGenerales.TipoExpediente", width: '3%' },
      { field: "numExpediente", header: "justiciaGratuita.ejg.datosGenerales.NumExpediente", width: "3%" },
      { field: "estadoExpediente", header: "exp.expedientes.faseestado", width: "3%" },
      { field: "relacion", header: "exp.expedientes.relacion", width: '3%' },
      { field: "fechaApertura", header: "gratuita.busquedaEJG.literal.fechaApertura", width: '3%' }
    ];
    this.cols.forEach(it => this.buscadores.push(""));

    this.colsEXEA = [
      { field: "tipoExpediente", header: "justiciaGratuita.ejg.datosGenerales.TipoExpediente", width: '3%' },
      { field: "numExpediente", header: "justiciaGratuita.ejg.datosGenerales.NumExpediente", width: "3%" },
      { field: "estadoExpediente", header: "exp.expedientes.faseestado", width: "3%" },
      { field: "relacion", header: "exp.expedientes.relacion", width: '3%' },
      { field: "fechaApertura", header: "gratuita.busquedaEJG.literal.fechaApertura", width: '3%' }
    ];
    this.cols.forEach(it => this.buscadoresEXEA.push(""));

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  openTab(dato : ExpedienteItem){
    let idInstitucion : string = this.authenticationService.getInstitucionSession();
    if(dato.exea){
      //Aqui redirigiriamos a la ficha de expediente de exea
    }else{
      let url : string = this.sigaServices.getOldSigaUrl() +
      "/EXP_AuditoriaExpedientes.do?modo=ver&idTipoExpediente=" + dato.idTipoExpediente + "&numExpediente=" + dato.numExpediente + "&anioExpediente=" + dato.anioExpediente
       + "&idInstitucion=" + idInstitucion + "&idInstitucion_tipoExpediente="+ dato.idInstitucion_tipoExpediente +"&nombreTipoExpediente=" + dato.nombreTipoExpediente;

      sessionStorage.setItem("url", JSON.stringify(url));
      sessionStorage.setItem("personaBody", JSON.stringify(this.generalBody));
      this.router.navigate(["/turnoOficioCenso"]);
    }
  }

  abreCierraFicha(key) {

    let fichaPosible = this.getFichaPosibleByKey(key);

    if (key == "generales" &&
      !this.activacionTarjeta &&
      !this.emptyLoadFichaColegial) {

      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;

    }
    if (this.activacionTarjeta) {

      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;

    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
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

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  asignarPermisosTarjetas() {
    this.tarjetaExpedientes = this.tarjetaExpedientesNum;
  }

  onChangeSelectAll() {

    if (this.selectAll) {
      this.selectMultiple = true;
      this.selectedDatos = this.expedientesSiga;
      this.numSelected = this.expedientesSiga.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }
      
  }

  onChangeSelectAllEXEA() {

    if (this.selectAllEXEA) {
      this.selectMultipleEXEA = true;
      this.selectedDatosEXEA = this.expedientesSiga;
      this.numSelectedEXEA = this.expedientesSiga.length;
    } else {
      this.selectedDatosEXEA = [];
      this.numSelectedEXEA = 0;
      this.selectMultipleEXEA = false;
    }
      
  }

  onChangeRowsPerPagesEXEA(event) {
    this.selectedItemEXEA = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableEXEA.reset();
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

}
