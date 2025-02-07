import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
}

class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[];
  private mouseX: number | null = null;
  private mouseY: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');
    this.ctx = context;
    this.particles = [];

    // Set initial size
    this.resize();
    
    // Create initial particles
    this.init();
  }

  private resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const { width, height } = parent.getBoundingClientRect();
    this.canvas.width = width;
    this.canvas.height = height;
  }

  setMousePosition(x: number | null, y: number | null) {
    this.mouseX = x;
    this.mouseY = y;
  }

  private createParticle(x: number, y: number): Particle {
    return {
      x,
      y,
      size: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2
    };
  }

  init() {
    this.particles = [];
    const numParticles = 50;
    for (let i = 0; i < numParticles; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      this.particles.push(this.createParticle(x, y));
    }
  }

  animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Add particles near mouse
    if (this.mouseX !== null && this.mouseY !== null && Math.random() < 0.1) {
      const x = this.mouseX + (Math.random() - 0.5) * 20;
      const y = this.mouseY + (Math.random() - 0.5) * 20;
      if (x >= 0 && x <= this.canvas.width && y >= 0 && y <= this.canvas.height) {
        this.particles.push(this.createParticle(x, y));
      }
    }

    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update position
      p.x += p.speedX;
      p.y += p.speedY;

      // Bounce off edges
      if (p.x <= 0 || p.x >= this.canvas.width) {
        p.speedX *= -1;
        p.x = Math.max(0, Math.min(p.x, this.canvas.width));
      }
      if (p.y <= 0 || p.y >= this.canvas.height) {
        p.speedY *= -1;
        p.y = Math.max(0, Math.min(p.y, this.canvas.height));
      }

      // Slow down
      p.speedX *= 0.99;
      p.speedY *= 0.99;

      // Reduce size
      p.size -= 0.1;

      // Draw
      this.ctx.fillStyle = 'rgba(100, 255, 218, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, Math.max(0, p.size), 0, Math.PI * 2);
      this.ctx.fill();

      // Remove if too small
      if (p.size <= 0) {
        this.particles.splice(i, 1);
        i--;
        
        // Add new particle at random position
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        this.particles.push(this.createParticle(x, y));
      }
    }

    // Keep particle count stable
    while (this.particles.length > 50) {
      this.particles.shift();
    }

    requestAnimationFrame(this.animate);
  };
}

const ParticleDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const systemRef = useRef<ParticleSystem | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const system = new ParticleSystem(canvas);
    systemRef.current = system;

    // Handle mouse events on the container
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        system.setMousePosition(x, y);
      } else {
        system.setMousePosition(null, null);
      }
    };

    const handleMouseLeave = () => {
      system.setMousePosition(null, null);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Start animation
    system.animate();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="bg-slate-800/30 rounded-lg aspect-square relative overflow-hidden"
    >
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full rounded-lg"
      />
    </div>
  );
};

export default ParticleDemo; 