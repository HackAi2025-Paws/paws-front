import React from 'react'

interface PetIllustrationProps {
  className?: string
}

export const PetIllustration: React.FC<PetIllustrationProps> = ({ className = "w-24 h-24" }) => {
  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 120 120" className="w-full h-full">
        {/* Fondo circular suave */}
        <circle 
          cx="60" 
          cy="60" 
          r="50" 
          fill="rgba(255, 255, 255, 0.2)" 
          className="backdrop-blur-sm"
        />
        
        {/* Cuerpo del perro/gato */}
        <ellipse 
          cx="60" 
          cy="70" 
          rx="20" 
          ry="25" 
          fill="rgba(255, 255, 255, 0.9)"
          className="drop-shadow-sm"
        />
        
        {/* Cabeza */}
        <circle 
          cx="60" 
          cy="45" 
          r="18" 
          fill="rgba(255, 255, 255, 0.9)"
          className="drop-shadow-sm"
        />
        
        {/* Orejas */}
        <ellipse 
          cx="50" 
          cy="35" 
          rx="6" 
          ry="12" 
          fill="rgba(226, 93, 57, 0.8)"
          transform="rotate(-20 50 35)"
        />
        <ellipse 
          cx="70" 
          cy="35" 
          rx="6" 
          ry="12" 
          fill="rgba(226, 93, 57, 0.8)"
          transform="rotate(20 70 35)"
        />
        
        {/* Ojos */}
        <circle cx="55" cy="42" r="2" fill="rgba(59, 41, 28, 0.8)" />
        <circle cx="65" cy="42" r="2" fill="rgba(59, 41, 28, 0.8)" />
        
        {/* Nariz */}
        <ellipse cx="60" cy="48" rx="1.5" ry="1" fill="rgba(226, 93, 57, 0.9)" />
        
        {/* Collar con corazón */}
        <rect 
          x="45" 
          y="60" 
          width="30" 
          height="4" 
          rx="2" 
          fill="rgba(242, 197, 217, 0.9)"
        />
        
        {/* Corazón en el collar */}
        <g transform="translate(60, 62)">
          <path 
            d="M0,2 C-3,0 -6,2 -3,6 L0,9 L3,6 C6,2 3,0 0,2 Z" 
            fill="rgba(226, 93, 57, 0.9)"
          />
        </g>
        
        {/* Patas */}
        <ellipse cx="50" cy="90" rx="3" ry="8" fill="rgba(255, 255, 255, 0.8)" />
        <ellipse cx="60" cy="90" rx="3" ry="8" fill="rgba(255, 255, 255, 0.8)" />
        <ellipse cx="70" cy="90" rx="3" ry="8" fill="rgba(255, 255, 255, 0.8)" />
        
        {/* Cola */}
        <path 
          d="M35 75 Q25 70 20 80 Q25 85 35 82" 
          fill="rgba(255, 255, 255, 0.8)"
          className="drop-shadow-sm"
        />
        
        {/* Elementos decorativos flotantes */}
        <g opacity="0.6">
          <circle cx="25" cy="25" r="2" fill="rgba(234, 150, 81, 0.7)">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="95" cy="30" r="1.5" fill="rgba(242, 197, 217, 0.8)">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="90" cy="85" r="1" fill="rgba(226, 93, 57, 0.6)">
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* Brillo en los ojos */}
        <circle cx="56" cy="41" r="0.5" fill="white" opacity="0.8" />
        <circle cx="66" cy="41" r="0.5" fill="white" opacity="0.8" />
      </svg>
    </div>
  )
}
