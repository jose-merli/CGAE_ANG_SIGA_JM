import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'siNo'
})
export class SiNoPipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'Sí' : 'No';
  }

}
