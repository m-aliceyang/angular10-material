import {Paginated} from './paginated.model';

export interface KeywordSearchModel extends Paginated {
  keyword: string;
}
