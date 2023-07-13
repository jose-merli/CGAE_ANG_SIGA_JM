import { Component, ViewEncapsulation } from "@angular/core";
import { ConfirmationService } from "primeng/api";
@Component({
  selector: "app-dialog",
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogComponent {
  constructor(private confirmationService: ConfirmationService) {}

  confirm() {
    this.confirmationService.confirm({
      message: "Are you sure that you want to perform this action?",
      accept: () => {
        //Actual logic to perform a confirmation
      }
    });
  }
}
