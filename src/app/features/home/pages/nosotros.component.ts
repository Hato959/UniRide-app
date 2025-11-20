import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">

      <section class="about-section">
        <div class="about-header">
            <h1>MoviUni: Nuestra Visión</h1>
            <p class="about-text">
                MoviUni es una startup académica con un propósito muy claro: lograr mejorar la experiencia de movilidad de los estudiantes universitarios de Lima Metropolitana. Esta startup surge como una respuesta frente a las dificultades de transporte que enfrentan muchos jóvenes universitarios.
            </p>
            <p class="about-text">
                La visión de MoviUni es buscar promover una movilidad estudiantil más segura, eficiente y sostenible. Todo esto fomentando una colaboración entre pares mediante un uso compartido de vehículos particulares.
            </p>
            <p class="about-text">
                Por ende, con el desarrollo de <strong>UniRide</strong>, nuestro producto digital, MoviUni busca convertirse en un gran referente de innovación tecnológica aplicada a la movilidad colaborativa estudiantil.
            </p>
        </div>
      </section>

      <section class="team-section">
        <h2 class="team-title">Nuestro Equipo</h2>
        <div class="team-grid">

            <div class="member-card">
                <div class="photo-placeholder"><i class="fas fa-user"></i></div>
                <div class="member-info">
                    <h3 class="member-name">Marcos Aaron Bedia Torres</h3>
                    <div class="member-role">Ciencias de la Computación</div>
                    <p class="member-bio">Me gusta la programación y aprender nuevos temas. Mis habilidades fuertes son C++, Python y me encanta el manejo de datos con SQL.</p>
                </div>
            </div>

            <div class="member-card">
                <div class="photo-placeholder"><i class="fas fa-user"></i></div>
                <div class="member-info">
                    <h3 class="member-name">Armando Navarro Pérez</h3>
                    <div class="member-role">7mo Ciclo - Computación</div>
                    <p class="member-bio">Tengo 20 años. Mis intereses son la programación, software de entretenimiento y data science.</p>
                </div>
            </div>

            <div class="member-card">
                <div class="photo-placeholder"><i class="fas fa-user"></i></div>
                <div class="member-info">
                    <h3 class="member-name">Cristopher Romero Delgado</h3>
                    <div class="member-role">Ciencias de la Computación</div>
                    <p class="member-bio">Mis intereses son la programación y desarrollo de software de entretenimiento. Me destaco por ser una persona responsable.</p>
                </div>
            </div>

            <div class="member-card">
                <div class="photo-placeholder"><i class="fas fa-user"></i></div>
                <div class="member-info">
                    <h3 class="member-name">Bruce Matias Fleck Ojeda</h3>
                    <div class="member-role">8vo Ciclo - Computación</div>
                    <p class="member-bio">Tengo 22 años. Mis intereses son la programación, la música y los gatos.</p>
                </div>
            </div>

        </div>
      </section>

    </div>
  `,
  styles: [`
    /* ABOUT SECTION */
    .about-section { padding: 60px 10%; background: white; }
    .about-header { max-width: 800px; margin: 0 auto 50px; text-align: center; }
    .about-header h1 { color: var(--primary-red); font-size: 2.8rem; margin-bottom: 20px; }
    .about-text { font-size: 1.1rem; line-height: 1.8; color: #444; text-align: justify; margin-bottom: 20px; }

    /* TEAM SECTION */
    .team-section { padding: 60px 10%; background: #f4f4f4; }
    .team-title { text-align: center; color: var(--primary-red); font-size: 2.5rem; margin-bottom: 50px; }
    .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }

    .member-card { background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s; text-align: center; padding-bottom: 20px; }
    .member-card:hover { transform: translateY(-5px); }

    .photo-placeholder { width: 100%; height: 250px; background-color: #ddd; display: flex; align-items: center; justify-content: center; color: #888; font-size: 3rem; position: relative; }

    .member-info { padding: 20px; }
    .member-name { color: var(--primary-red); font-size: 1.4rem; margin-bottom: 5px; font-weight: bold; }
    .member-role { color: #666; font-size: 0.9rem; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
    .member-bio { font-size: 0.95rem; color: #555; line-height: 1.5; }
  `]
})
export class NosotrosComponent {}
