// GenericCanvasEngine.ts
export class GenericCanvasEngine {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D | WebGLRenderingContext
    mouse = { x: null as number | null, y: null as number | null }
  
    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas
      const context = canvas.getContext('2d') // or 'webgl' as needed
      if (!context) throw new Error('Canvas context not available')
      this.ctx = context
      this.initEvents()
      this.resize()
      new ResizeObserver(() => this.resize()).observe(canvas.parentElement!)
    }
  
    initEvents() {
      const container = this.canvas.parentElement
      if (!container) return
      container.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        // Ensure the mouse coordinates are within the canvas bounds
        this.mouse.x = x >= 0 && x <= rect.width ? x : null
        this.mouse.y = y >= 0 && y <= rect.height ? y : null
      })
      container.addEventListener('mouseleave', () => {
        this.mouse.x = null
        this.mouse.y = null
      })
    }
  
    resize() {
      const parent = this.canvas.parentElement
      if (!parent) return
      const { width, height } = parent.getBoundingClientRect()
      this.canvas.width = width
      this.canvas.height = height
    }
  
    startLoop(
      render: (
        ctx: CanvasRenderingContext2D | WebGLRenderingContext,
        canvas: HTMLCanvasElement,
        mouse: { x: number | null; y: number | null },
        dt: number
      ) => void
    ) {
      let lastTime = performance.now()
      const loop = (time: number) => {
        const dt = time - lastTime
        lastTime = time
        render(this.ctx, this.canvas, this.mouse, dt)
        requestAnimationFrame(loop)
      }
      requestAnimationFrame(loop)
    }
  }