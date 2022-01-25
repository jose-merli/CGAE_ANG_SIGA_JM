import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/components/common/message';
import { FacRegistroFichContaItem } from '../../../../models/FacRegistroFichContaItem';

@Component({
    selector: 'app-filtros-exportaciones-contabilidad',
    templateUrl: './filtros-exportaciones-contabilidad.component.html',
    styleUrls: ['./filtros-exportaciones-contabilidad.component.scss']
  })
  export class FiltrosExportacionesContabilidadComponent implements OnInit {
    @Output() busqueda = new EventEmitter<boolean>();
    showDatosGenerales: boolean = true;
    showDatosExportacion: boolean = true;
    progressSpinner: boolean = false;  

    msgs: Message[] = [];
    filtros:FacRegistroFichContaItem = new FacRegistroFichContaItem();

    ngOnInit(): void {
        //En la documentación funcional se pide que por defecto aparezca el campo 
        //con la fecha de dos años antes
        let today = new Date();
        this.filtros.fechaCreacionDesde = new Date(new Date().setFullYear(today.getFullYear() - 2));
    }
  
    clearFilters(){
        this.filtros = new FacRegistroFichContaItem();
    }

    fillFecha(event, campo) {
        if(campo === 'creacionDesde')
            this.filtros.fechaCreacionDesde = event;
        else if(campo === 'creacionHasta')
            this.filtros.fechaCreacionHasta = event;
        else if(campo === 'exportacionDesde')
            this.filtros.fechaExportacionDesde = event;
        else if(campo === ' exportacionHasta')
            this.filtros.fechaExportacionHasta = event;
    }

      
    onHideDatosGenerales(): void {
        this.showDatosGenerales = !this.showDatosGenerales;
    }


    onHideDatosExportacion(): void {
        this.showDatosExportacion = !this.showDatosExportacion;
    }

    searchExportacionesContabilidad(){
        //False para buscar sin historico
        this.busqueda.emit(false)
    }

    clear() {
        this.msgs = [];
    }

}  