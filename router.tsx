"use client"

import { useState, useEffect } from "react"
import type { Patient } from "./interfaces"
import AuthPage from "./pages/AuthPage"
import SpecialtyPage from "./pages/SpecialtyPage"
import AppointmentsPage from "./pages/AppointmentsPage"
import SuccessPage from "./pages/SuccessPage"

type AppState = "auth" | "specialty" | "appointments" | "success"

export default function AppRouter() {
  const [currentState, setCurrentState] = useState<AppState>("auth")
  const [patient, setPatient] = useState<Patient | null>(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("")

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payloadBase64 = token.split(".")[1];
      if (payloadBase64) {
        try {
          const payload = JSON.parse(atob(payloadBase64));
          const expirationDate = new Date(payload.exp * 1000);
          if (expirationDate > new Date()) {
            setCurrentState("specialty");
          }
        } catch (error) {
          console.error("Error al decodificar el token:", error);
        }
      }
    }
  }, [])

  const handleAuthSuccess = (authenticatedPatient: Patient) => {
    setPatient(authenticatedPatient)
    setCurrentState("specialty")
  }

  const handleSpecialtySelect = (specialty: string) => {
    setSelectedSpecialty(specialty)
    setCurrentState("appointments")
  }

  const handleBackToSpecialty = () => {
    setCurrentState("specialty")
  }

  const handleBackToAuth = () => {
    setCurrentState("auth")
    setPatient(null)
    setSelectedSpecialty("")
  }

  const handleBookingSuccess = () => {
    setCurrentState("success")
  }

  const handleRestart = () => {
    setCurrentState("auth")
    setPatient(null)
    setSelectedSpecialty("")
  }

  switch (currentState) {
    case "auth":
      return <AuthPage onAuthSuccess={handleAuthSuccess} />

    case "specialty":
      return <SpecialtyPage patient={patient!} onSpecialtySelect={handleSpecialtySelect} onBack={handleBackToAuth} />

    case "appointments":
      return (
        <AppointmentsPage
          patient={patient!}
          specialty={selectedSpecialty}
          onBack={handleBackToSpecialty}
          onSuccess={handleBookingSuccess}
        />
      )

    case "success":
      return <SuccessPage onRestart={handleRestart} />

    default:
      return <AuthPage onAuthSuccess={handleAuthSuccess} />
  }
}
