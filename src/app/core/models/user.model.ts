
// --- RESPONSES ---
export interface UsuarioResponse {
  id: number;
  nombre: string;
  correoInstitucional: string;
  carrera: string;
  distrito: string;
  dni: string;
  rol: string;
  verificado: boolean;
  fotoPerfilUrl?: string;
}
