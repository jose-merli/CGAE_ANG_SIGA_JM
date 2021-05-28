import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe, APP_BASE_HREF } from '@angular/common';
import { BusquedaJusticiablesComponent } from './busqueda-justiciables/busqueda-justiciables.component';
import { FiltroJusticiablesComponent } from './busqueda-justiciables/filtro-justiciables/filtro-justiciables.component';
import { GestionJusticiablesComponent } from './gestion-justiciables/gestion-justiciables.component';
import { DatosGeneralesComponent } from './gestion-justiciables/datos-generales/datos-generales.component';
import { TablaJusticiablesComponent } from './busqueda-justiciables/tabla-justiciables/tabla-justiciables.component';
import { DataTableModule, PaginatorModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule, GrowlModule, MenubarModule, MultiSelectModule, ConfirmationService } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { PipeTranslationModule } from '../../../commons/translate/pipe-translation.module';
import { TableModule } from 'primeng/table';
import { PrecioModule } from '../../../commons/precio/precio.module';
import { ImagePipe } from '../../../commons/image-pipe/image.pipe';
import { TrimPipePipe } from '../../../commons/trim-pipe/trim-pipe.pipe';
import { SigaServices } from '../../../_services/siga.service';
import { CommonsService } from '../../../_services/commons.service';
import { cardService } from '../../../_services/cardSearch.service';
import { HeaderGestionEntidadService } from '../../../_services/headerGestionEntidad.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { AuthenticationService } from '../../../_services/authentication.service';
import { AuthGuard } from '../../../_guards/auth.guards';
import { environment } from '../../../../environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '../../../_interceptor/jwt.interceptor';
import { CookieService } from 'ngx-cookie-service';
import { FechaModule } from '../../../commons/fecha/fecha.module';
import { routingJusticiables } from './justiciables-routing.module';
import { DatosRepresentanteComponent } from './gestion-justiciables/datos-representante/datos-representante.component';
import { FileUploadModule } from 'primeng/fileupload';
import { AsuntosComponent } from './gestion-justiciables/asuntos/asuntos.component';
import { DatosDireccionComponent } from './gestion-justiciables/datos-direccion/datos-direccion.component';
import { DatosSolicitudComponent } from './gestion-justiciables/datos-solicitud/datos-solicitud.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/primeng';
import { DialogoModule } from '../../../commons/dialog/dialogo.module';
import { DatosAbogadoContrarioComponent } from './gestion-justiciables/datos-abogado-contrario/datos-abogado-contrario.component';
import { DatosProcuradorContrarioComponent } from './gestion-justiciables/datos-procurador-contrario/datos-procurador-contrario.component';
import { DatosPersonalesComponent } from './gestion-justiciables/datos-personales/datos-personales.component';
import { DatosUnidadFamiliarComponent } from './gestion-justiciables/datos-unidad-familiar/datos-unidad-familiar.component';

@NgModule({
  imports: [
    CommonModule,
    routingJusticiables,
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
    FechaModule,
    FileUploadModule,
    DialogoModule,
    ConfirmDialogModule

  ],
  declarations: [
    BusquedaJusticiablesComponent,
    FiltroJusticiablesComponent,
    TablaJusticiablesComponent,
    GestionJusticiablesComponent,
    DatosGeneralesComponent,
    DatosRepresentanteComponent,
    AsuntosComponent,
    DatosSolicitudComponent,
    DatosDireccionComponent,
    DatosAbogadoContrarioComponent,
    DatosProcuradorContrarioComponent,
    DatosPersonalesComponent,
    DatosUnidadFamiliarComponent
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
  ],
  exports: [AsuntosComponent]

})
export class JusticiablesModule { }
