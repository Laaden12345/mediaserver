export interface User {
  user_id?: string,
  username: string,
  password: string,
  email: string,
  scopes?: string[],
  created_at?: string,
  last_login?: string,
}