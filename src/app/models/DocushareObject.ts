import { ErrorItem } from "./ErrorItem";
import { DocushareItem } from "./DocushareItem";
export class DocushareObject {
  error: Error;
  docuShareObjectVO: DocushareItem[] = [];
  identificadorDS: string;
  constructor() {}
}
