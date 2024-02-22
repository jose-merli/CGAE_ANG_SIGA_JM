import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Message } from "primeng/components/common/api";
import { RuleModel } from '@syncfusion/ej2-angular-querybuilder';
import { QueryBuilderComponent } from '@syncfusion/ej2-angular-querybuilder';
import { Subscription } from 'rxjs';
import { SigaServices } from '../../../../../_services/siga.service';
import { ConstructorConsultasDTO } from '../../../../../models/ConstructorConsultasDTO';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { TranslateService } from '../../../../../commons/translate';
import { QueryBuilderDTO } from '../../../../../models/QueryBuilderDTO';
import { ConfigColumnasQueryBuilderDTO } from '../../../../../models/ConfigColumnasQueryBuilderDTO';
import { ComboObject } from '../../../../../models/ComboObject';

//Idioma
setCulture('sigaIdiomas');

@Component({
  selector: 'app-constructor-consultas',
  templateUrl: './constructor-consultas.component.html',
  styleUrls: ['./constructor-consultas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConstructorConsultasComponent implements OnInit {
  @ViewChild('constructorConsultas') public constructorConsultas: QueryBuilderComponent;

  msgs: Message[];
  openFicha: boolean = false;
  progressSpinner: Boolean = false;

  consultaBuscador;
  datosConstructorConsulta: ConstructorConsultasDTO = new ConstructorConsultasDTO();

  importRules: RuleModel = {
    //Inicializa los campos del querybuilder

  };
  public fields: Object = { text: 'label', value: 'value' };
  public customOperators: any = [
    { value: 'equal', key: this.translateService.instant("informesycomunicaciones.consultas.constructor.iguala") },
    { value: 'notequal', key: this.translateService.instant("informesycomunicaciones.consultas.constructor.distinto") },
    { value: 'lessthan', key: this.translateService.instant("informesycomunicaciones.consultas.constructor.menorque") },
    { value: 'greaterthan', key: this.translateService.instant("informesycomunicaciones.consultas.constructor.mayorque") },
    { value: 'lessthanorequal', key: this.translateService.instant("informesycomunicaciones.consultas.constructor.menorqueoigual") },
    { value: 'greaterthanorequal', key: this.translateService.instant("informesycomunicaciones.consultas.constructor.mayorqueoigual") },
    { value: 'startswith', key: this.translateService.instant("informesycomunicaciones.consultas.constructor.empiezacon") },
    { value: 'endswith', key: this.translateService.instant("informesycomunicaciones.consultas.constructor.terminacon") },
    { value: 'isnull', key: this.translateService.instant("informesycomunicaciones.consultas.constructor.isnull") },
  ];;

  //Suscripciones
  subscriptionDatosConstructorConsulta: Subscription;
  subscriptionGuardarDatosConstructor: Subscription;
  subscriptionObtenerConfigColumnas: Subscription;
  subscriptionObtenerCombo: Subscription;
  constructor(private sigaServices: SigaServices, private translateService: TranslateService) {
    //IDIOMAS
    L10n.load({
      'sigaIdiomas': {
        'querybuilder': {
          'AddGroup': this.translateService.instant("informesycomunicaciones.consultas.constructor.aniadirgrupo"),
          'AddCondition': this.translateService.instant("informesycomunicaciones.consultas.constructor.nuevacondicionboton"),
          'StartsWith': this.translateService.instant("informesycomunicaciones.consultas.constructor.empiezacon"),
          'EndsWith': this.translateService.instant("informesycomunicaciones.consultas.constructor.terminacon"),
          'Equal': this.translateService.instant("informesycomunicaciones.consultas.constructor.iguala"),
          'NotEqual': this.translateService.instant("informesycomunicaciones.consultas.constructor.distinto"),
          'LessThan': this.translateService.instant("informesycomunicaciones.consultas.constructor.menorque"),
          'LessThanOrEqual': this.translateService.instant("informesycomunicaciones.consultas.constructor.menorqueoigual"),
          'GreaterThan': this.translateService.instant("informesycomunicaciones.consultas.constructor.mayorque"),
          'GreaterThanOrEqual': this.translateService.instant("informesycomunicaciones.consultas.constructor.mayorqueoigual")
        }
      }
    });
  }
  ngOnInit() {
    this.obtenerConfigColumnas();
    if (sessionStorage.getItem("consultasSearch")) {
      this.consultaBuscador = JSON.parse(sessionStorage.getItem("consultasSearch"));
      this.obtenerDatosConsulta(this.consultaBuscador.idConsulta, this.consultaBuscador.idInstitucion);
    }

  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionDatosConstructorConsulta)
      this.subscriptionDatosConstructorConsulta.unsubscribe();
    if (this.subscriptionGuardarDatosConstructor)
      this.subscriptionGuardarDatosConstructor.unsubscribe();
    if (this.subscriptionObtenerConfigColumnas)
      this.subscriptionObtenerConfigColumnas.unsubscribe();
    if (this.subscriptionObtenerCombo)
      this.subscriptionObtenerCombo.unsubscribe();

    //Copia necesaria para conservar la informacion cuando se selecciona consulta experta en el radio button sin haber guardado el constructor y 
    //se vuelve ya que en ese caso se ha de conservar lo modificado.
    // if(this.constructorConsultas != undefined ){
    //   if(this.datosConst.consulta != this.constructorConsultas.getSqlFromRules() && sessionStorage.getItem("constructorDeConsultasGuardado") == undefined){
    //     sessionStorage.setItem("copiaCambiosConstructor", this.constructorConsultas.getSqlFromRules());
    //   }
    // }
    if (this.constructorConsultas != undefined && this.datosConst != undefined) {
      if (this.datosConst.consulta != this.constructorConsultas.getSqlFromRules() && sessionStorage.getItem("constructorDeConsultasGuardado") == undefined) {
        sessionStorage.setItem("copiaCambiosConstructor", this.constructorConsultas.getSqlFromRules());
      }
    }


  }

  fieldChange(e: any): void {
    this.constructorConsultas.notifyChange(e.value, e.element, 'field');
  }
  obtenerComboCampo(e: any) {
    this.configColumnasDTO.configColumnasQueryBuilderItem.forEach(campo => {
      if (e.rule.label == campo.nombreenconsulta && campo.selectayuda != null) {
        this.obtenerCombosQueryBuilder(campo, e.rule.label);
      }
    });
  }

  operatorChange(e: any): void {
    this.constructorConsultas.getRule(e.event.target).operator = e.value;
  }

  valueChange(e: any): void {
    this.constructorConsultas.notifyChange(e.value, e.element, 'value');
  }

  //INICIO METODOS TARJETA CONSTRUCTOR DE CONSULTAS
  checkDatos() {
    this.guardarDatosConstructor();
  }

  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevaConsulta") == null) {
      this.openFicha = !this.openFicha;
    }
  }

  clear() {
    this.msgs = [];
  }
  resetToOriginalData() {
    if (sessionStorage.getItem("consultasSearch")) {
      this.constructorConsultas.setRulesFromSql(this.datosConst.consulta);
    } else {
      this.constructorConsultas.setRulesFromSql("");
    }
  }

  //Inicializa las propiedades necesarias para el dialogo de confirmacion
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
  //FIN METODOS TARJETA CONSTRUCTOR DE CONSULTAS

  //INICIO SERVICIOS
  configColumnasDTO: ConfigColumnasQueryBuilderDTO;
  obtenerConfigColumnas() {
    this.progressSpinner = true;

    this.subscriptionObtenerConfigColumnas = this.sigaServices.get("constructorConsultas_obtenerConfigColumnasQueryBuilder").subscribe(
      configColumnasQueryBuilder => {

        this.configColumnasDTO = configColumnasQueryBuilder;
        this.configColumnasDTO.configColumnasQueryBuilderItem.forEach(campos => {
          campos.idcampo = "A" + campos.idcampo;
        });

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }, () => {
        if (sessionStorage.getItem("consultasSearch")) {
          this.configColumnasDTO.configColumnasQueryBuilderItem.forEach(campo => {
            if (campo.selectayuda != null) {
              this.obtenerCombosQueryBuilder(campo, campo.nombreenconsulta);
            }
          });
        }

      });;

  }

  comboDTOColumnaQueryBuilder: ComboObject = new ComboObject();
  listaCombosObject: Map<string, ComboObject> = new Map<string, ComboObject>();

  obtenerCombosQueryBuilder(campo, nombreCampo) {
    this.progressSpinner = true;

    this.subscriptionObtenerCombo = this.sigaServices.post("constructorConsultas_obtenerCombosQueryBuilder", campo).subscribe(
      comboDTO => {

        this.comboDTOColumnaQueryBuilder = JSON.parse(comboDTO.body);
        this.listaCombosObject.set(nombreCampo, this.comboDTOColumnaQueryBuilder);

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }, () => {

      });;
  }

  setRules(): void {
    if (this.constructorConsultas != undefined && this.datosConst != undefined) {
      this.constructorConsultas.setRulesFromSql(this.datosConst.consulta);
    }

    if (sessionStorage.getItem("constructorDeConsultasGuardado") == undefined && sessionStorage.getItem("copiaCambiosConstructor") != null) {
      this.constructorConsultas.setRulesFromSql(sessionStorage.getItem("copiaCambiosConstructor"));
    }
  }

  datosConst;
  obtenerDatosConsulta(idConsulta, idInstitucion) {

    this.progressSpinner = true;

    this.subscriptionDatosConstructorConsulta = this.sigaServices.getParam("constructorConsultas_obtenerDatosConsulta", "?idConsulta=" + idConsulta + "&idInstitucion=" + idInstitucion).subscribe(
      datosConstructorConsulta => {
        this.datosConst = datosConstructorConsulta;
        if (this.constructorConsultas != undefined && this.datosConst != undefined) {
          this.constructorConsultas.setRulesFromSql(this.datosConst.consulta);
        }
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {

        this.progressSpinner = false;
      }
    );
  }

  queryBuilderDTO: QueryBuilderDTO = new QueryBuilderDTO();

  guardarDatosConstructor() {
    this.progressSpinner = true;

    this.queryBuilderDTO.consulta = this.constructorConsultas.getSqlFromRules(this.constructorConsultas.getRules());
    if (this.consultaBuscador == undefined && sessionStorage.getItem("consultasSearch") != null) {
      this.consultaBuscador = JSON.parse(sessionStorage.getItem("consultasSearch"));
    }
    this.queryBuilderDTO.idconsulta = this.consultaBuscador.idConsulta;
    this.queryBuilderDTO.idinstitucion = this.consultaBuscador.idInstitucion;

    this.subscriptionGuardarDatosConstructor = this.sigaServices.post("constructorConsultas_guardarDatosConstructor", this.queryBuilderDTO).subscribe(
      response => {

        this.queryBuilderDTO = JSON.parse(response.body);

        if (response.status == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          sessionStorage.setItem("constructorDeConsultasGuardado", "true");
          sessionStorage.setItem("nuevaSentencia", this.queryBuilderDTO.sentencia);
        }

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => { }
    );
  }

  //FIN SERVICIOS
}
