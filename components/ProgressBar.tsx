"use client"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export default function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-3">
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className={`flex items-center ${index + 1 <= currentStep ? "text-blue-400" : "text-slate-500"}`}
          >
            <div
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold mr-1 sm:mr-2 ${
                index + 1 <= currentStep ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-400"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-xs sm:text-sm font-medium hidden md:block">{label}</span>
          </div>
        ))}
      </div>

      <div className="progress-bar h-1.5 sm:h-2">
        <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
      </div>

      <div className="text-center mt-2">
        <span className="text-xs sm:text-sm text-slate-400">
          Paso {currentStep} de {totalSteps}
        </span>
      </div>
    </div>
  )
}
