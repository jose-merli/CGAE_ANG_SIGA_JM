import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "numberPipe"
})
export class NumberPipePipe implements PipeTransform {
  transform(value: string, unit: string): string {

    if (value == undefined) {
      return '';
    }
    let split = value.split(",");
    let value2 = split[1];
    let n = parseInt(value);

    const rx = /(\d+)(\d{3})/;
    return String(n).replace(/^\d+/, function (w) {
      var res = w;
      while (rx.test(res)) {
        res = res.replace(rx, '$1.$2');
      }
      if (value2 != undefined) {
        return res + "," + value2;
      } else {
        return res;
      }

    });
  }
}
