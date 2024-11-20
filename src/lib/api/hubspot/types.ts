export interface ApiResponse<T> {
  results: T[];
  paging?: {
    next?: {
      link: string;
    };
  };
}

export interface ApiError {
  status: number;
  message: string;
  correlationId?: string;
  requestId?: string;
}

export interface RequestOptions {
  method?: string;
  headers: Record<string, string>;
  body?: string;
}