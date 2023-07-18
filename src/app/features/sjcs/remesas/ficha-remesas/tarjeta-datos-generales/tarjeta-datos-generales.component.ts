import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { DatePipe, Location } from "@angular/common";
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_oficio } from '../../../../../permisos/procesos_oficio';
import { Router } from '@angular/router';
import { RemesasItem } from '../../../../../models/sjcs/RemesasItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { procesos_comision } from '../../../../../permisos/procesos_comision';

@Component({
  selector: 'app-tarjeta-datos-generales',
  templateUrl: './tarjeta-datos-generales.component.html',
  styleUrls: ['./tarjeta-datos-generales.component.scss']
})
export class TarjetaDatosGeneralesComponent implements OnInit {

  // datos;
  openFicha: boolean = true;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  @Input() openGen;

  msgs;
  disableAll: boolean = false;
  permisosTarjeta: boolean = true;
  permisosTarjetaResumen: boolean = true;
  resaltadoDatosGenerales: boolean = false;
  fichasPosibles = [
    {
      key: "generales",
      activa: true
    },
    {
      key: "configuracion",
      activa: false
    },
  ];

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  @Input() datos;
  cols;
  buscadores = [];
  rowsPerPage: any = [];
  item;
  @Input() remesaTabla;
  @Input() remesaItem: RemesasItem = new RemesasItem();
  @Output() estado = new EventEmitter<string>();

  resultado;
  remesasDatosEntradaItem;
  busquedaActualizaciones: boolean;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private router: Router,
    private datepipe: DatePipe,
    private localStorageService: SigaStorageService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.openGen == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('datosGenerales')
      }
    }
  }

  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (
      key == "datosGenerales" &&
      !this.modoEdicion
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.modoEdicion) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  ngOnInit() {
    if(this.remesaTabla != null){
      this.listadoEstadosRemesa(this.remesaTabla);
    }else if(this.remesaItem != null){
      this.getUltimoRegitroRemesa();
      this.remesaItem.descripcion = "";
    }

    this.resaltadoDatosGenerales = true;
    // this.abreCierraFicha('datosGenerales');
    this.commonsService.checkAcceso(procesos_comision.remesasEnvio)
      .then(respuesta => {
        this.permisosTarjeta = respuesta;
        this.persistenceService.setPermisos(this.permisosTarjeta);
        if (this.permisosTarjeta == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        } else if (this.persistenceService.getPermisos() != true) {
          this.disableAll = true;
        }
      }
      ).catch(error => console.error(error));

    this.getCols();
    this.getInstitucionActual();
  }

  getInstitucionActual() {
		this.sigaServices.get("institucionActual").subscribe(n => { this.localStorageService.institucionActual = n.value });
	}

  getUltimoRegitroRemesa() {
    //console.log("Dentro del getUltimoRegistroRemesa");
    this.sigaServices
      .get("ficharemesas_getUltimoRegistroRemesa")
      .subscribe(
        n => {
          //console.log("Dentro de la respuesta. Contenido --> ", n.contador);
          let contador: string = "";

           contador = String(n.contador);

          if(contador.length < 5){
            let ceros: string = "";
            for(;(ceros.length + contador.length) < 5;){
              ceros += "0";
            }
            contador = ceros + contador;
          }

          this.remesaItem.numero = contador;
          //console.log("remesaItem -> ", this.remesaItem);
        },
        error => { },
        () => { }
      );
  }

  getCols() {

    this.cols = [
      { field: "fechaModificacion", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado" },
      { field: "estado", header: "justiciaGratuita.Calendarios.Estado" }
    ];
    this.cols.forEach(it => this.buscadores.push(""))

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

  listadoEstadosRemesa(remesa, padre?){
    this.progressSpinner = true;
    this.remesasDatosEntradaItem =
    {
      'idRemesa': (remesa.idRemesa != null && remesa.idRemesa != undefined) ? remesa.idRemesa.toString() : remesa.idRemesa,  
    };
    this.sigaServices.post("ficharemesas_listadoEstadosRemesa", this.remesasDatosEntradaItem).subscribe(
      n => {
        //console.log("Dentro del servicio del padre que llama al listadoEstadosRemesa");
        this.resultado = JSON.parse(n.body).estadoRemesaItem;

        if(padre){
          this.estado.emit(this.resultado[this.resultado.length-1].estado);
        }

        if(this.remesaTabla != null){
          this.remesaTabla.estado = this.resultado[this.resultado.length-1].estado;
        }
        
        this.remesaItem.estado = this.resultado[this.resultado.length-1].estado;
        

        let dateString: string = this.remesaTabla.fechaGeneracion;
        let dateObject: Date = new Date(dateString);

        let year: number = dateObject.getFullYear();
        let month: number = dateObject.getMonth() + 1; 
        let day: number = dateObject.getDate();
        let hour: number = dateObject.getHours();
        let minutes: number = dateObject.getMinutes();
        let seconds: number = dateObject.getSeconds();

        let formattedDate: string = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;;
        


        this.resultado.forEach(res =>{
          if(res.estado == 'Generada' && res.fechaModificacion == null){
            res.fechaModificacion = formattedDate;
          }
        });

        //console.log("Contenido de la respuesta del back --> ", this.resultado);
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
        let error = err;
        //console.log(err);
      });

      
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy HH24:MI:SS';
    return this.datepipe.transform(date, pattern);    
  }

  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
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

}

