import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';

import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../../_services/commons.service';
import { GuardiaItem } from '../../../../../../../models/guardia/GuardiaItem';
import { datos_combos } from '../../../../../../../utils/datos_combos';
import { endpoints_guardia } from '../../../../../../../utils/endpoints_guardia';
import { TranslateService } from '../../../../../../../commons/translate';
import { ConfiguracionCola, GlobalGuardiasService } from '../../../../guardiasGlobal.service';
import { SigaStorageService } from '../../../../../../../siga-storage.service';
import { Router } from '../../../../../../../../../node_modules/@angular/router';
import { MultiSelect } from 'primeng/primeng';


const asc = "ascendente"
const desc = "descendente"

const ordManual = "Ordenación Manual"


@Component({
  selector: 'app-datos-conf-cola',
  templateUrl: './datos-conf-cola.component.html',
  styleUrls: ['./datos-conf-cola.component.scss']
})
export class DatosConfColaComponent implements OnInit {

  @Input() datos = [];
  @Input() modoEdicion: boolean = false;
  @Input() permisoEscritura: boolean;
  @Output() modoEdicionSend = new EventEmitter<any>();
  @Input() modoVinculado = false;
  @Input() tarjetaConfigCola;

  body: GuardiaItem = new GuardiaItem();
  bodyInicial;
  pesosExistentes: any[];
  pesosExistentesInicial: any[];
  pesosSeleccionados: any[];
  pesosSeleccionadosInicial: any[];
  @Input() openFicha: boolean = false;
  historico: boolean = false;
  ordenacion = "";
  numeroletradosguardia = "";
  msgs = [];
  progressSpinner: boolean = false;
  tieneGuardiaPrincipal : boolean = false;
  isLetrado : boolean = false;
  resumenPesos : string;
  isDisabledGuardia: boolean = true;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  @ViewChild("table") table;
  @ViewChild("multiSelect") multiSelect: MultiSelect;
  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "configuracion",
      activa: false
    },
    {
      key: "tablacolaguardias",
      activa: false
    },
  ];

  @Output() actualizaBotonConfCola = new EventEmitter<String>();

  constructor(private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private globalGuardiasService: GlobalGuardiasService,
    private commonServices : CommonsService,
    private sigaStorageService : SigaStorageService,
    private router: Router) { }
    
  ngOnInit() {

    //Enviamos el valor de "porGrupo"
    this.isLetrado = this.sigaStorageService.isLetrado && this.sigaStorageService.idPersona;
    this.historico = this.persistenceService.getHistorico();
    this.sigaServices.datosRedy$.subscribe(
      data => {
        if (data.body)
          data = JSON.parse(data.body)

        if(data.idGuardiaPrincipal){
          this.tieneGuardiaPrincipal = true;
        }
        
        this.body.letradosGuardia = data.letradosGuardia;
        this.body.idOrdenacionColas = data.idOrdenacionColas;
        this.body.porGrupos = data.porGrupos == "1" ? true : false;
        let configuracionCola: ConfiguracionCola = {
          'manual': true,
          'porGrupos': this.body.porGrupos,
          'idConjuntoGuardia': 0,
          "fromCombo": false,
          "minimoLetradosCola": this.body.letradosGuardia
        };
        this.globalGuardiasService.emitConf(configuracionCola);
        this.body.rotarComponentes = data.rotarComponentes == "1" ? true : false;
        this.body.idGuardia = data.idGuardia;
        this.body.idTurno = data.idTurno;
        this.getPerfilesSeleccionados();
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        if (this.modoEdicion) this.getResumen();
      });
  }

  styleObligatorio(evento){
    if((evento==undefined || evento==null || evento=="")){
      return this.commonServices.styleObligatorio(evento);
    }
  }

  abreCierraFicha() {
    if(this.modoVinculado){
      this.modoEdicion=false
  }
    if (this.modoEdicion)
      this.openFicha = !this.openFicha;
  }

  disabledSave() {
     /* if (!this.historico && this.body.letradosGuardia
      && ((JSON.stringify(this.body) != JSON.stringify(this.bodyInicial))
        || (JSON.stringify(this.pesosSeleccionados) != JSON.stringify(this.pesosSeleccionadosInicial)))) {
      return false;
    } else return true;*/
    if (!this.historico && this.body.letradosGuardia) {
      return false;
    } else return true;

  }


  getResumen() {
    let datos = JSON.parse(JSON.stringify(this.persistenceService.getDatos()));
    this.sigaServices.post("busquedaGuardias_resumenConfCola", datos)
      .subscribe(data => {
        if (data.body)
          data = JSON.parse(data.body);
        this.numeroletradosguardia = data.letradosIns;
        this.ordenacion = data.idOrdenacionColas;
        if (this.ordenacion && this.ordenacion.split(",").length > 4)
          this.ordenacion = this.ordenacion.substring(0, this.ordenacion.lastIndexOf(","));
      },
        err => {
          //console.log(err);
        })
  }

  rest() {
    this.pesosExistentes = JSON.parse(JSON.stringify(this.pesosExistentesInicial));
    this.pesosSeleccionados = JSON.parse(JSON.stringify(this.pesosSeleccionadosInicial));
    if (this.pesosSeleccionados && this.pesosSeleccionados.length > 0){
      this.resumenPesos = this.pesosSeleccionados[0].por_filas ;
    }
     if (this.pesosSeleccionados.length > 1){
      this.resumenPesos =this.resumenPesos+ ", " + this.pesosSeleccionados[1].por_filas ;
    }
     if (this.pesosSeleccionados.length > 2){
      this.resumenPesos =this.resumenPesos+ ", "  + this.pesosSeleccionados[2].por_filas;
    }
     if (this.pesosSeleccionados.length > 3){
      this.resumenPesos =this.resumenPesos+ ", "  + this.pesosSeleccionados[3].por_filas;
    }
    
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  cambioExistentes(event) {
    let noexiste = this.pesosExistentes.find(item => item === event.items)
    if (noexiste == undefined) {
      event.items.forEach(element => {
        let e = { numero: element.numero, por_filas: element.por_filas, orden: element.orden };
        if (element.por_filas == ordManual && this.body.porGrupos) {
          let find = this.pesosExistentes.findIndex(x => x.por_filas == element.por_filas);
          if (find != undefined) {
            this.pesosExistentes.splice(find, 1);
            this.pesosSeleccionados = [element, ...this.pesosSeleccionados];
            if (this.pesosSeleccionados && this.pesosSeleccionados.length > 0){
              this.resumenPesos = this.pesosSeleccionados[0].por_filas ;
            }
             if (this.pesosSeleccionados.length > 1){
              this.resumenPesos =this.resumenPesos+ ", " + this.pesosSeleccionados[1].por_filas ;
            }
             if (this.pesosSeleccionados.length > 2){
              this.resumenPesos =this.resumenPesos+ ", "  + this.pesosSeleccionados[2].por_filas;
            }
             if (this.pesosSeleccionados.length > 3){
              this.resumenPesos =this.resumenPesos+ ", "  + this.pesosSeleccionados[3].por_filas;
            }
          }
        }
        else if (element.por_filas == ordManual) {

        }
        else if (e.orden == asc) {
          e.orden = desc;
          e.numero = "0";
          this.pesosExistentes.push(e);
        }
        else {
          e.orden = asc
          e.numero = "0";
          this.pesosExistentes.push(e);
        }
      });
    }
  }


  cambioSeleccionados(event) {
    event.items.forEach(element => {
      let find = this.pesosExistentes.findIndex(x => x.por_filas == event.items[0].por_filas);
      if (find != -1) {
        this.pesosExistentes.splice(find, 1);
      }
    });
    if (this.pesosSeleccionados) {
      if (this.pesosSeleccionados[0]) {
        this.pesosSeleccionados[0].numero = "5";
      }
      if (this.pesosSeleccionados[1]) {
        this.pesosSeleccionados[1].numero = "4";
      }
      if (this.pesosSeleccionados[2]) {
        this.pesosSeleccionados[2].numero = "3";
      }
      if (this.pesosSeleccionados[3]) {
        this.pesosSeleccionados[3].numero = "2";
      }
      if (this.pesosSeleccionados[4]) {
        this.pesosSeleccionados[4].numero = "1";
      }
    }

    if (this.pesosSeleccionados && this.pesosSeleccionados.length > 0){
      this.resumenPesos = this.pesosSeleccionados[0].por_filas ;
      }
    if (this.pesosSeleccionados.length > 1){
      this.resumenPesos =this.resumenPesos+ ", " + this.pesosSeleccionados[1].por_filas ;
    }
    if (this.pesosSeleccionados.length > 2){
      this.resumenPesos =this.resumenPesos+ ", "  + this.pesosSeleccionados[2].por_filas;
    }
    if (this.pesosSeleccionados.length > 3){
      this.resumenPesos =this.resumenPesos+ ", "  + this.pesosSeleccionados[3].por_filas;
    }
  }

  getPerfilesSeleccionados() {
    if (!this.modoEdicion) {
      this.pesosExistentes = [];

      this.pesosExistentes = datos_combos.pesos_existentes;
      this.getPerfilesExistentes();

    } else {
      this.sigaServices
        .getParam("combossjcs_ordenCola", "?idordenacioncolas=" + this.body.idOrdenacionColas)
        .subscribe(
          n => {
            // coger etiquetas de una persona juridica
            this.pesosExistentes = n.colaOrden;
            if (this.pesosExistentes && this.pesosExistentes.length > 0){
              this.resumenPesos = this.pesosExistentes[0].por_filas ;
            }
            if (this.pesosExistentes.length > 1){
              this.resumenPesos =this.resumenPesos+ ", " + this.pesosExistentes[1].por_filas ;
            }
             if (this.pesosExistentes.length > 2){
              this.resumenPesos =this.resumenPesos+ ", "  + this.pesosExistentes[2].por_filas;
            }
             if (this.pesosExistentes.length > 3){
              this.resumenPesos =this.resumenPesos+ ", "  + this.pesosExistentes[3].por_filas;
            }
            this.pesosExistentes.forEach(element => {
              if (element.por_filas == "ALFABETICOAPELLIDOS") {
                element.por_filas = "Apellidos y nombre";
              }
              else if (element.por_filas == "ANTIGUEDADCOLA") {
                element.por_filas = "Antigüedad en la cola";
              }
              else if (element.por_filas == "NUMEROCOLEGIADO") {
                element.por_filas = "Nº Colegiado";
              }
              else if (element.por_filas == "FECHANACIMIENTO") {
                element.por_filas = "Edad Colegiado";
              } else {
                element.por_filas = ordManual;
                element.orden = "";
              }

              if (element.orden == "asc") {
                element.orden = asc;
              }
              else if (element.orden == "desc") {
                element.orden = desc;
              }
            });


          },
          err => {
            //console.log(err);
          }, () => {
            this.getPerfilesExistentes();

          }
        );
    }


  }
  getPerfilesExistentes() {

    let pesosFiltrados = Object.assign([], this.pesosExistentes);
    this.pesosSeleccionados = [];


    pesosFiltrados.forEach(element => {
      if (element.numero > 0) {
        this.pesosSeleccionados.push(element);
        this.pesosExistentes.splice(this.pesosExistentes.indexOf(element), 1);
      }
    });
    if (this.pesosSeleccionados && this.pesosSeleccionados.length > 0){
      this.resumenPesos = this.pesosSeleccionados[0].por_filas ;
    }
     if (this.pesosSeleccionados.length > 1){
      this.resumenPesos =this.resumenPesos+ ", " + this.pesosSeleccionados[1].por_filas ;
    }
     if (this.pesosSeleccionados.length > 2){
      this.resumenPesos =this.resumenPesos+ ", "  + this.pesosSeleccionados[2].por_filas;
    }
     if (this.pesosSeleccionados.length > 3){
      this.resumenPesos =this.resumenPesos+ ", "  + this.pesosSeleccionados[3].por_filas;
    }
    this.pesosExistentes.forEach(element => {
      let e = { numero: element.numero, por_filas: element.por_filas, orden: element.orden };
      if (e.por_filas != ordManual) {
        if (!e.orden) {
          element.orden = asc;
        }
        if (e.orden != "desc") {
          e.orden = desc;
          this.pesosExistentes.push(e)
        }
      } else {
        let existManual = this.pesosExistentes.find(it => it.por_filas == ordManual);
        if (!existManual || existManual == 0) {
          this.pesosExistentes.push(e);

          let configuracionCola: ConfiguracionCola = {
            'manual': false,
            'porGrupos': this.body.porGrupos,
            'idConjuntoGuardia': 0,
            "fromCombo": false,
            "minimoLetradosCola": this.body.letradosGuardia
          };
          this.globalGuardiasService.emitConf(configuracionCola);
        }
      }
    });



    this.pesosExistentesInicial = JSON.parse(JSON.stringify(this.pesosExistentes));
    this.pesosSeleccionadosInicial = JSON.parse(JSON.stringify(this.pesosSeleccionados));

  }
  moverSeleccionados(event) {
    if (this.pesosSeleccionados != undefined) {
      if (this.body.porGrupos && this.pesosSeleccionados[0].por_filas != ordManual) {
        [this.pesosSeleccionados[0], this.pesosSeleccionados[1]] = [this.pesosSeleccionados[1], this.pesosSeleccionados[0]]
      }
      if (this.pesosSeleccionados[0] != undefined) {
        this.pesosSeleccionados[0].numero = "5";
      }
      if (this.pesosSeleccionados[1] != undefined) {
        this.pesosSeleccionados[1].numero = "4";
      }
      if (this.pesosSeleccionados[2] != undefined) {
        this.pesosSeleccionados[2].numero = "3";
      }
      if (this.pesosSeleccionados[3] != undefined) {
        this.pesosSeleccionados[3].numero = "2";
      }
      if (this.pesosSeleccionados[4] != undefined) {
        this.pesosSeleccionados[4].numero = "1";
      }
    }
  }

  cambiaMinimo(event){
    this.body.letradosGuardia = event;
    let configuracionCola: ConfiguracionCola = {
      'manual': true,
      'porGrupos': this.body.porGrupos,
      'idConjuntoGuardia': 0,
      "fromCombo": false,
      "minimoLetradosCola": this.body.letradosGuardia
    };
    this.globalGuardiasService.emitConf(configuracionCola);
  }
  cambiaGrupo() {
    this.body.rotarComponentes = this.body.porGrupos;
    let configuracionCola: ConfiguracionCola = {
      'manual': true,
      'porGrupos': this.body.porGrupos,
      'idConjuntoGuardia': 0,
      "fromCombo": false,
      "minimoLetradosCola": this.body.letradosGuardia
    };
    if (this.body.porGrupos) {
      this.globalGuardiasService.emitConf(configuracionCola);
      this.pesosSeleccionados = this.pesosSeleccionados.filter(it => {
        return it.por_filas != ordManual;
      });
      this.pesosExistentes = this.pesosExistentes.filter(it => {
        return it.por_filas != ordManual;
      });
      let pos = 5
      this.pesosSeleccionados = this.pesosSeleccionados.map(it => {
        pos -= 1
        it.numero = pos + "";
        return it;
      });

      this.pesosSeleccionados = [({
        numero: "5",
        por_filas: ordManual,
        orden: ""
      }), ...this.pesosSeleccionados];

      if (this.pesosSeleccionados && this.pesosSeleccionados.length > 0){
        this.resumenPesos = this.pesosSeleccionados[0].por_filas ;
      }
       if (this.pesosSeleccionados.length > 1){
        this.resumenPesos =this.resumenPesos+ ", " + this.pesosSeleccionados[1].por_filas ;
      }
       if (this.pesosSeleccionados.length > 2){
        this.resumenPesos =this.resumenPesos+ ", "  + this.pesosSeleccionados[2].por_filas;
      }
       if (this.pesosSeleccionados.length > 3){
        this.resumenPesos =this.resumenPesos+ ", "  + this.pesosSeleccionados[3].por_filas;
      }
    } else {
      this.globalGuardiasService.emitConf(configuracionCola);
    }
    // else {
    //   this.pesosExistentes = this.pesosExistentes.filter(it => {
    //     return it.por_filas != ordManual;
    //   });
    //   this.pesosSeleccionados = this.pesosSeleccionados.filter(it => {
    //     return it.por_filas != ordManual;
    //   });
    //   this.pesosExistentes.push({
    //     numero: "0",
    //     por_filas: ordManual,
    //     orden: ""
    //   });
    // }
  }
  save() {
    if (this.permisoEscritura && !this.historico) {
      let montag = [0, 0, 0, 0, 0];
      this.pesosSeleccionados.forEach(element => {
        if (element.por_filas == "Apellidos y nombre") {
          montag[0] = element.numero;
          if (element.orden == desc) montag[0] = -montag[0];
        }
        else if (element.por_filas == "Antigüedad en la cola") {
          montag[3] = element.numero;
          if (element.orden == desc) montag[3] = -montag[3];
        }
        else if (element.por_filas == "Nº Colegiado") {
          montag[2] = element.numero;
          if (element.orden == desc) montag[2] = -montag[2];
        }
        else if (element.por_filas == "Edad Colegiado") {
          montag[1] = element.numero;
          if (element.orden == desc) montag[1] = -montag[1];
        } else {
          montag[4] = element.numero;
        }
      });
      if(!this.body.letradosGuardia){
        this.showMessage('error','Error',this.translateService.instant('general.message.camposObligatorios'));
      }else{
        this.body.filtros = montag.toString();
        this.callSaveService();
      }
    }
  }

  callSaveService() {

    this.progressSpinner = true;
    this.sigaServices.post("busquedaGuardias_updateGuardia", this.body).subscribe(
      data => {
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        this.pesosExistentesInicial = JSON.parse(JSON.stringify(this.pesosExistentes));
        this.pesosSeleccionadosInicial = JSON.parse(JSON.stringify(this.pesosSeleccionados));
        if (this.pesosSeleccionados && this.pesosSeleccionados.length > 0){
          this.resumenPesos = this.pesosSeleccionados[0].por_filas ;
        }
         if (this.pesosSeleccionados.length > 1){
          this.resumenPesos =this.resumenPesos+ ", " + this.pesosSeleccionados[1].por_filas ;
        }
         if (this.pesosSeleccionados.length > 2){
          this.resumenPesos =this.resumenPesos+ ", "  + this.pesosSeleccionados[2].por_filas;
        }
         if (this.pesosSeleccionados.length > 3){
          this.resumenPesos =this.resumenPesos+ ", "  + this.pesosSeleccionados[3].por_filas;
        }
        this.modoEdicionSend.emit(true);
        this.modoEdicion = true;
        this.progressSpinner = false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

        //Llamada a funcion tarjeta colaGuardia para habilitar/deshabilitar botonera ordenacion manual
        //this.router.navigate(["/gestionGuardias"]); // Funciona, pero es muy lento
        
        // EMIT A app-gestion-guardia para recargar y luego el de gestionGuardiaComponent se activa el metodo para llamar al tabla-resultado-order.component para que haga el onInit
        //this.
        this.abreCierraFichaByKey('colaGuardias');
      },
      err => {

        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }
  
  abreCierraFichaByKey(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (key == "colaGuardias" && !this.modoEdicion) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.modoEdicion) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
    this.actualizaBotonConfCola.emit(this.ordenacion);
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;

    }
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
