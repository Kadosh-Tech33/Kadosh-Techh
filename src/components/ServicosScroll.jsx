import ScrollExpand, { ScrollExpandItem } from './ScrollExpand.jsx';

const ITEMS = [
  {
    tag: 'Desenvolvimento Sênior',
    title: 'Engenharia de Software & Sistemas',
    desc: 'Plataformas personalizadas, automação de processos e softwares sob medida com arquiteturas escaláveis.',
    icon: <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
  },
  {
    tag: 'High Performance',
    title: 'Páginas Web Corporativas',
    desc: 'Landing pages e ecossistemas institucionais de alta performance, focados em velocidade e conversão mobile.',
    icon: <><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>,
  },
  {
    tag: 'Escalabilidade',
    title: 'E-commerce de Alta Performance',
    desc: 'Lojas online com checkout otimizado, integrações seguras de pagamento e painéis de gestão robustos.',
    icon: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>,
  },
  {
    tag: 'Portfólio',
    title: 'Projetos Entregues em Produção',
    desc: 'Mais de 50 sites e sistemas já entregues para clientes reais — veja alguns na seção de trabalhos selecionados.',
    icon: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>,
  },
];

export default function ServicosScroll() {
  return (
    <section className="section-fade-in" aria-label="Serviços e projetos em destaque">
      <ScrollExpand useWindowScroll={true} itemDistance={140} baseScale={0.82} rotationAmount={0} blurAmount={0}>
        {ITEMS.map((item) => (
          <ScrollExpandItem key={item.title}>
            <div className="scroll-expand-card-icon">
              <svg viewBox="0 0 24 24">{item.icon}</svg>
            </div>
            <div className="scroll-expand-card-body">
              <span className="scroll-expand-card-tag">{item.tag}</span>
              <h3 className="scroll-expand-card-title">{item.title}</h3>
              <p className="scroll-expand-card-desc">{item.desc}</p>
            </div>
          </ScrollExpandItem>
        ))}
      </ScrollExpand>
    </section>
  );
}
