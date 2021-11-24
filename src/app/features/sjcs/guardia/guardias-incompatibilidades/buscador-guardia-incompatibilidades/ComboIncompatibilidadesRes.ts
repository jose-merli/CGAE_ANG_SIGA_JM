export class ComboIncompatibilidadesRes{
	  labels: string[];
    values: string[];

  constructor(obj: Object) {
    this.labels = obj['labels'];
    this.values = obj['values'];
  }
}
