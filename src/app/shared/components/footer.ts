import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer>
      <div class="footer-brand">UNIRIDE</div>
      <div class="footer-slogan">“Movilidad universitaria segura y colaborativa”</div>

      <div class="footer-contact">
        <i class="far fa-envelope"></i>
        <span>info@uniride.com</span>
      </div>

      <div class="footer-socials">
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      background-color: #D50100;
      color: #FFFFFF;
      text-align: center;
      padding: 40px 20px;
      margin-top: auto;
      width: 100%;
    }

    .footer-brand {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
    }

    .footer-slogan {
      font-size: 1.1rem;
      margin-bottom: 20px;
      font-weight: 500;
    }

    .footer-contact {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 25px;
      font-size: 1.1rem;
    }

    .footer-contact i {
      font-size: 1.5rem;
    }

    .footer-socials {
      display: flex;
      justify-content: center;
      gap: 40px;
    }

    .footer-socials a {
      color: #FFFFFF;
      font-size: 2rem;
      text-decoration: none;
      transition: opacity 0.3s;
    }

    .footer-socials a:hover {
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      footer {
        padding: 30px 15px;
      }
    }
  `]
})
export class FooterComponent {}
