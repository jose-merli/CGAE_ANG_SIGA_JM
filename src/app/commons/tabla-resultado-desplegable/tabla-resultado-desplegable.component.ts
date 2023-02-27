import { DatePipe } from '@angular/common';
import { ElementRef, Renderer2, Output, EventEmitter, SimpleChange, ViewRef, KeyValueDiffers, ViewChildren, QueryList } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { Actuacion } from '../../features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/detalle-tarjeta-actuaciones-designa.component';
import { ParametroDto } from '../../models/ParametroDto';
import { ParametroRequestDto } from '../../models/ParametroRequestDto';
import { ActuacionDesignaItem } from '../../models/sjcs/ActuacionDesignaItem';
import { DesignaItem } from '../../models/sjcs/DesignaItem';
import { JusticiableBusquedaItem } from '../../models/sjcs/JusticiableBusquedaItem';
import { CommonsService } from '../../_services/commons.service';
import { SigaServices } from '../../_services/siga.service';
import { TranslateService } from '../translate';
import { Cell, Row, RowGroup } from './tabla-resultado-desplegable-je.service';
import { PersistenceService } from '../../_services/persistence.service';
import { FiltroAsistenciaItem } from '../../models/guardia/FiltroAsistenciaItem';
import { EJGItem } from '../../models/sjcs/EJGItem';
@Component({
  selector: 'app-tabla-resultado-desplegable',
  templateUrl: './tabla-resultado-desplegable.component.html',
  styleUrls: ['./tabla-resultado-desplegable.component.scss']
})
export class TablaResultadoDesplegableComponent implements OnInit {
  @ViewChild("table") table;
  @ViewChildren("rowGroupEl") rowGroupEl?: QueryList<ElementRef>;
  @ViewChild("iconrightEl") iconrightEl;
  @ViewChild("icondownEl") icondownEl;
  info = new FormControl();
  @Input() cabeceras = [];
  @Input() rowGroups: RowGroup[];
  @Input() rowGroupsAux: RowGroup[];
  @Input() seleccionarTodo = false;
  @Input() pantalla: string = '';
  @Input() s = false;
  @Input() colegiado;
  @Input() isLetrado;
  @Input() permisosFichaAct;
  @Input() permisosEJG;
  @Input() fechaFiltro;
  @Input() filtroAsistencia: FiltroAsistenciaItem;
  turnoAllow;  //to do
  justActivarDesigLetrado;
  activarSubidaJustDesig;
  lastChangePadre;
  lastChangeHijo;
  lastChange = "";
  permisoProcedimiento: boolean = true;
  textoComActivo: string = '[Com] / Juz';
  textoJuzActivo: string = 'Com / [Juz]';
  sumar = false;
  @Output() anySelected = new EventEmitter<any>();
  @Output() designasToDelete = new EventEmitter<any[]>();
  @Output() actuacionesToDelete = new EventEmitter<any[]>();
  @Output() actuacionesToAdd = new EventEmitter<Row[]>();
  @Output() dataToUpdate = new EventEmitter<RowGroup[]>();
  @Output() totalActuaciones = new EventEmitter<Number>();
  @Output() numDesignasModificadas = new EventEmitter<any>();
  @Output() numActuacionesModificadas = new EventEmitter<any>();
  @Output() refreshData = new EventEmitter<boolean>();
  msgs: Message[] = [];
  cabecerasMultiselect = [];
  modalStateDisplay = true;
  searchText = [];
  selectedHeader = [];
  positionsToDelete = [];
  numColumnasChecked = 0;
  selected = false;
  currentRoute: String;
  selectedArray = [];
  selecteChild = [];
  RGid = "inicial";
  down = false;
  itemsaOcultar = [];
  textSelected: string = "{0} visibles";
  columnsSizes = [];
  tamanioTablaResultados = 0;
  childNumber = 0;
  newActuacionesArr: Row[] = [];
  rowIdsToUpdate = [];
  indicesToUpdate: [string, string][] = [];
  numperPage = 10;
  from = 0;
  to = 10;
  fromRowGroup = 0;
  toRowGroup = 9;
  totalRegistros = 0;
  disableDelete = true;
  todoDesplegado = false;
  idTurno = "";
  rowIdWithNewActuacion = "";
  //@Input() comboAcreditacionesPorModulo: any [];
  @Output() cargaModulosPorJuzgado2 = new EventEmitter<String>();
  @Output() cargaAllModulos = new EventEmitter<boolean>();
  @Output() cargaAcreditacionesPorModulo2 = new EventEmitter<String[]>();
  //@Output() cargaJuzgados = new EventEmitter<boolean>();
  progressSpinner: boolean = false;
  rowValidadas = [];
  @Input() comboJuzgados = [];
  @Input() comboModulos = [];
  @Input() comboAcreditacion = [];
  comboTipoDesigna = [];
  dataToUpdateArr: RowGroup[] = [];
  rowGroupWithNew = "";
  valorParametro: AnalyserNode;
  datosBuscar: any[];
  searchParametros: ParametroDto = new ParametroDto();
  configComboDesigna;
  permisoEscritura;
  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];
  numCell: number;
  constructor(
    private renderer: Renderer2,
    private datepipe: DatePipe,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private router: Router,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService

  ) {


    this.renderer.listen('window', 'click', (event: { target: HTMLInputElement; }) => {
      for (let i = 0; i < this.table.nativeElement.children.length; i++) {

        if (!event.target.classList.contains("selectedRowClass")) {
          // this.selected = false;
          // this.selectedArray = [];
          // this.selecteChild = [];
        }
      }
    });
  }

  ngOnInit(): void {
    this.currentRoute = "/justificacionExpres";
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    if (this.pantalla == 'JE') {
      this.fromRowGroup = 0;
      this.toRowGroup = 9;
      this.numCell = 2;
      this.rowIdsToUpdate = []; //limpiamos
      this.dataToUpdateArr = []; //limpiamos
      this.newActuacionesArr = []; //limpiamos
      this.rowValidadas = [];
      sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
      this.getParams("JUSTIFICACION_EDITAR_DESIGNA_LETRADOS");
      this.getConfComboDesigna();


      //this.cargaJuzgados.emit(false);
      if (this.comboModulos != undefined && this.comboModulos.length > 0) {
        this.searchNuevo(this.comboModulos, []);
      }

      if (this.comboModulos != undefined && this.comboModulos.length > 0 && this.comboAcreditacion !== undefined && this.comboAcreditacion.length > 0) {
        this.searchNuevo(this.comboModulos, this.comboAcreditacion);
      }
    } else if (this.pantalla == 'AE') {
      this.fromRowGroup = 0;
      this.toRowGroup = 6;
      this.numCell = 0;
    }
    this.cabeceras.forEach(cab => {
      this.selectedHeader.push(cab);
      this.cabecerasMultiselect.push(cab.name);
    });
    if (this.rowGroups != undefined) {
      this.totalRegistros = this.rowGroups.length;
    } else {
      this.totalRegistros = 0;
    }

    this.selected = false;
    this.selectedArray = [];
    this.selecteChild = [];
  }

  selectRow(rowSelected, rowId, child) {
    // Disabled de Módulo.
    let filaSeleccionada = this.rowGroups.filter(row => row.id == rowId);
    if (filaSeleccionada.length > 0 && filaSeleccionada[0].rows != undefined) {
      if (filaSeleccionada[0].rows[0].cells[4].value === "") {
        this.permisoProcedimiento = true;
      } else {
        this.permisoProcedimiento = false;
      }
    }

    if (child == undefined) {
      this.disableDelete = true;
    } else {
      this.disableDelete = false;
    }
    this.selected = true;
    if (child != undefined) {
      if (this.selecteChild.includes({ [rowId]: child })) {
        const i = this.selecteChild.indexOf({ [rowId]: child });
        this.selecteChild.splice(i, 1);
      } else {
        this.selecteChild.push({ [rowId]: child });
      }
      if (this.selecteChild.length != 0) {
        this.anySelected.emit(true);
      } else {
        this.anySelected.emit(false);
      }
    }
    if (this.selectedArray.includes(rowId)) {
      const i = this.selectedArray.indexOf(rowId);
      this.selectedArray.splice(i, 1);
    } else {
      this.selectedArray.push(rowId);
    }
    if (this.selectedArray.length != 0) {
      this.anySelected.emit(true);
      this.disableDelete = false;
    } else {
      this.anySelected.emit(false);
      this.disableDelete = true;
    }
  }
  isSelected(id) {
    if (this.selectedArray.includes(id)) {
      return true;
    } else {
      return false;
    }
  }
  sortData(sort: Sort) {
    let data: RowGroup[] = [];
    this.rowGroups = this.rowGroupsAux.filter((row) => {
      data.push(row);
    });
    data = data.slice();
    if (!sort.active || sort.direction === '') {
      this.rowGroups = data;
      return;
    }
    if (sort.active == "anio") {
      this.rowGroups = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        let resultado;
        resultado = compare(a.id, b.id, isAsc);
        return resultado;
      });
    } else if (this.pantalla == 'JE' && sort.active == "ejgs") {
      this.rowGroups = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        let resultado;
        resultado = compare(a.id2, b.id2, isAsc);
        return resultado;
      });
    } else if (this.pantalla == 'JE' && sort.active == "clientes") {
      this.rowGroups = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        let resultado;
        resultado = compare(a.id3, b.id3, isAsc);
        return resultado;
      });
    } else {
      let j = 0;
      this.rowGroups = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        let resultado;
        let arr = [];

        if (a.rows.length - 1 < j) {
          arr = b.rows;
        } else {
          arr = a.rows;
        }
        if (j <= a.rows.length - 1 && j <= b.rows.length - 1) {
          for (let i = 0; i < arr[j].cells.length; i++) {
            resultado = compare(a.rows[j].cells[i].value, b.rows[j].cells[i].value, isAsc);
          }
          j++;
          return resultado;
        }
      });
      this.rowGroupsAux = this.rowGroups;
    }
    this.totalRegistros = this.rowGroups.length;
  }
  getPosition(selectedHeaders) {
    this.positionsToDelete = [];
    if (selectedHeaders != undefined) {
      let i = -1;
      this.cabeceras.forEach(cabecera => {
        selectedHeaders.forEach(selected => {

          if (selectedHeaders != undefined && selected != undefined && selected.id != undefined && selected.id.toString().toLowerCase().includes(cabecera.id.toString().toLowerCase())) {
            this.positionsToDelete.push(i);
          }
        })
        i++;
      })
    }
    let mySet = new Set(this.positionsToDelete);
    return this.positionsToDelete;
  }

  cabeceraOculta(selectedHeaders, cabecera) {
    let pos;
    let ocultar = false;
    if (selectedHeaders != "" && selectedHeaders != undefined && selectedHeaders != null && selectedHeaders.length > 0) {
      selectedHeaders.forEach(selectedHeader => {
        if (selectedHeader != undefined && selectedHeader.id != undefined && selectedHeader.id.toString().toLowerCase().includes(cabecera.toLowerCase())) {
          ocultar = true;
        }
      });

    }
    pos = this.getPosition(selectedHeaders);
    this.totalRegistros = this.rowGroups.length;
    return ocultar;
  }
  posicionOcultar(z) {
    if (this.positionsToDelete != undefined && this.positionsToDelete.length > 0) {
      return this.positionsToDelete.includes(z);
    } else {
      return false;
    }

  }
  iconClickChange(iconrightEl, iconDownEl) {
    this.renderer.addClass(iconrightEl, 'collapse');
    this.renderer.removeClass(iconDownEl, 'collapse');
  }
  iconClickChange2(iconrightEl, iconDownEl) {
    this.renderer.removeClass(iconrightEl, 'collapse');
    this.renderer.addClass(iconDownEl, 'collapse');

  }
  rowGroupArrowClick(rowWrapper, rowGroupId, uncollapse?: boolean) {
    this.down = !this.down
    this.RGid = rowGroupId;
    const toggle = rowWrapper;
    if (rowWrapper.children != undefined) {
      for (let i = 0; i < rowWrapper.children.length; i++) {
        if (rowWrapper.children[i].className.includes('child')) {
          this.modalStateDisplay = false;
          if (uncollapse === undefined) {
            rowWrapper.children[i].className.includes('collapse')
              ? this.renderer.removeClass(
                rowWrapper.children[i],
                'collapse'
              )
              : this.renderer.addClass(
                rowWrapper.children[i],
                'collapse'
              );
          } else if (rowWrapper.children[i].className.includes('collapse')) {
            this.renderer.removeClass(
              rowWrapper.children[i],
              'collapse'
            )
          }
        } else {
          this.modalStateDisplay = true;
        }
      }
    }

    // Muesta o oculta las actuaciones de cada designación
    let rowGroup = this.rowGroups.find(rowGroup => rowGroup.id == rowGroupId);
    if (rowGroup != undefined) {
      rowGroup.rows.forEach(row => {
        row.position = row.position != 'collapse' ? 'collapse' : 'noCollapse';
      });
    }

    this.selectedArray.length = 0;
    this.anySelected.emit(false);
  }
  searchChange(j: any) {
    if (this.pantalla == 'AE') {
      let isReturn = true;
      let sT;
      let isReturnArr = [];
      this.rowGroups = this.rowGroupsAux.filter((row) => {
        isReturnArr = [];

        for (let r = 0; r < row.rows.length; r++) {
          for (let i = 0; i < row.rows[r].cells.length; i++) {
            if (row.rows[r].cells[i].value != null && i <= 8) {

              //this.searchText.forEach(sT => {
              if ((i == 8 || i == 0) && (this.searchText[i + 3] == 's' || this.searchText[i + 3] == 'si')) {
                sT = 'true';
              } else if ((i == 8 || i == 0) && (this.searchText[i + 3] == 'n' || this.searchText[i + 3] == 'no')) {
                sT = 'false';
              } else {
                sT = this.searchText[i + 3];
              }
              if (
                (i == 0 && this.searchText[i] != undefined && !row.id.toLowerCase().includes(this.searchText[0].toLowerCase())) ||
                (i == 1 && this.searchText[i] != undefined && !row.id2.toLowerCase().includes(this.searchText[1].toLowerCase())) ||
                (i == 2 && this.searchText[i] != undefined && !row.id3.toLowerCase().includes(this.searchText[2].toLowerCase())) ||

                (sT != " " &&
                  sT != undefined &&
                  sT != null &&
                  !row.rows[0].cells[i].value.toString().toLowerCase().includes(sT.toLowerCase()))
              ) {
                isReturn = false;
              } else {
                isReturn = true;
              }
              //});
              isReturnArr.push(isReturn);
            }
          }
          if (!isReturnArr.includes(false)) {
            return row;
          }
        }

      });
    } else if (this.pantalla == 'JE') {
      this.rowGroups = this.rowGroupsAux.filter(rowGroup => {
        let isReturn = true;

        for (let j = 0; j < this.searchText.length && isReturn; j++) {
          if (this.searchText[j] == undefined || this.searchText[j].trim().length == 0) continue;

          if (this.cabeceras[j].id == "finalizado" && ["s", "si", "sí", "1"].includes(this.searchText[j].toLowerCase().trim())) {
            isReturn = rowGroup.rows[0].cells[0].type == 'checkboxPermisos' && Array.isArray(rowGroup.rows[0].cells[0].value) && rowGroup.rows[0].cells[0].value[0];
          } else if (this.cabeceras[j].id == "finalizado" && ["n", "no", "0"].includes(this.searchText[j].toLowerCase().trim())) {
            isReturn = rowGroup.rows[0].cells[0].type == 'checkboxPermisos' && Array.isArray(rowGroup.rows[0].cells[0].value) && !rowGroup.rows[0].cells[0].value[0];
          }

          if (this.cabeceras[j].id == "validar" && ["s", "si", "sí", "1"].includes(this.searchText[j].toLowerCase().trim())) {
            isReturn = rowGroup.rows.some(row => row.cells[8].type == 'checkbox' && row.cells[8].value);
          } else if (this.cabeceras[j].id == "validar" && ["n", "no", "0"].includes(this.searchText[j].toLowerCase().trim())) {
            isReturn = rowGroup.rows.some(row => row.cells[8].type == 'checkbox' && !row.cells[8].value);
          }

          if (["actuacion", "justificacion", "acreditacion"].includes(this.cabeceras[j].id)) {
            if (this.cabeceras[j].id == "actuacion") {
              isReturn = rowGroup.rows.some(row => (row.cells[5].type == 'text' || row.cells[5].type == 'datePicker') && row.cells[5].value.includes(this.searchText[j].trim()));
            } else if (this.cabeceras[j].id == "justificacion") {
              isReturn = rowGroup.rows.some(row => (row.cells[6].type == 'text' || row.cells[6].type == 'datePicker') && row.cells[6].value.includes(this.searchText[j].trim()));
            } else if (this.cabeceras[j].id == "acreditacion") {
              isReturn = rowGroup.rows.some(row => (row.cells[7].type == 'text' || row.cells[7].type == 'link') && row.cells[7].value.toLowerCase().includes(this.searchText[j].toLowerCase().trim()));
            }
          }

          if (["nig", "nproced"].includes(this.cabeceras[j].id)) {
            if (this.cabeceras[j].id == "nig") {
              isReturn = rowGroup.rows.some(row => (row.cells[2].type == 'text' || row.cells[2].type == 'input') && row.cells[2].value.toLowerCase().includes(this.searchText[j].toLowerCase().trim()));
            } else if (this.cabeceras[j].id == "nproced") {
              isReturn = rowGroup.rows.some(row => (row.cells[3].type == 'text' || row.cells[3].type == 'input') && row.cells[3].value.toLowerCase().includes(this.searchText[j].toLowerCase().trim()));
            }
          }

          if (["juzgado", "modulo"].includes(this.cabeceras[j].id)) {
            if (this.cabeceras[j].id == "juzgado") {
              isReturn = rowGroup.rows.some(row => row.cells[1].type == 'tooltip' && (row.cells[1].value.toLowerCase().includes(this.searchText[j].toLowerCase().trim()) || (row.cells[1].combo as any).toLowerCase().includes(this.searchText[j].toLowerCase().trim())));
            } else if (this.cabeceras[j].id == "modulo") {
              isReturn = rowGroup.rows.some(row => row.cells[4].type == 'tooltip' && (row.cells[4].value.toLowerCase().includes(this.searchText[j].toLowerCase().trim()) || (row.cells[4].combo as any).toLowerCase().includes(this.searchText[j].toLowerCase().trim())));
            }

            if (!isReturn && this.cabeceras[j].id == "juzgado") {
              isReturn = rowGroup.rows.some(row => {
                if (row.cells[1].type == 'select' && row.cells[1].combo != undefined) {
                  let item = row.cells[1].combo.find(e => e.value == row.cells[1].value);
                  if (item != undefined && item.label != undefined) {
                    return item.label.toLowerCase().includes(this.searchText[j].toLowerCase().trim());
                  }
                }

                return false;
              });
            } else if (!isReturn && this.cabeceras[j].id == "modulo") {
              isReturn = rowGroup.rows.some(row => {
                if (row.cells[1].type == 'select' && row.cells[1].combo != undefined) {
                  let item = row.cells[1].combo.find(e => e.value == row.cells[1].value);
                  if (item != undefined && item.label != undefined) {
                    return item.label.toLowerCase().includes(this.searchText[j].toLowerCase().trim());
                  }
                }

                return false;
              });
            }
          }

          if (["anio", "ejgs", "clientes",].includes(this.cabeceras[j].id)) {
            if (this.cabeceras[j].id == "anio") {
              isReturn = rowGroup.id.toLowerCase().includes(this.searchText[j].toLowerCase().trim());
            } else if (this.cabeceras[j].id == "ejgs") {
              isReturn = rowGroup.id2.toLowerCase().includes(this.searchText[j].toLowerCase().trim());
            } else if (this.cabeceras[j].id == "clientes") {
              isReturn = rowGroup.id3.toLowerCase().includes(this.searchText[j].toLowerCase().trim());
            }
          }
        }

        return isReturn;
      });

      this.rowGroups.forEach(rowGroup => {
        rowGroup.rows = rowGroup.rows.filter((row, rowIndex) => {
          let isReturn = true;

          for (let j = 0; j < this.searchText.length && isReturn; j++) {
            if (this.searchText[j] == undefined || this.searchText[j].trim().length == 0) continue;

            if (this.cabeceras[j].id == "validar" && ["s", "si", "sí", "1"].includes(this.searchText[j].toLowerCase().trim())) {
              isReturn = row.cells[8].type == 'checkbox' && row.cells[8].value;
            } else if (this.cabeceras[j].id == "validar" && ["n", "no", "0"].includes(this.searchText[j].toLowerCase().trim())) {
              isReturn = row.cells[8].type == 'checkbox' && !row.cells[8].value;
            }

            if (["actuacion", "justificacion", "acreditacion"].includes(this.cabeceras[j].id)) {
              if (this.cabeceras[j].id == "actuacion") {
                isReturn = (row.cells[5].type == 'text' || row.cells[5].type == 'datePicker') && row.cells[5].value.includes(this.searchText[j].trim());
              } else if (this.cabeceras[j].id == "justificacion") {
                isReturn = (row.cells[6].type == 'text' || row.cells[6].type == 'datePicker') && row.cells[6].value.includes(this.searchText[j].trim());
              } else if (this.cabeceras[j].id == "acreditacion") {
                isReturn = (row.cells[7].type == 'text' || row.cells[7].type == 'link') && row.cells[7].value.toLowerCase().includes(this.searchText[j].toLowerCase().trim());
              }
            }

            if (["nig", "nproced"].includes(this.cabeceras[j].id)) {
              if (this.cabeceras[j].id == "nig") {
                isReturn = (row.cells[2].type == 'text' || row.cells[2].type == 'input') && row.cells[2].value.toLowerCase().includes(this.searchText[j].toLowerCase().trim());
              } else if (this.cabeceras[j].id == "nproced") {
                isReturn = (row.cells[3].type == 'text' || row.cells[3].type == 'input') && row.cells[3].value.toLowerCase().includes(this.searchText[j].toLowerCase().trim());
              }
            }

            if (["juzgado", "modulo"].includes(this.cabeceras[j].id)) {
              if (this.cabeceras[j].id == "juzgado") {
                isReturn = row.cells[1].type == 'tooltip' && (row.cells[1].value.toLowerCase().includes(this.searchText[j].toLowerCase().trim()) || (row.cells[1].combo as any).toLowerCase().includes(this.searchText[j].toLowerCase().trim()));
              } else if (this.cabeceras[j].id == "modulo") {
                isReturn = row.cells[4].type == 'tooltip' && (row.cells[4].value.toLowerCase().includes(this.searchText[j].toLowerCase().trim()) || (row.cells[4].combo as any).toLowerCase().includes(this.searchText[j].toLowerCase().trim()));
              }

              if (!isReturn && this.cabeceras[j].id == "juzgado") {
                if (row.cells[1].type == 'select' && row.cells[1].combo != undefined) {
                  let item = row.cells[1].combo.find(e => e.value == row.cells[1].value);
                  if (item != undefined && item.label != undefined) {
                    isReturn = item.label.toLowerCase().includes(this.searchText[j].toLowerCase().trim());
                  } else {
                    isReturn = false;
                  }
                } else {
                  isReturn = false;
                }
              } else if (!isReturn && this.cabeceras[j].id == "modulo") {
                if (row.cells[4].type == 'select' && row.cells[4].combo != undefined) {
                  let item = row.cells[4].combo.find(e => e.value == row.cells[4].value);
                  if (item != undefined && item.label != undefined) {
                    isReturn = item.label.toLowerCase().includes(this.searchText[j].toLowerCase().trim());
                  } else {
                    isReturn = false;
                  }
                } else {
                  isReturn = false;
                }
              }
            }
          }

          if (rowIndex == 0 || Array.isArray(row.cells[0].value) && row.cells[0].value[1] == 'Nuevo') {
            return true;
          }

          return isReturn;
        });
      });
    }
    //let self = this;
    /*setTimeout(function () {
      self.setTamanios();
      self.setTamanioPrimerRegistroGrupo();
    }, 1);*/
    this.totalRegistros = this.rowGroups.length;

  }

  isPar(numero): boolean {
    return numero % 2 === 0;
  }

  validaCheck(texto) {
    return texto === 'Si';
  }
  fillFechaAsist(event, cell, rowId, row, rowGroup, padre, index) {
    cell.value = event;
    this.rowIdsToUpdate.push(rowId);
    if (rowGroup.rows[1].cells[3].type == 'datePickerAct') {
      rowGroup.rows[1].cells[3].value = event;
    }
  }
  fillFecha(event, cell, rowId, row, rowGroup, padre, index) {

    this.rowValidadas = [];
    if (row == undefined) {
      //designacion
      if (this.isLetrado) {
        if (this.justActivarDesigLetrado != "1") {
          this.showMsg('error', "No tiene permiso para actualizar designaciones", '')
          this.rowGroups = this.rowGroupsAux;
          this.refreshData.emit(true);
        } else {
          cell.value = this.datepipe.transform(event, 'dd/MM/yyyy');
          if (this.rowIdsToUpdate.indexOf(rowId) == -1) {
            this.rowIdsToUpdate.push(rowId);
          }
        }
      } else if (this.pantalla == 'JE') {
        cell.value = this.datepipe.transform(event, 'dd/MM/yyyy');
        if (!this.indicesToUpdate.some(d => d[0] == rowId && d[1] == index)) {
          this.indicesToUpdate.push([rowId, index]);
        }
      } else {
        cell.value = event;
        this.rowIdsToUpdate.push(rowId);
      }
    } else if (this.pantalla == 'JE') {
      //actuacion
      this.turnoAllow = rowGroup.rows[0].cells[39].value;
      if ((this.isLetrado && (this.turnoAllow != "1" || this.turnoAllow == "1" && row.cells[8].value != true)) || (!this.isLetrado)) {
        if (row.cells[8].value != true) {
          cell.value = this.datepipe.transform(event, 'dd/MM/yyyy');
          if (!this.indicesToUpdate.some(d => d[0] == rowId && d[1] == index)) {
            this.indicesToUpdate.push([rowId, index]);

            if ((row.cells[0].value[1] == undefined || row.cells[0].value[1].length == 0) && row.cells[6].value != undefined) {
              this.newActuacionesArr.push(row);
            }

            this.rowIdsToUpdate.push(rowId);
          }

        } else {
          this.rowValidadas.push(row);
          this.showMsg('error', "No se pueden actualizar actuaciones validadas", '')
          this.refreshData.emit(true);
        }
      } else {
        this.showMsg('error', "No tiene permiso para actualizar datos de una actuación", '')
        this.refreshData.emit(true);
      }
    } else {
      cell.value = event;
      this.rowIdsToUpdate.push(rowId);
    }

    this.numDesignasModificadas.emit(this.rowIdsToUpdate.length);
    this.numActuacionesModificadas.emit(this.indicesToUpdate.length);

    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
    this.lastChange = "fillFecha";
  }

  checkBoxDateChange(event, rowId, cell, row, rowGroup, padre, index) {
    this.rowValidadas = [];
    if (row == undefined) {
      //designacion
      if (this.isLetrado) {
        if (this.isLetrado) {
          if (this.justActivarDesigLetrado != "1") {
            this.showMsg('error', "No tiene permiso para actualizar designaciones", '')
          } else {
            if (this.rowIdsToUpdate.indexOf(rowId) == -1) {
              this.rowIdsToUpdate.push(rowId);
            }
            if (cell != undefined) {
              cell.value[0] = event;
            }
          }
        } else {
          if (this.rowIdsToUpdate.indexOf(rowId) == -1) {
            this.rowIdsToUpdate.push(rowId);
          }
          if (cell != undefined) {
            cell.value[0] = event;
          }
        }
      } else {
        if (this.sumar) {
          this.rowIdsToUpdate.push(rowId);
        } else {
          this.rowIdsToUpdate = []; //limpiamos
        }
        if (cell != undefined) {
          if (event == true) {
            /*Aquellas actuaciones sin fecha de justificación activando el check de las actuaciones se aplicará como fecha de justificación la fecha cumplimentada en el componente de acciones generales del listado*/
            cell.value = this.fechaFiltro;
          }
        }
      }
    } else {
      //actuacion
      this.turnoAllow = rowGroup.rows[0].cells[39].value;
      const newAllow = rowGroup.rows[0].cells[40].value;
      if ((this.isLetrado && row.cells[8].value != true && newAllow == "1") || (!this.isLetrado)) {
        if (row.cells[8].value != true) {
          if (row.cells[0].value[1] != undefined && row.cells[0].value[1].length != 0 && !this.indicesToUpdate.some(d => d[0] == rowId && d[1] == index)) {
            this.indicesToUpdate.push([rowId, index]);
          }
        } else {
          this.rowValidadas.push(row);
          row.cells[8].value = false;
        }
      } else {
        this.showMsg('error', "No tiene permiso para actualizar datos de una actuación", '')
        this.refreshData.emit(true);
      }
    }

    this.numDesignasModificadas.emit(this.rowIdsToUpdate.length);
    this.numActuacionesModificadas.emit(this.indicesToUpdate.length);

    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
    this.lastChange = "checkBoxDateChange";
  }
  checkBoxChange(event, rowId, cell, row, rowGroup, padre, index) {

    this.rowValidadas = [];
    if (row == undefined) {
      //designacion
      if (this.isLetrado) {
        if (this.justActivarDesigLetrado != "1") {
          this.showMsg('error', "No tiene permiso para actualizar designaciones", '');
          this.refreshData.emit(true);
        } else {
          if (this.rowIdsToUpdate.indexOf(rowId) == -1) {
            this.rowIdsToUpdate.push(rowId);
          }
          if (cell != undefined) {
            cell.value[0] = event;
          }
        }
      } else {
        if (this.rowIdsToUpdate.indexOf(rowId) == -1) {
          this.rowIdsToUpdate.push(rowId);
        }
        if (cell != undefined) {
          cell.value[0] = event;
        }
      }
    } else {
      //actuacion
      this.turnoAllow = rowGroup.rows[0].cells[39].value;
      if ((this.isLetrado && row.cells[8].value != true && this.turnoAllow != "1") || (!this.isLetrado)) {
        if (row.cells[8].value != true) {
          if (!this.indicesToUpdate.some(d => d[0] == rowId && d[1] == index)) {
            this.indicesToUpdate.push([rowId, index]);
          }
          if (cell != undefined) {
            cell.value[0] = event;
          }
        } else {
          this.rowValidadas.push(row);
          this.showMsg('error', "No se pueden actualizar actuaciones validadas", '')
        }
      } else {
        this.showMsg('error', "No tiene permiso para actualizar datos de una actuación", '')
        this.refreshData.emit(true);
      }
    }

    this.numDesignasModificadas.emit(this.rowIdsToUpdate.length);
    this.numActuacionesModificadas.emit(this.indicesToUpdate.length);

    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
    this.lastChange = "checkBoxChange";
  }

  checkBoxChange2(event, rowId, cell, row, rowGroup, padre, index) {
    if (cell.value == false && row != undefined && row.cells[35] != undefined && row.cells[35].value == "1") {
      cell.value = !cell.value;
      this.showMsg('error', "No puede desvalidar actuaciones facturadas", '')
    } else {
      this.rowValidadas = [];
      if (row == undefined) {
        //designacion
        if (this.isLetrado) {
          if (this.justActivarDesigLetrado != "1") {
            cell.value = !cell.value;
            this.showMsg('error', "No tiene permiso para actualizar designaciones", '')
          } else {
            if (this.rowIdsToUpdate.indexOf(rowId) == -1) {
              this.rowIdsToUpdate.push(rowId);
            }
          }
        } else {
          if (this.rowIdsToUpdate.indexOf(rowId) == -1) {
            this.rowIdsToUpdate.push(rowId);
          }
        }
      } else {
        //actuacion
        this.turnoAllow = rowGroup.rows[0].cells[39].value;
        const newAllow = rowGroup.rows[0].cells[40].value;
        if ((this.isLetrado && newAllow == "1" && this.turnoAllow != "1") || (!this.isLetrado)) {
          if (!this.indicesToUpdate.some(d => d[0] == rowId && d[1] == index)) {
            this.indicesToUpdate.push([rowId, index]);
            this.rowIdsToUpdate.push(rowId);
          }
          /*}else{
            this.rowValidadas.push(row);
            cell.value = !cell.value;
            this.showMsg('error', "No se pueden actualizar actuaciones validadas", '')
          }*/
        } else {
          cell.value = !cell.value;
          this.showMsg('error', "No tiene permiso para actualizar datos de una actuación", '')
          this.refreshData.emit(true);
        }
      }

      this.numDesignasModificadas.emit(this.rowIdsToUpdate.length);
      this.numActuacionesModificadas.emit(this.indicesToUpdate.length);

      sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
      this.lastChange = "checkBoxChange2";

      if (cell.value == true) {
        if (row != undefined) {

          if (row.cells[6].type == 'checkboxDate') {
            row.cells[6].value = true;
          } else if (row.cells[6].value == undefined) {
            row.cells[6].type = 'text';
            row.cells[5].type = 'text';
            row.cells[6].value = this.fechaFiltro;
          } else {
            row.cells[6].type = 'text';
            row.cells[5].type = 'text';
          }

        }

      } else {
        if (row != undefined) {
          if (row.cells[6].type == 'checkboxDate') {
            row.cells[6].value = true;
          } else {
            row.cells[6].type = 'datePicker';
            row.cells[5].type = 'datePicker';
          }
        }
      }
    }
  }
  changeSelect(event, cell, rowId, row, rowGroup, padre, index) {
    if (this.pantalla == 'AE' && row == undefined) {
      //designacion
      if (this.isLetrado) {
        if (this.justActivarDesigLetrado != "1") {
          this.showMsg('error', "No tiene permiso para actualizar designaciones", '')
          this.refreshData.emit(true);
        } else {
          if (this.rowIdsToUpdate.indexOf(rowId) == -1) {
            this.rowIdsToUpdate.push(rowId);
          }
        }
      } else {
        if (this.rowIdsToUpdate.indexOf(rowId) == -1) {
          this.rowIdsToUpdate.push(rowId);
        }
      }
    } else if (this.pantalla == 'JE' && row != undefined) {
      //actuacion
      if (row.cells[8].value != true) {
        if (!this.indicesToUpdate.some(d => d[0] == rowId && d[1] == index)) {
          this.indicesToUpdate.push([rowId, index]);
        }

        this.rowIdsToUpdate.push(rowId);
      } else {
        this.rowValidadas.push(row);
        this.showMsg('error', "No se pueden actualizar actuaciones validadas", '')
        this.refreshData.emit(true);
      }
    } else {
      if (this.pantalla == 'JE' && rowGroup.rows != undefined) {
        rowGroup.rows[0].cells[4].value = cell.value;
      }
      this.rowIdsToUpdate.push(rowId);
    }

    this.numDesignasModificadas.emit(this.rowIdsToUpdate.length);
    this.numActuacionesModificadas.emit(this.indicesToUpdate.length);

    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
    this.lastChange = "changeSelect";
  }

  inputChange(event, rowId, row, rowGroup, padre, index) {

    this.rowValidadas = [];
    if (this.pantalla == 'AE' && row == undefined) {
      //designacion
      if (this.isLetrado) {
        if (this.justActivarDesigLetrado != "1") {
          this.showMsg('error', "No tiene permiso para actualizar designaciones", '')
          this.refreshData.emit(true);
        } else {
          if (this.rowIdsToUpdate.indexOf(rowId) == -1) {
            this.rowIdsToUpdate.push(rowId);
          }
        }
      } else {
        if (this.rowIdsToUpdate.indexOf(rowId) == -1) {
          this.rowIdsToUpdate.push(rowId);
        }
      }
    } else if (this.pantalla == 'JE' && row != undefined) {
      //actuacion
      this.turnoAllow = rowGroup.rows[0].cells[39].value;
      if ((this.isLetrado && (this.turnoAllow != "1" || this.turnoAllow == "1" && row.cells[8].value != true)) || (!this.isLetrado)) {
        if (row.cells[8].value != true) {
          if (!this.indicesToUpdate.some(d => d[0] == rowId && d[1] == index)) {
            this.indicesToUpdate.push([rowId, index]);
          }
        } else {
          this.rowValidadas.push(row);
          this.showMsg('error', "No se pueden actualizar actuaciones validadas", '')
          this.refreshData.emit(true);
        }

        this.rowIdsToUpdate.push(rowId);
      } else {
        this.showMsg('error', "No tiene permiso para actualizar datos de una actuación", '')
        this.refreshData.emit(true);
      }
    } else {
      this.rowIdsToUpdate.push(rowId);
    }

    this.numDesignasModificadas.emit(this.rowIdsToUpdate.length);
    this.numActuacionesModificadas.emit(this.indicesToUpdate.length);

    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
    this.lastChange = "inputChange";
  }
  onChangeSelector(event, row, cell, rowId, rowGroup) {

    this.rowIdsToUpdate.push(rowId);
    if (event) {
      cell.value[5] = event[0];
    } else {
      cell.value[5] = 0;
    }

    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
  }

  ocultarColumna(event) {
    if (event.itemValue != undefined) {
      // Se muestran o ocuntan las columnas de 1 en 1
      this.ocultarColumnaItem(event, event.itemValue);
    } else {
      // Se muestran o ocultan todas las columnas

      // Busco las columnas a mostrar
      let shownElements = event.value
        .filter(element => document.getElementById(element.id).classList.contains("collapse"))
        .filter(element => event.value.some(e => e.id == element.id));

      // Busco las columnas a ocultar
      let hiddenElements = this.cabeceras
        .filter(element => !document.getElementById(element.id).classList.contains("collapse"))
        .filter(element => !event.value.some(e => e.id == element.id));

      // Muestro u oculto los cambios
      shownElements.forEach(columna => this.ocultarColumnaItem(event, columna));
      hiddenElements.forEach(columna => this.ocultarColumnaItem(event, columna));
    }
  }

  ocultarColumnaItem(event, columna) {
    if (this.pantalla == 'JE' && columna.id == "clientes" || columna.id == "ejgs") {
      this.showMsg('error', "Clientes y EJG's pertenecen a la columna Año/Número Designación, no pueden ocultarse/mostrarse por sí solas", '')
    } else {

      let tabla = document.getElementById("tablaResultadoDesplegable");

      if (columna == undefined && event.value.length == 0) {
        this.cabeceras.forEach(element => {
          this.renderer.addClass(document.getElementById(element.id), "collapse");
        });
        this.getPosition(this.cabeceras);
        this.itemsaOcultar = this.cabeceras;
        tabla.setAttribute("style", 'width: 0px !important');
      }

      if (columna == undefined && event.value.length > 0) {
        this.cabeceras.forEach(element => {
          this.renderer.removeClass(document.getElementById(element.id), "collapse");
        });
        this.getPosition([]);
        this.itemsaOcultar = [];
        this.setTamanioPrimerRegistroGrupo();
        tabla.setAttribute("style", `width: ${this.tamanioTablaResultados}px !important`);
      }

      if (columna != undefined && event.value.length >= 0) {
        let ocultar = true;
        event.value.forEach(element => {
          if (element.id == columna.id) {
            ocultar = false;
          }
        });
        if (this.pantalla == 'JE') {
          /*if (columna.id == "ejgs" || columna.id == "clientes"){
            columna.id = "anio";
          }
          //console.log('columna.id: ', columna.id)*/
          if (ocultar && columna.id == "anio") {
            this.ocultarItem("clientes");
            this.ocultarItem("ejgs");
          } else if (!ocultar && columna.id == "anio") {
            this.mostrarItem("clientes");
            this.mostrarItem("ejgs");
          }
        }
        if (ocultar) {
          this.renderer.addClass(document.getElementById(columna.id), "collapse");
          this.itemsaOcultar.push(columna);
          if (this.columnsSizes.length != 0) {
            tabla.setAttribute("style", `width: ${tabla.clientWidth - this.columnsSizes.find(el => el.id == columna.id).size}px !important`);
          }


        } else {
          this.renderer.removeClass(document.getElementById(columna.id), "collapse");
          this.itemsaOcultar.forEach((element, index) => {
            if (element.id == columna.id) {
              this.itemsaOcultar.splice(index, 1);
            }
          });
          if (this.columnsSizes.length != 0) {
            tabla.setAttribute("style", `width: ${tabla.clientWidth + this.columnsSizes.find(el => el.id == columna.id).size}px !important`);
          }
        }
        this.getPosition(this.itemsaOcultar);

        if (!ocultar) {
          this.setTamanioPrimerRegistroGrupo();
        }

      }
      this.totalRegistros = this.rowGroups.length;
    }
  }

  mostrarItem(id) {
    let tabla = document.getElementById("tablaResultadoDesplegable");
    this.renderer.removeClass(document.getElementById(id), "collapse");
    this.itemsaOcultar.forEach((element, index) => {
      if (element.id == id) {
        this.itemsaOcultar.splice(index, 1);
      }
    });
    if (this.columnsSizes.length != 0) {
      tabla.setAttribute("style", `width: ${tabla.clientWidth + this.columnsSizes.find(el => el.id == id).size}px !important`);
    }
  }
  ocultarItem(id) {
    let tabla = document.getElementById("tablaResultadoDesplegable");
    this.renderer.addClass(document.getElementById(id), "collapse");
    //this.itemsaOcultar.push(event.itemValue);
    if (this.columnsSizes.length != 0) {
      tabla.setAttribute("style", `width: ${tabla.clientWidth - this.columnsSizes.find(el => el.id == id).size}px !important`);
    }
  }
  setTamanioPrimerRegistroGrupo() {
    if (this.pantalla == 'AE' || this.pantalla == '') {
      let self = this;
      setTimeout(function () {
        let primerRegistroDelGrupo = document.getElementsByClassName("table-row-header");

        for (let i = 0; i < primerRegistroDelGrupo.length; i++) {
          primerRegistroDelGrupo[i].setAttribute("style", `max-width: ${self.columnsSizes[0].size}px`);
        }
      }, 1);
    }
  }

  ngAfterViewInit(): void {
    //this.setTamanios();
    this.tamanioTablaResultados = document.getElementById("tablaResultadoDesplegable").clientWidth;
  }

  setTamanios() {
    if (this.pantalla == 'AE') {

      this.cabeceras.forEach(ind => {
        if (ind.id != 'idApNombreSexo') {
          this.columnsSizes.push({
            id: ind.id,
            size: 225.75
          });
          document.getElementById(ind.id).setAttribute("style", "max-width: 225.75px");
        } else {
          this.columnsSizes.push({
            id: ind.id,
            size: 445.5
          });
          document.getElementById(ind.id).setAttribute("style", "max-width: 445.5px");
        }
      });

      let primeraColumna = document.getElementsByClassName("table-row-header");
      let columnasHijas = document.getElementsByClassName("table-cell");

      for (let i = 0; i < primeraColumna.length; i++) {
        primeraColumna[i].setAttribute("style", "max-width: 225.75px");
      }


      for (let j = 0; j < columnasHijas.length; j++) {

        if ([0, 6, 12, 18, 24].includes(j)) {
          columnasHijas[j].setAttribute("style", "max-width: 445.5px");
        } else {
          columnasHijas[j].setAttribute("style", "max-width: 225.75px");
        }
      }

    } else if (this.pantalla == '') {

      this.cabeceras.forEach(ind => {
        if (ind.id == 'clientes') {
          this.columnsSizes.push({
            id: ind.id,
            size: 300
          });
          document.getElementById(ind.id).setAttribute("style", "max-width: 300px");
        } else if (ind.id == 'finalizado' || ind.id == 'validar') {
          this.columnsSizes.push({
            id: ind.id,
            size: 50
          });
          document.getElementById(ind.id).setAttribute("style", "max-width: 50px");
        } else {
          this.columnsSizes.push({
            id: ind.id,
            size: 153.7
          });
          document.getElementById(ind.id).setAttribute("style", "max-width: 153.7px");
        }
      });

      let primeraColumna = document.getElementsByClassName("table-row-header");
      let columnasHijas = document.getElementsByClassName("table-cell");

      for (let i = 0; i < primeraColumna.length; i++) {
        primeraColumna[i].setAttribute("style", "max-width: 153.7px");
      }


      for (let j = 0; j < columnasHijas.length; j++) {

        if ([1, 12, 23, 34, 45, 56].includes(j)) {
          columnasHijas[j].setAttribute("style", "max-width: 300px");
        } else if ([2, 10, 13, 21, 24, 32, 35, 43, 46, 54, 57, 65].includes(j)) {
          columnasHijas[j].setAttribute("style", "max-width: 50px");
        } else {
          columnasHijas[j].setAttribute("style", "max-width: 153.7px");
        }
      }
    }
  }
  setMyStyles(size) {
    let styles = {
      'max-width': size + 'px',
    };
    return styles;
  }
  changeDisplay() {
    return (document.getElementsByClassName("openedMenu").length == 0 && document.documentElement.clientWidth > 1812);
  }

  fromReg(event) {
    this.from = Number(event) - 1;
  }

  toReg(event) {
    this.to = Number(event);
  }

  perPage(perPage) {
    this.numperPage = perPage;
  }

  selectedAll(event) {
    this.seleccionarTodo = event;
    // this.isDisabled = !event;
  }
  colorByStateDesigmacion(state) {
    if (state == 'V') {
      return 'green'; // activa
    } else if (state == 'F') {
      return 'blue'; // finalizada
    } else if (state == 'A') {
      return 'red'; // anulada
    } else {
      return 'black';
    }
  }

  onChangeMulti($event, rowId, cell, z, padre, index) {
    if ((padre && this.lastChangePadre == rowId) || (!padre && this.lastChangeHijo == rowId)) {
      if (this.lastChange == "onChangeMulti") {
        this.sumar = !this.sumar;
        if (padre) {
          this.lastChangePadre = rowId;
          this.numDesignasModificadas.emit(this.sumar);
        } else {
          this.lastChangeHijo = rowId;
          this.numActuacionesModificadas.emit(this.sumar);
        }
      }
    } else {
      this.sumar = true;
      if (padre) {
        this.lastChangePadre = rowId;
        this.numDesignasModificadas.emit(this.sumar);
      } else {
        this.lastChangeHijo = rowId;
        this.numActuacionesModificadas.emit(this.sumar);
      }
    }

    if (z == 1) {
      //comboJuzgados
      let juzgado = $event.value;
      if (this.configComboDesigna == "1" || this.configComboDesigna == "2" || this.configComboDesigna == "3") {
        this.cargaModulosPorJuzgado2.emit(juzgado);
      } else if (this.configComboDesigna == "4" || this.configComboDesigna == "5") {
        this.cargaAllModulos.emit(true);
      }

    } else if (z == 4) {
      //comboModulos
      let modulo = $event.value;
      let data: String[] = [];

      data.push(modulo);
      data.push(this.newActuacionesArr[0].cells[33].value);
      this.cargaAcreditacionesPorModulo2.emit(data);
    } else if (z == 7) {
      //comboAcreditacion
    }

    this.lastChange = "onChangeMulti";


    this.rowIdsToUpdate.push(rowId);
  }

  searchNuevo(comboModulos, comboAcreditacion) {
    let rowGroupFound = false;
    this.rowGroups.forEach((rowGroup, i) => {
      rowGroup.rows.forEach(row => {
        row.cells.forEach(cell => {
          if (cell.type == 'multiselect2') {
            cell.combo = comboModulos;

            if (comboModulos.every(d => d.value != cell.value)) {
              cell.value = comboModulos[0].value;
            }
            rowGroupFound = true;
          } else if (cell.type == 'multiselect3' && comboAcreditacion[0] != undefined) {
            cell.combo = comboAcreditacion;

            if (comboAcreditacion.every(d => d.value != cell.value)) {
              cell.value = comboAcreditacion[0].value;
            }
            rowGroupFound = true;
          }

        })
        if (comboModulos.length && comboAcreditacion.length && rowGroupFound == true) {
          this.newActuacionesArr.push(row);
        }
      })

      if (rowGroupFound == true) {
        rowGroup.rows.forEach(row => {
          row.position = 'noCollapse';
        });
      }
      rowGroupFound = false;
    });
  }

  newFromSelected() {
    //console.log('sessionStorage.getItem(rowIdsToUpdate) ', sessionStorage.getItem('rowIdsToUpdate') );
    if (sessionStorage.getItem('rowIdsToUpdate') != null && sessionStorage.getItem('rowIdsToUpdate') != 'null' && sessionStorage.getItem('rowIdsToUpdate') != '[]') {
      let keyConfirmation = "confirmacionGuardarJustificacionExpress";
      this.confirmationService.confirm({
        key: keyConfirmation,
        message: this.translateService.instant('justiciaGratuita.oficio.justificacion.reestablecer'),
        icon: "fa fa-trash-alt",
        accept: () => {
          this.rowGroups.forEach((rowG, i) => {
            this.selectedArray.forEach(id => {
              if (rowG.id == id) {
                //this.toDoButton('Nuevo', rowG.id, rowG, null)
                this.linkFichaActIfPermis(null, rowG);
              }
            });
          });
        },
        reject: () => {
        }
      });
    } else {
      this.rowGroups.forEach((rowG, i) => {
        this.selectedArray.forEach(id => {
          if (rowG.id == id) {
            //this.toDoButton('Nuevo', rowG.id, rowG, null)
            this.linkFichaActIfPermis(null, rowG);
          }
        });
      });
    }
  }
  toDoButton(type, designacion, rowGroup, rowWrapper) {
    this.turnoAllow = rowGroup.rows[0].cells[39].value;
    if (type == 'Nuevo') {
      this.rowGroupWithNew = rowGroup.id;
      this.rowIdWithNewActuacion = rowGroup.id;
      let desig = rowGroup.rows[0].cells;
      let juzgado = desig[1].value;
      //this.getJuzgados(desig[17].value);

      this.idTurno = desig[17].value;
      this.progressSpinner = true;

      this.sigaServices.post("combo_comboJuzgadoDesignaciones", '0').subscribe(
        n => {
          this.comboJuzgados = JSON.parse(n.body).combooItems;
          if (this.comboJuzgados[0] != undefined) {
            this.commonsService.arregloTildesCombo(this.comboJuzgados);
            this.progressSpinner = false;
            if (this.configComboDesigna == "1" || this.configComboDesigna == "2" || this.configComboDesigna == "3") {
              this.cargaModulosPorJuzgado(juzgado, designacion, rowGroup);
            } else if (this.configComboDesigna == "4" || this.configComboDesigna == "5") {
              this.cargaModulos(designacion, rowGroup);
            }
          } else {
            if (this.configComboDesigna == "1" || this.configComboDesigna == "2" || this.configComboDesigna == "3") {
              this.comboModulos = [];
              let data: String[] = [];
              data.push("0");
              data.push(this.idTurno);
              this.cargaAcreditacionesPorModulo(data, designacion, rowGroup);
            } else if (this.configComboDesigna == "4" || this.configComboDesigna == "5") {
              this.cargaModulos(designacion, rowGroup);
            }

          }

          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }
      );



    }
  }

  colorByStateExpediente(resolucion) {
    if (resolucion == 'NO_FAVORABLE') {
      return 'red';
    } else if (resolucion == 'FAVORABLE') {
      return 'blue';
    } else {
      return 'black';
    }

  }

  /* tooltipEJG(state,resolucion){
    if ( (resolucion == '' || resolucion == undefined || resolucion == null || resolucion == 'SIN_RESOLUCION') && (state == "''" || state == undefined || state == null) ){
      return 'Designación con EJG sin Resolución';
    }else if((resolucion != '' || resolucion != undefined || resolucion != null || resolucion != 'SIN_RESOLUCION') && (state == "''" || state == undefined || state == null)){
      return `Resolucion: ${resolucion}`;
    }else if((resolucion == '' || resolucion == undefined || resolucion == null || resolucion == 'SIN_RESOLUCION') && (state != "''" || state != undefined || state != null)){
      return `Dictamen: ${state}`;
    }else{
      return `Resolucion: ${resolucion} \ Dictamen: ${state}`;
    }
  } */

  searchActuacionwithSameNumDesig(idAcreditacionNew, rowGroupWithNew) {
    let esPosibleCrearNuevo = true;
    let nameAcreditacionArr = [];
    let idAcreditacionArr = [];
    this.rowGroups.forEach(rowGroup => {
      if (rowGroup.id == rowGroupWithNew) {
        let actuaciones = rowGroup.rows.slice(1, rowGroup.rows.length - 1);
        actuaciones.forEach(rowAct => {
          let idAcre = rowAct.cells[14].value;
          nameAcreditacionArr.push(idAcre);
        })
      }
    })
    nameAcreditacionArr.forEach(nameA => {
      if (nameA == 'Inic.-Fin') {
        idAcreditacionArr.push('1,0')
      } else if (nameA == 'Inic.') {
        idAcreditacionArr.push('2,0')
      } else if (nameA == 'Fin') {
        idAcreditacionArr.push('3,0')
      } else if (nameA == 'Inic.<2005') {
        idAcreditacionArr.push('10,0')
      } else if (nameA == 'Fin<2005') {
        idAcreditacionArr.push('11,0')
      } else if (nameA == 'Fin sin Inic.') {
        idAcreditacionArr.push('15,0')
      }
    });
    if (idAcreditacionArr.includes(idAcreditacionNew)) {
      esPosibleCrearNuevo = false;
    }
    return esPosibleCrearNuevo;
  }
  guardar() {
    let esPosibleCrearNuevo = true;
    let actuaciones;

    // Obtenemos todas las nuevas actuaciones creadas a partir de los checkbox de justificación
    this.rowGroups.forEach(rowGroup => {
      this.newActuacionesArr = this.newActuacionesArr.concat(rowGroup.rows.filter(row => row.cells[6].type == 'checkboxDate' && row.cells[6].value));
    });


    //1. Guardar nuevos
    if (this.newActuacionesArr.length != 0) {

      let newActuacionesArrNOT_REPEATED = new Set(this.newActuacionesArr);
      this.newActuacionesArr = Array.from(newActuacionesArrNOT_REPEATED);

      let newActuacionesToSend = [];

      this.newActuacionesArr.forEach(newAct => {
        // Si las actuaciones han sido creadas a partir de los checkbox de actuacion,
        // se establece la fecha de justificación con la fecha del selector y se cambian los
        // valores de las columnas donde deberían ir los ids de los combos.
        if (newAct.cells[6].type == 'checkboxDate' && newAct.cells[6].value) newAct.cells[6].value = this.fechaFiltro;
        if (newAct.cells[1].type != 'multiselect1') newAct.cells[1].value = newAct.cells[21].value;
        if (newAct.cells[4].type != 'multiselect2') newAct.cells[4].value = newAct.cells[20].value;
        if (newAct.cells[7].type != 'multiselect3') newAct.cells[7].value = newAct.cells[10].value;


        let idAcreditacionNew = newAct.cells[7].value;
        esPosibleCrearNuevo = this.searchActuacionwithSameNumDesig(idAcreditacionNew, this.rowGroupWithNew);
        if (esPosibleCrearNuevo) {
          newActuacionesToSend.push(newAct);
        } else {
          this.showMsg('error', "No es posible crear otra actuación con valor de acreditación Inicio/Fin", '')
        }
      });

      if (newActuacionesToSend.length != 0) {
        this.actuacionesToAdd.emit(newActuacionesToSend);
        this.totalActuaciones.emit(newActuacionesToSend.length);
      }
    }


    //2. Actualizar editados

    let rowValidadasNOT_REPEATED = new Set(this.rowValidadas);
    this.rowValidadas = Array.from(rowValidadasNOT_REPEATED);

    if (this.rowIdsToUpdate.length && this.newActuacionesArr.length == 0) {
      let rowIdsToUpdateNOT_REPEATED = new Set(this.rowIdsToUpdate);
      this.rowIdsToUpdate = Array.from(rowIdsToUpdateNOT_REPEATED);
      this.rowGroups.forEach(row => {
        if (this.rowIdsToUpdate.indexOf(row.id.toString()) >= 0 || this.indicesToUpdate.some(d => d[0] == row.id.toString())) {
          let rowGroupToUpdate = row;

          let rowsToUpdate = [];

          // Línea que actualiza la designación
          rowsToUpdate.push(row.rows[0]);

          // Se agregan las actuaciones modificadas
          rowsToUpdate = rowsToUpdate.concat(row.rows.slice(1).filter(d => Array.isArray(d.cells[0].value)
            && d.cells[0].value.length > 1
            && d.cells[0].value[1] != undefined && d.cells[0].value[1] != 'Nuevo'
            && (d.cells[0].value[1] != undefined || d.cells[0].value[1] != '')));

          row.rows = rowsToUpdate;

          this.rowValidadas.forEach(rowValid => {
            if (rowGroupToUpdate.rows.includes(rowValid)) {
            }
          })
          this.rowValidadas = [];

          this.dataToUpdateArr.push(row);
        }
      })
      if (this.dataToUpdateArr.length != 0) {
        this.dataToUpdate.emit(this.dataToUpdateArr);

        this.rowIdsToUpdate = [];
        this.indicesToUpdate = [];
        this.numDesignasModificadas.emit(this.rowIdsToUpdate.length);
        this.numActuacionesModificadas.emit(this.indicesToUpdate.length);
      }


    }
    this.rowIdsToUpdate = []; //limpiamos
    this.dataToUpdateArr = []; //limpiamos
    this.newActuacionesArr = []; //limpiamos
    this.rowValidadas = [];
    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
    this.refreshData.emit(true);
  }

  eliminar() {
    let deletedDesig = [];
    let deletedAct = [];
    this.rowGroups.forEach((rowG, i) => {
      //1. Eliminamos designaciones
      this.selectedArray.forEach(idToDelete => {
        if (rowG.id == idToDelete) {
          this.showMsg('error', "No se pueden eliminar designaciones", '')
          /*this.rowGroups.splice(i, 1);
          deletedDesig.push(rowG.id)
          this.designasToDelete.emit(deletedDesig);*/
          //NO SE PUEDEN ELIMINAR DESIGNACIONES!!
        }
      });
      //2. Eliminamos actuaciones
      if (this.selecteChild.length) {


        this.selecteChild.forEach((child) => {
          let rowIdChild = Object.keys(child)[0];
          let rowId = rowIdChild.slice(0, -1);
          this.childNumber = Number(Object.values(child)[0]);
          this.selectedArray.forEach(idToDelete => {
            if (rowIdChild == idToDelete && rowG.id == rowId) {
              this.turnoAllow = rowG.rows[0].cells[39].value;
              //rowG.rows.splice(this.childNumber, 1);
              if (rowG.rows[this.childNumber + 1].cells[8].value == false) {
                //actuacion No Validada
                //console.log("isListreado")
                if ((this.isLetrado && this.turnoAllow != "1") || (!this.isLetrado)) {
                  if (rowG.rows[this.childNumber + 1].cells[35].value == "1") {
                    this.showMsg('error', "No puede eliminar actuaciones facturadas", '')
                    this.refreshData.emit(true);
                  } else {
                    //console.log("push del else");
                    deletedAct.push(rowG.rows[this.childNumber + 1].cells)
                  }
                } else {
                  this.showMsg('error', "No tiene permiso para eliminar actuaciones", '')
                  this.refreshData.emit(true);
                }
              } else {
                this.showMsg('error', "No se pueden eliminar actuaciones validadas", '')
                this.refreshData.emit(true);
              }

              this.totalActuaciones.emit(-1);

            }
          });
        })

      }
    });
    this.totalRegistros = this.rowGroups.length;

    if (deletedAct.length != 0) {

      let keyConfirmation = "deletePlantillaDoc";

      this.confirmationService.confirm({
        key: keyConfirmation,
        message: this.translateService.instant('messages.deleteConfirmation'),
        icon: "fa fa-trash-alt",
        accept: () => {
          let deletedActNOT_REPEATED = new Set(deletedAct);
          deletedAct = Array.from(deletedActNOT_REPEATED);
          this.actuacionesToDelete.emit(deletedAct);
          deletedAct = [];
          this.selectedArray = [];
          this.selecteChild = [];
          this.selected = false;
        },
        reject: () => {
          deletedAct = [];
          this.msgs = [
            {
              severity: "info",
              summary: "info",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
    }

  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }
  clear() {
    this.msgs = [];
  }
  cargaAcreditacionesPorModulo($event, designacion, rowGroup) {
    let validacion = false;
    this.turnoAllow = rowGroup.rows[0].cells[39].value;
    if (this.isLetrado) {
      //colegiado
      if (this.turnoAllow != "1") {
        //check desactivado
        validacion = true;
      }
    } else {
      //colegio
      validacion = true;
    }


    this.progressSpinner = true;
    let desig = rowGroup.rows[0].cells;
    this.idTurno = desig[17].value;
    if ($event[0] == "0") {
      this.rowGroups.forEach((rowGroup, i) => {
        if (rowGroup.id == designacion) {
          let id = Object.keys(rowGroup.rows)[0];
          let newArrayCells: Cell[];
          newArrayCells = [
            { type: 'checkboxPermisos', value: [undefined, ""], size: 120, combo: null, disabled: null },
            { type: 'multiselect1', value: "0", size: 400, combo: [], disabled: null },
            { type: 'input', value: desig[2].value, size: 200, combo: null, disabled: null },
            { type: 'input', value: desig[3].value, size: 200, combo: null, disabled: null },//numProc
            { type: 'multiselect2', value: "0", size: 400, combo: [], disabled: null }, //modulo
            { type: 'datePicker', value: this.formatDate(new Date()), size: 200, combo: null, disabled: null },
            { type: 'datePicker', value: this.formatDate(new Date()), size: 200, combo: null, disabled: null },
            { type: 'multiselect3', value: "0", size: 200, combo: [], disabled: null },
            { type: 'checkbox', value: validacion, size: 80, combo: null, disabled: null },
            { type: 'invisible', value: desig[19].value, size: 0, combo: null, disabled: null },//numDesig
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: desig[15].value, size: 0, combo: null, disabled: null },//idJuzgado   
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
            { type: 'invisible', value: desig[10].value, size: 0, combo: null, disabled: null },//anio
            { type: 'invisible', value: desig[17].value, size: 0, combo: null, disabled: null },//idturno
            { type: 'invisible', value: desig[13].value, size: 0, combo: null, disabled: null }];//idInstitucion

          const newAllow = rowGroup.rows[0].cells[40].value;
          if (!this.isLetrado || (this.isLetrado && (this.turnoAllow != "1" || this.turnoAllow == "1" && newArrayCells[8].value != true) && newAllow == "1")) {
            let newRow: Row = { cells: newArrayCells, position: 'noCollapse' };
            if (rowGroup.rows[rowGroup.rows.length-1].cells[0].value[1] == "Nuevo") {
              rowGroup.rows.splice(rowGroup.rows.length-1, 0, newRow);
            } else {
              rowGroup.rows.push(newRow);
            }
            this.newActuacionesArr.push(newRow);
          } else {
            this.showMsg('error', "No tiene permiso para añadir actuaciones", '')
            this.rowGroups = this.rowGroupsAux;
            this.refreshData.emit(true);
          }

        }
      })
    } else {
      this.sigaServices.getParam("combo_comboAcreditacionesPorModulo", `?idModulo=${$event[0]}&idTurno=${this.idTurno}`).subscribe(
        n => {
          this.comboAcreditacion = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboAcreditacion);
          this.progressSpinner = false;
          //this.cargaJuzgados.emit(true);
          //this.comboModulos = [];
          //this.comboAcreditacion = [];
          this.rowGroups.forEach((rowGroup, i) => {
            if (rowGroup.id == designacion) {
              let id = Object.keys(rowGroup.rows)[0];
              let newArrayCells: Cell[];
              if (this.comboJuzgados.length != 0) {
                newArrayCells = [
                  { type: 'checkboxPermisos', value: [undefined, ''], size: 120, combo: null, disabled: null },
                  { type: 'select', value: desig[1].value, size: 400, combo: this.comboJuzgados, disabled: null },
                  { type: 'input', value: desig[2].value, size: 200, combo: null, disabled: null },
                  { type: 'input', value: desig[3].value, size: 200, combo: null, disabled: null },//numProc
                  { type: 'multiselect2', value: desig[21].value, size: 400, combo: this.comboModulos, disabled: null }, //modulo
                  { type: 'datePicker', value: this.formatDate(new Date()), size: 200, combo: null, disabled: null },
                  { type: 'datePicker', value: this.formatDate(new Date()), size: 200, combo: null, disabled: null },
                  { type: 'multiselect3', value: this.comboAcreditacion[0].value, size: 200, combo: this.comboAcreditacion, disabled: null },
                  { type: 'checkbox', value: validacion, size: 80, combo: null, disabled: null },
                  { type: 'invisible', value: desig[19].value, size: 0, combo: null, disabled: null },//numDesig
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: desig[15].value, size: 0, combo: null, disabled: null },//idJuzgado   
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: desig[10].value, size: 0, combo: null, disabled: null },//anio
                  { type: 'invisible', value: desig[17].value, size: 0, combo: null, disabled: null },//idturno
                  { type: 'invisible', value: desig[13].value, size: 0, combo: null, disabled: null }];//idInstitucion
              } else {
                newArrayCells = [
                  { type: 'checkboxPermisos', value: [undefined, ''], size: 120, combo: null, disabled: null },
                  { type: 'select', value: "0", size: 400, combo: [], disabled: null },
                  { type: 'input', value: desig[2].value, size: 200, combo: null, disabled: null },
                  { type: 'input', value: desig[3].value, size: 200, combo: null, disabled: null },//numProc
                  { type: 'multiselect2', value: this.comboModulos[0].value, size: 400, combo: this.comboModulos, disabled: null }, //modulo
                  { type: 'datePicker', value: this.formatDate(new Date()), size: 200, combo: null, disabled: null },
                  { type: 'datePicker', value: this.formatDate(new Date()), size: 200, combo: null, disabled: null },
                  { type: 'multiselect3', value: this.comboAcreditacion[0].value, size: 200, combo: this.comboAcreditacion, disabled: null },
                  { type: 'checkbox', value: validacion, size: 80, combo: null, disabled: null },
                  { type: 'invisible', value: desig[19].value, size: 0, combo: null, disabled: null },//numDesig
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: desig[15].value, size: 0, combo: null, disabled: null },//idJuzgado   
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: '', size: 0, combo: null, disabled: null },
                  { type: 'invisible', value: desig[10].value, size: 0, combo: null, disabled: null },//anio
                  { type: 'invisible', value: desig[17].value, size: 0, combo: null, disabled: null },//idturno
                  { type: 'invisible', value: desig[13].value, size: 0, combo: null, disabled: null }];//idInstitucion
              }

              const newAllow = rowGroup.rows[0].cells[40].value;
              if (!this.isLetrado || (this.isLetrado && (this.turnoAllow != "1" || this.turnoAllow == "1" && newArrayCells[8].value != true) && newAllow == "1")) {
                let newRow: Row = { cells: newArrayCells, position: 'noCollapse' };
                if (rowGroup.rows[rowGroup.rows.length-1].cells[0].value[1] == "Nuevo") {
                  rowGroup.rows.splice(rowGroup.rows.length-1, 0, newRow);
                } else {
                  rowGroup.rows.push(newRow);
                }
                this.newActuacionesArr.push(newRow);
              } else {
                this.showMsg('error', "No tiene permiso para añadir actuaciones", '')
                this.rowGroups = this.rowGroupsAux;
                this.refreshData.emit(true);
              }

            }
          })
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }
      );
    }

  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }
  cargaModulosPorJuzgado($event, designacion, rowGroup) {
    this.progressSpinner = true;
    this.sigaServices.getParam("combo_comboModulosConJuzgado", "?idJuzgado=" + $event).subscribe(
      n => {
        this.comboModulos = n.combooItems;
        if (this.comboModulos != undefined && this.comboModulos.length > 0 ) {
          this.commonsService.arregloTildesCombo(this.comboModulos);
          let data: String[] = [];
          let desig = rowGroup.rows[0].cells;
          this.idTurno = desig[17].value;
          data.push(this.comboModulos[0].value);
          data.push(this.idTurno);
          this.cargaAcreditacionesPorModulo(data, designacion, rowGroup);
        }
        
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }

    );
  }

  cargaModulos(designacion, rowGroup) {
    this.progressSpinner = true;
    this.sigaServices.get("combo_comboModulos").subscribe(
      n => {
        this.progressSpinner = false;
        this.comboModulos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboModulos);
        let data: String[] = [];
        let desig = rowGroup.rows[0].cells;
        this.idTurno = desig[17].value;
        data.push(this.comboModulos[0].value);
        data.push(this.idTurno);
        this.cargaAcreditacionesPorModulo(data, designacion, rowGroup);
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  getConfComboDesigna(){
    let parametro = {
      valor: "CONFIGURAR_COMBO_DESIGNA"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          this.configComboDesigna = JSON.parse(data.body).parametro;
      });
  }

  getParams(param) {
    let parametro = new ParametroRequestDto();
    let institucionActual;
    this.sigaServices.get("institucionActual").subscribe(n => {
      institucionActual = n.value;
      parametro.idInstitucion = institucionActual;
      parametro.modulo = "SCS";
      parametro.parametrosGenerales = param;
      this.sigaServices
        .postPaginado("parametros_search", "?numPagina=1", parametro)
        .subscribe(
          data => {
            this.searchParametros = JSON.parse(data["body"]);
            this.datosBuscar = this.searchParametros.parametrosItems;
            this.datosBuscar.forEach(element => {
              if (element.parametro == param && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)) {
                this.valorParametro = element.valor;
                if (param == "JUSTIFICACION_EDITAR_DESIGNA_LETRADOS") {
                  this.justActivarDesigLetrado = this.valorParametro;
                }
              }
            });
          });
    });
  }

  onChangeNifJg(value, rowGroupId, row: Row, rowGroup: RowGroup) {

    if (value) {
      let justiciableItem: JusticiableBusquedaItem = new JusticiableBusquedaItem();
      justiciableItem.nif = value;

      this.sigaServices.post("gestionJusticiables_getJusticiableByNif", justiciableItem).subscribe(
        n => {
          let justiciableDTO = JSON.parse(n["body"]);
          let justiciableItem = justiciableDTO.justiciable;
          if (justiciableItem) {

            rowGroup.rows[0].cells[0].value[0] = justiciableItem.nif;
            rowGroup.rows[0].cells[0].value[1] = justiciableItem.apellido1;
            rowGroup.rows[0].cells[0].value[2] = justiciableItem.apellido2;
            rowGroup.rows[0].cells[0].value[3] = justiciableItem.nombre;
            rowGroup.rows[0].cells[0].value[4] = justiciableItem.sexo;

          }
        },
        err => {
          //console.log(err);
        },
        () => {
          this.progressSpinner = false;
        }
      );

    }
  }

  linkFichaActIfPermis(row, rowGroup) {
    if (this.pantalla == 'JE') {
      if (this.permisosFichaAct) {

        let des: DesignaItem = new DesignaItem();
        if (rowGroup != null) {
          des.ano = rowGroup.id.split('\n')[0];
          des.idTurno = rowGroup.rows[0].cells[17].value;
          des.numero = rowGroup.rows[0].cells[19].value;
          des.idInstitucion = rowGroup.rows[0].cells[13].value;
          des.nig = rowGroup.rows[0].cells[2].value;
          des.numProcedimiento = rowGroup.rows[0].cells[3].value;
          des.idJuzgado = rowGroup.rows[0].cells[15].value;
          des.idProcedimiento = rowGroup.rows[0].cells[21].value;
          des.numColegiado = rowGroup.rows[0].cells[38].value;
          des.fechaEntradaInicio = rowGroup.rows[0].cells[9].value;
        }

        let act: ActuacionDesignaItem = new ActuacionDesignaItem();
        if (row != null) {
          act.idTurno = row.cells[33].value;
          act.anio = row.cells[32].value;
          act.fechaActuacion = row.cells[5].value;
          act.idJuzgado = row.cells[21].value;
          act.idProcedimiento = row.cells[20].value;
          act.nig = row.cells[2].value;
          act.numProcedimiento = row.cells[3].value;
          act.idAcreditacion = row.cells[10].value;
          act.numeroAsunto = row.cells[19].value;
        } else {
          act.idTurno = rowGroup.rows[0].cells[17].value;
          act.anio = rowGroup.rows[0].cells[10].value;
          act.fechaActuacion = rowGroup.rows[0].cells[9].value;
          act.idJuzgado = rowGroup.rows[0].cells[15].value;
          act.idProcedimiento = rowGroup.rows[0].cells[21].value;
          act.nig = rowGroup.rows[0].cells[2].value;
          act.numProcedimiento = rowGroup.rows[0].cells[3].value;
          //act.idAcreditacion = rowGroup.rows[0].cells[10].value;
          //act.numeroAsunto = rowGroup.rows[0].cells[19].value;
        }

        let actuacion: Actuacion = {
          isNew: (row == null),
          designaItem: des,
          actuacion: act,
          relaciones: null
        };
        sessionStorage.setItem("vieneDeJE", "true");
        this.searchRelaciones(actuacion);
      }
    }
  }

  linkFichaDesigna(rowGroup: RowGroup, id: string) {
    if (this.pantalla == "JE" && id) {
      id = id.split("\n")[0];
      sessionStorage.setItem("vieneDeJE", "true");
      this.busquedaDesignaciones(id);
    } else if (this.pantalla == "AE" && id) {
      sessionStorage.setItem("modoBusqueda", "b");
      sessionStorage.setItem("idAsistencia", id.slice(1));
      this.router.navigate(["/fichaAsistencia"]);
    }
  }

  busquedaDesignaciones(id) {
    this.progressSpinner = true;

    let designaItem = new DesignaItem();
    designaItem.ano = id.split("/")[0];
    designaItem.codigo = id.split("/")[1];
    let datos = [];

    this.sigaServices.post("designaciones_busqueda", designaItem).subscribe(
      n => {
        let error = null;
        datos = JSON.parse(n.body);

        if (datos[0] != null && datos[0] != undefined) {
          if (datos[0].error != null) {
            error = datos[0].error;
          }
        }

        datos.forEach(async element => {
          element.factConvenio = element.ano;
          element.anio = element.ano;
          element.ano = 'D' + element.ano + '/' + element.codigo;
          //  element.fechaEstado = new Date(element.fechaEstado);
          element.fechaEstado = this.formatDate(element.fechaEstado);
          element.fechaFin = this.formatDate(element.fechaFin);
          element.fechaAlta = this.formatDate(element.fechaAlta);
          element.fechaEntradaInicio = this.formatDate(element.fechaEntradaInicio);
          if (element.estado == 'V') {
            element.sufijo = element.estado;
            element.estado = 'Activo';
          } else if (element.estado == 'F') {
            element.sufijo = element.estado;
            element.estado = 'Finalizado';
          } else if (element.estado == 'A') {
            element.sufijo = element.estado;
            element.estado = 'Anulada';
          }
          element.nombreColegiado = element.apellido1Colegiado + " " + element.apellido2Colegiado + ", " + element.nombreColegiado;
          if (element.nombreInteresado != null) {
            element.nombreInteresado = element.apellido1Interesado + " " + element.apellido2Interesado + ", " + element.nombreInteresado;
          }
          if (element.art27 == "1") {
            element.art27 = "Si";
          } else {
            element.art27 = "No";
          }
          await this.getDatosAdicionales(element);
          await this.getComboTipoDesignas();

          this.progressSpinner = false;

          this.enlaceADesignacion(element);

        },
          err => {
            this.progressSpinner = false;
          });
      },
      err => {
        this.progressSpinner = false;
      });
  }

  getDatosAdicionales(element) {
    this.progressSpinner = true;
    let desginaAdicionales = new DesignaItem();
    let anio = element.ano.split("/");
    desginaAdicionales.ano = Number(anio[0].substring(1, 5));
    desginaAdicionales.numero = element.numero;
    desginaAdicionales.idTurno = element.idTurno;
    return this.sigaServices.post("designaciones_getDatosAdicionales", desginaAdicionales).toPromise().then(
      n => {

        let datosAdicionales = JSON.parse(n.body);
        if (datosAdicionales[0] != null && datosAdicionales[0] != undefined) {
          element.delitos = datosAdicionales[0].delitos;
          element.fechaOficioJuzgado = datosAdicionales[0].fechaOficioJuzgado;
          element.observaciones = datosAdicionales[0].observaciones;
          element.fechaRecepcionColegio = datosAdicionales[0].fechaRecepcionColegio;
          element.defensaJuridica = datosAdicionales[0].defensaJuridica;
          element.fechaJuicio = datosAdicionales[0].fechaJuicio;
        }
      },
      err => {
      }
    );
  }

  enlaceADesignacion(dato) {
    this.progressSpinner = true;
    let idProcedimiento = dato.idProcedimiento;
    let datosProcedimiento;
    let datosModulo;

    if (dato.idTipoDesignaColegio != null && dato.idTipoDesignaColegio != undefined && this.comboTipoDesigna != undefined) {
      this.comboTipoDesigna.forEach(element => {
        if (element.value == dato.idTipoDesignaColegio) {
          dato.descripcionTipoDesigna = element.label;
        }
      });
    }

    let designaProcedimiento = new DesignaItem();
    designaProcedimiento.idPretension = dato.idPretension;
    designaProcedimiento.idTurno = dato.idTurno;
    designaProcedimiento.ano = dato.factConvenio;
    designaProcedimiento.numero = dato.numero
    this.sigaServices.post("designaciones_busquedaProcedimiento", designaProcedimiento).subscribe(
      n => {
        datosProcedimiento = JSON.parse(n.body);
        if (datosProcedimiento.length == 0) {
          dato.nombreProcedimiento = "";
          dato.idProcedimiento = "";
        } else {
          dato.nombreProcedimiento = datosProcedimiento[0].nombreProcedimiento;
          dato.idProcedimiento = designaProcedimiento.idPretension;
        }

        let designaModulo = new DesignaItem();
        designaModulo.idProcedimiento = idProcedimiento;
        designaModulo.idTurno = dato.idTurno;
        designaModulo.ano = dato.factConvenio;
        designaModulo.numero = dato.numero
        this.sigaServices.post("designaciones_busquedaModulo", designaModulo).subscribe(
          n => {
            datosModulo = JSON.parse(n.body);
            if (datosModulo.length == 0) {
              dato.modulo = "";
              dato.idModulo = "";
            } else {
              dato.modulo = datosModulo[0].modulo;
              dato.idModulo = datosModulo[0].idModulo;
            }
            this.sigaServices.post("designaciones_busquedaJuzgado", dato.idJuzgado).subscribe(
              n => {
                dato.nombreJuzgado = n.body;
                sessionStorage.setItem("nuevaDesigna", "false");
                sessionStorage.setItem("designaItemLink", JSON.stringify(dato));
                this.router.navigate(["/fichaDesignaciones"]);

              },
              err => {
                this.progressSpinner = false;
                dato.nombreJuzgado = "";
                sessionStorage.setItem("nuevaDesigna", "false");
                sessionStorage.setItem("designaItemLink", JSON.stringify(dato));
                this.router.navigate(["/fichaDesignaciones"]);
              }, () => {
                this.progressSpinner = false;
              });
          },
          err => {
            this.progressSpinner = false;

            //console.log(err);
          }, () => {
            this.progressSpinner = false;
          });
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }, () => {
        this.progressSpinner = false;
      });
  }

  getComboTipoDesignas() {
    this.progressSpinner = true;

    return this.sigaServices.get("designas_tipoDesignas").toPromise().then(
      n => {
        this.comboTipoDesigna = n.combooItems;
      },
      err => {
      }
    );
  }

  linkFichaAsistencia(id) {
    let idAsistencia: string = id;
    if (this.pantalla == "AE") {
      sessionStorage.setItem("filtroAsistencia", JSON.stringify(this.filtroAsistencia));
      sessionStorage.setItem("idAsistencia", idAsistencia.substr(1));
      sessionStorage.setItem("modoBusqueda", "b");
      this.router.navigate(['/fichaAsistencia']);
    }
  }
  linkToFichaEJG(rowGroup: RowGroup, idEJG: string) {
    if (this.pantalla == "AE" && idEJG) {
      idEJG = idEJG.substring(1);
      sessionStorage.setItem("filtroAsistencia", JSON.stringify(this.filtroAsistencia));
      sessionStorage.setItem("modoBusqueda", "b");
      let ejgItem = new EJGItem();
      ejgItem.numAnnioProcedimiento = idEJG;
      ejgItem.annio = idEJG.split("/")[0];
      ejgItem.numero = idEJG.split("/")[1];
      ejgItem.tipoEJG = rowGroup.rows[0].cells[6].value;
      this.progressSpinner = true;

      this.sigaServices.post("gestionejg_datosEJG", ejgItem).subscribe(
        n => {
          let ejgObject: any[] = JSON.parse(n.body).ejgItems;
          let datosItem: EJGItem = ejgObject[0];
          this.persistenceService.setDatos(datosItem);
          this.consultaUnidadFamiliar(ejgItem);
          this.commonsService.scrollTop();
          this.progressSpinner = false;
        },
        err => {
          console.error(err);
          this.showMsg('error', 'Error al consultar el EJG', '');
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );

    } else if (this.pantalla == "JE" && idEJG) {
      idEJG = idEJG.split("\n")[0];
      // sessionStorage.setItem("filtroAsistencia", JSON.stringify(this.filtro));
      // sessionStorage.setItem("modoBusqueda","b");
      let ejgItem = new EJGItem();
      ejgItem.numAnnioProcedimiento = idEJG;
      ejgItem.annio = idEJG.split("/")[0];
      ejgItem.numero = idEJG.split("/")[1];
      //ejgItem.tipoEJG = rowGroup.rows[0].cells[6].value;
      this.progressSpinner = true;

      this.sigaServices.post("gestionejg_datosEJGJustificacionExpres", ejgItem).subscribe(
        n => {
          let ejgObject: any[] = JSON.parse(n.body).ejgItems;
          let datosItem: EJGItem = ejgObject[0];
          this.persistenceService.setDatosEJG(datosItem);
          //this.consultaUnidadFamiliar(ejgItem);
          if (sessionStorage.getItem("EJGItem")) {
            sessionStorage.removeItem("EJGItem");
          }
          sessionStorage.setItem("vieneDeJE", "true");

          this.router.navigate(['/gestionEjg']);
          this.progressSpinner = false;
          this.commonsService.scrollTop();
        },
        err => {
          console.error(err);
          this.showMsg('error', 'Error al consultar el EJG', '');
          this.progressSpinner = false;
        }
      );
    }
  }

  consultaUnidadFamiliar(selected) {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_unidadFamiliarEJG", selected).subscribe(
      n => {
        let datosFamiliares: any[] = JSON.parse(n.body).unidadFamiliarEJGItems;
        this.persistenceService.setBodyAux(datosFamiliares);

        if (sessionStorage.getItem("EJGItem")) {
          sessionStorage.removeItem("EJGItem");
        }

        this.router.navigate(['/gestionEjg']);
        this.progressSpinner = false;
        this.commonsService.scrollTop();
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  searchRelaciones(actuacion: Actuacion) {

    this.progressSpinner = true;

    let item = ["D" + actuacion.designaItem.ano, actuacion.designaItem.idTurno, actuacion.designaItem.idInstitucion, actuacion.designaItem.numero];

    this.sigaServices.post("designacionesBusquedaRelaciones", item).subscribe(
      n => {

        let relaciones = JSON.parse(n.body).relacionesItem;
        let error = JSON.parse(n.body).error;

        if (error != null && error.description != null) {
          this.showMsg('info', this.translateService.instant("general.message.informacion"), error.description);
        } else {
          actuacion.relaciones = relaciones;
        }
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        //console.log(actuacion)
        sessionStorage.setItem("actuacionDesignaJE", JSON.stringify(actuacion));
        this.router.navigate(['/fichaActDesigna']);
      }
    );
  }
  fillRowGroup(event, rowGroup) {
    rowGroup.id = event;
  }

  onClickBotonJuzProc(cell, rowGroup) {

    if (cell.value[3] == 'C') {
      // Cambia a juzgado
      cell.value[3] = 'J';

      // Label juzgados
      cell.value[0] = this.textoJuzActivo;

      // Valor seleccionado del combo de juzgados
      cell.value[4] = '';
    } else {
      // Cambia a comisarías
      cell.value[3] = 'C';

      // Label comisarías
      cell.value[0] = this.textoComActivo;

      // Valor seleccionado del combo de comisarías
      cell.value[4] = '';
    }

    if (cell.value[5] == 'Asistencia') {
      rowGroup.rows[0].cells[5].value = '';
    }
  }

  navigateComunicarJE(rowGroup, identificador) {
    sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
    if (this.pantalla == 'JE') {
      //IDMODULO de SJCS es 10
      sessionStorage.setItem("idModulo", '10');

      this.getDatosComunicarJE(rowGroup, identificador);
    }
    else this.msgs = [
      {
        severity: "info",
        summary: "En proceso",
        detail: "Boton no funcional actualmente"
      }
    ];
  }



  getDatosComunicarJE(rowGroup, expediente) {
    let datosSeleccionados = [];
    let rutaClaseComunicacion = this.currentRoute.toString();

    this.sigaServices
      .post("dialogo_claseComunicacion", rutaClaseComunicacion)
      .subscribe(
        data => {
          this.idClaseComunicacion = JSON.parse(
            data["body"]
          ).clasesComunicaciones[0].idClaseComunicacion;
          this.sigaServices
            .post("dialogo_keys", this.idClaseComunicacion)
            .subscribe(
              data => {
                this.keys = JSON.parse(data["body"]).keysItem;
                this.sigaServices.get("institucionActual").subscribe(n => {
                  let institucionActual = n.value;
                  let i = 0;
                  let anioEJG: String = expediente.substr(0, 4);
                  let numEJG: String = expediente.substr(5);
                  let aniodes: String = rowGroup.rows[0].cells[10].value;
                  let idTurno: String = rowGroup.rows[0].cells[17].value;
                  let numeroDes: String = rowGroup.rows[0].cells[19].value;

                  this.sigaServices.getParam("justificacionExpres_getEJG", "?numEjg=" + numEJG + "&anioEjg=" + anioEJG).subscribe(
                    ejg => {
                      let keysValues = [];

                      keysValues.push(ejg.idinstitucion);
                      keysValues.push(idTurno);
                      keysValues.push(aniodes);
                      keysValues.push(numeroDes);
                      keysValues.push(ejg.idtipoejg);
                      keysValues.push(anioEJG);
                      keysValues.push(ejg.numero);

                      datosSeleccionados.push(keysValues);

                      sessionStorage.setItem(
                        "datosComunicar",
                        JSON.stringify(datosSeleccionados)
                      );

                      i++;
                      if (this.selectedArray.length == i) {
                        this.router.navigate(["/dialogoComunicaciones"]);
                      }
                    });
                });
              });
        }
      );
  }

  expandAll() {
    this.todoDesplegado = true;
    for (let i = 1; i < this.table.nativeElement.children.length; i++) {
      if(!this.table.nativeElement.children[i].children[0].children[0].children[0].children[0].children[0].className.includes("collapse")){
        this.rowGroupArrowClick(this.table.nativeElement.children[i], this.rowGroups[this.from + i-1].id);
        this.iconClickChange(this.table.nativeElement.children[i].children[0].children[0].children[0].children[0].children[0], this.table.nativeElement.children[i].children[0].children[0].children[0].children[0].children[1]);
      }
    }
  }

  collapseAll() {
    this.todoDesplegado = false;
    for (let i = 1; i < this.table.nativeElement.children.length; i++) {
      if(this.table.nativeElement.children[i].children[0].children[0].children[0].children[0].children[0].className.includes("collapse")){
        this.rowGroupArrowClick(this.table.nativeElement.children[i], this.rowGroups[this.from + i-1].id);
        this.iconClickChange2(this.table.nativeElement.children[i].children[0].children[0].children[0].children[0].children[0], this.table.nativeElement.children[i].children[0].children[0].children[0].children[0].children[1]);
      }
    }
  }

  styleObligatorio(evento){
    if((evento==undefined || evento==null || evento=="")){
      return this.commonsService.styleObligatorio(evento);
    }
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}