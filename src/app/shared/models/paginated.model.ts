export interface Paginated {
  page: number;
  pageSize: number;
  pages?: number;
  order: string;
  dir: string;
  records?: number;
  view?: 'table' | 'card';
}
