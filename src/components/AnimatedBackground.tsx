"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pathname = usePathname();
    const isHome = pathname === "/";
    const topOffset = isHome ? 800 : 0; // Approximate hero height

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const updateDimensions = () => {
            const width = window.innerWidth;
            const height = document.documentElement.scrollHeight;
            canvas.width = width;
            canvas.height = height;
            return { width, height };
        };

        let { width, height } = updateDimensions();

        const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
        const particleCount = Math.floor((width * (height - topOffset)) / 40000); 

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: topOffset + Math.random() * (height - topOffset),
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 5 + 5 
            });
        }

        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = "rgba(212, 175, 55, 0.25)"; 
            ctx.strokeStyle = "rgba(212, 175, 55, 0.15)"; 

            for (let i = 0; i < particleCount; i++) {
                const p = particles[i];

                // Update pos
                p.x += p.vx;
                p.y += p.vy;

                // Bounce
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < topOffset || p.y > height) p.vy *= -1;

                // Draw dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                // Draw lines
                for (let j = i + 1; j < particleCount; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < 40000) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            const dims = updateDimensions();
            width = dims.width;
            height = dims.height;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [topOffset]);

    return (
        <canvas
            ref={canvasRef}
            style={{ top: topOffset }}
            className="absolute left-0 w-full z-[-1] pointer-events-none opacity-60 mix-blend-screen"
        />
    );
}
