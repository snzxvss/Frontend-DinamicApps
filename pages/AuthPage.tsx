"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Loader2, User } from "lucide-react"
import { authService } from "../services/api"
import type { Patient } from "../interfaces"

interface AuthPageProps {
  onAuthSuccess: (patient: Patient) => void
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [documento, setDocumento] = useState("")
  const [fechaNacimiento, setFechaNacimiento] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showLoadingScreen, setShowLoadingScreen] = useState(true)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())

  useEffect(() => {
    // Hide loading screen after animation
    const loadingTimer = setTimeout(() => {
      setShowLoadingScreen(false)
    }, 1600)

    return () => {
      clearTimeout(loadingTimer)
    }
  }, [])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    // Formatear la fecha como YYYY-MM-DD para el backend
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    setFechaNacimiento(formattedDate)
    setIsCalendarOpen(false)
  }

  const handleYearChange = (year: number) => {
    setSelectedYear(year)
  }

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await authService.authenticatePatient({
        documento,
        fechanacimiento: fechaNacimiento,
      })

      console.log("Response received in AuthPage:", response)

      const patient: Patient | null = response?.content || null

      if (patient) {
        console.log("Patient found:", patient)
        onAuthSuccess(patient)
      } else {
        setError("No se encontró un paciente con los datos proporcionados.")
      }
    } catch (err) {
      setError("Error al verificar los datos. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const fillTestData = (patientIndex: number) => {
    const testPatients = [
      { documento: "12345678", fecha: "1990-05-15" },
      { documento: "87654321", fecha: "1985-08-22" },
      { documento: "11223344", fecha: "1992-12-10" },
      { documento: "55667788", fecha: "1988-03-25" },
      { documento: "99887766", fecha: "1995-11-08" },
    ]

    if (testPatients[patientIndex]) {
      setDocumento(testPatients[patientIndex].documento)
      setFechaNacimiento(testPatients[patientIndex].fecha)
      // Also set the selected date for the calendar
      const date = new Date(testPatients[patientIndex].fecha)
      setSelectedDate(date)
      setSelectedYear(date.getFullYear())
      setSelectedMonth(date.getMonth())
    }
  }

  // Generate years from 1900 to current year
  const years = Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i).reverse()

  const formatDate = (date: Date, formatString: string): string => {
    const options: Intl.DateTimeFormatOptions = {}

    if (formatString.includes("yyyy")) options.year = "numeric"
    if (formatString.includes("MM")) options.month = "2-digit"
    if (formatString.includes("dd")) options.day = "2-digit"

    return new Intl.DateTimeFormat("es-ES", options).format(date)
  }

  const CustomCalendar = ({
    selectedDate,
    onDateSelect,
    selectedYear,
    selectedMonth,
    onYearChange,
    onMonthChange,
  }: {
    selectedDate: Date | null
    onDateSelect: (date: Date) => void
    selectedYear: number
    selectedMonth: number
    onYearChange: (year: number) => void
    onMonthChange: (month: number) => void
  }) => {
    const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay()

    const handleDayClick = (day: number) => {
      const date = new Date(selectedYear, selectedMonth, day)
      onDateSelect(date)
    }

    return (
      <div className="custom-calendar bg-slate-800 text-white rounded-lg p-2 w-64 max-w-[90vw]">
        <div className="flex justify-between items-center mb-2 gap-2">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="bg-slate-700 text-white rounded-md p-1 text-xs flex-1 min-w-0"
          >
            {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i)
              .reverse()
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="bg-slate-700 text-white rounded-md p-1 text-xs flex-1 min-w-0"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-slate-400 text-xs py-1 font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} className="text-center text-slate-500 h-7">
              &nbsp;
            </div>
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handleDayClick(i + 1)}
              className={`text-center rounded-md h-7 w-full text-xs transition-colors ${
                selectedDate?.getDate() === i + 1 &&
                selectedDate?.getMonth() === selectedMonth &&
                selectedDate?.getFullYear() === selectedYear
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-600 text-slate-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (showLoadingScreen) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <img src="/logo.svg" alt="DinamicAPPS" className="h-12 w-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden flex flex-col">
      {/* Flowing background lines */}
      <div className="flowing-lines"></div>

      {/* Curved decorative lines */}
      <div className="curved-lines">
        <div className="curved-line" style={{ "--rotation": "45deg" } as React.CSSProperties}></div>
        <div className="curved-line" style={{ "--rotation": "-30deg" } as React.CSSProperties}></div>
        <div className="curved-line" style={{ "--rotation": "60deg" } as React.CSSProperties}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-3 sm:p-4 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <img src="/logo.svg" alt="DinamicAPPS" className="h-8 sm:h-10 w-auto" />
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xs">
          <div className="text-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Sistema de Citas Médicas</h1>
          </div>

          <Card className="shadow-2xl bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-center text-base text-white">Autenticación de Paciente</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="documento" className="flex items-center gap-2 text-slate-200 text-xs">
                    <User className="h-3 w-3" />
                    Documento de Identidad
                  </Label>
                  <Input
                    id="documento"
                    type="text"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    placeholder="Ingrese su número de documento"
                    required
                    disabled={isLoading}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 h-8 text-sm rounded-md"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="fechaNacimiento" className="flex items-center gap-2 text-slate-200 text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M5 19h14M5 7h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z"
                      />
                    </svg>
                    Fecha de Nacimiento
                  </Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Input
                        readOnly
                        value={selectedDate ? formatDate(selectedDate, "PPP") : ""}
                        placeholder="Seleccione su fecha de nacimiento"
                        onClick={() => setIsCalendarOpen(true)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 h-8 text-sm cursor-pointer rounded-md text-left"
                        disabled={isLoading}
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-slate-800 border-slate-600 rounded-lg shadow-xl"
                      align="start"
                      side="bottom"
                      sideOffset={4}
                      alignOffset={0}
                      avoidCollisions={true}
                      collisionPadding={8}
                    >
                      <CustomCalendar
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        selectedYear={selectedYear}
                        selectedMonth={selectedMonth}
                        onYearChange={handleYearChange}
                        onMonthChange={handleMonthChange}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {error && (
                  <div className="bg-red-900/50 border border-red-700 text-red-200 px-2 py-1.5 rounded text-xs">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 h-8 rounded-lg transition-colors text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Acceder al Sistema"
                  )}
                </Button>
              </form>

              <div className="mt-3 p-2 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                <p className="text-xs text-blue-200 font-semibold mb-2">Datos de prueba (click para llenar):</p>
                <div className="text-xs text-blue-300 space-y-1">
                  <button
                    type="button"
                    onClick={() => fillTestData(0)}
                    className="block w-full text-left hover:text-blue-100 transition-colors"
                    disabled={isLoading}
                  >
                    • Doc: 12345678, Fecha: 15 may 1990
                  </button>
                  <button
                    type="button"
                    onClick={() => fillTestData(1)}
                    className="block w-full text-left hover:text-blue-100 transition-colors"
                    disabled={isLoading}
                  >
                    • Doc: 87654321, Fecha: 22 ago 1985
                  </button>
                  <button
                    type="button"
                    onClick={() => fillTestData(2)}
                    className="block w-full text-left hover:text-blue-100 transition-colors"
                    disabled={isLoading}
                  >
                    • Doc: 11223344, Fecha: 10 dic 1992
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
