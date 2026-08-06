export default function Footer() {
  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <a className="nav-logo" href="#" style={{ textDecoration: 'none' }}>
              <div className="nav-logo-icon">
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'none', stroke: 'white', strokeWidth: 2.2, strokeLinecap: 'round' }}>
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <span className="nav-logo-text">KADOSH<span>TECH</span></span>
            </a>
            <p className="footer-tagline">Software Developer &amp; Web Solutions — criando experiências digitais que transformam negócios.</p>
            <div className="footer-socials">
              <a href="https://github.com/MisaeL337" className="social-btn" aria-label="GitHub">
                <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
              </a>
              <a href="https://www.instagram.com/kadosh.tech/" className="social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="" className="social-btn" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>SERVIÇOS</h4>
            <ul>
              <li><a href="#">Engenharia de Software &amp; Sistemas</a></li>
              <li><a href="#">Páginas Web Corporativas</a></li>
              <li><a href="#">Otimização de Performance &amp; Cloud</a></li>
              <li><a href="#">E-Commerce de Alta Performance</a></li>
              <li><a href="#">Governança, Manutenção &amp; Suporte</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>EMPRESA</h4>
            <ul>
              <li><a href="#sobre">Sobre</a></li>
              <li><a href="#work">Projetos</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>TECNOLOGIAS</h4>
            <ul>
              <li><a href="#">Next.js</a></li>
              <li><a href="#">React</a></li>
              <li><a href="#">Node.js</a></li>
              <li><a href="#">Tailwind CSS</a></li>
              <li><a href="#">TypeScript</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copy">© 2026 <span>Kadosh Tech</span>. Todos os direitos reservados.</p>
          <a
            href="#"
            className="footer-back"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Voltar ao topo
            <svg viewBox="0 0 24 24"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
