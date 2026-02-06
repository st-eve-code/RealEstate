import React from 'react';
import { Check } from 'lucide-react';

/**
 * ProgressIndicator Component
 * 
 * Displays a vertical progress indicator showing which step the user is on
 * in the property listing process.
 * 
 * @param {Array} steps - Array of step objects with {id, title}
 * @param {number} currentStep - The current active step (1, 2, or 3)
 */
function ProgressIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-start gap-6">
      {/* Vertical Progress Line */}
      <div className="flex flex-col items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                currentStep > step.id
                  ? 'bg-purple-600 text-white'
                  : currentStep === step.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {currentStep > step.id ? (
                <Check className="w-5 h-5" />
              ) : (
                step.id
              )}
            </div>
            
            {/* Connecting Line (except for last step) */}
            {index < steps.length - 1 && (
              <div
                className={`w-0.5 h-16 my-2 transition-colors ${
                  currentStep > step.id ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex flex-col gap-16 pt-1">
        {steps.map((step) => (
          <div key={step.id}>
            <h3
              className={`font-semibold text-base transition-colors ${
                currentStep >= step.id ? 'text-purple-600' : 'text-gray-400'
              }`}
            >
              {step.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressIndicator;

