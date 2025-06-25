//esperado dados de retorno
export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string; // JWT token para autenticação do usuário
}
