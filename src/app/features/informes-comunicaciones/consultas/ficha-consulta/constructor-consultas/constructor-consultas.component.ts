import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from "primeng/components/common/api";

//Imports constructor de consultas
import { RuleModel } from '@syncfusion/ej2-querybuilder';
import { Browser } from '@syncfusion/ej2-base';
import { QueryBuilderComponent } from '@syncfusion/ej2-angular-querybuilder';


@Component({
  selector: 'app-constructor-consultas',
  templateUrl: './constructor-consultas.component.html',
  styleUrls: ['./constructor-consultas.component.scss']
})
export class ConstructorConsultasComponent implements OnInit {
  @ViewChild('constructorConsultas') constructorConsultas: QueryBuilderComponent;

  msgs: Message[];
  openFicha: boolean = true;
  progressSpinner: Boolean = false;

  constructor() { }

  ngOnInit() {
  }

  

    dataSource: any = [{
      
    }];

    values: string[] = ['Mr.', 'Mrs.'];

    importRules: RuleModel = {
        //Inicializa los campos del querybuilder
        'condition': 'and', //Fija por defecto en el toggle and/or la opcion and
        'rules': [{
                'label': 'Employee ID',
                'field': 'EmployeeID',
                'type': 'number',
                'operator': 'equal',
                'value': 1
            },
            {
                'label': 'Title',
                'field': 'Title',
                'type': 'string',
                'operator': 'equal',
                'value': 'Sales Manager'
            }]
        };

        createdControl(): void {
          if (Browser.isDevice) {
              this.constructorConsultas.summaryView = true;
            }
        }


  //INICIO METODOS TARJETA CONSTRUCTOR DE CONSULTAS
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

  clear() {
    this.msgs = [];
  }
}
