export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface Pagination {
  lastPage: number;
  perPage: number;
  total: number;
  page: number;
}

export interface ApiResponsePaginated<T> {
  status: string;
  message: string;
  data: T;
  pagination: Pagination;
}

export interface PaginationParams {
  perPage?: number;
  page: number;
}
