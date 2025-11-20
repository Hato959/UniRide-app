export interface SpringErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  path: string;
  message?: string;
}
