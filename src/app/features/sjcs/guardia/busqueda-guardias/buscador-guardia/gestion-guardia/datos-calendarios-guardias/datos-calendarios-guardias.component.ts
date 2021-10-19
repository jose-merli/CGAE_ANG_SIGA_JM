import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '../../../../../../../commons/translate';
import { GuardiaItem } from '../../../../../../../models/guardia/GuardiaItem';
import { datos_combos } from '../../../../../../../utils/datos_combos';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { element } from '../../../../../../../../../node_modules/protractor';
import { Jsonp } from '../../../../../../../../../node_modules/@angular/http';
import { CommonsService } from '../../../../../../../_services/commons.service';

@Component({
  selector: 'app-datos-calendarios-guardias',
  templateUrl: './datos-calendarios-guardias.component.html',
  styleUrls: ['./datos-calendarios-guardias.component.scss']
})
export class DatosCalendariosGuardiasComponent implements OnInit {

  @Input() openFicha: boolean = false;
  selectLaborables = false;
  selectFestividades = false;
  body: GuardiaItem = new GuardiaItem();
  infoDiasLab = "";
  infoDiasFes = "";
  historico = false;
  laborables;
  festividades;
  laborablesInicial;
  festividadesInicial;
  bodyInicial;
  resumen = {
    duracion: "",
    dias: "",
    diasSeparacion: "",
    separarGuardia: ""
  }
  progressSpinner: boolean = false;
  msgs = [];
  @Input() modoEdicion: boolean = false;
  @Input() permisoEscritura: boolean = false;
  @Input() tarjetaCalendariosGuardias;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  comboUnidad = datos_combos.comboUnidadesTiempo;
  resaltadoDatos: boolean = false;

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.resaltadoDatos=true;
    this.festividades = this.creaSemana();
    this.laborables = this.creaSemana();

