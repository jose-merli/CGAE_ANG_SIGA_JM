import { Component, ChangeDetectorRef, ViewChild } from "@angular/core";
import { SigaServices } from "../../../_services/siga.service";
import { DatosGeneralesItem } from "../../../../app/models/DatosGeneralesItem";
import { DatosGeneralesObject } from "../../../../app/models/DatosGeneralesObject";
import { Message } from "primeng/components/common/api";
import { TranslateService } from "../../../commons/translate/translation.service";
import { MultiSelect, Dropdown } from "primeng/primeng";

@Component({
  selector: "app-solicitudes-incorporacion",
  templateUrl: "./solicitudes-incorporacion.component.html",
  styleUrls: ["./solicitudes-incorporacion.component.scss"]
})
export class SolicitudesIncorporacionComponent {
  url;
  values: string[] = [];
  comboEtiquetas: any[];
  mostrarComboEtiquetas: any[];
  etiquetasSeleccionadas: string[] = [];
  idPersona: string;
  body: DatosGeneralesItem = new DatosGeneralesItem();
  bodySearch: DatosGeneralesObject = new DatosGeneralesObject();

  textFilter: String = "Elegir";
  textSelected: String = "{0} etiquetas seleccionados";

  showDatos: boolean = false;
  listar: boolean;
  display: boolean = false;
  progressSpinner: boolean = false;

  msgs: Message[];

  initialDate: Date;
  finalDate: Date;

  pButton;

  checked: boolean = false;
  crear: boolean = false;
  aceptar: boolean = false;

  @ViewChild("ms") multiSelect: MultiSelect;

  constructor(
    public sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.showDatos = true;

    this.body.idPersona = "2000043724";
    this.body.idInstitucion = "2000";

    if (this.body.idPersona != undefined || this.body.idPersona != null) {
      this.obtenerEtiquetasConcretas();
    }
  }

  onHideDatos() {
    this.showDatos = !this.showDatos;
    // Ocultamos el botón guardar
    this.listar = false;
  }

  obtenerEtiquetasConcretas() {
    this.sigaServices
      .post("busquedaPerJuridica_etiquetasPersona", this.body)
      .subscribe(
        n => {
          // coger etiquetas de una persona
          this.comboEtiquetas = JSON.parse(n["body"]).combooItems;

          this.comboEtiquetas.forEach((value: any, index: number) => {
            console.log("value", value);
            this.etiquetasSeleccionadas.push(value.value);
          });
        },
        err => {
          console.log(err);
        }
      );
  }

  obtenerEtiquetas() {
    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {
        // coger todas las etiquetas
        this.mostrarComboEtiquetas = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  condicionItemChips(item) {
    if (item.value % 2 === 0) {
      if (item.label.length == 2) {
        return "colorRojo";
      } else {
        return "colorVerde";
      }
    } else {
      return "colorAmarillo";
    }
  }

  condicionDisabledButton() {
    return this.comboEtiquetas == undefined ||
      this.comboEtiquetas == null ||
      this.comboEtiquetas.length == 0
      ? true
      : false;
  }

  mostrarChips(event) {
    if (event) {
      this.listar = true;
      this.obtenerEtiquetas();
    } else {
      this.listar = false;
    }
  }

  abrirDialogo() {
    this.display = true;
  }

  guardarEtiquetas() {
    // llamada al rest correspondiente --> tal cómo está comentado
    this.sigaServices.post("busquedaPerJuridica_update", this.body).subscribe(
      data => {
        this.progressSpinner = false;
        //this.bodySearch = JSON.parse(data["body"]);

        this.showSuccess("Se han guardado correctamente los datos");

        this.display = false;
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(JSON.stringify(this.bodySearch.error.description));
        console.log(error);

        this.progressSpinner = false;
      },
      () => {
        // Limpiamos los datos del popup
        this.initialDate = null;
        this.finalDate = null;

        // Recargamos el combo
        this.obtenerEtiquetasConcretas();
      }
    );
  }

  showFail(mensaje: string) {
    this.clear();
    this.msgs.push({
      severity: "error",
      summary: "",
      detail: this.translateService.instant(mensaje)
    });
  }

  showSuccess(mensaje: string) {
    this.clear();
    this.msgs.push({
      severity: "success",
      summary: "",
      detail: this.translateService.instant(mensaje)
    });
  }

  clear() {
    this.msgs = [];
  }

  onFilter(event) {
    return event && this.multiSelect.visibleOptions.length == 0
      ? (this.multiSelect.visibleOptions.push({ value: 0, label: "hola" }),
        (this.checked = true))
      : (this.checked = false);
  }

  guardarNuevaEtiqueta() {
    this.checked = false;
    this.crear = true;
  }

  closeDialogConfirmacion() {
    this.checked = false;
    this.multiSelect.filterValue = null;
    this.multiSelect.filterInputChild.nativeElement.value = null;
  }

  closeDialogoCreacionEtiqueta() {
    this.crear = false;
    this.multiSelect.filterValue = null;
    this.multiSelect.filterInputChild.nativeElement.value = null;
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }
}
