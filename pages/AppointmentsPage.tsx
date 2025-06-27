"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowLeft, Loader2, ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import type { Patient, Appointment } from "../interfaces"
import { appointmentService } from "../services/api"
import ConfirmationModal from "../modals/ConfirmationModal"
import ProgressBar from "../components/ProgressBar"

interface AppointmentsPageProps {
  patient: Patient
  specialty: string
  onBack: () => void
  onSuccess: () => void
}

const stepLabels = ["Autenticación", "Especialidad", "Selección de Cita"]

const AppointmentCardSkeleton = () => (
  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
    <CardContent className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 flex-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 sm:h-5 sm:w-5 bg-slate-600 rounded animate-pulse flex-shrink-0" />
            <div className="h-4 bg-slate-600 rounded animate-pulse w-24 sm:w-32" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 sm:h-5 sm:w-5 bg-slate-600 rounded animate-pulse flex-shrink-0" />
            <div className="h-4 bg-slate-600 rounded animate-pulse w-16 sm:w-20" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 sm:h-5 sm:w-5 bg-slate-600 rounded animate-pulse flex-shrink-0" />
            <div className="h-4 bg-slate-600 rounded animate-pulse w-20 sm:w-28" />
          </div>
        </div>

        <div className="h-8 sm:h-10 bg-slate-600 rounded animate-pulse w-full sm:w-24" />
      </div>
    </CardContent>
  </Card>
)

