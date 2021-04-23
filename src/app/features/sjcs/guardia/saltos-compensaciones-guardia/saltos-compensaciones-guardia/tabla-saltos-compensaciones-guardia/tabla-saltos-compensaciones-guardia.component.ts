import { Component, OnInit, ChangeDetectorRef, ViewChild, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '../../../../../../commons/translate';
import { SigaServices } from '../../../../../../_services/siga.service';
import { ConfirmationService } from '../../../../../../../../node_modules/primeng/api';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-tabla-saltos-compensaciones-guardia',
  templateUrl: './tabla-saltos-compensaciones-guardia.component.html',
  styleUrls: ['./tabla-saltos-compensaciones-guardia.component.scss']
})
export class TablaSaltosCompensacionesGuardiaComponent implements OnInit {

  rowsPerPage: any = [];

  cols;
  datos;
  datosInicial;
  updateSaltosCompen = [];
  nuevo;
  editMode: boolean = false;
  selectionMode;
  buscadores = [];
  msgs;
  selectedItem: number = 10;
  selectAll;
  selectedDatos: any[] = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;


  @Input() permisoEscritura;
  @Output() search = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService) { }

  ngOnInit() {
    this.selectedDatos = [];
    this.getCols();

    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
    // this.initDatos = JSON.parse(JSON.stringify((this.datos)));

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.historico == false) {
      this.selectMultiple = false;
      this.selectionMode = "single"
    } else {
      this.selectMultiple = true;
      this.selectionMode = "multiple"
    }
    this.selectedDatos = [];
    this.updateSaltosCompen = [];
    this.nuevo = false;
    this.datosInicial = JSON.parse(JSON.stringify(this.datos));
  }
  changeDescripcion(dato) {

    let findDato = this.datosInicial.find(item => item.idRetencion === dato.idRetencion);
    if (dato.descripcion != undefined)
      dato.descripcion = dato.descripcion.trim();
    if (findDato != undefined) {
      if (dato.descripcion != findDato.descripcion) {

        let findUpdate = this.updateSaltosCompen.find(item => item.idRetencion === dato.idRetencion);

        if (findUpdate == undefined) {
          this.updateSaltosCompen.push(dato);
        }
      }
    }

  }

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  isHistorico() {
    this.historico = !this.historico;
    if (this.historico) {

      this.editElementDisabled();
      this.editMode = false;
      this.nuevo = false;
      this.selectMultiple = true;

      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectionMode = "multiple";
    }
    else {
      this.selectMultiple = false;
      this.selectionMode = "single";
    }
    this.search.emit(this.historico);
    this.selectAll = false;
  }


  onChangeSelectAll() {
    if (this.selectAll === true) {
      if (this.nuevo) this.datos.shift();
      this.nuevo = false;
      this.editMode = false;
      this.selectMultiple = false;
      this.editElementDisabled();

      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
        this.selectMultiple = true;
        this.selectionMode = "single";
      } else {
        this.selectedDatos = this.datos;
        this.selectMultiple = false;
        this.selectionMode = "single";
      }
      this.selectionMode = "multiple";
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      if (this.historico)
        this.selectMultiple = true;
      this.selectionMode = "multiple";
    }
  }

  edit(evento) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = [];
    }
    if (!this.nuevo && this.permisoEscritura) {

      if (!this.selectAll && !this.selectMultiple && !this.historico) {

        //   this.datos.forEach(element => {
        //     element.editable = false;
        //     element.overlayVisible = false;
        //   });

        //   evento.data.editable = true;
        //   this.editMode = true;

        //   this.selectedDatos = [];
        //   this.selectedDatos.push(evento.data);

        //   let findDato = this.datosInicial.find(item => item.nombrepartida === this.selectedDatos[0].nombrepartida && item.descripcion === this.selectedDatos[0].descripcion && item.retencion === this.selectedDatos[0].retencion);

        //   this.selectedBefore = findDato;
        // } else {
        //   if ((evento.data.fechabaja == null || evento.data.fechabaja == undefined) && this.historico) {
        //     if (this.selectedDatos[0] != undefined) {
        //       this.selectedDatos.pop();
        //     } else {
        //       this.selectedDatos = [];
        //     }
        // }

      }

    }
  }

  newSaltoCompensacion() {
    this.nuevo = true;
    this.editMode = false;
    this.selectionMode = "single";
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();

    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    // let retencion = {
    //   descripcion: undefined,
    //   retencion: "",
    //   retencionReal: undefined,
    //   claveModelo: undefined,
    //   tipoSociedad: undefined,
    //   editable: true
    // };
    // if (this.datos.length == 0) {
    //   this.datos.push(retencion);
    // } else {
    //   this.datos = [retencion, ...this.datos];
    // }

  }
  disabledSave() {
    return true;
  }

  rest() {
    if (this.datosInicial != undefined) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    } else {
      this.datos = [];
    }

    this.editElementDisabled();
    this.selectedDatos = [];
    this.updateSaltosCompen = [];
    this.nuevo = false;
    this.editMode = false;
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
    this.buscadores = this.buscadores.map(it => it = "");


  }

  editElementDisabled() {
    this.datos.forEach(element => {
      element.editable = false
      element.overlayVisible = false;
    });
  }

  getCols() {

    this.cols = [
      { field: "turno", header: "justiciaGratuita.sjcs.designas.DatosIden.turno", width: "20%" },
      { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu", width: "20%" },
      { field: "nColegiado", header: "censo.nuevaSolicitud.numColegiado", width: "5%" },
      { field: "letrados", header: "justiciaGratuita.oficio.turnos.nletrados", width: "15%" },
      { field: "tipo", header: "censo.nuevaSolicitud.tipoSolicitud", width: "10%" },
      { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "10%" },
      { field: "motivos", header: "dato.jgr.guardia.guardias.motivos", width: "10%" },
      { field: "fechaUso", header: "", width: "10%" },


    ];
    this.cols.forEach(it => this.buscadores.push(""));
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

  actualizaSeleccionados(selectedDatos) {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.numSelected = selectedDatos.length;
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

  isSelectMultiple() {
    if (this.permisoEscritura && !this.historico) {
      if (this.nuevo) this.datos.shift();
      this.editElementDisabled();
      this.editMode = false;
      this.nuevo = false;
      this.selectMultiple = !this.selectMultiple;

      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "single";
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode = "multiple";

      }
    }
    // this.volver();
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }


}
