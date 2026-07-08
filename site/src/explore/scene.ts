// The EXPLORE scene: a 1:1 port of the Session 3 prototype (Site
// Explore.html script body) wrapped in a class React can mount and dispose.
// React owns routing and the info card; the scene owns WebGL and per-frame
// work, and reports intent through onRequestFocus. Focus itself is driven
// back in via focusNode()/unfocus() so the URL stays the source of truth.
//
// Sanctioned deviations from the prototype (flagged in the build session):
// - pointerup re-raycasts from the event coords so touch taps focus (the
//   prototype only raycast on pointermove, which never fires before a tap).
// - focus() only saves the camera when arriving from unfocused, so
//   focus-switching A>B still restores the original framing on return.
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GRAPH, neighbors } from './graph'
import { CARBON, EDGE, LENSES, REDLINE_WIRE } from './palette'
import { loadExploreFonts, makeTexture } from './textures'

const F = 150
const ENTRY_STAGGER = 28
const ENTRY_DUR = 620
const ENTRY_DELAY = 120

interface Cloud {
  cp: THREE.Points
  cg: THREE.BufferGeometry
  cm: THREE.PointsMaterial
  pos: Float32Array
  scatter: Float32Array
  count: number
  fx: number
  fy: number
  fz: number
}

interface SpriteData {
  i: number
  norm: THREE.CanvasTexture
  hot: THREE.CanvasTexture
  baseScale: THREE.Vector3
  baseY: number
  s: number
  v: number
  baseOpacity: number
  phase: number
  cloud: Cloud | null
  start: number
}

interface Tween {
  t0: number
  dur: number
  step: (e: number) => void
  done?: () => void
}

export interface ExploreSceneOptions {
  prm: boolean
  onRequestFocus: (id: string | null) => void
  onEntryDone: () => void
  // Fallback matrix (Session 12): if the GL context is lost at runtime (a
  // low-power device reclaiming it, a driver hiccup), the surface swaps to the
  // static poster instead of showing a dead canvas.
  onContextLost?: () => void
}

export class ExploreScene {
  private container: HTMLElement
  private leader: HTMLCanvasElement
  private lctx: CanvasRenderingContext2D
  private hoverLbl: HTMLElement
  private opts: ExploreSceneOptions

  private renderer!: THREE.WebGLRenderer
  private camera!: THREE.OrthographicCamera
  private controls!: OrbitControls
  private scene = new THREE.Scene()
  private gridGeo!: THREE.BufferGeometry
  private gridMat!: THREE.PointsMaterial

  private sprites: THREE.Sprite[] = []
  private hiGeo!: THREE.BufferGeometry
  private hiMat!: THREE.LineBasicMaterial
  private hipos!: Float32Array

  private tweens: Tween[] = []
  private clock = new THREE.Clock()
  private rafId = 0
  private disposed = false
  private built = false

  private entryDone: boolean
  private entryT0 = 0
  private lastInteract = 0
  private hovered = -1
  private hovStart = 0
  private focused = -1
  private saved: { zoom: number; tgt: THREE.Vector3 } | null = null

  private ray = new THREE.Raycaster()
  private ptr = new THREE.Vector2(-2, -2)
  private v3 = new THREE.Vector3()
  private downX = 0
  private downY = 0
  private width = 1
  private height = 1
  private aspect = 1

  constructor(
    container: HTMLElement,
    leader: HTMLCanvasElement,
    hoverLbl: HTMLElement,
    opts: ExploreSceneOptions,
  ) {
    this.container = container
    this.leader = leader
    this.lctx = leader.getContext('2d')!
    this.hoverLbl = hoverLbl
    this.opts = opts
    this.entryDone = opts.prm
  }

  async init() {
    const prm = this.opts.prm
    this.width = this.container.clientWidth || 1
    this.height = this.container.clientHeight || 1
    this.aspect = this.width / this.height

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height)
    this.renderer.setClearColor(CARBON)
    // Orbit dragging must own the gesture, not the page: without this a vertical
    // drag on a phone scrolls the embedding page (Session 13 Home) and the scene
    // reads as broken. On the full-page route the layout is fixed anyway.
    this.renderer.domElement.style.touchAction = 'none'
    this.renderer.domElement.addEventListener('webglcontextlost', this.onContextLost)
    this.container.appendChild(this.renderer.domElement)

