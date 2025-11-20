import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing-container">

      <section class="hero">
        <div class="hero-content">
          <h1>Tu viaje a la U,<br>seguro y compartido.</h1>
          <p>Únete a la comunidad de movilidad exclusiva universitaria. Conecta con compañeros, reduce costos y llega seguro a clases con UniRide.</p>
          <a routerLink="/auth/login" class="cta-button">Comenzar servicio</a>
        </div>
        <div class="hero-visual">
          <div class="app-card">
              <div class="image-container">
               <!-- Asegúrate de que la imagen se llame así en src/assets/images/ -->
               <img src="images/app-preview.png" alt="Vista previa de la App" class="hero-img">
              </div>
          </div>
        </div>
      </section>

      <section class="features">
        <h2 class="section-title">Beneficios UNIRIDE</h2>
        <div class="features-grid">
          <div class="feature-card">
            <i class="fas fa-user-check"></i>
            <h3>Comunidad Exclusiva</h3>
            <p>Sin desconocidos. Viajas únicamente con estudiantes verificados.</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-wallet"></i>
            <h3>Ahorro Inteligente</h3>
            <p>Tarifas justas pensadas para el bolsillo del estudiante.</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-leaf"></i>
            <h3>Eco-Amigable</h3>
            <p>Reducimos la huella de carbono compartiendo vehículo.</p>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    /* Estilos extraídos de tu index.html y adaptados */

    .landing-container {
      width: 100%;
      overflow-x: hidden;
    }

    /* HERO */
    .hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 60px 10%;
      min-height: 85vh;
    }

    .hero-content {
      flex: 1;
      max-width: 600px;
    }

    .hero h1 {
      font-size: 3.5rem;
      line-height: 1.2;
      margin-bottom: 20px;
      color: var(--primary-red);
    }

    .hero p {
      font-size: 1.2rem;
      margin-bottom: 30px;
      line-height: 1.6;
    }

    .cta-button {
      background-color: var(--primary-red);
      color: var(--text-white);
      padding: 15px 40px;
      font-size: 1.2rem;
      font-weight: bold;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.2);
      transition: transform 0.2s;
      display: inline-block;
      cursor: pointer;
      text-decoration: none;
    }

    .cta-button:hover {
      transform: translateY(-2px);
      background-color: var(--dark-red);
    }

    /* VISUAL CARD */
    .hero-visual {
      flex: 1;
      display: flex;
      justify-content: center;
    }

    .app-card {
      /* Quitamos el fondo blanco de tarjeta si la imagen ya tiene su propio marco o si quieres que flote */
      /* background-color: var(--card-white); */
      padding: 20px;
      /* box-shadow: ... */
      width: 100%;
      max-width: 400px; /* Ajusta el tamaño máximo de la imagen */
      text-align: center;
      display: flex;
      justify-content: center;
    }

    .image-container {
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .hero-img {
      width: 100%;
      height: auto;
      object-fit: contain;
      /* Opcional: Sombra suave a la imagen */
      filter: drop-shadow(0 10px 15px rgba(0,0,0,0.15));
    }

    /* FEATURES */
    .features {
      background-color: #F5F5F5;
      padding: 60px 10%;
      text-align: center;
    }

    .section-title {
      font-size: 2.5rem;
      margin-bottom: 60px;
      color: var(--text-dark);
      position: relative;
      display: inline-block;
    }

    .section-title::after {
      content: '';
      display: block;
      width: 60px;
      height: 4px;
      background-color: var(--primary-red);
      margin: 10px auto 0;
      border-radius: 2px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
    }

    .feature-card {
      padding: 30px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      transition: transform 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-card i {
      font-size: 3rem;
      color: var(--primary-red);
      margin-bottom: 20px;
    }

    .feature-card h3 {
      margin-bottom: 15px;
      font-size: 1.5rem;
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .hero {
        flex-direction: column;
        text-align: center;
        padding: 40px 20px;
      }
      .hero-visual {
        margin-top: 50px;
      }
      .app-card {
        max-width: 100%;
      }
    }
  `]
})
export class HomeComponent {}
