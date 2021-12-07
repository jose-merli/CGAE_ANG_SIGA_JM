import { CommonModule, DatePipe, UpperCasePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/components/common/messageservice";
import { ButtonModule, CheckboxModule, DropdownModule, GrowlModule, InputTextModule, MenubarModule, PaginatorModule } from "primeng/primeng";
import { TableModule } from "primeng/table";
import { ImagePipe } from "../../../../../commons/image-pipe/image.pipe";
import { PipeTranslationModule } from "../../../../../commons/translate/pipe-translation.module";
import { TrimPipePipe } from "../../../../../commons/trim-pipe/trim-pipe.pipe";
import { CommonsService } from "../../../../../_services/commons.service";
import { SigaServices } from "../../../../../_services/siga.service";
import { TablaBusquedaBaremosComponent } from "./tabla-busqueda-baremos.component";

@NgModule({
    imports: [
        CommonModule,
        PaginatorModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        CheckboxModule,
        FormsModule,
        GrowlModule,
        PipeTranslationModule,
        MenubarModule,
        TableModule
    ],
    declarations: [TablaBusquedaBaremosComponent],
    providers: [
        ImagePipe,
        DatePipe,
        TrimPipePipe,
        UpperCasePipe,
        SigaServices,
        CommonsService,
        MessageService
    ],
    exports: [
        TablaBusquedaBaremosComponent
    ]
})
export class TablaBusquedaBaremosModule { }