    this.camera = new THREE.OrthographicCamera(
      -F * this.aspect,
      F * this.aspect,
      F,
      -F,
      -800,
      1600,
    )
    this.camera.position.set(140, 115, 140)
    this.camera.lookAt(0, 0, 0)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.06
    this.controls.addEventListener('start', this.onControlsStart)

    {
      const pts: number[] = []
      for (let x = -12; x <= 12; x++)
        for (let z = -12; z <= 12; z++) pts.push(x * 22, -110, z * 22)
      this.gridGeo = new THREE.BufferGeometry()
      this.gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
      this.gridMat = new THREE.PointsMaterial({
        color: EDGE,
        size: 1.4,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.1,
      })
      this.scene.add(new THREE.Points(this.gridGeo, this.gridMat))
    }

    this.sizeLeader()

    await loadExploreFonts()
    if (this.disposed) return

    GRAPH.nodes.forEach((n, i) => {
      const norm = makeTexture(n, false)
      const hot = makeTexture(n, true)
      const mat = new THREE.SpriteMaterial({
        map: norm.tex,
        transparent: true,
        opacity: prm ? (n.kind === 'project' ? 1 : 0.85) : 0,
      })
      const sp = new THREE.Sprite(mat)
      const k = n.kind === 'project' ? 7.2 : 6.0
      sp.scale.set(norm.w / k, norm.h / k, 1)
      const fx = n.x * 1.12,
        fy = n.y * 0.72,
        fz = n.z * 1.12
      sp.position.set(fx, fy, fz)
      let cloud: Cloud | null = null
      if (!prm) {
        const count = 26
        const pos = new Float32Array(count * 3)
        const scatter = new Float32Array(count * 3)
        for (let q = 0; q < count; q++) {
          const m = 14 + Math.random() * 22
          const uu = Math.random() * 2 - 1,
            th = Math.random() * Math.PI * 2,
            s = Math.sqrt(1 - uu * uu)
          scatter.set([s * Math.cos(th) * m, uu * m, s * Math.sin(th) * m], q * 3)
          pos.set(
            [fx + scatter[q * 3]!, fy + scatter[q * 3 + 1]!, fz + scatter[q * 3 + 2]!],
            q * 3,
          )
        }
        const cg = new THREE.BufferGeometry()
        cg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        const cm = new THREE.PointsMaterial({
          color: LENSES[n.lens].wire,
          size: 1.8,
          sizeAttenuation: false,
          transparent: true,
          opacity: 0.85,
        })
        const cp = new THREE.Points(cg, cm)
        this.scene.add(cp)
        cloud = { cp, cg, cm, pos, scatter, count, fx, fy, fz }
      }
      sp.userData = {
        i,
        norm: norm.tex,
        hot: hot.tex,
        baseScale: sp.scale.clone(),
        baseY: fy,
        s: 1,
        v: 0,
        baseOpacity: n.kind === 'project' ? 1 : 0.85,
        phase: Math.random() * 6.28,
        cloud,
        start: ENTRY_DELAY + i * ENTRY_STAGGER,
      } satisfies SpriteData
      this.scene.add(sp)
      this.sprites.push(sp)
    })

    this.hipos = new Float32Array(GRAPH.edges.length * 6)
    this.hiGeo = new THREE.BufferGeometry()
    this.hiGeo.setAttribute('position', new THREE.BufferAttribute(this.hipos, 3))
    this.hiGeo.setDrawRange(0, 0)
    this.hiMat = new THREE.LineBasicMaterial({ color: EDGE, transparent: true, opacity: 0 })
    this.scene.add(new THREE.LineSegments(this.hiGeo, this.hiMat))

    const dom = this.renderer.domElement
    dom.addEventListener('pointermove', this.onPointerMove)
    dom.addEventListener('pointerdown', this.onPointerDown)
    dom.addEventListener('pointerup', this.onPointerUp)
    window.addEventListener('resize', this.onResize)

