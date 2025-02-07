import React, { useEffect, useRef, useState } from 'react';

interface PathMakerProps {
  uniqueId: string;
  startEdge: 'left' | 'right' | 'top' | 'bottom';
  startY: number;
  endX: [string, 'left' | 'right' | 'center'];
  endY: [string, 'top' | 'bottom' | 'center'];
  strokeColor: string;
  circleColor: string;
  strokeWidth?: number;
  circleRadius?: number;
  animationDuration?: number;
  strokeDasharray?: string;
  hideOnMobile?: boolean;
}

const PathMaker: React.FC<PathMakerProps> = ({
  uniqueId,
  startEdge,
  startY,
  endX,
  endY,
  strokeColor,
  circleColor,
  strokeWidth = 2,
  circleRadius = 4,
  animationDuration = 2,
  strokeDasharray = "4,4",
  hideOnMobile = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [path, setPath] = useState<string>("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [pathLength, setPathLength] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Add scale factor to control all sizes
  const scaleFactor = 2;
  const effectRadius = circleRadius * scaleFactor;

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const calculatePath = () => {
      if (!svgRef.current || !pathRef.current) return;

      const targetElement = document.getElementById(endX[0]);
      if (!targetElement) return;

      const svgRect = svgRef.current.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();

      let startX = startEdge === 'left' ? 0 : svgRect.width;
      let endXPos =
        endX[1] === 'left'
          ? targetRect.left - svgRect.left
          : endX[1] === 'right'
          ? targetRect.right - svgRect.left
          : targetRect.left + targetRect.width / 2 - svgRect.left;

      let endYPos =
        endY[1] === 'top'
          ? targetRect.top - svgRect.top
          : endY[1] === 'bottom'
          ? targetRect.bottom - svgRect.top
          : targetRect.top + targetRect.height / 2 - svgRect.top;

      const newPath = `M ${startX} ${startY} C ${(startX + endXPos) / 2} ${startY}, ${(startX + endXPos) / 2} ${endYPos}, ${endXPos} ${endYPos}`;
      setPath(newPath);
      setDimensions({
        width: svgRect.width,
        height: Math.max(svgRect.height, endYPos + 50)
      });

      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      
      // Reset animation states
      setIsVisible(false);
      setIsAnimating(false);
      
      // Start animation after a brief delay
      setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 100);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      calculatePath();
    };

    calculatePath();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [startEdge, startY, endX, endY]);

  if (hideOnMobile && isMobile) return null;

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: dimensions.height,
        zIndex: -1
      }}
      className="path-maker"
    >
      <defs>
        <linearGradient id={`gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: strokeColor, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: strokeColor, stopOpacity: 1 }} />
        </linearGradient>
        <filter id={`electric-glow-${uniqueId}`} x="-150%" y="-150%" width="400%" height="400%">
          {/* Primary turbulence with more complex animation */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="4"
            seed="5"
            result="turbulence"
          >
            <animate
              attributeName="baseFrequency"
              values="0.05; 0.08; 0.12; 0.15; 0.12; 0.08; 0.05"
              keyTimes="0; 0.15; 0.3; 0.5; 0.7; 0.85; 1"
              dur="2.3s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale={15 * scaleFactor}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />

          {/* Second turbulence layer with different timing */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.08"
            numOctaves="3"
            seed="10"
            result="turbulence2"
          >
            <animate
              attributeName="baseFrequency"
              values="0.08; 0.12; 0.15; 0.18; 0.15; 0.12; 0.08"
              keyTimes="0; 0.2; 0.4; 0.5; 0.6; 0.8; 1"
              dur="1.7s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="displaced"
            in2="turbulence2"
            scale={8 * scaleFactor}
            xChannelSelector="B"
            yChannelSelector="A"
            result="displaced2"
          />

          {/* Third turbulence layer for fine details */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.1"
            numOctaves="2"
            seed="15"
            result="turbulence3"
          >
            <animate
              attributeName="baseFrequency"
              values="0.1; 0.15; 0.2; 0.15; 0.1"
              keyTimes="0; 0.25; 0.5; 0.75; 1"
              dur="1.1s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="displaced2"
            in2="turbulence3"
            scale={4 * scaleFactor}
            xChannelSelector="G"
            yChannelSelector="R"
            result="displaced3"
          />

          {/* Enhanced glow effect */}
          <feGaussianBlur in="displaced3" stdDeviation={4 * scaleFactor} result="glowBlur" />
          <feColorMatrix
            in="glowBlur"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"
            result="whiteGlow"
          />
          <feMerge>
            <feMergeNode in="whiteGlow" />
            <feMergeNode in="displaced3" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>
          {`
            .path-${uniqueId} {
              stroke-dasharray: ${strokeDasharray};
              animation: dash-${uniqueId} ${animationDuration}s ease-out ${2}s forwards;
              opacity: 0;
            }

            @keyframes dash-${uniqueId} {
              0% {
                opacity: 0;
                stroke-dashoffset: 1000;
              }
              10% {
                opacity: 1;
                stroke-dashoffset: 1000;
              }
              100% {
                opacity: 1;
                stroke-dashoffset: 0;
              }
            }

            .circle-${uniqueId} {
              filter: url(#electric-glow-${uniqueId});
              animation: pulse-${uniqueId} 2s ease-in-out infinite;
              animation-delay: ${2 + animationDuration * 0.1}s;
              opacity: 0;
            }

            @keyframes pulse-${uniqueId} {
              0% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.1);
                opacity: 1;
              }
              100% {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}
        </style>
      </defs>
      <path
        ref={pathRef}
        d={path}
        stroke={`url(#gradient-${uniqueId})`}
        strokeWidth={strokeWidth}
        fill="none"
        className={`path-${uniqueId}`}
      />
      {path && (
        <circle 
          r={effectRadius}
          fill={circleColor}
          className={`circle-${uniqueId}`}
        >
          <animateMotion
            dur={`${animationDuration}s`}
            repeatCount="indefinite"
            path={path}
            rotate="auto"
            begin={`${2 + animationDuration * 0.1}s`}
          />
        </circle>
      )}
    </svg>
  );
};

export default PathMaker;