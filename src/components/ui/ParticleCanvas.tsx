import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface RouteNode {
  x: number;
  y: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  ripples: Ripple[];
  rippleTimer: number;
  rippleInterval: number;
}

interface Ripple {
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
}

interface RoutePath {
  points: [number, number][];
  pulses: RoutePulse[];
  spawnTimer: number;
  spawnInterval: number;
  color: string;
  width: number;
  opacity: number;
}

interface RoutePulse {
  t: number;
  speed: number;
  size: number;
  opacity: number;
  trail: { x: number; y: number; opacity: number }[];
}

function getCubicBezierPoint(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number]
): [number, number] {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;
  return [
    mt3 * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t3 * p3[0],
    mt3 * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t3 * p3[1],
  ];
}

function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha: number,
  glowRadius: number
) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
  grad.addColorStop(0, `rgba(${color}, ${alpha})`);
  grad.addColorStop(0.4, `rgba(${color}, ${alpha * 0.4})`);
  grad.addColorStop(1, `rgba(${color}, 0)`);
  ctx.beginPath();
  ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${color}, ${Math.min(alpha * 1.5, 1)})`;
  ctx.fill();
}

function buildPaths(w: number, h: number): RoutePath[] {
  const paths: RoutePath[] = [];

  const routes: Array<{
    points: [number, number][];
    color: string;
    width: number;
    opacity: number;
  }> = [
    {
      points: [
        [-w * 0.05, h * 0.3],
        [w * 0.15, h * 0.25],
        [w * 0.38, h * 0.42],
        [w * 0.55, h * 0.38],
        [w * 0.75, h * 0.28],
        [w * 1.05, h * 0.2],
      ],
      color: '255, 241, 0',
      width: 1.5,
      opacity: 0.55,
    },
    {
      points: [
        [-w * 0.05, h * 0.65],
        [w * 0.12, h * 0.7],
        [w * 0.3, h * 0.58],
        [w * 0.55, h * 0.62],
        [w * 0.72, h * 0.52],
        [w * 1.05, h * 0.55],
      ],
      color: '200, 220, 255',
      width: 1.2,
      opacity: 0.4,
    },
    {
      points: [
        [w * 0.2, -h * 0.05],
        [w * 0.25, h * 0.18],
        [w * 0.38, h * 0.42],
        [w * 0.45, h * 0.62],
        [w * 0.42, h * 0.85],
        [w * 0.4, h * 1.05],
      ],
      color: '255, 241, 0',
      width: 1.2,
      opacity: 0.45,
    },
    {
      points: [
        [w * 0.55, -h * 0.05],
        [w * 0.58, h * 0.15],
        [w * 0.55, h * 0.38],
        [w * 0.52, h * 0.6],
        [w * 0.56, h * 0.82],
        [w * 0.54, h * 1.05],
      ],
      color: '200, 220, 255',
      width: 1.0,
      opacity: 0.35,
    },
    {
      points: [
        [-w * 0.05, h * 0.48],
        [w * 0.18, h * 0.44],
        [w * 0.38, h * 0.42],
        [w * 0.6, h * 0.44],
        [w * 0.82, h * 0.38],
        [w * 1.05, h * 0.42],
      ],
      color: '255, 200, 80',
      width: 2.0,
      opacity: 0.3,
    },
    {
      points: [
        [w * 0.75, -h * 0.05],
        [w * 0.78, h * 0.12],
        [w * 0.75, h * 0.28],
        [w * 0.72, h * 0.52],
        [w * 0.76, h * 0.75],
        [w * 0.74, h * 1.05],
      ],
      color: '255, 241, 0',
      width: 1.0,
      opacity: 0.38,
    },
  ];

  for (const r of routes) {
    paths.push({
      points: r.points as [number, number][],
      pulses: [],
      spawnTimer: Math.random() * 120,
      spawnInterval: 80 + Math.random() * 100,
      color: r.color,
      width: r.width,
      opacity: r.opacity,
    });
  }

  return paths;
}

function buildNodes(w: number, h: number): RouteNode[] {
  const positions: [number, number][] = [
    [w * 0.38, h * 0.42],
    [w * 0.55, h * 0.38],
    [w * 0.75, h * 0.28],
    [w * 0.3, h * 0.58],
    [w * 0.72, h * 0.52],
    [w * 0.25, h * 0.18],
    [w * 0.58, h * 0.15],
  ];

  return positions.map(([x, y], i) => ({
    x,
    y,
    radius: i < 3 ? 4 : 2.5,
    pulsePhase: Math.random() * Math.PI * 2,
    pulseSpeed: 0.018 + Math.random() * 0.012,
    ripples: [],
    rippleTimer: Math.random() * 200,
    rippleInterval: 160 + Math.random() * 120,
  }));
}

function drawRoutePath(
  ctx: CanvasRenderingContext2D,
  path: RoutePath,
  w: number,
  _h: number
) {
  const pts = path.points;
  if (pts.length < 4) return;

  for (let seg = 0; seg <= pts.length - 4; seg += 3) {
    const p0 = pts[Math.min(seg, pts.length - 1)];
    const p1 = pts[Math.min(seg + 1, pts.length - 1)];
    const p2 = pts[Math.min(seg + 2, pts.length - 1)];
    const p3 = pts[Math.min(seg + 3, pts.length - 1)];

    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
    ctx.strokeStyle = `rgba(${path.color}, ${path.opacity * 0.6})`;
    ctx.lineWidth = path.width * 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
    ctx.strokeStyle = `rgba(${path.color}, ${path.opacity})`;
    ctx.lineWidth = path.width;
    ctx.stroke();
  }

  void w;
}

function getPathPosition(path: RoutePath, t: number): [number, number] {
  const pts = path.points;
  const segments = Math.floor((pts.length - 1) / 3);
  const segT = t * segments;
  const seg = Math.min(Math.floor(segT), segments - 1);
  const localT = segT - seg;
  const i = seg * 3;
  const p0 = pts[Math.min(i, pts.length - 1)];
  const p1 = pts[Math.min(i + 1, pts.length - 1)];
  const p2 = pts[Math.min(i + 2, pts.length - 1)];
  const p3 = pts[Math.min(i + 3, pts.length - 1)];
  return getCubicBezierPoint(localT, p0, p1, p2, p3);
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef<{
    paths: RoutePath[];
    nodes: RouteNode[];
    time: number;
  }>({ paths: [], nodes: [], time: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const isLight = theme === 'light';

    const init = (w: number, h: number) => {
      stateRef.current.paths = buildPaths(w, h);
      stateRef.current.nodes = buildNodes(w, h);
      stateRef.current.time = 0;
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      init(canvas.width, canvas.height);
    };

    resize();

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const { paths, nodes } = stateRef.current;
      stateRef.current.time += 1;
      const time = stateRef.current.time;

      ctx.clearRect(0, 0, w, h);

      if (!isLight) {
        const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.5, w * 0.75);
        bgGrad.addColorStop(0, 'rgba(8, 14, 30, 0)');
        bgGrad.addColorStop(1, 'rgba(2, 6, 18, 0.35)');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
      }

      for (const path of paths) {
        drawRoutePath(ctx, path, w, h);
      }

      for (const node of nodes) {
        node.rippleTimer++;
        if (node.rippleTimer >= node.rippleInterval) {
          node.rippleTimer = 0;
          node.rippleInterval = 160 + Math.random() * 120;
          node.ripples.push({
            radius: node.radius,
            maxRadius: 60 + Math.random() * 40,
            opacity: 0.6,
            speed: 0.5 + Math.random() * 0.3,
          });
        }

        node.ripples = node.ripples.filter((r) => r.opacity > 0.01);
        for (const r of node.ripples) {
          r.radius += r.speed;
          r.opacity *= 0.975;
          const rColor = node.radius > 3 ? '255, 241, 0' : '200, 220, 255';
          ctx.beginPath();
          ctx.arc(node.x, node.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${rColor}, ${r.opacity * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          if (r.radius > 8) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, r.radius * 0.6, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${rColor}, ${r.opacity * 0.15})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }

        const pulse = Math.sin(node.pulsePhase + time * node.pulseSpeed);
        const pScale = 1 + pulse * 0.35;
        const pAlpha = 0.7 + pulse * 0.3;
        const nColor = node.radius > 3 ? '255, 241, 0' : '200, 220, 255';
        drawGlow(ctx, node.x, node.y, node.radius * pScale, nColor, pAlpha, node.radius * 8 * pScale);
      }

      for (const path of paths) {
        path.spawnTimer++;
        if (path.spawnTimer >= path.spawnInterval) {
          path.spawnTimer = 0;
          path.spawnInterval = 80 + Math.random() * 100;
          path.pulses.push({
            t: 0,
            speed: 0.0018 + Math.random() * 0.0012,
            size: 2.5 + Math.random() * 1.5,
            opacity: 0.9,
            trail: [],
          });
        }

        path.pulses = path.pulses.filter((p) => p.t <= 1.0);

        for (const pulse of path.pulses) {
          pulse.t += pulse.speed;
          if (pulse.t > 1.0) continue;

          const [px, py] = getPathPosition(path, pulse.t);

          pulse.trail.unshift({ x: px, y: py, opacity: pulse.opacity });
          if (pulse.trail.length > 28) pulse.trail.pop();

          for (let ti = 0; ti < pulse.trail.length; ti++) {
            const tp = pulse.trail[ti];
            const trailAlpha = tp.opacity * (1 - ti / pulse.trail.length) * 0.7;
            const trailSize = pulse.size * (1 - ti / pulse.trail.length) * 0.8;
            if (trailSize < 0.3) continue;
            ctx.beginPath();
            ctx.arc(tp.x, tp.y, trailSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${path.color}, ${trailAlpha})`;
            ctx.fill();
          }

          drawGlow(ctx, px, py, pulse.size, path.color, pulse.opacity, pulse.size * 7);
        }
      }

      const scanLine = ((time * 0.4) % (h * 1.6)) - h * 0.3;
      const scanGrad = ctx.createLinearGradient(0, scanLine - 60, 0, scanLine + 60);
      scanGrad.addColorStop(0, 'rgba(255, 241, 0, 0)');
      scanGrad.addColorStop(0.45, 'rgba(255, 241, 0, 0.018)');
      scanGrad.addColorStop(0.5, 'rgba(255, 241, 0, 0.045)');
      scanGrad.addColorStop(0.55, 'rgba(255, 241, 0, 0.018)');
      scanGrad.addColorStop(1, 'rgba(255, 241, 0, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanLine - 60, w, 120);

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full transition-opacity duration-500"
      style={{ display: 'block', opacity: theme === 'light' ? 0.15 : 1 }}
    />
  );
}