    this.sigaServices.datosRedy$.subscribe(
      n => {
        n = JSON.parse(n.body)

        this.body.diasSeparacionGuardias = n.diasSeparacionGuardias;
        this.body.tipoDiasPeriodo = n.tipoDiasPeriodo;
        this.body.tipoDiasGuardia = n.tipoDiasGuardia;
        this.body.diasPeriodo = n.diasPeriodo;
        this.body.diasGuardia = n.diasGuardia;
        if(this.body.diasPeriodo == "0"){
          this.body.diasPeriodo = '';
        }
        if(this.body.diasGuardia == "0"){
          this.body.diasGuardia = '';
        }
        this.body.idGuardia = n.idGuardia;
        this.body.idTurno = n.idTurno;
        this.body.separarGuardia = n.separarGuardia;
        this.body.requeridaValidacion = n.requeridaValidacion;
        this.body.seleccionFestivos = n.seleccionFestivos;
        this.body.seleccionLaborables = n.seleccionLaborables;
        if (this.body.seleccionFestivos && this.body.seleccionFestivos.length > 0)
          this.body.seleccionFestivos.split("").forEach(element => {
            this.festividades.forEach(it => {
              if (it.label == element)
                it.value = true;
            })
          });
        if (this.body.seleccionLaborables && this.body.seleccionLaborables.length > 0)
          this.body.seleccionLaborables.split("").forEach(element => {
            this.laborables.forEach(it => {
              if (it.label == element)
                it.value = true;
            })
          });
        this.laborablesInicial = JSON.parse(JSON.stringify(this.laborables));
        this.festividadesInicial = JSON.parse(JSON.stringify(this.festividades));
        this.changeFestividades();
        this.changeLaborables();
        this.actualizaResumen();
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));


      });
    if (this.persistenceService.getHistorico())
      this.historico = this.persistenceService.getHistorico();
  }

  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento==undefined || evento==null || evento=="")){
      this.openFicha = true;
      this.opened.emit(this.openFicha);
      return this.commonsService.styleObligatorio(evento);
    }
  }

  styleObligatorioPeriodoTipoDia(evento){
    if(this.resaltadoDatos && this.body.diasPeriodo && (evento==undefined || evento==null || evento=="")){
      this.openFicha = true;
      this.opened.emit(this.openFicha);
      return this.commonsService.styleObligatorio(evento);
    }
  }

  styleObligatorioDuracionTipoDia(evento){
    if(this.resaltadoDatos && this.body.diasGuardia && (evento==undefined || evento==null || evento=="")){
      this.openFicha = true;
      this.opened.emit(this.openFicha);
      return this.commonsService.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios(){
    this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios')}];
    this.resaltadoDatos=true;
  }

  onChangeSeleccLaborables() {
    if (!this.selectLaborables)
      this.laborables.map(it => {
        it.value = false
        this.infoDiasLab = ""
        return it;
      });
    else
      this.laborables.map(it => {
        it.value = true
        return it;
      });

    this.changeLaborables();
  }
  onChangeSeleccFestividades() {
    if (!this.selectFestividades)
      this.festividades.map(it => {
        it.value = false;
        this.infoDiasFes = ""
        return it;
      });
    else
      this.festividades.map(it => {
        it.value = true;
        return it;
      });

    this.changeFestividades();
  }

  changeLaborables() {
    if (this.selectLaborables) {
      this.laborables.forEach(it => {
        if (!it.value)
          this.selectLaborables = false;

      })
    } else {
      this.selectLaborables = true
      this.laborables.forEach(it => {
        if (!it.value)
          this.selectLaborables = false;
      })
    }

    this.infoDiasLab = "";
    this.laborables.forEach(it => {
      if (it.value)
        this.infoDiasLab += it.label;
    });
    if (this.infoDiasLab.length == 5 && this.infoDiasLab.indexOf('S') == -1 && this.infoDiasLab.indexOf('D') == -1)
      this.infoDiasLab = "L-V";
    else if (this.infoDiasLab.length == 6 && this.infoDiasLab.indexOf('D') == -1)
      this.infoDiasLab = "L-S";
    else if (this.infoDiasLab.length == 7)
      this.infoDiasLab = "L-D";

    if (this.infoDiasLab != "")
      this.infoDiasLab = "Lab. " + this.infoDiasLab + ", ";
  }
  changeFestividades() {
    if (this.selectFestividades) {
      this.festividades.forEach(it => {
        if (!it.value)
          this.selectFestividades = false;
      })
    } else {
      this.selectFestividades = true
      this.festividades.forEach(it => {
        if (!it.value)
          this.selectFestividades = false;
      })
    }

    this.infoDiasFes = "";
    this.festividades.forEach(it => {
      if (it.value)
        this.infoDiasFes += it.label;
    });
    if (this.infoDiasFes.length == 5 && this.infoDiasFes.indexOf('S') == -1 && this.infoDiasFes.indexOf('D') == -1)
      this.infoDiasFes = "L-V";
    else if (this.infoDiasFes.length == 6 && this.infoDiasFes.indexOf('D') == -1)
      this.infoDiasFes = "L-S";
    else if (this.infoDiasFes.length == 7)
      this.infoDiasFes = "L-D";

    if (this.infoDiasFes != "")
      this.infoDiasFes = "Fes. " + this.infoDiasFes;
  }



  abreCierraFicha(key) {
    if (this.modoEdicion)
      this.openFicha = !this.openFicha;

    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  creaSemana() {
    let semana = [];
    Array.from("LMXJVSD").forEach(it => {
      semana.push({
        label: it,
        value: false
      });
    });
    return semana;
  }
  save() {
    if(!this.disabledSave()){
      if (this.permisoEscritura && !this.historico) {
        this.body.seleccionFestivos = "";
        this.body.seleccionLaborables = "";
        this.festividades.forEach(element => {
          if (element.value)
            this.body.seleccionFestivos += element.label;
        })
        this.laborables.forEach(element => {
          if (element.value)
            this.body.seleccionLaborables += element.label;
        });
        this.callSaveService();
      }
    }else{
      this.muestraCamposObligatorios();
    }
  }

  callSaveService() {
    this.progressSpinner = true
    this.sigaServices.post("busquedaGuardias_updateGuardia", this.body).subscribe(
      data => {

        this.rellenaDias();

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));

        this.laborablesInicial = JSON.parse(JSON.stringify(this.laborables));
        this.festividadesInicial = JSON.parse(JSON.stringify(this.festividades));
        this.actualizaResumen();
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
  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.rellenaDias();
  }

  disabledSave() {
    let boolLaborable = false;
    let boolFestivo = false;// Comprobamos si los checks de la semana han cambiado
    if (this.laborables && this.laborablesInicial && this.festividades && this.festividadesInicial) {
      this.laborables.forEach(it => {
        if (it.value != this.laborablesInicial.filter(element => it.label == element.label)[0].value)
          boolLaborable = true;
      });
      this.festividades.forEach(it => {
        if (it.value != this.festividadesInicial.filter(element => it.label == element.label)[0].value)
          boolFestivo = true;
      });
    }
    //Comprobamos todo
    /*if (!this.historico && this.permisoEscritura && this.body.diasSeparacionGuardias && this.body.diasGuardia && this.body.tipoDiasGuardia
      && !(this.body.requeridaValidacion && !this.body.diasPeriodo) &&
      !(this.body.diasPeriodo && !this.body.tipoDiasPeriodo) && !(!this.body.diasPeriodo && this.body.tipoDiasPeriodo)
      && ((JSON.stringify(this.body) != JSON.stringify(this.bodyInicial)) || boolFestivo || boolLaborable)) {
      return false;*/
      if (!this.historico && this.permisoEscritura && this.body.diasSeparacionGuardias && this.body.diasGuardia && this.body.tipoDiasGuardia
        && !(this.body.requeridaValidacion && !this.body.diasPeriodo) &&
        !(this.body.diasPeriodo && !this.body.tipoDiasPeriodo) && !(!this.body.diasPeriodo && this.body.tipoDiasPeriodo)) {
        return false;
    }
    return true;
  }
  rellenaDias() {
    //Conf de festivos
    this.festividades = this.festividades.map(it => {
      it.value = false;
      return it;
    })
    if (this.body.seleccionFestivos)
      this.body.seleccionFestivos.split("").forEach(element => {
        this.festividades.forEach(it => {
          if (it.label == element)
            it.value = true;
        })
      });


    //Conf de laborables
    this.laborables = this.laborables.map(it => {
      it.value = false;
      return it;
    })
    if (this.body.seleccionLaborables)
      this.body.seleccionLaborables.split("").forEach(element => {
        this.laborables.forEach(it => {
          if (it.label == element)
            it.value = true;
        })
      });


    this.changeFestividades();
    this.changeLaborables();
  }

  actualizaResumen() {
    this.resumen.dias = JSON.parse(JSON.stringify(this.infoDiasLab)) + " " + JSON.parse(JSON.stringify(this.infoDiasFes))
    let tipoDuracion;
    switch (this.body.tipoDiasGuardia) {
      case "D":
        tipoDuracion = " días";
        break;
      case "M":
        tipoDuracion = " meses";
        break;
      case "Q":
        tipoDuracion = " quincenas";
        break;
      case "S":
        tipoDuracion = " semanas";
        break;
      default:
        tipoDuracion = " días"
        break;
    }
    this.resumen.duracion = this.body.diasGuardia + tipoDuracion;
    this.resumen.diasSeparacion = this.body.diasSeparacionGuardias;
    this.resumen.separarGuardia = this.body.separarGuardia;
  }
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
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
  clear() {
    this.msgs = [];
  }
}
