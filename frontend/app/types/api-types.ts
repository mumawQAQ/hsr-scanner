export type ApiResponse<T> = {
  status: 'success' | 'failed';
  message: string; // this only exists when status is 'error'
  data?: T; // this only exists when status is 'success'
};
