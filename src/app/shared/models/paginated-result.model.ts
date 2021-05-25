import {Paginated} from './paginated.model';

export interface PaginatedResult<T> extends Paginated {
  data?: T[];
  records?: number;
}
