import {CreateAndUpdate} from './create-and-update.model';
import {ConsigneePostModel} from './consignee-post.model';

export interface ConsigneeModel extends CreateAndUpdate, ConsigneePostModel {
  id: string;
  companyName: string;
}
