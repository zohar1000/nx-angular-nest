export interface ServerResponse {
  isSuccess: boolean;
  data?: any;
  error?: {
    code?: number,
    message?: string
  };
}
