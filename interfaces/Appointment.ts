import { Doctor } from "./Doctor";

export interface Appointment {
  id: number;
  especialidad: string;
  fechaHora: string;
  estado: "Disponible" | "Reservada" | "Completada";
  idmedico: number;
  medico?: Doctor;
}
