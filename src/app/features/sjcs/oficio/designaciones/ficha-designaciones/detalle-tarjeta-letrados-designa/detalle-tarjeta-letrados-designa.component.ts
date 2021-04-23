import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { JusticiableBusquedaItem } from '../../../../../../models/sjcs/JusticiableBusquedaItem';
import { Message } from 'primeng/components/common/api';


@Component({
  selector: 'app-detalle-tarjeta-letrados-designa',
  templateUrl: './detalle-tarjeta-letrados-designa.component.html',
  styleUrls: ['./detalle-tarjeta-letrados-designa.component.scss']
})
export class DetalleTarjetaLetradosDesignaComponent implements OnInit {

  
  msgs : Message[] = [];
  selectedItem: number = 10;
  datos;
  cols;
  rowsPerPage;
  selectMultiple: boolean = false;
  selectionMode: string = "single";
  numSelected = 0;
  
  selectedDatos: any = [];

  selectAll: boolean= false;
  progressSpinner: boolean = false;

  @ViewChild("table") tabla;

  constructor(private sigaServices: SigaServices, 
    private  translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.getCols(); 
    //this.datos=this.interesados;
    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
  }

  ngOnChanges(changes: SimpleChanges): void {
    //this.datos=this.interesados;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  actualizaSeleccionados(){
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (this.selectedDatos != undefined) {
      if(this.selectedDatos.length ==undefined) this.numSelected=1;
      else this.numSelected = this.selectedDatos.length;
    }
  }

  getCols() {

    /* 
•	Motivo de la renuncia. Icono con un tooltip para mostrar el campo de observaciones. */


    this.cols = [
      { field: "fechaDesignacion", header: "justiciaGratuita.oficio.designaciones.fechaDesignacion" },
      { field: "nColegiado", header: "censo.resultadosSolicitudesModificacion.literal.nColegiado" },
      { field: "apellidosnombre", header: "justiciaGratuita.oficio.designas.interesados.apellidosnombre" },
      { field: "fechaSolicitudRenuncia", header: "justiciaGratuita.oficio.designas.letrados.fechaSolicitudRenuncia" },
      { field: "fechaRenunciaEfectiva", header: "justiciaGratuita.oficio.designas.letrados.fechaRenunciaEfectiva" },
      { field: "motivoRenuncia", header: "justiciaGratuita.oficio.designas.letrados.motivoRenuncia" }
    ];

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
  
  onChangeSelectAll() {
    if (this.selectAll === true) {
      /* if (this.historico) {
        this.selectedDatos = this.datos.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
        this.selectMultiple = true;
        this.selectionMode = "single";
      } else { */
        this.selectedDatos = this.datos;
        /* this.selectMultiple = false;
        this.selectionMode = "single";
      }
      this.selectionMode = "multiple"; */
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
     /*  if (this.historico)
        this.selectMultiple = true;
      this.selectionMode = "multiple"; */
    }
  }

}
