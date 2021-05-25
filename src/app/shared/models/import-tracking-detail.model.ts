import {ImportTrackingPostPutModel} from './import-tracking-post-put.model';
import {CreateAndUpdate} from './create-and-update.model';

export interface ImportTrackingDetailModel extends ImportTrackingPostPutModel, CreateAndUpdate {
  id: string;
  consigneeName: string;
  status: string;
  tranType: string;
  destOrig: string;
  company: string;
}
