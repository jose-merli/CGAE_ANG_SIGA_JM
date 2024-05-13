import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule, DropdownModule, GrowlModule } from "primeng/primeng";
import { TableModule } from "primeng/table";
import { EJGModule } from "./ejg/ejg.module";
import { FacturacionSJCSModule } from "./facturacionSJCS/facturacionsjcs.module";
import { GuardiaModule } from "./guardia/guardia.module";
import { JusticiablesModule } from "./justiciables/justiciables.module";
import { MaestrosModule } from "./maestros/maestros.module";
import { OficioModule } from "./oficio/oficio.module";
import { routingSjcs } from "./sjcs-routing.module";
@NgModule({
  declarations: [],
  imports: [CommonModule, MaestrosModule, OficioModule, JusticiablesModule, GuardiaModule, ConfirmDialogModule, TableModule, GrowlModule, CheckboxModule, DropdownModule, routingSjcs, FacturacionSJCSModule, EJGModule, routingSjcs],
  providers: [],
})
export class SjcsModule {}
