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



@Component({
  selector: 'app-constructor-consultas',
  templateUrl: './constructor-consultas.component.html',
  styleUrls: ['./constructor-consultas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConstructorConsultasComponent implements OnInit {
  @ViewChild('constructorConsultas') constructorConsultas: QueryBuilderComponent;

  msgs: Message[];
  openFicha: boolean = true;
  progressSpinner: Boolean = false;

  consultaBuscador;
  datosConstructorConsulta: ConstructorConsultasDTO = new ConstructorConsultasDTO();

  //Suscripciones
  subscriptionDatosConstructorConsulta: Subscription;

  constructor(private sigaServices: SigaServices,private translateService: TranslateService) { }

  ngOnInit() {
    if(sessionStorage.getItem("consultasSearch")){
      this.consultaBuscador = JSON.parse(sessionStorage.getItem("consultasSearch"));
      this.obtenerDatosConsulta(this.consultaBuscador.idConsulta);
    }

    //IDIOMAS
   /*  L10n.load({
      'sigaIdiomas': {
          'querybuilder': {
              'AddGroup': "facturacion.servicios.fichaservicio.unicaformapagodomiciliacionbancariaconfirm",
              'AddCondition': 'Bedingung hinzufügen',
              'DeleteRule': 'Entfernen Sie diesen Zustand',
              'DeleteGroup': 'Gruppe löschen',
              'Edit': 'BEARBEITEN',
              'SelectField': 'Wählen Sie ein Feld aus',
              'SelectOperator': 'Operator auswählen',
              'StartsWith': 'Beginnt mit',
              'EndsWith': 'Endet mit',
              'Contains': 'Enthält',
              'Equal': 'Gleich',
              'NotEqual': 'Nicht gleich',
              'LessThan': 'Weniger als',
              'LessThanOrEqual': 'Weniger als oder gleich',
              'GreaterThan': 'Größer als',
              'GreaterThanOrEqual': 'Größer als oder gleich',
              'Between': 'Zwischen',
              'NotBetween': 'Nicht zwischen',
              'In': 'Im',
              'NotIn': 'Nicht in',
              'Remove': 'LÖSCHEN',
              'ValidationMessage': 'Dieses Feld wird benötigt',
          }
      }
    }); */
  }

    //Necesario para liberar memoria
    ngOnDestroy() {
      if (this.subscriptionDatosConstructorConsulta)
        this.subscriptionDatosConstructorConsulta.unsubscribe();
    }
  

    dataSource: any = this.datosConstructorConsulta.constructorConsultasItem;

    comboSiNo: string[] = ['Si', 'No'];
    comboEstadoCivil: String[] = ['Casado/a', 'Desconocido', 'Divorciado/a', 'Emparejado/a', 'Separado/a', 'Soltero/a', 'Unión de hecho', 'Viudo/a'];
    public items:  { [key: string]: Object}[] = [{field:'USA', label:'USA'},{field:'England', label:'England'},{field:'India',label:'India'},{field:'Spain',label:'Spain'}];
    public fields: Object = { text: 'field', value: 'label' };
    comboGrupoCliente: String[] = ['Provisional1', 'Provisional2'];
    comboSexo: String[] = ['HOMBRE', 'MUJER'];
    comboTipoColegiado: String[] = ['Provisional1', 'Provisional2'];
    comboTipoSeguro: String[] = ['Provisional1', 'Provisional2'];

    idEmpleado;

    //AQUI VAN LOS VALORES TAMBIEN?
   /*  importRules: RuleModel = {
        //Inicializa los campos del querybuilder
        'condition': 'and', //Fija por defecto en el toggle and/or la opcion and
        'rules': [{
                'label': 'Employee ID',
                'field': 'EmployeeID',
                'type': 'number',
                'operator': 'equal',
                'value': 1
            }]
        }; */

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
    console.log(this.constructorConsultas.getFilteredRecords());
  /*   console.log(this.constructorConsultas.getDataManagerQuery(this.importRules));
    console.log(this.constructorConsultas.getSqlFromRules(this.importRules)); */
    console.log(this.constructorConsultas.getValues('EmployeeID'));
    console.log(this.dataSource);
    console.log(this.idEmpleado);
    this.obtenerDatosConsulta(this.consultaBuscador.idconsulta);
  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

  clear() {
    this.msgs = [];
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
        this.progressSpinner = false;
      }
    );
  }

  //FIN SERVICIOS
}
