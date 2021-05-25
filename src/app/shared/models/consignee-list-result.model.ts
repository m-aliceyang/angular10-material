import { ConsigneeModel } from './consignee.model';
import {PaginatedResult} from './paginated-result.model';

export interface ConsigneeListResult extends PaginatedResult<ConsigneeModel> {

}
