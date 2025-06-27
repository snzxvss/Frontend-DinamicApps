"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Home } from "lucide-react"

interface SuccessPageProps {
  onRestart: () => void
}

export default function SuccessPage({ onRestart }: SuccessPageProps) {
  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden flex flex-col page-enter">
      {/* Flowing background lines */}
      <div className="flowing-lines"></div>

      {/* Curved decorative lines */}
      <div className="curved-lines">
        <div className="curved-line" style={{ "--rotation": "45deg" } as React.CSSProperties}></div>
        <div className="curved-line" style={{ "--rotation": "-30deg" } as React.CSSProperties}></div>
        <div className="curved-line" style={{ "--rotation": "60deg" } as React.CSSProperties}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 sm:p-6 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <img src="/logo.svg" alt="DinamicAPPS" className="h-10 sm:h-12 w-auto" />
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <Card className="shadow-2xl text-center bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-400 mx-auto mb-4" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">¡Cita Confirmada!</h1>
                <p className="text-slate-300 text-base sm:text-lg">Su cita médica ha sido reservada exitosamente</p>
              </div>

              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-green-300 mb-2">
                  <Calendar className="h-5 w-5" />
                  <p className="font-semibold text-base">Cita reservada correctamente</p>
                </div>
                <p className="text-xs sm:text-sm text-green-200">
                  Recibirá una confirmación por SMS y/o correo electrónico con los detalles de su cita.
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-slate-300">
                  <strong className="text-white">Importante:</strong> Llegue 15 minutos antes de su cita con su
                  documento de identidad.
                </p>

                <Button
                  variant="ghost"
                  onClick={() => {
                    const token = localStorage.getItem("token")
                    if (token) {
                      console.log("Token encontrado, verificando validez...")
                      const payloadBase64 = token.split(".")[1]
                      if (payloadBase64) {
                        try {
                          const payload = JSON.parse(atob(payloadBase64))
                          const expirationDate = new Date(payload.exp * 1000) // Convertir de segundos a milisegundos
                          console.log("Fecha de expiración del token:", expirationDate)
                          // Verificar si el token aún es válido
                          if (expirationDate > new Date()) {
                            console.log("Token válido, refrescando página.")
                            window.location.reload()
                            return
                          }
                        } catch (error) {
                          console.error("Error al decodificar el token:", error)
                        }
                      }
                    }
                    onRestart() // Permitir retroceder si no hay token válido
                  }}
                  className="text-white hover:bg-white/10 h-8 px-2 sm:h-10 sm:px-4"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Volver al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