    this.built = true
    this.entryT0 = performance.now()
    if (this.entryDone) this.opts.onEntryDone()
    this.frame()
  }

  // ---- public API driven by the router --------------------------------------

  focusNode(i: number) {
    if (!this.built || i < 0 || i >= this.sprites.length || this.focused === i) return
    if (this.focused < 0) {
      this.saved = { zoom: this.camera.zoom, tgt: this.controls.target.clone() }
    }
    this.focused = i
    const prm = this.opts.prm
    const z0 = this.camera.zoom,
      t0 = this.controls.target.clone()
    const np = this.sprites[i]!.position.clone()
    this.tw(prm ? 1 : 800, (e) => {
      this.camera.zoom = z0 + (2.9 - z0) * e
      this.camera.updateProjectionMatrix()
      this.controls.target.lerpVectors(t0, np, e)
    })
    const nb = neighbors(GRAPH, i)
    this.sprites.forEach((s, j) => {
      const t = j === i || nb.has(j) ? (s.userData as SpriteData).baseOpacity : 0.07
      const o0 = (s.material as THREE.SpriteMaterial).opacity
      this.tw(prm ? 1 : 600, (e) => {
        ;(s.material as THREE.SpriteMaterial).opacity = o0 + (t - o0) * e
      })
    })
    this.setHiEdges(i)
    this.edgesTo(0.4, 300)
  }

  unfocus() {
    if (!this.built || this.focused < 0 || !this.saved) return
    const prm = this.opts.prm
    const saved = this.saved
    const z0 = this.camera.zoom,
      t0 = this.controls.target.clone()
    this.tw(prm ? 1 : 700, (e) => {
      this.camera.zoom = z0 + (saved.zoom - z0) * e
      this.camera.updateProjectionMatrix()
      this.controls.target.lerpVectors(t0, saved.tgt, e)
    })
    this.sprites.forEach((s) => {
      const o0 = (s.material as THREE.SpriteMaterial).opacity
      this.tw(prm ? 1 : 600, (e) => {
        ;(s.material as THREE.SpriteMaterial).opacity =
          o0 + ((s.userData as SpriteData).baseOpacity - o0) * e
      })
    })
    this.edgesTo(0, 300)
    this.focused = -1
    this.saved = null
  }

  setControlsEnabled(v: boolean) {
    if (this.controls) this.controls.enabled = v
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.rafId)
    window.removeEventListener('resize', this.onResize)
    if (this.renderer) {
      const dom = this.renderer.domElement
      dom.removeEventListener('pointermove', this.onPointerMove)
      dom.removeEventListener('pointerdown', this.onPointerDown)
      dom.removeEventListener('pointerup', this.onPointerUp)
      dom.removeEventListener('webglcontextlost', this.onContextLost)
    }
    this.controls?.removeEventListener('start', this.onControlsStart)
    this.controls?.dispose()
    this.sprites.forEach((sp) => {
      const u = sp.userData as SpriteData
      u.norm.dispose()
      u.hot.dispose()
      if (u.cloud) {
        this.scene.remove(u.cloud.cp)
        u.cloud.cg.dispose()
        u.cloud.cm.dispose()
        u.cloud = null
      }
      ;(sp.material as THREE.SpriteMaterial).dispose()
    })
    this.sprites = []
    this.gridGeo?.dispose()
    this.gridMat?.dispose()
    this.hiGeo?.dispose()
    this.hiMat?.dispose()
    if (this.renderer) {
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      this.renderer.domElement.remove()
    }
    document.body.style.cursor = ''
  }

  // ---- internals -------------------------------------------------------------

  private onControlsStart = () => {
    this.lastInteract = performance.now()
  }

  private onContextLost = (ev: Event) => {
    // Keep the browser from trying to auto-restore a context we are abandoning;
    // the surface will render the poster instead.
    ev.preventDefault()
    cancelAnimationFrame(this.rafId)
    this.opts.onContextLost?.()
  }

  private onPointerMove = (ev: PointerEvent) => {
    this.setPtr(ev)
  }

  private onPointerDown = (ev: PointerEvent) => {
    this.downX = ev.clientX
    this.downY = ev.clientY
    this.lastInteract = performance.now()
  }

  private onPointerUp = (ev: PointerEvent) => {
    if (Math.hypot(ev.clientX - this.downX, ev.clientY - this.downY) > 5) return
    // Touch fix: no pointermove precedes a tap, so raycast from the tap point.
    this.setPtr(ev)
    this.ray.setFromCamera(this.ptr, this.camera)
    const hit = this.ray.intersectObjects(this.sprites)
    const idx = hit.length ? ((hit[0]!.object.userData as SpriteData).i as number) : -1
    if (idx >= 0) {
      this.opts.onRequestFocus(this.focused === idx ? null : GRAPH.nodes[idx]!.id)
    } else if (this.focused >= 0) {
      this.opts.onRequestFocus(null)
    }
  }

  private onResize = () => {
    this.width = this.container.clientWidth || 1
    this.height = this.container.clientHeight || 1
    this.aspect = this.width / this.height
    this.camera.left = -F * this.aspect
    this.camera.right = F * this.aspect
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.renderer.setSize(this.width, this.height)
    this.sizeLeader()
  }

  private setPtr(ev: PointerEvent) {
    const r = this.renderer.domElement.getBoundingClientRect()
    this.ptr.x = ((ev.clientX - r.left) / r.width) * 2 - 1
    this.ptr.y = -((ev.clientY - r.top) / r.height) * 2 + 1
  }

  private sizeLeader() {
    const dpr = devicePixelRatio
    this.leader.width = this.width * dpr
    this.leader.height = this.height * dpr
    this.leader.style.width = this.width + 'px'
    this.leader.style.height = this.height + 'px'
    this.lctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  private tw(dur: number, step: (e: number) => void, done?: () => void) {
    this.tweens.push({ t0: performance.now(), dur, step, done })
  }

  private runTweens() {
    const now = performance.now()
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const t = this.tweens[i]!
      const k = Math.min(1, (now - t.t0) / t.dur)
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
      t.step(e)
      if (k >= 1) {
        this.tweens.splice(i, 1)
        if (t.done) t.done()
      }
    }
  }

  private edgesTo(target: number, dur: number) {
    const o0 = this.hiMat.opacity
    this.tw(this.opts.prm ? 1 : dur, (e) => {
      this.hiMat.opacity = o0 + (target - o0) * e
    })
  }

  private setHiEdges(i: number) {
    let c = 0
    GRAPH.edges.forEach((e) => {
      if (e.a === i || e.b === i) {
        const a = this.sprites[e.a]!.position,
          b = this.sprites[e.b]!.position
        this.hipos.set([a.x, a.y, a.z, b.x, b.y, b.z], c * 6)
        c++
      }
    })
    this.hiGeo.attributes.position!.needsUpdate = true
    this.hiGeo.setDrawRange(0, c * 2)
  }

  private stepEntry(now: number) {
    if (this.entryDone) return
    let allDone = true
    const el = now - this.entryT0
    this.sprites.forEach((sp) => {
      const u = sp.userData as SpriteData
      if (!u.cloud) return
      const t = Math.max(0, Math.min(1, (el - u.start) / ENTRY_DUR))
      if (t < 1) allDone = false
      const e = 1 - Math.pow(1 - t, 3)
      const c = u.cloud
      for (let q = 0; q < c.count; q++) {
        const q3 = q * 3
        c.pos[q3] = c.fx + c.scatter[q3]! * (1 - e)
        c.pos[q3 + 1] = c.fy + c.scatter[q3 + 1]! * (1 - e)
        c.pos[q3 + 2] = c.fz + c.scatter[q3 + 2]! * (1 - e)
      }
      c.cg.attributes.position!.needsUpdate = true
      c.cm.opacity = 0.85 * (1 - e * e)
      ;(sp.material as THREE.SpriteMaterial).opacity =
        u.baseOpacity * Math.max(0, (t - 0.35) / 0.65)
      const sc = 1 + 0.14 * (1 - e)
      sp.scale.set(u.baseScale.x * sc, u.baseScale.y * sc, 1)
    })
    if (allDone) {
      this.entryDone = true
      this.sprites.forEach((sp) => {
        const u = sp.userData as SpriteData
        if (u.cloud) {
          this.scene.remove(u.cloud.cp)
          u.cloud.cg.dispose()
          u.cloud.cm.dispose()
          u.cloud = null
        }
        ;(sp.material as THREE.SpriteMaterial).opacity = u.baseOpacity
      })
      this.opts.onEntryDone()
    }
  }

  private screenPos(obj: THREE.Object3D) {
    this.v3.copy(obj.position).project(this.camera)
    return {
      x: (this.v3.x * 0.5 + 0.5) * this.width,
      y: (-this.v3.y * 0.5 + 0.5) * this.height,
    }
  }

  private frame = () => {
    if (this.disposed) return
    this.rafId = requestAnimationFrame(this.frame)
    const prm = this.opts.prm
    const t = this.clock.elapsedTime
    this.clock.getDelta()
    const now = performance.now()

    this.stepEntry(now)

    if (!prm && now - this.lastInteract > 3000 && this.focused < 0) {
      this.controls.target.x += (Math.sin(t * 0.12) * 20 - this.controls.target.x) * 0.01
      this.controls.target.y += (Math.cos(t * 0.09) * 12 - this.controls.target.y) * 0.01
    }

    if (this.entryDone) {
      this.ray.setFromCamera(this.ptr, this.camera)
      const hit = this.ray.intersectObjects(this.sprites)
      const nh = hit.length ? ((hit[0]!.object.userData as SpriteData).i as number) : -1
      if (nh !== this.hovered) {
        if (this.hovered >= 0) {
          const u = this.sprites[this.hovered]!.userData as SpriteData
          ;(this.sprites[this.hovered]!.material as THREE.SpriteMaterial).map = u.norm
        }
        this.hovered = nh
        this.hovStart = now
        document.body.style.cursor = this.hovered >= 0 ? 'pointer' : 'default'
        if (this.hovered >= 0) {
          const u = this.sprites[this.hovered]!.userData as SpriteData
          ;(this.sprites[this.hovered]!.material as THREE.SpriteMaterial).map = u.hot
          if (this.focused < 0) {
            this.setHiEdges(this.hovered)
            this.edgesTo(0.35, 250)
          }
        } else if (this.focused < 0) {
          this.edgesTo(0, 250)
        }
      }

      this.sprites.forEach((s, j) => {
        const u = s.userData as SpriteData
        const target = j === this.hovered ? 1.16 : 1
        if (prm) {
          // Reduced motion: hover feedback is an instant state change.
          u.v = 0
          u.s = target
        } else {
          u.v += (target - u.s) * 0.16
          u.v *= 0.8
          u.s += u.v
        }
        s.scale.set(u.baseScale.x * u.s, u.baseScale.y * u.s, 1)
        if (!prm && this.focused < 0) {
          s.position.y = u.baseY + Math.sin(t * 0.7 + u.phase) * 1.4
        }
      })
    }

    this.lctx.clearRect(0, 0, this.width, this.height)
    if (this.hovered >= 0 && this.entryDone) {
      const sp = this.screenPos(this.sprites[this.hovered]!)
      const n = GRAPH.nodes[this.hovered]!
      const halfW =
        (this.sprites[this.hovered]!.scale.x / (2 * F * this.aspect)) *
        this.width *
        this.camera.zoom
      const p = prm ? 1 : Math.min(1, (now - this.hovStart) / 450)
      const x = sp.x + halfW * 0.55,
        y = sp.y
      const lctx = this.lctx
      lctx.strokeStyle = REDLINE_WIRE
      lctx.fillStyle = REDLINE_WIRE
      lctx.lineWidth = 1.2
      lctx.beginPath()
      lctx.arc(x, y, 2.5, 0, 6.29)
      lctx.fill()
      const seg1 = Math.min(1, p * 2),
        seg2 = Math.max(0, p * 2 - 1)
      lctx.beginPath()
      lctx.moveTo(x, y)
      lctx.lineTo(x + 24 * seg1, y - 20 * seg1)
      if (seg2 > 0) lctx.lineTo(x + 24 + 40 * seg2, y - 20)
      lctx.stroke()
      if (p >= 1) {
        lctx.beginPath()
        lctx.moveTo(x + 64, y - 23)
        lctx.lineTo(x + 70, y - 20)
        lctx.lineTo(x + 64, y - 17)
        lctx.closePath()
        lctx.fill()
      }
      this.hoverLbl.style.display = 'block'
      this.hoverLbl.style.left = x + 74 + 'px'
      this.hoverLbl.style.top = y - 26 + 'px'
      this.hoverLbl.textContent = n.label + ' · ' + n.kind.toUpperCase()
    } else {
      this.hoverLbl.style.display = 'none'
    }

    this.runTweens()
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}
