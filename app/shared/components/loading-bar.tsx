'use client';

import { useEffect, useState } from 'react';
import { Brain, FileCheck, FileSearch, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingBarProps {
  duration?: number;
}

interface Step {
  id: number;
  name: string;
  icon: React.ReactNode;
  description: string;
  weight: number; // Percentage of total time
  speed: number; // How fast the percentage counter increments (1-10)
}

const steps: Step[] = [
  {
    id: 1,
    name: 'Clasificación',
    icon: <FileSearch className="h-5 w-5" />,
    description: 'Analizando estructura del los documentos',
    weight: 0.15, // 15% of total time
    speed: 8, // Fast counter
  },
  {
    id: 2,
    name: 'Extracción',
    icon: <Brain className="h-5 w-5" />,
    description: 'Extrayendo la información clave de la operación',
    weight: 0.20, // 20% of total time
    speed: 7, // Pretty fast counter
  },
  {
    id: 3,
    name: 'Validación',
    icon: <FileCheck className="h-5 w-5" />,
    description: 'Verificando cada uno de los campos del pedimento',
    weight: 0.50, // 50% of total time
    speed: 3, // Slow counter - creates perception of complex work
  },
  {
    id: 4,
    name: 'Compilación',
    icon: <Loader2 className="h-5 w-5 animate-spin" />,
    description: 'Generando los resultados finales',
    weight: 0.15, // 15% of total time
    speed: 9, // Very fast counter - feels like wrapping up quickly
  },
];

// Ensure weights add up to 1.0
const totalWeight = steps.reduce((sum, step) => sum + step.weight, 0);
if (Math.abs(totalWeight - 1.0) > 0.001) {
  console.warn(`Step weights do not add up to 1.0 (got ${totalWeight})`);
}

// Fun facts about Mexican foreign trade (30 total)
const FUN_FACTS = [
  // Original 8 facts
  "¿Sabías? México es el país que más exporta en toda América Latina.",
  "¿Sabías? En 2023, México superó a China como el principal socio comercial de Estados Unidos.",
  "¿Sabías? México tiene más de 50 tratados y acuerdos comerciales con diferentes países.",
  "¿Sabías? México es uno de los mayores exportadores de autos en el mundo.",
  "¿Sabías? El puerto de Manzanillo es el más importante del Pacífico mexicano.",
  "¿Sabías? La aduana de Nuevo Laredo es la más activa de América Latina.",
  "¿Sabías? Además de autos, México exporta aguacates, pantallas planas, cerveza y tequila.",
  "¿Sabías? Muchas empresas extranjeras usan el programa IMMEX para fabricar en México.",
  
  // Additional 22 facts
  "¿Sabías? El T-MEC (USMCA) sustituyó al TLCAN (NAFTA) como acuerdo comercial entre México, EE.UU. y Canadá en 2020.",
  "¿Sabías? México exporta más de 400,000 millones de dólares en bienes anualmente.",
  "¿Sabías? La industria aeroespacial mexicana ha crecido más del 15% anualmente en la última década.",
  "¿Sabías? México es el mayor productor y exportador de plata en el mundo.",
  "¿Sabías? Los aguacates mexicanos representan más del 80% de los aguacates consumidos en EE.UU.",
  "¿Sabías? México es el principal exportador de televisores de pantalla plana del mundo.",
  "¿Sabías? México tiene 11 zonas económicas especiales para impulsar el comercio exterior.",
  "¿Sabías? El 80% de las exportaciones mexicanas se dirigen a Estados Unidos.",
  "¿Sabías? La primera aduana en México se estableció en Veracruz en 1551.",
  "¿Sabías? México es el tercer país con más acuerdos de libre comercio en el mundo.",
  "¿Sabías? México es el principal exportador mundial de cervezas.",
  "¿Sabías? El tequila mexicano está protegido por denominación de origen en más de 40 países.",
  "¿Sabías? México exporta más de 1.5 millones de vehículos al año.",
  "¿Sabías? La Ventanilla Única de Comercio Exterior Mexicana (VUCEM) procesa más de 6 millones de trámites al año.",
  "¿Sabías? México tiene más de 60 puertos marítimos, pero solo 16 manejan el 98% del tráfico comercial.",
  "¿Sabías? El sector automotriz representa más del 30% de las exportaciones totales de México.",
  "¿Sabías? México exporta más de 35 millones de cajas de berries (frutos rojos) anualmente.",
  "¿Sabías? La industria maquiladora emplea a más de 3 millones de personas en México.",
  "¿Sabías? México es el cuarto exportador mundial de partes de computadoras.",
  "¿Sabías? La marca 'Hecho en México' fue creada en 1978 para promover productos mexicanos.",
  "¿Sabías? México exporta dispositivos médicos a más de 100 países.",
  "¿Sabías? El chocolate tiene su origen en México, y hoy el país es un importante exportador de cacao fino."
];

// Process-related messages for each step (1-2 messages per step)
const STEP_MESSAGES = {
  1: [ // Classification step
    "Procesando tu documento con inteligencia artificial...",
    "Analizando patrones de datos para un procesamiento óptimo..."
  ],
  2: [ // Extraction step
    "Extrayendo información clave de la operación...",
    "Procesando datos relevantes a la operación..."
  ],
  3: [ // Validation step
    "Validando cada uno de los campos del pedimento...",
    "Verificando cumplimiento normativo...",
    "Analizando consistencia entre documentos...",
    "Aplicando criterios de validación avanzados..."
  ],
  4: [ // Compilation step
    "Generando los resultados finales...",
    "Generando reportes para revisión..."
  ]
};

const LoadingBar: React.FC<LoadingBarProps> = ({ duration = 120000 }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(STEP_MESSAGES[1][0]);
  const [stepProgress, setStepProgress] = useState(0);

  // Select two random facts once when component mounts
  const [selectedFacts] = useState(() => {
    const indices: number[] = [];
    while (indices.length < 2) {
      const randomIndex = Math.floor(Math.random() * FUN_FACTS.length);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    return indices.map(index => FUN_FACTS[index]);
  });

  useEffect(() => {
    // Reset state when component mounts
    setCurrentStep(1);
    setProgress(0);
    setStepProgress(0);
    setIsComplete(false);
    
    // Use non-linear progress for psychological optimization
    const updateInterval = 50; // Update every 50ms for smooth animation
    const totalUpdates = duration / updateInterval;
    let currentUpdate = 0;
    
    // Calculate step transition points
    const stepTransitions: number[] = steps.reduce<number[]>((acc, step, index) => {
      const previousSum = index > 0 ? acc[index - 1] || 0 : 0;
      acc.push(previousSum + step.weight);
      return acc;
    }, []);
    
    let lastStepIndex = 0;
    let factDisplayed = false;
    
    const timer = setInterval(() => {
      currentUpdate++;
      
      if (currentUpdate >= totalUpdates) {
        // When we reach the end, set full progress and clear interval
        setProgress(100);
        setStepProgress(100);
        setCurrentStep(steps.length);
        setIsComplete(true);
        clearInterval(timer);
        return;
      }
      
      // Calculate overall progress with non-linear curve
      // Accelerate faster at beginning, slower in middle, faster at end
      const linearProgress = currentUpdate / totalUpdates;
      const nonLinearProgress = Math.pow(linearProgress, 0.85) * 100;
      setProgress(nonLinearProgress);
      
      // Determine which step we're in
      let currentStepIndex = 0;
      for (let i = 0; i < stepTransitions.length; i++) {
        const transition = stepTransitions[i];
        if (transition !== undefined && linearProgress <= transition) {
          currentStepIndex = i;
          break;
        }
      }
      
      // Step has changed - update message
      if (currentStepIndex !== lastStepIndex) {
        lastStepIndex = currentStepIndex;
        
        // Reset message rotation for new step
        const stepNum = currentStepIndex + 1;
        const messagesForStep = STEP_MESSAGES[stepNum as keyof typeof STEP_MESSAGES] || [];
        
        if (messagesForStep.length > 0) {
          setCurrentMessage(messagesForStep[0]);
        }
        
        factDisplayed = false;
      }
      
      // Only change message once per step, in the middle of the step
      // and display a fact if we're in the middle of a step (and one hasn't been shown for this step)
      const currentStepInfo = steps[currentStepIndex];
      if (currentStepInfo) {
        // For the step progress, we need to know where in the step we are
        const prevTransition = currentStepIndex > 0 ? (stepTransitions[currentStepIndex - 1] || 0) : 0;
        const stepLinearProgress = (linearProgress - prevTransition) / currentStepInfo.weight;
        
        // If we're halfway through a step and haven't shown a fact yet for this step
        if (stepLinearProgress > 0.5 && !factDisplayed) {
          // Show a fun fact in steps 2 and 3 only (indices 1 and 2)
          if (currentStepIndex === 1 || currentStepIndex === 2) {
            const factIndex = currentStepIndex === 1 ? 0 : 1;
            setCurrentMessage(selectedFacts[factIndex]);
            factDisplayed = true;
          } else {
            // For other steps, show the second message if available
            const stepNum = currentStepIndex + 1;
            const messagesForStep = STEP_MESSAGES[stepNum as keyof typeof STEP_MESSAGES] || [];
            if (messagesForStep.length > 1) {
              setCurrentMessage(messagesForStep[1]);
            }
            factDisplayed = true;
          }
        }
        
        // Applying the speed factor to make each step's percentage counter move at different rates
        const speedFactor = currentStepInfo.speed / 5; // normalize to 0-2 range
        const stepVisualProgress = Math.pow(stepLinearProgress, 1 / speedFactor) * 100;
        
        setStepProgress(Math.min(Math.round(stepVisualProgress), 99)); // Cap at 99% until complete
      }
      
      setCurrentStep(currentStepIndex + 1);
    }, updateInterval);
    
    return () => clearInterval(timer);
  }, [duration, selectedFacts]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Message display - engages users while waiting */}
      <div className="text-center mb-4 h-6 overflow-hidden">
        <p className="text-sm text-gray-500 animate-fade-in-up">
          {currentMessage}
        </p>
      </div>
      
      {/* Main progress bar - make it move faster initially */}
      <div className="h-1.5 w-full bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Steps visualization */}
      <div className="grid grid-cols-1 gap-3">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep || isComplete;
          const isUpcoming = step.id > currentStep;
          
          return (
            <div 
              key={step.id}
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg transition-all duration-300",
                isActive && "bg-primary/5 border-l-4 border-primary",
                isCompleted && "bg-gray-50",
                isUpcoming && "opacity-50"
              )}
            >
              <div 
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isActive && "bg-primary/10 text-primary animate-pulse",
                  isCompleted && "bg-primary text-white",
                  isUpcoming && "bg-gray-100 text-gray-400"
                )}
              >
                {isCompleted ? (
                  <FileCheck className="h-5 w-5" />
                ) : (
                  <div className={isActive ? "animate-bouncing" : ""}>
                    {step.icon}
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <h3 className={cn(
                    "font-medium",
                    isActive && "text-primary",
                    isCompleted && "text-gray-800",
                    isUpcoming && "text-gray-500"
                  )}>
                    {step.name}
                    {isCompleted && (
                      <span className="ml-2 inline-flex items-center">
                        <Sparkles className="h-3 w-3 text-yellow-400" />
                      </span>
                    )}
                  </h3>
                  
                  {/* Step progress indicator - only shown for active step */}
                  {isActive && (
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full animate-pulse">
                      {stepProgress}%
                    </span>
                  )}
                </div>
                
                <p className={cn(
                  "text-sm mt-0.5",
                  isActive && "text-primary/80",
                  isCompleted && "text-gray-600",
                  isUpcoming && "text-gray-400"
                )}>
                  {isCompleted 
                    ? "Completado" 
                    : isActive 
                      ? step.description + "..."
                      : step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Add necessary keyframe animations
const styles = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bouncing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

.animate-bouncing {
  animation: bouncing 1s ease-in-out infinite;
}
`;

// Insert the styles into the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}

export default LoadingBar;
