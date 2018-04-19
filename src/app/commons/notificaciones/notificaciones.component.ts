import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { CalendarModule } from "primeng/calendar";
import { Http, Response } from "@angular/http";
import { MenuItem } from "primeng/api";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { SelectItem } from "primeng/api";
import { CommonsService } from "../../_services/commons.service";

@Component({
  selector: "app-notificaciones",
  templateUrl: "./notificaciones.component.html",
  styleUrls: ["./notificaciones.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NotificacionesComponent implements OnInit {
  formNotificaciones: FormGroup;
  datos: any[];
  colegios: any[];
  displayTable: boolean = false;
  text: string;

  constructor(
    private formBuilder: FormBuilder,
    private commonsService: CommonsService
  ) {
    this.formNotificaciones = this.formBuilder.group({
      colegio: null,
      asunto: null,
      destinatarios: null,
      email: null
    });
  }

  ngOnInit() {
    this.datos = [
      { nombre: "Madrid", obligatorio: "true" },
      { nombre: "Sevilla", obligatorio: "true" },
      { nombre: "Madrid", obligatorio: "false" },
      { nombre: "Madrid", obligatorio: "true" }
    ];

    /*this.colegios = [
      { label: '-', value: null },
      { label: 'Madrid', value: { name: 'Madrid' } },
      { label: 'Toledo', value: { name: 'Toledo' } },
    ];*/
  }

  /*onChangeColegio(e) {
    if (this.formNotificaciones.controls['colegio'].value === null) {
      this.displayTable = false;
    } else {
      this.displayTable = true;
    }

  }*/

  /**
   * Recuperamos el colegio que ha seleccionado el admin
   */
  onChangeColegio(event) {
    console.log(event.value);
  }
}
