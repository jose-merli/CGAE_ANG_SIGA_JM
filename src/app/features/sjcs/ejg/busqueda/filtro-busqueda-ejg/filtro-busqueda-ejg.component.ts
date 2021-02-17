import { Component, EventEmitter, Input, OnInit, Output,ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-filtro-busqueda-ejg',
  templateUrl: './filtro-busqueda-ejg.component.html',
  styleUrls: ['./filtro-busqueda-ejg.component.scss']
})
export class FiltroBusquedaEJGComponent implements OnInit {

  
  body: EJGItem = new EJGItem();

  expanded = true;

  @Output() formulario = new EventEmitter<boolean>();
  cForm = new FormGroup({
    anio: new FormControl(''),
    numero: new FormControl(''),
  });
  @Input() selectorEstados = [];
  @Input() selectores = [];
  @Input() datePickers = [];
  @Input() inputs = [];

  selectores1 = [];
  selectores2 = [];
  selectores3 = [];
  selectores4 = [];
  selectores5 = [];
  selectores6 = [];
  datePickers1 = [];
  datePickers2 = [];
  datePickers3 = [];
  inputs1 = [];
  inputs2 = [];
  inputs3 = [];


  cFormValidity = true;
  
  @ViewChild('inputNumero') inputNumero: ElementRef;

  constructor(
    private persistenceService: PersistenceService,
    private router: Router,
    private commonsService: CommonsService
    ) { }

  ngOnInit(): void {
    
    for (let i = 0; i < this.selectores.length; i++) {
      this.selectores1 = this.selectores[0];
      this.selectores2 = this.selectores[1];
      this.selectores3 = this.selectores[2];
      this.selectores4 = this.selectores[3];
      this.selectores5 = this.selectores[4];
      this.selectores6 = this.selectores[5];
    }
    for (let i = 0; i < this.datePickers.length; i++) {
      this.datePickers1 = this.datePickers[0];
      this.datePickers2 = this.datePickers[1];
      this.datePickers3 = this.datePickers[2];
    }
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs1 = this.inputs[0];
      this.inputs2 = this.inputs[1];
      this.inputs3 = this.inputs[2];
    }

    setTimeout(() => {
      this.inputNumero.nativeElement.focus();
    }, 300);
    this.body.annio = new Date().getFullYear().toString();
    
  }

  sendFom(value: FormGroup) {
    this.formulario.emit(value.valid)
  }

  clear() {
    this.body = new EJGItem();
    this.persistenceService.clearFiltros();
    this.inputNumero.nativeElement.focus();
    this.body.annio = new Date().getFullYear().toString();
    this.commonsService.scrollTop();
  }

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }
  
  nuevoEJG(){
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionEjg"]);
  }
}
