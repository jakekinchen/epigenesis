import { WebGLRenderer, ACESFilmicToneMapping, SRGBColorSpace, ShaderMaterial, Vector2 } from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { WebGPURenderer } from 'three/webgpu';
import * as React from 'react';

interface Props {
  children?: React.ReactNode;
}

// Fallback shader for WebGL
const fragmentShader = `
  uniform vec2 resolution;
  uniform float time;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 color = 0.5 + 0.5 * cos(time + uv.xyx + vec3(0,2,4));
    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export function WebGPUCanvas({ children }: Props) {
  const [isWebGPU, setIsWebGPU] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize renderer based on capability
  const createRenderer = React.useCallback((canvas: HTMLCanvasElement) => {
    if ('gpu' in navigator) {
      // First create a WebGL renderer as fallback
      const renderer = new WebGLRenderer({ canvas, antialias: true });
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.outputColorSpace = SRGBColorSpace;

      // Attempt to initialize WebGPU
      (async () => {
        try {
          const gpuRenderer = new WebGPURenderer({ canvas });
          await gpuRenderer.init();
          gpuRenderer.toneMapping = ACESFilmicToneMapping;
          gpuRenderer.outputColorSpace = SRGBColorSpace;
          setIsWebGPU(true);
          // Note: We can't replace the renderer here due to R3F limitations
        } catch (error) {
          console.warn('WebGPU initialization failed:', error);
          setError('WebGPU not available, using WebGL fallback');
          setIsWebGPU(false);
        }
      })();

      return renderer;
    }

    // Fall back to WebGL
    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.outputColorSpace = SRGBColorSpace;
    setIsWebGPU(false);
    return renderer;
  }, []);

  // Fallback content for WebGL
  const FallbackContent = React.useCallback(() => {
    const uniforms = {
      time: { value: 0 },
      resolution: { value: new Vector2() }
    };

    React.useEffect(() => {
      const updateUniforms = () => {
        uniforms.time.value += 0.01;
      };
      const interval = setInterval(updateUniforms, 16);
      return () => clearInterval(interval);
    }, []);

    return (
      <mesh>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      </mesh>
    );
  }, []);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800/30 rounded-lg text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Canvas 
      gl={createRenderer} 
      camera={{ position: [0, 0, 5] }}
      style={{ width: '100%', height: '100%', position: 'absolute' }}
    >
      <OrbitControls enableDamping={false} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <React.Suspense fallback={null}>
        {isWebGPU ? children : <FallbackContent />}
      </React.Suspense>
    </Canvas>
  );
}