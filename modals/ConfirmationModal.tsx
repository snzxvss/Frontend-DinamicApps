"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"
import type { Appointment } from "../interfaces"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  appointment: Appointment | null
  patientName: string
  isLoading?: boolean
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  appointment,
  patientName,
  isLoading = false,
}: ConfirmationModalProps) {
  if (!appointment) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-slate-900 border border-slate-700 rounded-lg shadow-lg p-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-white">Confirmar Cita Médica</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-slate-700 p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <User className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Paciente</p>
                <p className="font-semibold text-white text-lg">{patientName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Fecha</p>
                <p className="font-semibold text-white text-lg">{formatDate(appointment.fechaHora)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Clock className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Hora</p>
                <p className="font-semibold text-white text-lg">{formatTime(appointment.fechaHora)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <User className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Especialidad</p>
                <p className="font-semibold text-white text-lg">{appointment.especialidad}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <User className="h-6 w-6 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Profesional</p>
                <p className="font-semibold text-white text-lg">{appointment.medico?.nombre}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-300 text-center">¿Está seguro de que desea confirmar esta cita médica?</p>
        </div>

        <DialogFooter className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            {isLoading ? "Confirmando..." : "Confirmar Cita"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
