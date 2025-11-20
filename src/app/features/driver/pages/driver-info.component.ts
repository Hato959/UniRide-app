import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DriverComment {
  name: string;
  stars: number;
  text: string;
}

interface DriverSchedule {
  day: string;
  hours: string;
  campus: string;
}

@Component({
  selector: 'app-driver-info',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-body">
        <div class="back-row">
          <a routerLink="/home" class="back-btn">Volver</a>
        </div>

        <section class="card profile-card">
          <div class="driver-block">
            <div class="avatar">
              <span>MG</span>
            </div>
            <div class="info">
              <h2>Mateo Alvarez Garcia</h2>
              <p><strong>Carrera:</strong> Arquitectura</p>
              <p><strong>Correo universitario:</strong> u202456778@upc.edu.pe</p>
              <p><strong>Distrito:</strong> San Borja</p>
            </div>
          </div>
          <div class="vehicle-block">
            <h3>Vehiculo</h3>
            <div class="vehicle-body">
              <div class="car-photo">Auto</div>
              <div class="vehicle-data">
                <p><strong>Placa:</strong> XSJ-593</p>
                <p><strong>Marca:</strong> Kia</p>
                <p><strong>Modelo:</strong> Rio</p>
                <p><strong>Color:</strong> Blanco</p>
              </div>
            </div>
          </div>
        </section>

        <div class="grid">
          <section class="card rating-card">
            <div class="rating-header">
              <h3>Calificacion</h3>
              <div class="rating-score">
                <span class="score">4.0</span>
                <div class="stars">
                  <i class="fas fa-star" *ngFor="let s of [1,2,3,4];"></i>
                  <i class="far fa-star"></i>
                </div>
              </div>
            </div>

            <div class="comments">
              <p class="comments-label">Comentarios</p>
              <div class="comment" *ngFor="let comment of comments">
                <div class="comment-head">
                  <strong>{{ comment.name }}</strong>
                  <div class="stars">
                    <i class="{{ starIcon(i, comment.stars) }}" *ngFor="let i of [1,2,3,4,5]"></i>
                  </div>
                </div>
                <p class="comment-text">{{ comment.text }}</p>
              </div>
            </div>
          </section>

          <section class="card schedule-card">
            <h3>Horarios disponibles</h3>
            <div class="schedule-list">
              <div class="schedule" *ngFor="let slot of schedule">
                <div class="day-hours">
                  <span class="day">{{ slot.day }}</span>
                  <span class="hours">{{ slot.hours }}</span>
                </div>
                <span class="campus">Sede: {{ slot.campus }}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer class="footer">
        <div class="footer-brand">UNIRIDE</div>
        <div class="footer-text">Movilidad universitaria segura y colaborativa</div>
        <div class="footer-contact">
          <i class="fas fa-envelope"></i>
          <span>info@uniride.com</span>
        </div>
        <div class="footer-social">
          <i class="fab fa-facebook"></i>
          <i class="fab fa-twitter"></i>
          <i class="fab fa-instagram"></i>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .page {
      min-height: 100vh;
      background: #e3e3e3;
      display: flex;
      flex-direction: column;
      color: #222;
    }

    .topbar {
      height: 70px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #c40000;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .logo .divider {
      width: 2px;
      height: 26px;
      background: #c40000;
      opacity: 0.7;
    }
    .logo i { font-size: 1.3rem; }

    .actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid #d8d8d8;
      display: grid;
      place-items: center;
      color: #444;
      background: #fff;
      text-decoration: none;
      transition: transform 0.15s ease, box-shadow 0.2s;
    }
    .circle:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 10px rgba(0,0,0,0.12);
    }

    .page-body {
      flex: 1;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .back-row {
      display: flex;
      justify-content: flex-end;
    }
    .back-btn {
      background: #c40000;
      color: white;
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    .card {
      background: white;
      border-radius: 18px;
      padding: 18px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.12);
      border: 1px solid #ededed;
    }

    .profile-card {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 18px;
      align-items: center;
    }
    .driver-block {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .avatar {
      width: 84px;
      height: 84px;
      border-radius: 50%;
      background: linear-gradient(180deg, #f56c6c, #c42121);
      display: grid;
      place-items: center;
      color: white;
      font-weight: 800;
      font-size: 1.4rem;
      letter-spacing: 1px;
      box-shadow: 0 8px 18px rgba(0,0,0,0.2);
    }
    .info h2 {
      margin: 0 0 4px;
      font-size: 1.2rem;
    }
    .info p {
      margin: 2px 0;
      color: #444;
      font-size: 0.95rem;
    }

    .vehicle-block h3 { margin: 0 0 10px; font-size: 1.15rem; color: #c40000; }
    .vehicle-body {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 12px;
      align-items: center;
    }
    .car-photo {
      height: 110px;
      border-radius: 14px;
      background: linear-gradient(135deg, #f4f4f4, #e1e1e1);
      display: grid;
      place-items: center;
      color: #999;
      font-weight: 700;
      box-shadow: inset 0 0 0 1px #dedede;
    }
    .vehicle-data p {
      margin: 4px 0;
      font-size: 0.95rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 18px;
    }

    .rating-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .rating-header h3 { margin: 0; font-size: 1.2rem; }
    .rating-score {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .score {
      font-size: 1.2rem;
      font-weight: 700;
      color: #c40000;
    }
    .stars { color: #c40000; }

    .comments { margin-top: 12px; }
    .comments-label { margin: 0 0 6px; font-weight: 700; }
    .comment {
      padding: 8px 0;
      border-bottom: 1px solid #f1f1f1;
    }
    .comment:last-child { border-bottom: none; }
    .comment-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    .comment-text {
      margin: 4px 0 0;
      color: #555;
      font-size: 0.95rem;
    }

    .schedule-card h3 { margin: 0 0 10px; font-size: 1.2rem; }
    .schedule-list { display: flex; flex-direction: column; gap: 10px; }
    .schedule {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: #f9f9f9;
      border-radius: 12px;
      border: 1px solid #ededed;
    }
    .day-hours { display: flex; flex-direction: column; }
    .day { font-weight: 700; }
    .hours { color: #555; }
    .campus { color: #555; }

    .footer {
      background: white;
      padding: 16px 20px 20px;
      text-align: center;
      border-top: 1px solid #e1e1e1;
      display: grid;
      gap: 4px;
    }
    .footer-brand { font-weight: 800; letter-spacing: 1px; }
    .footer-text { font-size: 0.95rem; color: #444; }
    .footer-contact {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #c40000;
      justify-content: center;
    }
    .footer-social {
      display: flex;
      justify-content: center;
      gap: 16px;
      color: #c40000;
      margin-top: 6px;
    }

    @media (max-width: 720px) {
      .vehicle-body { grid-template-columns: 1fr; }
      .profile-card { grid-template-columns: 1fr; }
      .schedule { flex-direction: column; align-items: flex-start; gap: 4px; }
      .rating-header { flex-direction: column; align-items: flex-start; gap: 6px; }
    }
  `]
})
export class DriverInfoComponent {
  comments: DriverComment[] = [
    { name: 'Marcos Ruiz Zapata', stars: 4, text: 'Buen conductor, puso buena musica.' },
    { name: 'Diego Correa Hilario', stars: 4, text: 'Llegue a tiempo a mi examen, gracias.' }
  ];

  schedule: DriverSchedule[] = [
    { day: 'Lunes', hours: '7-8 am', campus: 'Monterrico' },
    { day: 'Miercoles', hours: '10-11 am', campus: 'Monterrico' },
    { day: 'Viernes', hours: '5-6 pm', campus: 'Monterrico' }
  ];

  starIcon(position: number, rating: number): string {
    return position <= rating ? 'fas fa-star' : 'far fa-star';
  }
}