export default function AppointmentsPage({ patient, specialty, onBack, onSuccess }: AppointmentsPageProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const appointmentsPerPage = 3
  const [isPaginationLoading, setIsPaginationLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<Patient>(patient)

  useEffect(() => {
    loadAppointments()
  }, [specialty])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}")
      setUserInfo(storedUserInfo)
    }
  }, [])

  const loadAppointments = async () => {
    try {
      setIsLoading(true)
      setError("")
      setCurrentPage(1) // Reset pagination when loading new specialty
      const response = await appointmentService.getAvailableAppointments({
        especialidad: specialty,
      })

      const availableAppointments = response?.content

      if (availableAppointments) {
        const formattedAppointments = availableAppointments.map((appointment) => {
          const date = new Date(appointment.fechaHora)
          const isValidDate = !isNaN(date.getTime())

          if (!isValidDate) {
            console.error("Invalid date detected:", appointment.fechaHora)
            return {
              ...appointment,
              formattedDate: "Fecha inválida",
              formattedTime: "Hora inválida",
            }
          }

          return {
            ...appointment,
            formattedDate: date.toLocaleDateString("es-CO", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
            formattedTime: date.toLocaleTimeString("es-CO", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }
        })

        setAppointments(formattedAppointments)
      } else {
        setError(response?.message || "No se encontraron citas disponibles para la especialidad seleccionada.")
      }
    } catch (err) {
      setError("Error al cargar las citas disponibles")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppointmentSelect = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowConfirmModal(true)
  }

  const handleConfirmBooking = async () => {
    if (!selectedAppointment) return

    try {
      setIsBooking(true)
      const success = await appointmentService.bookAppointment({
        citaId: selectedAppointment.id,
        pacienteId: userInfo.id || 0, // Fallback to 0 if id is undefined
      })

      if (success) {
        setShowConfirmModal(false)
        onSuccess()
      } else {
        setError("Error al reservar la cita. Intente nuevamente.")
      }
    } catch (err) {
      console.log("Error: ", err)
      setError("Error al reservar la cita. Intente nuevamente.")
    } finally {
      setIsBooking(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CO", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Pagination logic with sliding window
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage)
  const startIndex = (currentPage - 1) * appointmentsPerPage
  const endIndex = startIndex + appointmentsPerPage
  const currentAppointments = appointments.slice(startIndex, endIndex)

  // Calculate visible page numbers (sliding window of 5 pages)
  const getVisiblePages = () => {
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // If total pages is 5 or less, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Calculate the start of the sliding window
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const end = Math.min(totalPages, start + maxVisiblePages - 1)

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const visiblePages = getVisiblePages()
  const canGoBack10 = currentPage > 10
  const canGoForward10 = currentPage + 10 <= totalPages

  const goToNextPage = async () => {
    if (currentPage < totalPages) {
      setIsPaginationLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setCurrentPage(currentPage + 1)
      setIsPaginationLoading(false)
    }
  }

  const goToPrevPage = async () => {
    if (currentPage > 1) {
      setIsPaginationLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setCurrentPage(currentPage - 1)
      setIsPaginationLoading(false)
    }
  }

  const goToPage = async (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setIsPaginationLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setCurrentPage(page)
      setIsPaginationLoading(false)
    }
  }

  const goBack10Pages = async () => {
    const targetPage = Math.max(1, currentPage - 10)
    if (targetPage !== currentPage) {
      setIsPaginationLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setCurrentPage(targetPage)
      setIsPaginationLoading(false)
    }
  }

  const goForward10Pages = async () => {
    const targetPage = Math.min(totalPages, currentPage + 10)
    if (targetPage !== currentPage) {
      setIsPaginationLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setCurrentPage(targetPage)
      setIsPaginationLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white text-lg">Cargando citas disponibles...</p>
        </div>
      </div>
    )
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
          {/* Ajustar el botón para que use handleBackToSpecialty en lugar de onBack */}
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10 h-8 px-2 sm:h-10 sm:px-4">
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Volver</span>
          </Button>
          <img src="/logo.svg" alt="DinamicAPPS" className="h-10 sm:h-12 w-auto" />
          {/* Botón para cerrar sesión */}
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
          <ProgressBar currentStep={3} totalSteps={3} stepLabels={stepLabels} />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Citas Disponibles</h1>
          <p className="text-sm sm:text-base text-blue-200">{specialty} - Seleccione la cita de su preferencia</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-3 py-2 rounded mb-4 text-sm">{error}</div>
        )}

        {appointments.length === 0 && !isLoading ? (
          <Card className="text-center py-8 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent>
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">No hay citas disponibles</h3>
              <p className="text-slate-400 text-sm">
                No se encontraron citas disponibles para {specialty} en este momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="grid gap-4 mb-6 min-h-[240px] content-start">
              {isLoading || isPaginationLoading
                ? // Show skeletons while loading
                  Array.from({ length: appointmentsPerPage }).map((_, index) => (
                    <AppointmentCardSkeleton key={`skeleton-${index}`} />
                  ))
                : currentAppointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="hover:shadow-2xl transition-all duration-300 cursor-pointer bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:scale-102"
                      onClick={() => handleAppointmentSelect(appointment)}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 flex-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                              <p className="font-semibold text-white text-sm sm:text-base">
                                {formatDate(appointment.fechaHora)}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                              <p className="font-semibold text-white text-sm sm:text-base">
                                {formatTime(appointment.fechaHora)}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                              <p className="font-semibold text-white text-sm sm:text-base truncate">
                                {appointment.medico?.nombre}
                              </p>
                            </div>
                          </div>

                          <Button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm sm:text-base w-full sm:w-auto">
                            Seleccionar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {/* Go back 10 pages */}
                  {canGoBack10 && (
                    <Button
                      variant="outline"
                      onClick={goBack10Pages}
                      disabled={isPaginationLoading}
                      className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700 h-8 px-2 sm:h-10 sm:px-3"
                      title="Retroceder 10 páginas"
                    >
                      <span className="text-xs sm:text-sm">{"<<"}</span>
                    </Button>
                  )}

                  {/* Previous page */}
                  <Button
                    variant="outline"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1 || isPaginationLoading}
                    className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700 h-8 px-2 sm:h-10 sm:px-4"
                  >
                    <ChevronLeft className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Anterior</span>
                  </Button>

                  {/* Show first page if not in visible range */}
                  {visiblePages[0] > 1 && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => goToPage(1)}
                        disabled={isPaginationLoading}
                        className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700 w-8 h-8 sm:w-10 sm:h-10 text-sm"
                      >
                        1
                      </Button>
                      {visiblePages[0] > 2 && <span className="text-slate-400 px-1 text-sm">...</span>}
                    </>
                  )}

                  {/* Visible page numbers */}
                  <div className="flex items-center gap-1">
                    {visiblePages.map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => goToPage(page)}
                        disabled={isPaginationLoading}
                        className={`w-8 h-8 sm:w-10 sm:h-10 text-sm ${
                          currentPage === page
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  {/* Show last page if not in visible range */}
                  {visiblePages[visiblePages.length - 1] < totalPages && (
                    <>
                      {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                        <span className="text-slate-400 px-1 text-sm">...</span>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => goToPage(totalPages)}
                        disabled={isPaginationLoading}
                        className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700 w-8 h-8 sm:w-10 sm:h-10 text-sm"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}

                  {/* Next page */}
                  <Button
                    variant="outline"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages || isPaginationLoading}
                    className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700 h-8 px-2 sm:h-10 sm:px-4"
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="h-4 w-4 sm:ml-2" />
                  </Button>

                  {/* Go forward 10 pages */}
                  {canGoForward10 && (
                    <Button
                      variant="outline"
                      onClick={goForward10Pages}
                      disabled={isPaginationLoading}
                      className="bg-slate-800/50 border-slate-600 text-white hover:bg-slate-700 h-8 px-2 sm:h-10 sm:px-3"
                      title="Avanzar 10 páginas"
                    >
                      <span className="text-xs sm:text-sm">{">>"}</span>
                    </Button>
                  )}
                </div>

                <p className="text-slate-400 text-xs sm:text-sm">
                  Página {currentPage} de {totalPages} - Mostrando {startIndex + 1}-
                  {Math.min(endIndex, appointments.length)} de {appointments.length} citas
                </p>
              </div>
            )}
          </div>
        )}

        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmBooking}
          appointment={selectedAppointment}
          patientName={`${userInfo.nombres || ""} ${userInfo.apellidos || ""}`}
          isLoading={isBooking}
        />
      </div>
    </div>
  )
}
