export interface queryData {
  limit: number;
  offset: number;
  count: number;
  year: string;
  month: string;
}

export interface UserQuery {
  limit: number;
  offset: number;
  count: number;
  search: string;
}
