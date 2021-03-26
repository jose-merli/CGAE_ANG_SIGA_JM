import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { element } from 'protractor';
import { ConfirmationService, SelectItem } from '../../../../../../../../node_modules/primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-tabla-saltos-compensaciones-guardia',
  templateUrl: './tabla-saltos-compensaciones-guardia.component.html',
  styleUrls: ['./tabla-saltos-compensaciones-guardia.component.scss']
})
export class TablaSaltosCompensacionesGuardiaComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  @Input() datos;
  datosInicial;
  updateSaltosCompen = [];
  nuevo;
  editMode: boolean = false;
  buscadores = [];
  msgs;
  selectedItem: number = 10;
  selectAll;
  selectedDatos: any[] = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  selectionMode = 'multiple';
  comboTurnos: SelectItem[];
  comboGuardias: SelectItem[];
  opcionesTipo = [
    {
      label: 'Salto',
      value: 'S'
    },
    {
      label: 'Compensación',
      value: 'C'
    }
  ];

  @Input() permisoEscritura;
  @Output() search = new EventEmitter<boolean>();

  @ViewChild("tabla") tabla;
  @ViewChild("tablaFoco") tablaFoco: ElementRef;

  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService) { }

  ngOnInit() {

    this.selectedDatos = [];

    if (this.datos != undefined) {
      this.datosInicial = this.datos;
    }

    this.getComboTurno();
    this.getCols();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.historico) {
      this.selectMultiple = false;
    } else {
      this.selectMultiple = true;
    }

    /*this.selectedDatos = [];
    this.updateSaltosCompen = [];
    this.nuevo = false;
    this.datosInicial = this.datos;*/
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
    return dato.fechaUso != null || dato.fechaAnulacion != null;
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

    }
    else {
      this.selectMultiple = false;

    }
    this.search.emit(this.historico);
    this.selectAll = false;
  }


  onChangeSelectAll() {


    if (this.selectAll) {

      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechaUso != null);
        this.numSelected = this.datos.length;
      } else {
        this.selectedDatos = this.datos;
        this.numSelected = this.datos.length;
      }

    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }

    /*if (this.selectAll === true) {
      if (this.nuevo) this.datos.shift();
      this.nuevo = false;
      this.editMode = false;
      this.selectMultiple = false;
      this.editElementDisabled();

      if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
        this.selectMultiple = true;

      } else {
        this.selectedDatos = this.datos;
        this.selectMultiple = false;

      }

      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      if (this.historico)
        this.selectMultiple = true;

    }*/
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }


  edit(evento) {

    if (evento.data && evento.data.fechaUso == null && this.historico) {
      this.selectedDatos.pop();
    }

    // if (this.selectedDatos == undefined) {
    //   this.selectedDatos = [];
    // }
    // if (!this.nuevo && this.permisoEscritura) {

    //   if (!this.selectAll && !this.selectMultiple && !this.historico) {

    //       this.datos.forEach(element => {
    //         element.editable = false;
    //         element.overlayVisible = false;
    //       });

    //       evento.data.editable = true;
    //       this.editMode = true;

    //       this.selectedDatos = [];
    //       this.selectedDatos.push(evento.data);

    //       let findDato = this.datosInicial.find(item => item.nombrepartida === this.selectedDatos[0].nombrepartida && item.descripcion === this.selectedDatos[0].descripcion && item.retencion === this.selectedDatos[0].retencion);

    //       this.selectedBefore = findDato;
    //     } else {
    //       if ((evento.data.fechabaja == null || evento.data.fechabaja == undefined) && this.historico) {
    //         if (this.selectedDatos[0] != undefined) {
    //           this.selectedDatos.pop();
    //         } else {
    //           this.selectedDatos = [];
    //         }
    //     }

    //   }

    // }
  }

  createNewSaltoCompensacion() {
    let dat = this.datos;
    let nuevo = {
      turno: '',
      guardia: '',
      nColegiado: '',
      letrado: '',
      saltoCompensacion: '',
      fecha: '',
      motivo: '',
      fechaUso: ''
    };
    this.datos = [nuevo, ...dat];
  }

  newSaltoCompensacion() {
    this.nuevo = true;
    this.editMode = false;

    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();

    if (this.datosInicial != undefined && this.datosInicial != null) {
      this.datos = this.datosInicial;
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
      this.datos = this.datosInicial;
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
      { field: "turno", header: "dato.jgr.guardia.guardias.turno", width: "18%" },
      { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu", width: "18%" },
      { field: "nColegiado", header: "censo.nuevaSolicitud.numColegiado", width: "7%" },
      { field: "letrado", header: "justiciaGratuita.oficio.turnos.nletrados", width: "18%" },
      { field: "saltoCompensacion", header: "censo.nuevaSolicitud.tipoSolicitud", width: "7%" },
      { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "7%" },
      { field: "motivo", header: "dato.jgr.guardia.guardias.motivos", width: "18%" },
      { field: "fechaUso", header: "dato.jgr.guardia.guardias.fechaUso", width: "7%" },


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

      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;

      }
    }
    // this.volver();
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  getComboTurno() {

    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurnos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTurnos);
      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeTurno() {
    // this.filtros.idGuardia = "";
    // this.comboGuardias = [];

    // if (this.filtros.idTurno) {
    //   this.getComboGuardia();
    // } else {
    //   this.isDisabledGuardia = true;
    // }
  }

  getComboGuardia(idTurno) {
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + idTurno).subscribe(
        data => {
          this.comboGuardias = data.combooItems;
          this.commonsService.arregloTildesCombo(this.comboGuardias);
        },
        err => {
          console.log(err);
        }
      );
  }

  fillFecha(event, dato) {
    dato.fecha = event;
  }

}
