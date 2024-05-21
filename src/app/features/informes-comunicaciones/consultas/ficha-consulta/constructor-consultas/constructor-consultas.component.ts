import { Component, OnInit, ViewChild } from "@angular/core";
import { QueryBuilderComponent } from "@syncfusion/ej2-angular-querybuilder";
import { RuleModel } from "@syncfusion/ej2-querybuilder";
import { Message } from "primeng/primeng";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate";
import { ComboObject } from "../../../../../models/ComboObject";
import { ConfigColumnasQueryBuilderDTO } from "../../../../../models/ConfigColumnasQueryBuilderDTO";
import { ConstructorConsultasDTO } from "../../../../../models/ConstructorConsultasDTO";
import { QueryBuilderDTO } from "../../../../../models/QueryBuilderDTO";

@Component({
  selector: "app-constructor-consultas",
  templateUrl: "./constructor-consultas.component.html",
  styleUrls: ["./constructor-consultas.component.scss"],
})
export class ConstructorConsultasComponent implements OnInit {
  msgs: Message[];
  openFicha: boolean = false;
  progressSpinner: Boolean = false;
  consultaBuscador;
  datosConstructorConsulta: ConstructorConsultasDTO = new ConstructorConsultasDTO();
  configColumnasDTO: ConfigColumnasQueryBuilderDTO;
  comboDTOColumnaQueryBuilder: ComboObject = new ComboObject();
  listaCombosObject: Map<string, ComboObject> = new Map<string, ComboObject>();
  customOperators: any = [
    { value: "equal", key: this.translateService.instant("informesycomunicaciones.consultas.constructor.iguala") },
    { value: "notequal", key: this.translateService.instant("informesycomunicaciones.consultas.constructor.distinto") },
    { value: "lessthan", key: this.translateService.instant("informesycomunicaciones.consultas.constructor.menorque") },
    { value: "greaterthan", key: this.translateService.instant("informesycomunicaciones.consultas.constructor.mayorque") },
    { value: "lessthanorequal", key: this.translateService.instant("informesycomunicaciones.consultas.constructor.menorqueoigual") },
    { value: "greaterthanorequal", key: this.translateService.instant("informesycomunicaciones.consultas.constructor.mayorqueoigual") },
    { value: "startswith", key: this.translateService.instant("informesycomunicaciones.consultas.constructor.empiezacon") },
    { value: "endswith", key: this.translateService.instant("informesycomunicaciones.consultas.constructor.terminacon") },
    { value: "isnull", key: this.translateService.instant("informesycomunicaciones.consultas.constructor.isnull") },
  ];
  datosConst;
  importRules: RuleModel = {};

  @ViewChild("constructorConsultas") public constructorConsultas: QueryBuilderComponent;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService) {}

  ngOnInit() {
    this.obtenerConfigColumnas();
    if (sessionStorage.getItem("consultasSearch")) {
      this.consultaBuscador = JSON.parse(sessionStorage.getItem("consultasSearch"));
      this.obtenerDatosConsulta(this.consultaBuscador.idConsulta, this.consultaBuscador.idInstitucion);
    }
  }

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

  setRules(): void {
    if (this.constructorConsultas != undefined && this.datosConst != undefined) {
      this.constructorConsultas.setRulesFromSql(this.datosConst.consulta);
    }
    if (sessionStorage.getItem("constructorDeConsultasGuardado") == undefined && sessionStorage.getItem("copiaCambiosConstructor") != null) {
      this.constructorConsultas.setRulesFromSql(sessionStorage.getItem("copiaCambiosConstructor"));
    }
  }

  obtenerComboCampo(e: any) {
    this.configColumnasDTO.configColumnasQueryBuilderItem.forEach((campo) => {
      if (e.rule.label == campo.nombreenconsulta && campo.selectayuda != null) {
        this.obtenerCombosQueryBuilder(campo, e.rule.label);
      }
    });
  }

  private obtenerDatosConsulta(idConsulta, idInstitucion) {
    this.progressSpinner = true;

    this.sigaServices.getParam("constructorConsultas_obtenerDatosConsulta", "?idConsulta=" + idConsulta + "&idInstitucion=" + idInstitucion).subscribe(
      (datosConstructorConsulta) => {
        this.progressSpinner = false;
        this.datosConst = datosConstructorConsulta;
        if (this.constructorConsultas != undefined) {
          this.constructorConsultas.setRulesFromSql(this.datosConst.consulta);
        }
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  //Inicializa las propiedades necesarias para el dialogo de confirmacion
  private showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }

  private obtenerConfigColumnas() {
    this.progressSpinner = true;

    this.sigaServices.get("constructorConsultas_obtenerConfigColumnasQueryBuilder").subscribe(
      (configColumnasQueryBuilder) => {
        this.configColumnasDTO = configColumnasQueryBuilder;
        this.configColumnasDTO.configColumnasQueryBuilderItem.forEach((campos) => {
          campos.idcampo = "A" + campos.idcampo;
        });
      },
      () => {
        this.progressSpinner = false;
        if (sessionStorage.getItem("consultasSearch")) {
          this.configColumnasDTO.configColumnasQueryBuilderItem.forEach((campo) => {
            if (campo.selectayuda != null) {
              this.obtenerCombosQueryBuilder(campo, campo.nombreenconsulta);
            }
          });
        }
      },
    );
  }

  private obtenerCombosQueryBuilder(campo, nombreCampo) {
    this.progressSpinner = true;

    this.sigaServices.post("constructorConsultas_obtenerCombosQueryBuilder", campo).subscribe(
      (comboDTO) => {
        this.comboDTOColumnaQueryBuilder = JSON.parse(comboDTO.body);
        this.listaCombosObject.set(nombreCampo, this.comboDTOColumnaQueryBuilder);
        this.progressSpinner = false;
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  private guardarDatosConstructor() {
    this.progressSpinner = true;

    let queryBuilderDTO: QueryBuilderDTO = new QueryBuilderDTO();
    queryBuilderDTO.consulta = this.constructorConsultas.getSqlFromRules(this.constructorConsultas.getRules());
    if (this.consultaBuscador == undefined && sessionStorage.getItem("consultasSearch") != null) {
      this.consultaBuscador = JSON.parse(sessionStorage.getItem("consultasSearch"));
    }
    queryBuilderDTO.idconsulta = this.consultaBuscador.idConsulta;
    queryBuilderDTO.idinstitucion = this.consultaBuscador.idInstitucion;

    this.sigaServices.post("constructorConsultas_guardarDatosConstructor", queryBuilderDTO).subscribe(
      (response) => {
        this.progressSpinner = false;
        let result = JSON.parse(response.body);
        if (response.status == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          sessionStorage.setItem("constructorDeConsultasGuardado", "true");
          sessionStorage.setItem("nuevaSentencia", result.sentencia);
        }
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }
}
