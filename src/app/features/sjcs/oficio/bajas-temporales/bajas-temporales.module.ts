import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, APP_BASE_HREF, UpperCasePipe } from '@angular/common';
import { DataTableModule, PaginatorModule, InputTextModule, CheckboxModule, DropdownModule, ButtonModule, GrowlModule, MenubarModule, PickListModule, TooltipModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { PipeTranslationModule } from '../../../../commons/translate/pipe-translation.module';
import { ImagePipe } from '../../../../commons/image-pipe/image.pipe';
import { TrimPipePipe } from '../../../../commons/trim-pipe/trim-pipe.pipe';
import { SigaServices } from '../../../../_services/siga.service';
import { cardService } from '../../../../_services/cardSearch.service';
import { CommonsService } from '../../../../_services/commons.service';
import { HeaderGestionEntidadService } from '../../../../_services/headerGestionEntidad.service';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { AuthGuard } from '../../../../_guards/auth.guards';
import { environment } from '../../../../../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../../../../_interceptor/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { MultiSelectModule } from "primeng/multiselect";
import { PrecioModule } from '../../../../commons/precio/precio.module';
import { TarjetaResumenFijaModule } from '../../../../commons/tarjeta-resumen-fija/tarjeta-resumen-fija.module';
import { FechaComponent } from '../../../../commons/fecha/fecha.component';
import { FechaModule } from '../../../../commons/fecha/fecha.module';
import { routingOficio } from '../oficio-routing.module';
import { BusquedaColegiadoExpressModule } from '../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.module';
import {TreeTableModule} from 'primeng/treetable';
import {ConfirmationService, TreeNode} from 'primeng/api';
import { BajasTemporalesComponent } from './busqueda-bajas-temporales.component';
import { MatSortModule } from '@angular/material/sort';
import { FiltrosBajasTemporales } from './filtros-inscripciones/filtros-bajas-temporales.component';
import { GestionBajasTemporalesComponent } from './gestion-bajas-temporales/gestion-bajas-temporales.component';
import { Paginador2Module } from './paginador2/paginador2.module';
import { GestionBajasTemporalesService } from './gestion-bajas-temporales/gestion-bajas-temporales.service';

@NgModule({
  imports: [
    CommonModule,
    routingOficio,
    DataTableModule,
    PaginatorModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    FormsModule,
    GrowlModule,
    PipeTranslationModule,
    MenubarModule,
    TableModule,
    MultiSelectModule,
    PrecioModule,
    PickListModule,
    TooltipModule,
    TarjetaResumenFijaModule,
    ConfirmDialogModule,
    FechaModule,
    BusquedaColegiadoExpressModule,
    TreeTableModule,
    Paginador2Module,
    MatSortModule
    
  ],
  declarations: [
    BajasTemporalesComponent,
    FiltrosBajasTemporales,
    GestionBajasTemporalesComponent
  ],
  providers: [
    // { provide: TranslationClass.TRANSLATIONS, useValue: TranslationClass.dictionary },
    ImagePipe,
    DatePipe,
    TrimPipePipe,
    UpperCasePipe,
    SigaServices,
    CommonsService,
    cardService,
    HeaderGestionEntidadService,
    MessageService,
    AuthenticationService,
    ConfirmationService,
    GestionBajasTemporalesService,
    AuthGuard,
    {
      provide: APP_BASE_HREF,
      useValue: environment.baseHref
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    CookieService,
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ]
})
export class GestionBajasTemporalesModule { }
