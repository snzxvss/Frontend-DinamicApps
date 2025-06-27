import { AuthRequest, Patient, AppointmentRequest, BookingRequest, Appointment, ResponseModel } from "../interfaces/index";
import { environment } from "../env/development";

const API_URL = environment.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export const authService = {
  async authenticatePatient(request: AuthRequest): Promise<ResponseModel<Patient | null>> {
    const response = await fetch(`${API_URL}/api/paciente/autenticar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const data: ResponseModel<Patient | null> = await response.json();

    console.log("Response received:", data);

    // Guardado de información completa del usuario en localStorage
    if (data.content) {
      const { id, nombres, apellidos, token } = data.content;
      if (token) {
        localStorage.setItem("token", token);
      }
      if (id && nombres && apellidos) {
        localStorage.setItem("userInfo", JSON.stringify({ id, nombres, apellidos }));
      }
    }

    return data;
  },
};

export const appointmentService = {
  async getAvailableAppointments(request: AppointmentRequest): Promise<ResponseModel<Appointment[]>> {
    const response = await fetch(
      `${API_URL}/api/cita/disponibles?especialidad=${encodeURIComponent(request.especialidad)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    return await response.json();
  },

  async bookAppointment(request: BookingRequest): Promise<ResponseModel<null>> {
    const response = await fetch(`${API_URL}/api/cita/reservar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(request),
    });
    return await response.json();
  },
};