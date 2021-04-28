import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { JusticiableBusquedaItem } from '../../../../../../models/sjcs/JusticiableBusquedaItem';
import { Message } from 'primeng/components/common/api';
import { DatosColegiadosItem } from '../../../../../../models/DatosColegiadosItem';
import { Location, DatePipe } from '@angular/common';


@Component({
  selector: 'app-detalle-tarjeta-letrados-designa',
  templateUrl: './detalle-tarjeta-letrados-designa.component.html',
  styleUrls: ['./detalle-tarjeta-letrados-designa.component.scss']
})
export class DetalleTarjetaLetradosDesignaComponent implements OnInit {


  msgs: Message[] = [];
  selectedItem: number = 10;
  datos;
  cols;
  rowsPerPage;
  selectMultiple: boolean = false;
  selectionMode: string = "single";
  numSelected = 0;
  art27: String;

  selectedDatos: any = [];

  selectAll: boolean = false;
  progressSpinner: boolean = false;
  @Input() letrados;

  @ViewChild("table") tabla;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService,
    private router: Router,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.getCols();
    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    let datos: DesignaItem = designa;
    this.progressSpinner = true;
    let request = [designa.ano,  designa.idTurno, designa.numero];

    //Buscamos la designacion en la que estamos para extraer la informacion que falta
    this.sigaServices.post("designaciones_busquedaDesignacionActual", request).subscribe(
      data => {
        this.art27 = JSON.parse(data.body).art27;
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );

    this.progressSpinner = true;

    this.datos=this.letrados;
    this.datos.forEach(element => {
      element.fechaDesignacion = this.datepipe.transform(element.fechaDesignacion, 'dd/MM/yyyy');
    });
    //Buscamos los letrados asociados a la designacion
   /*  this.sigaServices.post("designaciones_busquedaLetradosDesignacion", request).subscribe(
      data => {
        let letrados = JSON.parse(data.body);
        if(letrados!=[]){
          this.datos = letrados;
        }
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    ); */
    
  }

  irFichaColegial(){

    let bodyColegiado: DatosColegiadosItem = new DatosColegiadosItem();
      bodyColegiado.nif = this.letrados[0].nif;
      bodyColegiado.idInstitucion = this.letrados[0].numeroInstitucion;
  
      this.sigaServices
        .postPaginado(
          'busquedaCensoGeneral_searchColegiado',
          '?numPagina=1',
          bodyColegiado
        )
              .subscribe((data) => {
          let colegiadoSearch = JSON.parse(data['body']);
          let datosColegiados = colegiadoSearch.colegiadoItem;
  
          if (datosColegiados == null || datosColegiados == undefined ||
            datosColegiados.length == 0) {
            this.getNoColegiado(this.letrados[0]);
          } else {
            sessionStorage.setItem(
              'personaBody',
              JSON.stringify(datosColegiados[0])
            );
            sessionStorage.setItem(
              'esColegiado',
              JSON.stringify(true)
            );
            this.router.navigate(['/fichaColegial']);
          }
        },
                  (err) => {
            this.progressSpinner = false;
  
          });
  }

  getNoColegiado(selectedDatos) {
    let bodyNoColegiado: DatosColegiadosItem = new DatosColegiadosItem();
      bodyNoColegiado.nif = this.letrados[0].nif;
      bodyNoColegiado.idInstitucion = this.letrados[0].numeroInstitucion;

    this.sigaServices
      .postPaginado(
        'busquedaNoColegiados_searchNoColegiado',
        '?numPagina=1',
        bodyNoColegiado
      )
            .subscribe((data) => {
        this.progressSpinner = false;
        let noColegiadoSearch = JSON.parse(data['body']);
        let datosNoColegiados = noColegiadoSearch.noColegiadoItem;

          if (datosNoColegiados[0].fechaNacimiento != null) {
            datosNoColegiados[0].fechaNacimiento = this.personaBodyFecha(
              datosNoColegiados[0].fechaNacimiento
            );
          }

          sessionStorage.setItem(
            'esColegiado',
            JSON.stringify(false)
          );

          sessionStorage.setItem(
            'personaBody',
            JSON.stringify(datosNoColegiados[0])
          );

          this.router.navigate(['/fichaColegial']);
      },
                 (err) => {
          this.progressSpinner = false;

        });
  }

  personaBodyFecha(fecha) {
    let f = fecha.substring(0, 10);
    let year = f.substring(0, 4);
    let month = f.substring(5, 7);
    let day = f.substring(8, 10);

    return day + '/' + month + '/' + year;
  }

  ngOnChanges(changes: SimpleChanges): void {
    //this.datos=this.interesados;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  actualizaSeleccionados() {
    if (this.selectedDatos == undefined) {
      this.selectedDatos = []
    }
    if (this.selectedDatos != undefined) {
      if (this.selectedDatos.length == undefined) this.numSelected = 1;
      else this.numSelected = this.selectedDatos.length;
    }
  }

  getCols() {

    /* 
•	Motivo de la renuncia. Icono con un tooltip para mostrar el campo de observaciones. */
    this.cols = [
      { field: "fechaDesignacion", header: "justiciaGratuita.oficio.designaciones.fechaDesignacion" },
      { field: "nColegiado", header: "censo.resultadosSolicitudesModificacion.literal.nColegiado" },
      { field: "apellidosNombre", header: "justiciaGratuita.oficio.designas.interesados.apellidosnombre" },
      { field: "fechaSolRenuncia", header: "justiciaGratuita.oficio.designas.letrados.fechaSolicitudRenuncia" },
      { field: "fechaEfecRenuncia", header: "justiciaGratuita.oficio.designas.letrados.fechaRenunciaEfectiva" },
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

  NewLetrado(){
    sessionStorage.setItem("letrado",  JSON.stringify(this.letrados[this.letrados.length - 1]));
    this.router.navigate(["/fichaCambioLetrado"]);
  }

}
