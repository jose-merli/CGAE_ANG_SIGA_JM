import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Message } from "primeng/components/common/api";
import { RuleModel } from '@syncfusion/ej2-querybuilder';
import { Browser } from '@syncfusion/ej2-base';
import { QueryBuilderComponent } from '@syncfusion/ej2-angular-querybuilder';
import { Subscription } from 'rxjs';
import { SigaServices } from '../../../../../_services/siga.service';
import { ConstructorConsultasDTO } from '../../../../../models/ConstructorConsultasDTO';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { TranslateService } from '../../../../../commons/translate';
import { RadioButtonModule } from '@syncfusion/ej2-angular-buttons';

//Idioma
setCulture('sigaIdiomas');

//IDIOMAS
L10n.load({
  'sigaIdiomas': {
      'querybuilder': {
          'AddGroup': 'Añadir Grupo',
          'AddCondition': 'Añadir condicion',
          'DeleteRule': 'Entfernen Sie diesen Zustand',
          'DeleteGroup': 'Gruppe löschen',
          'Edit': 'BEARBEITEN',
          'SelectField': 'Wählen Sie ein Feld aus',
          'SelectOperator': 'Operator auswählen',
          'StartsWith': 'Beginnt mit',
          'EndsWith': 'Endet mit',
          'Contains': 'Enthält',
          'Equal': 'igual a',
          'NotEqual': 'distinto',
          'LessThan': 'menor que',
          'LessThanOrEqual': 'menor o igual',
          'GreaterThan': 'mayor que',
          'GreaterThanOrEqual': 'mayor o igual',
          'Between': 'Zwischen',
          'NotBetween': 'Nicht zwischen',
          'In': 'Im',
          'NotIn': 'Nicht in',
          'Remove': 'LÖSCHEN',
          'ValidationMessage': 'Dieses Feld wird benötigt',
      }
  }
});

@Component({
  selector: 'app-constructor-consultas',
  templateUrl: './constructor-consultas.component.html',
  styleUrls: ['./constructor-consultas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConstructorConsultasComponent implements OnInit {
  @ViewChild('constructorConsultas') constructorConsultas: QueryBuilderComponent;

  msgs: Message[];
  openFicha: boolean = false;
  progressSpinner: Boolean = false;

  consultaBuscador;
  datosConstructorConsulta: ConstructorConsultasDTO = new ConstructorConsultasDTO();
 
  importRules: RuleModel = {
    //Inicializa los campos del querybuilder
    'condition': '',
    'rules': [ { 
      'label': 'AÑOS COLEGIACION',
      'field': 'AÑOS COLEGIACION',
      'type': 'number',
      'operator': 'equal',
      'value': 0
    }]
  };

  comboSiNo: string[] = ['Si', 'No'];
  comboEstadoCivil: String[] = ['Casado/a', 'Desconocido', 'Divorciado/a', 'Emparejado/a', 'Separado/a', 'Soltero/a', 'Unión de hecho', 'Viudo/a'];
  public items:  { [key: string]: Object}[] = [{field:'USA', label:'USA'},{field:'England', label:'England'},{field:'India',label:'India'},{field:'Spain',label:'Spain'}];
  public fields: Object = { text: 'field', value: 'label' };
  comboGrupoCliente: String[] = ['Provisional1', 'Provisional2'];
  comboSexo: String[] = ['HOMBRE', 'MUJER'];
  comboTipoColegiado: String[] = ['Provisional1', 'Provisional2'];
  comboTipoSeguro: String[] = ['Provisional1', 'Provisional2'];

  //Suscripciones
  subscriptionDatosConstructorConsulta: Subscription;
  subscriptionGuardarDatosConstructor: Subscription;

  constructor(private sigaServices: SigaServices,private translateService: TranslateService) { }

  ngOnInit() {
    if(sessionStorage.getItem("consultasSearch")){
      this.consultaBuscador = JSON.parse(sessionStorage.getItem("consultasSearch"));
      //this.obtenerDatosConsulta(this.consultaBuscador.idConsulta);    
    }
  }

  //Necesario para liberar memoria
  ngOnDestroy() {
    if (this.subscriptionDatosConstructorConsulta)
      this.subscriptionDatosConstructorConsulta.unsubscribe();
  }
        
  createdControl(): void {
    if (Browser.isDevice) {
      this.constructorConsultas.summaryView = true;
    }
  }

  fieldChange(e: any): void {
    this.constructorConsultas.notifyChange(e.value, e.element, 'field');
  }

  operatorChange(e: any): void {
    this.constructorConsultas.getRule(e.event.target).operator = e.value;
  }

  valueChange(e: any): void {
    this.constructorConsultas.notifyChange(e.value, e.element, 'value');
  }

  //INICIO METODOS TARJETA CONSTRUCTOR DE CONSULTAS
  checkDatos(){
   console.log(this.constructorConsultas.getRules());
   this.guardarDatosConstructor(this.constructorConsultas.getRules());
  }

  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevaConsulta") == null) {
      this.openFicha = !this.openFicha;
    }
  }

  clear() {
    this.msgs = [];
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
  //Metodo para obtener los valores del combo Tipo segun el combo Categoria
  obtenerDatosConsulta(idConsulta) {
    this.progressSpinner = true;

    this.subscriptionDatosConstructorConsulta = this.sigaServices.getParam("constructorConsultas_obtenerDatosConsulta", "?idConsulta=" + idConsulta).subscribe(
      datosConstructorConsulta => {
        this.datosConstructorConsulta.constructorConsultasItem = datosConstructorConsulta.constructorConsultasItem;

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.datosConstructorConsulta.constructorConsultasItem.forEach((registro, index) => {

          this.importRules.condition = registro.conector;
/* 
          if(index <= 1){
            this.importRules.rules.push({
              'label': registro.campo,
              'field': registro.campo,
              'type': typeof registro.campo,
              'operator': registro.operador,
              'value': registro.valor
            })
          } */

          /* if(index > 1){
            if(this.datosConstructorConsulta.constructorConsultasItem[index].conector != this.datosConstructorConsulta.constructorConsultasItem[index - 1].conector){
              (Array) (this.importRules.rules[index]).push({
                'condition': registro.conector,
                'rules': [{
                  'label': registro.campo,
                  'field': registro.campo,
                  'type': typeof registro.campo,
                  'operator': registro.operador,
                  'value': registro.valor
                }]
              })
            }else{
              
            }
          } */
          this.importRules.rules.push({
            'label': registro.campo,
            'field': registro.campo,
            'type': typeof registro.campo,
            'operator': registro.operador,
            'value': registro.valor
          })
        });
        

        console.log(this.importRules.rules[0]);
        this.constructorConsultas.setRules(this.importRules);
        this.progressSpinner = false;
      }
    );
  }

  //Metodo para obtener los valores del combo Tipo segun el combo Categoria
  guardarDatosConstructor(datosConstructor) {
    this.progressSpinner = true;

    this.subscriptionGuardarDatosConstructor = this.sigaServices.post("constructorConsultas_guardarDatosConstructor", datosConstructor).subscribe(
      response => {
        /* if (JSON.parse(response.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        } */

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {}
    );
  } 
  //FIN SERVICIOS

}
