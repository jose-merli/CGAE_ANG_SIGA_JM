import { SelectItem, ConfirmationService } from "primeng/api";
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef
} from "@angular/core";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { SubtipoCurricularItem } from "../../../../models/SubtipoCurricularItem";
import { SubtipoCurricularObject } from "../../../../models/SubtipoCurricularObject";

@Component({
  selector: "app-subtipo-curricular",
  templateUrl: "./subtipo-curricular.component.html",
  styleUrls: ["./subtipo-curricular.component.scss"]
})
export class SubtipoCurricularComponent implements OnInit {
  body: SubtipoCurricularItem = new SubtipoCurricularItem();
  bodySearch: SubtipoCurricularObject = new SubtipoCurricularObject();

  categoriaCurricular: SelectItem[];
  selectedCategoriaCurricular: any;

  @ViewChild("input1")
  inputEl: ElementRef;
  @ViewChild("inputDesc")
  inputDesc: ElementRef;
  @ViewChild("inputCdgoExt")
  inputCdgoExt: ElementRef;

  @ViewChild("table")
  table;
  selectedDatos = [];
  cols: any = [];
  rowsPerPage: any = [];
  datos: any[];
  datosHist: any[];
  datosNuevos: any[];
  selectedItem: number = 10;
  numSelected: number = 0;
  selectMultiple: boolean = false;
  selectAll: boolean = false;

  msgs: any = [];

  showSubtipoCurricular: boolean = true;
  progressSpinner: boolean = false;
  buscar: boolean = false;
  nuevo: boolean = false;
  crear: boolean = false;
  editar: boolean = false;
  historico: boolean = false;
  blockCrear: boolean = true;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    // Llamada al rest para obtener la categoría curricular
    this.sigaServices.get("tipoCurricular_categoriaCurricular").subscribe(
      n => {
        this.categoriaCurricular = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.getRowPerPage();
  }

  getRowPerPage() {
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

  onHideSubtipoCV() {
    this.showSubtipoCurricular = !this.showSubtipoCurricular;
  }

  // Métodos
  search() {
    this.progressSpinner = true;
    this.buscar = true;
    this.nuevo = false;
    this.editar = false;
    this.historico = false;

    this.selectAll = false;
    this.selectMultiple = false;

    if (this.body.tipoCategoriaCurricular == undefined) {
      this.body.tipoCategoriaCurricular = "";
    }

    this.sigaServices
      .postPaginado(
        "subtipoCurricular_searchSubtipoCurricular",
        "?numPagina=1",
        this.body
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.bodySearch = JSON.parse(data["body"]);
          this.datos = this.bodySearch.subtipoCurricularItems;

          this.table.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
  }

  restore() {
    this.body.tipoCategoriaCurricular = "";
  }

  // Para la creación de un nuevo elemento
  newElement() {
    this.selectAll = false;
    this.selectMultiple = false;

    let nuevoDato = {
      codigoExterno: "",
      descripcion: ""
    };
    let value = this.table.first;
    this.nuevo = true;
    this.editar = false;
    this.buscar = false;

    // cambie datosNuevos por datos
    this.datosNuevos = [nuevoDato, ...this.datos];

    this.table.reset();
  }
}
