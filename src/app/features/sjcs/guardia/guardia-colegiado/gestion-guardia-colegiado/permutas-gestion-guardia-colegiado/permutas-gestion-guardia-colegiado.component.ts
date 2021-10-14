import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { PermutaItem } from '../../../../../../models/guardia/PermutaItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-permutas-gestion-guardia-colegiado',
  templateUrl: './permutas-gestion-guardia-colegiado.component.html',
  styleUrls: ['./permutas-gestion-guardia-colegiado.component.scss']
})
export class PermutasGestionGuardiaColegiadoComponent implements OnInit {
  cols: any;
  buscadores = [];
  rowsPerPage: any = [];
  selectMultiple: boolean;
  selectedDatos = [];
  selectAll;
  numSelected: number = 0;
  selectedItem: number = 10;
  permisoEscritura;
  progressSpinner;
  msgs;
  permutas;
  body: any;
  constructor(private translateService: TranslateService,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.progressSpinner = true;
    if(this.persistenceService.getDatos()){
      this.body = this.persistenceService.getDatos();
     this.getPermutas();
     this.getCols()
    }
    this.progressSpinner = false
  
    
}

  getCols() {
    this.cols = [
      { field: "fechaconfirmacion", header: "general.cabecera.confirmacion" },//cambiar
      { field: "fechasolicitud", header: "formacion.busquedaInscripcion.fechaSolicitud" },
      { field: "nombreTurno", header: "dato.jgr.guardia.guardias.turno" },
      { field: "nombreGuardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      { field: "motivos", header: "dato.jgr.guardia.guardias.motivos" },

    ];
    this.cols.forEach(it => this.buscadores.push(""))
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

  getPermutas(){
    
    let permutaItem = new PermutaItem();
    permutaItem.idpersona = this.body.idPersona;
    permutaItem.idguardia = this.body.idGuardia;

      this.progressSpinner = true
      this.sigaServices.post("guardiasColegiado_getPermutasColegiado", permutaItem).subscribe(
        n => {
          let error = JSON.parse(n.body).error;
          this.permutas = JSON.parse(n.body).permutaItems;
          this.progressSpinner = false
          if (error != null && error.description != null) {
            this.showMessage( 'info',  this.translateService.instant("general.message.informacion"), error.description );
          }
        },
        err => {
          console.log(err);
          this.progressSpinner = false
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }, () => {
          
        }
      );
  }

  isSelectMultiple() {
    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
  }


  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    //this.table.reset();
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  validar(){}

  permutar(){}
  clear(){
    this.msgs = [];
  }
}
