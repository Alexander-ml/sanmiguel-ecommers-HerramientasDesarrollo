import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface CaptchaHandle {
    valorActual: string;
    refrescar: () => void;
}

interface CaptchaCanvasProps {
    /** Se llama cada vez que cambia el código (al montar y al refrescar). */
    onChange: (valor: string) => void;
}

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const LARGO = 5;

function generarCodigo(): string {
    let s = '';
    for (let i = 0; i < LARGO; i++) {
        s += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return s;
}

/**
 * Captcha visual propio (punto 7 de los 15).
 * Modo demo: la validación es en el componente padre comparando el string.
 * Cuando backend exponga /api/auth/captcha, se reemplaza por <img src=...>.
 */
export const CaptchaCanvas = forwardRef<CaptchaHandle, CaptchaCanvasProps>(
    ({ onChange }, ref) => {
        const { t } = useTranslation();
        const [valor, setValor] = useState(generarCodigo);
        const canvasRef = useRef<HTMLCanvasElement>(null);

        const dibujar = (texto: string) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Fondo
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Ruido (puntitos azules)
            for (let i = 0; i < 70; i++) {
                ctx.fillStyle = `rgba(37, 99, 235, ${Math.random() * 0.15})`;
                ctx.fillRect(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    2,
                    2,
                );
            }

            // Texto con rotación individual
            ctx.font = 'bold 28px Inter, sans-serif';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#0f172a';
            const anchoChar = canvas.width / (LARGO + 1);
            for (let i = 0; i < texto.length; i++) {
                ctx.save();
                ctx.translate(anchoChar * (i + 1), canvas.height / 2 + (Math.random() * 6 - 3));
                ctx.rotate((Math.random() - 0.5) * 0.4);
                ctx.fillText(texto[i], 0, 0);
                ctx.restore();
            }

            // Líneas de interferencia
            for (let i = 0; i < 3; i++) {
                ctx.strokeStyle = `rgba(37, 99, 235, ${0.2 + Math.random() * 0.3})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.stroke();
            }
        };

        // Dibuja al montar y cada vez que cambia el valor
        useEffect(() => {
            dibujar(valor);
            onChange(valor);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [valor]);

        const refrescar = () => {
            setValor(generarCodigo());
        };

        useImperativeHandle(ref, () => ({ valorActual: valor, refrescar }), [valor]);

        return (
            <div className="d-flex align-items-center gap-2">
                <canvas
                    ref={canvasRef}
                    width={170}
                    height={50}
                    style={{
                        borderRadius: 'var(--sm-radius-sm)',
                        border: '1px solid var(--sm-border)',
                        display: 'block',
                    }}
                    aria-label="Captcha visual"
                />
                <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={refrescar}
                    aria-label={t('auth.captchaRefrescar')}
                    title={t('auth.captchaRefrescar')}
                >
                    <i className="bi bi-arrow-clockwise" />
                </button>
            </div>
        );
    },
);

CaptchaCanvas.displayName = 'CaptchaCanvas';