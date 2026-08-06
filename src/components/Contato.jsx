import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../lib/smoothScroll.js';
import ServiceSelect from './ServiceSelect.jsx';
import DepthText from './DepthText/DepthText.jsx';

export default function Contato() {
  const [sent, setSent] = useState(false);
  const [service, setService] = useState('');
  const sectionRef = useRef(null);
  const infoRef = useRef(null);
  const formWrapRef = useRef(null);
  const btnRef = useRef(null);
  const fname = useRef(null);
  const fmsg = useRef(null);

  // Entrance only — none of this touches the form's own state/refs/submit
  // logic below.
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // Left column: label, title, description and each contact row stagger
    // in as their own beat, instead of the whole block fading as one lump.
    const infoTargets = gsap.utils.toArray('.section-label, .contato-impact, .contato-desc, .ci-bare', infoRef.current);
    gsap.set(infoTargets, { opacity: 0, y: 22 });
    ScrollTrigger.batch(infoTargets, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out' }),
    });

    const targets = gsap.utils.toArray('.form-group, .form-submit', formWrapRef.current);
    gsap.set(targets, { opacity: 0, y: 24 });
    ScrollTrigger.batch(targets, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.09, duration: 0.7, ease: 'power3.out' }),
    });
  }, { scope: sectionRef });

  const onSubmit = (e) => {
    e.preventDefault();
    const nome = fname.current.value.trim();
    const servico = service || 'Não informado';
    const msg = fmsg.current.value.trim();
    const texto = [
      '👋 Olá! Vim pelo site da *Kadosh Tech* e gostaria de solicitar um orçamento.',
      '',
      `*Nome:* ${nome}`,
      `*Serviço:* ${servico}`,
      `*Mensagem:* ${msg || 'Sem mensagem adicional.'}`,
    ].join('\n');
    const url = 'https://wa.me/5511953616991?text=' + encodeURIComponent(texto);
    setSent(true);
    setTimeout(() => window.open(url, '_blank'), 900);
  };

  const onBtnMouseMove = (e) => {
    const btn = btnRef.current;
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--bx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    btn.style.setProperty('--by', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  };

  return (
    <section id="contato" className="section-fade-in" ref={sectionRef}>
      <div className="section-inner">
        <div className="contato-grid">
          <div className="contato-info reveal" ref={infoRef}>
            <p className="section-label">Entre em contato</p>
            <h2 className="contato-impact">
              VAMOS<br />CRIAR<br />
              <DepthText
                text="ALGO ÚNICO?"
                className="kadosh-depth-word"
                layers={14}
                depth={2.2}
                tilt={6}
                faceColor="#ffffff"
                depthColor="#1d4ed8"
                fontSize="clamp(2.8rem, 5.5vw, 5rem)"
                fontWeight={400}
                orbitSpeed={0.25}
              />
            </h2>
            <p className="contato-desc">Manda uma mensagem — seu próximo projeto começa com uma conversa.</p>

            <div className="contato-bare">
              <div className="ci-bare">
                <div className="ci-bare-icon">
                  <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <div className="ci-bare-text">
                  <div className="ci-bare-label">E-mail</div>
                  <div className="ci-bare-value">kadoshtech33@gmail.com</div>
                </div>
              </div>
              <div className="ci-bare">
                <div className="ci-bare-icon">
                  <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                </div>
                <div className="ci-bare-text">
                  <div className="ci-bare-label">WhatsApp</div>
                  <div className="ci-bare-value">(11) 95361-6991</div>
                </div>
              </div>
              <div className="ci-bare">
                <div className="ci-bare-icon">
                  <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <div className="ci-bare-text">
                  <div className="ci-bare-label">Localização</div>
                  <div className="ci-bare-value">São Paulo, SP — Brasil</div>
                </div>
              </div>
            </div>
          </div>

          <div className="contato-form-wrap reveal reveal-delay-2" ref={formWrapRef}>
            {!sent && (
              <form id="contactForm" onSubmit={onSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <input type="text" id="fname" placeholder=" " required ref={fname} />
                    <label htmlFor="fname">Nome</label>
                  </div>
                  <div className="form-group">
                    <input type="email" id="femail" placeholder=" " required />
                    <label htmlFor="femail">E-mail</label>
                  </div>
                </div>
                <div className="form-group form-group--select">
                  <ServiceSelect id="fservice" value={service} onChange={setService} />
                  <label htmlFor="fservice">Serviço</label>
                </div>
                <div className="form-group">
                  <textarea id="fmsg" placeholder=" " ref={fmsg}></textarea>
                  <label htmlFor="fmsg">Mensagem</label>
                </div>
                <button type="submit" className="form-submit" ref={btnRef} onMouseMove={onBtnMouseMove}>
                  Enviar Mensagem
                  <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                </button>
              </form>
            )}
            <div className={`form-success${sent ? ' show' : ''}`} id="formSuccess">
              <div className="fs-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></div>
              <div className="fs-title">MENSAGEM ENVIADA!</div>
              <p className="fs-desc">Abrindo WhatsApp para continuar a conversa…</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
