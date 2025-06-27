"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stethoscope, SmileIcon as Tooth, ArrowLeft, LogOut } from "lucide-react"
import ProgressBar from "../components/ProgressBar"
import type { Patient } from "../interfaces"

interface SpecialtyPageProps {
  patient: Patient;
  onSpecialtySelect: (specialty: string) => void
  onBack: () => void
}

const specialties = [
  {
    id: "Medicina general",
    name: "Medicina General",
    description: "Consulta médica general para diagnóstico y tratamiento",
    icon: Stethoscope,
    color: "bg-blue-500",
  },
  {
    id: "Examen odontológico",
    name: "Examen Odontológico",
    description: "Revisión dental y tratamientos odontológicos",
    icon: Tooth,
    color: "bg-green-500",
  },
]

const stepLabels = ["Autenticación", "Especialidad", "Selección de Cita"]

export default function SpecialtyPage({ onSpecialtySelect, onBack }: SpecialtyPageProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("")
  const [userInfo, setUserInfo] = useState<{ nombres?: string; apellidos?: string }>({})

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
      setUserInfo(storedUserInfo)
    }
  }, [])

  const handleContinue = () => {
    if (selectedSpecialty) {
      onSpecialtySelect(selectedSpecialty)
    }
  }

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
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <img src="/logo.svg" alt="DinamicAPPS" className="h-10 sm:h-12 w-auto" />
          {/* Botón para cerrar sesión con icono de salida */}
          <Button
            variant="ghost"
            onClick={() => {
              localStorage.removeItem("token")
              localStorage.removeItem("userInfo")
              window.location.reload()
            }}
            className="text-white hover:bg-white/10 h-8 px-2 sm:h-10 sm:px-4"
          >
            <LogOut className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 max-w-4xl mx-auto px-4 pb-6 flex flex-col">
        {/* Progress Bar */}
        <div className="mb-6">
          <ProgressBar currentStep={2} totalSteps={3} stepLabels={stepLabels} />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            {userInfo.nombres && userInfo.apellidos ? (
              `Bienvenido, ${userInfo.nombres} ${userInfo.apellidos}`
            ) : (
              "Bienvenido, Usuario"
            )}
          </h1>
          <p className="text-base sm:text-lg text-blue-200">Seleccione la especialidad médica para su cita</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 flex-1">
          {specialties.map((specialty) => {
            const Icon = specialty.icon
            const isSelected = selectedSpecialty === specialty.id

            return (
              <Card
                key={specialty.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-2xl bg-slate-800/50 border-slate-700 backdrop-blur-sm ${
                  isSelected ? "ring-2 ring-blue-500 shadow-2xl scale-105" : "hover:scale-102"
                }`}
                onClick={() => setSelectedSpecialty(specialty.id)}
              >
                <CardHeader className="text-center pb-3">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 ${specialty.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-white">{specialty.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-slate-300 text-center text-sm sm:text-base">{specialty.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedSpecialty}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-2 sm:py-3 text-base sm:text-lg font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  )
}
