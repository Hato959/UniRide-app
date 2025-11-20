import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
        <div class="guide-header">
            <h1>¿Cómo usar UniRide?</h1>
            <p>La movilidad colaborativa explicada paso a paso</p>
        </div>

        <div class="process-container">
            <div class="role-column">
                <div class="role-title">
                    <i class="fas fa-car-side"></i>
                    <h2>Modo Conductor</h2>
                </div>
                <div class="step">
                    <div class="step-num">1</div>
                    <div class="step-content">
                        <h4>Publica tu viaje</h4>
                        <p>Ingresa a la app y establece tu hora de salida, punto de inicio y destino.</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-num">2</div>
                    <div class="step-content">
                        <h4>Recibe solicitudes</h4>
                        <p>Recibirás una notificación cuando alguien quiera ocupar un asiento.</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-num">3</div>
                    <div class="step-content">
                        <h4>Acepta y viaja</h4>
                        <p>Revisa el perfil del estudiante y acepta la solicitud.</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-num">4</div>
                    <div class="step-content">
                        <h4>Cobro del viaje</h4>
                        <p>El pasajero realiza el pago acordado mediante Yape, Plin o efectivo.</p>
                    </div>
                </div>
            </div>

            <div class="role-column">
                <div class="role-title">
                    <i class="fas fa-user-graduate"></i>
                    <h2>Modo Pasajero</h2>
                </div>
                <div class="step">
                    <div class="step-num">1</div>
                    <div class="step-content">
                        <h4>Busca tu ruta</h4>
                        <p>Entra a la web y busca conductores hacia tu universidad.</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-num">2</div>
                    <div class="step-content">
                        <h4>Reserva tu asiento</h4>
                        <p>Selecciona el viaje y envía una solicitud de reserva.</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-num">3</div>
                    <div class="step-content">
                        <h4>Confirmación</h4>
                        <p>Espera a que el conductor acepte tu solicitud.</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-num">4</div>
                    <div class="step-content">
                        <h4>Viaja cómodo</h4>
                        <p>Preséntate en el punto de encuentro a tiempo y disfruta el viaje.</p>
                    </div>
                </div>
            </div>
        </div>

        <section class="faq-section">
            <h2 class="faq-title">Preguntas Frecuentes</h2>

            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-circle"></i> ¿Es necesario usar el correo institucional?</div>
                <div class="faq-answer">Sí, para garantizar la seguridad, todos deben validar su cuenta con un correo .edu activo.</div>
            </div>
            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-circle"></i> ¿Qué métodos de pago aceptan?</div>
                <div class="faq-answer">Fomentamos el uso de billeteras digitales como Yape o Plin, pero también efectivo.</div>
            </div>
            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-circle"></i> ¿Puedo cancelar un viaje?</div>
                <div class="faq-answer">Sí, puedes cancelar con anticipación. Cancelaciones frecuentes afectan tu calificación.</div>
            </div>
        </section>
    </div>
  `,
  styles: [`
    /* GUIDE HEADER */
    .guide-header { background: white; padding: 60px 10%; text-align: center; }
    .guide-header h1 { color: var(--primary-red); font-size: 3rem; margin-bottom: 10px; }
    .guide-header p { color: #666; font-size: 1.2rem; }

    /* PROCESS */
    .process-container { display: flex; flex-wrap: wrap; padding: 40px 5%; gap: 40px; justify-content: center; background-color: #f4f4f4; }
    .role-column { flex: 1; min-width: 350px; background: white; border-radius: 15px; padding: 30px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }

    .role-title { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 15px; }
    .role-title i { font-size: 2rem; color: var(--primary-red); }
    .role-title h2 { font-size: 1.8rem; color: #333; }

    .step { display: flex; gap: 15px; margin-bottom: 25px; }
    .step-num { min-width: 30px; height: 30px; background: var(--primary-red); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-top: 3px; }
    .step-content h4 { font-size: 1.1rem; margin-bottom: 5px; color: #222; }
    .step-content p { font-size: 0.95rem; color: #666; line-height: 1.4; }

    /* FAQ */
    .faq-section { padding: 60px 15%; background: white; }
    .faq-title { text-align: center; color: var(--primary-red); font-size: 2rem; margin-bottom: 40px; }
    .faq-item { border-bottom: 1px solid #eee; padding: 20px 0; }
    .faq-question { font-weight: bold; font-size: 1.2rem; color: #333; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
    .faq-question i { color: var(--primary-red); font-size: 0.8rem; }
    .faq-answer { color: #666; line-height: 1.6; padding-left: 20px; }

    @media (max-width: 768px) {
        .role-column { min-width: 100%; }
    }
  `]
})
export class GuiaComponent {}
