import { Paginated } from './paginated.model';

export interface ShipmentSearchModel extends Paginated {
  indentNumber?: string;
  mawb?: string;
  hawb?: string;
  etdFrom?: Date;
  etdTo?: Date;
  deliveredFrom?: Date;
  deliveredTo?: Date;
  pickupDateFrom?: Date;
  pickupDateTo?: Date;
  shipper?: string;
  invoice?: string;
  destination?: string;
  status?: string;
  companies?: string[];
  tranType?: string[];
  consignee?: string;
  department?: string;
}
