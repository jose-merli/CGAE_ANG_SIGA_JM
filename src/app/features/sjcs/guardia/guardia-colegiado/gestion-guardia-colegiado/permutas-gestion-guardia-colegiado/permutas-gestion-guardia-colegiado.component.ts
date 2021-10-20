import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { PermutaItem } from '../../../../../../models/guardia/PermutaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
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
  clickPermuta:boolean = false;
  comboTurnos;
  comboGuardias;
  valueComboTurno;
  valueComboGuardia
  motivos: any;
  constructor(private translateService: TranslateService,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonServices: CommonsService) { }

  ngOnInit() {
    this.progressSpinner = true;
    if(this.persistenceService.getDatos()){
      this.body = this.persistenceService.getDatos();
     this.getPermutas();
     this.getComboTurno();
     if(this.valueComboTurno != null || this.valueComboTurno != undefined){
       this.getComboGuardia();
     }
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

  nuevaFila(){
 this.clickPermuta = true;

 let dummy = {
  fechaconfirmacion: "",
  fechasolicitud: "",
  nombreTurno: "",
  nombreGuardia: "",
  motivos: "",
  nuevoRegistro: true
};

this.permutas = [dummy, ...this.permutas];

  }

  checkPermutar(){
 
      let icon = "fa fa-edit";

      this.confirmationService.confirm({
        key: 'perm',
        message: '¿Desea añadir la siguiente Permuta?',
        icon: icon,
        accept: () => {
          this.permutaColegiado();
          this.restPermutas();

        },
        reject: () => {
          this.msgs = [{
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant("general.message.accion.cancelada")
          }];
          this.restPermutas();

        }
      });
    
  }

  permutaColegiado(){
    let permutaItem = new PermutaItem();
    permutaItem.idturnoConfirmador = this.valueComboTurno;
    permutaItem.idguardiaConfirmador = this.valueComboGuardia;

    permutaItem.motivos = this.motivos;
    permutaItem.idpersonaSolicitante = this.body.idPersona;
    permutaItem.idguardiaSolicitante = this.body.idGuardia;
    permutaItem.idturnoConfirmador = this.body.idTurno;
    console.log("permutado");
    console.log(permutaItem);
  }

  restPermutas(){
    this.selectedDatos = [];
    this.clickPermuta = false;
  }
  getComboTurno() {

    this.sigaServices.getParam("guardiasColegiado_getComboTurnoInscrito",'?idPersona='+ this.body.idPersona).subscribe(
      n => {
        this.comboTurnos = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurnos);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboGuardia() {
    this.sigaServices.getParam(
      "guardiasColegiado_getComboGuardiaDestinoInscrito", "?idTurno=" + this.valueComboTurno).subscribe(
        data => {
          this.comboGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardias);
        },
        err => {
          console.log(err);
        }
      )

  }

  onChangeTurnos() {
    this.valueComboGuardia = "";
    this.comboGuardias = [];

    if (this.valueComboTurno) {
      this.getComboGuardia();
    }
  }

  clear(){
    this.msgs = [];
  }
}
