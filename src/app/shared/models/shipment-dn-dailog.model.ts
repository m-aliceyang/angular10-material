import { ImportTrackingPostPutAmountModel } from './import-tracking-post-put.model';

export interface ShipmentDnDialogModel {
  systemRef: string;
  amounts: ImportTrackingPostPutAmountModel[];
}
