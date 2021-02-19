import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Message } from 'primeng/components/common/api';
import { DataService } from '../../shared/services/data.service';
import { PreviousRouteService } from '../../shared/services/previous-route.service';

@Component({
  selector: 'app-tarjeta-datos-generales-calendario',
  templateUrl: './tarjeta-datos-generales-calendario.component.html',
  styleUrls: ['./tarjeta-datos-generales-calendario.component.scss']
})
export class TarjetaDatosGeneralesCalendarioComponent implements OnInit {

  msgs: Message[] = [];
  datePickers1 = [
    {
      title: "Fecha desde",
      // controlName: 'fechadesde'
      value: null
    },
    {
      title: "Fecha hasta",
      // controlName: 'fechahasta'
      value: null
    },
    {
      title: "Fecha programada",
      // controlName: 'fechaprogramada'
      value: null
    }];
  inputs1 = [
    {
      nombre: "Observaciones",
      valor: "",
      controlName: 'observaciones'
    }];

  selectores1 = [
    {
      nombre: "Listado Guardias",
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    }
  ];

  constructor(private data: DataService, private previousRouteService: PreviousRouteService) { }

  dgForm = new FormGroup({
    observaciones: new FormControl(''),
    // fechadesde: new FormControl(''),
    // fechahasta: new FormControl(''),
    // fechaprogramada: new FormControl('')
  });

  ngOnInit(): void {

    this.previousRouteService.previousUrl.subscribe(url => {
      console.log(url);
      if (url == "/pantallaCalendariosComponent" || url == null) {

        this.data.currentMessage.subscribe(message => {

          if (message.fechaDesde != null) {
            this.dgForm.controls["observaciones"].setValue(message.observaciones);
            this.datePickers1[0].value = new Date(this.dateFormat(message.fechaDesde));
            this.datePickers1[1].value = new Date(this.dateFormat(message.fechaHasta));
            this.datePickers1[2].value = new Date(this.dateFormat(message.fechaProgramada));
            this.selectores1[0].opciones.push(
              { label: message.listadoGuardia, value: 0 });
          }

        });

      }

    });

  }

  dateFormat(fecha) {

    let fechaArray = fecha.split('/');
    return `${fechaArray[2]}-${fechaArray[1]}-${fechaArray[0]}`;
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail,
    });
  }

  clear() {
    this.msgs = [];
  }

  capturar() {

  }

}
