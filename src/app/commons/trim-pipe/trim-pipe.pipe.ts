import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "trimPipe"
})
export class TrimPipePipe implements PipeTransform {
  transform(value: any): any {
    if (value != null && value != undefined) {
      return value.trim();
    }
  }
}
