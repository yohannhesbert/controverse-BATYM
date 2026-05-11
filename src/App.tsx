import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Shield, 
  Leaf, 
  History,
  TrendingUp,
  MapPin,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Scale,
  Quote,
  ArrowUpRight,
  Info,
  Maximize2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import RotatingText from './components/RotatingText/RotatingText';

// --- Utility for Tailwind classes ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Interactive Image Component ---
const TiltImage = ({ src, alt, className, caption }: { src: string, alt: string, className?: string, caption?: string }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const factor = 20; 
    
    setRotateX((y - centerY) / factor);
    setRotateY((centerX - x) / factor);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="group/img">
      <motion.div
        className={cn("relative overflow-hidden rounded-[2rem] glass p-2 cursor-pointer", className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        style={{ perspective: 1000 }}
      >
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover rounded-[1.5rem] opacity-90 transition-transform duration-700 group-hover/img:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
        {caption && (
          <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover/img:translate-y-0 opacity-0 group-hover/img:opacity-100 transition-all duration-500">
            <p className="text-white font-bold text-sm">{caption}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// --- Matrix Actor Node ---
const MatrixNode = ({ x, y, label, detail, color, icon: Icon }: { x: number, y: number, label: string, detail: string, color: string, icon?: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <motion.div 
          animate={{ scale: isHovered ? 1.2 : 1 }}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center cursor-help transition-shadow",
            isHovered ? "shadow-[0_0_20px_rgba(255,255,255,0.3)] z-30" : "z-10"
          )}
          style={{ backgroundColor: color }}
        >
          {Icon ? <Icon className="w-5 h-5 text-black" /> : <span className="text-[10px] font-black text-black">{label.substring(0, 3).toUpperCase()}</span>}
        </motion.div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-64 glass p-6 rounded-2xl z-40 border border-white/10 shadow-2xl backdrop-blur-2xl"
            >
              <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white/5 border-r border-b border-white/10 rotate-45" />
              <h5 className="font-display font-black text-white text-lg mb-2 leading-tight">{label}</h5>
              <p className="text-xs text-white/50 leading-relaxed">{detail}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${100 - y}%`, backgroundColor: color }} />
                </div>
                <span className="text-[8px] font-bold text-white/30 uppercase">Perception</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-[#05070a]/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center font-black text-black text-xs group-hover:rotate-90 transition-transform">B</div>
          <span className="font-display font-black tracking-tighter text-xl text-white group-hover:text-accent transition-colors">BATYM</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          {['Contexte', 'Triangle', 'Chronologie', 'Acteurs', 'Cartographie', 'Équipe'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-accent transition-all tracking-tight hover:scale-105 active:scale-95 text-white/60">{item}</a>
          ))}
        </div>
        <div className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase hidden sm:block">
          Paris • Controverse 2026
        </div>
      </div>
    </nav>
  );
};

const SectionHeading = ({ children, subtitle, id }: { children: React.ReactNode, subtitle?: string, id?: string }) => (
  <div id={id} className="mb-16">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-4 mb-2"
    >
      <div className="h-px w-12 bg-accent/50" />
      <span className="text-accent text-xs font-bold tracking-widest uppercase">{subtitle}</span>
    </motion.div>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-5xl lg:text-7xl font-display font-black leading-tight text-white tracking-tighter"
    >
      {children}
    </motion.h2>
  </div>
);

const TimelineItem = ({ year, title, description, index }: { year: string, title: string, description: string, index: number }) => (
  <motion.div 
    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="relative pl-12 pb-16 last:pb-0 border-l border-white/10 ml-4 group"
  >
    <div className="absolute left-[-6px] top-0 w-3 h-3 rounded-full bg-accent shadow-[0_0_15px_rgba(0,210,255,0.6)] group-hover:scale-[2] transition-transform duration-500" />
    <span className="text-sm font-black text-accent mb-2 block tracking-widest">{year}</span>
    <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors text-white font-display leading-tight">{title}</h3>
    <p className="text-white/50 text-base leading-relaxed group-hover:text-white/70 transition-colors">{description}</p>
  </motion.div>
);

const ActorCard = ({ name, role, description, side }: { name: string, role: string, description: string, side: 'pro' | 'con' | 'neutral' }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    className="glass p-8 rounded-[2.5rem] relative overflow-hidden group border border-white/5 hover:border-white/10 transition-all duration-500"
  >
    <div className={cn(
      "absolute top-0 right-0 w-2 h-full opacity-30 group-hover:opacity-100 transition-opacity duration-500",
      side === 'pro' ? "bg-accent" : side === 'con' ? "bg-accent-purple" : "bg-white/40"
    )} />
    <h4 className="text-xl font-black mb-1 text-white group-hover:text-accent transition-colors">{name}</h4>
    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-6 block">{role}</span>
    <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors font-medium">{description}</p>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);

  return (
    <div className="bg-[#05070a] min-h-screen selection:bg-accent/40 selection:text-white overflow-x-hidden font-sans text-white">
      <Navbar />
      
      {/* Hero Section */}
      <header className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 15 }}
          className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], y: [0, -50, 0] }}
          transition={{ repeat: Infinity, duration: 18 }}
          className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-accent-purple/5 rounded-full blur-[150px]" 
        />
        
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 text-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 rounded-full border border-white/10 bg-white/5 text-[11px] font-black tracking-[0.5em] uppercase mb-12 text-accent shadow-[0_0_30px_rgba(0,210,255,0.15)]">
              Étude de Cartographie des Controverses
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-7xl md:text-9xl lg:text-[12rem] font-display font-black tracking-tighter leading-[0.8] mb-12 text-gradient select-none"
          >
            PARIS<br/>
            <RotatingText
              texts={['VERTICAL?', 'DENSE?', 'VERTE?', 'DURABLE?']}
              mainClassName="text-white/5"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2000}
            />
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl md:text-3xl text-white/30 max-w-4xl mx-auto leading-relaxed mb-16 font-light"
          >
            Analyse des enjeux socio-économiques et patrimoniaux des gratte-ciels en périphérie parisienne.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <a href="#contexte" className="group flex items-center gap-3 bg-white text-black px-12 py-6 rounded-full font-black text-lg transition-all hover:bg-accent hover:scale-105 active:scale-95 shadow-xl">
              COMMENCER L'ANALYSE
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#triangle" className="flex items-center gap-3 px-12 py-6 rounded-full font-black text-lg border border-white/10 hover:bg-white/5 text-white transition-all">
              FOCUS TRIANGLE
              <Maximize2 className="w-5 h-5 text-white/40" />
            </a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-accent/50 to-transparent" />
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-24 space-y-64">
        
        {/* Context / Problématique */}
        <section id="contexte">
          <div className="grid lg:grid-cols-12 gap-24 items-start">
            <div className="lg:col-span-7">
              <SectionHeading subtitle="La Problématique" id="prob">Le Choc des Hauteurs</SectionHeading>
              <div className="space-y-12 text-2xl text-white/50 leading-relaxed font-light">
                <p>
                  On appelle <strong className="text-white font-black">« manhattanisation »</strong> l’idée de construire de nombreuses tours de grande hauteur en couronne autour de Paris.
                </p>
                <div className="glass p-12 rounded-[3rem] border-l-[12px] border-accent relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Quote className="w-32 h-32 text-white" />
                  </div>
                  <p className="text-3xl font-display font-black text-white italic leading-tight mb-6">
                    "Faut-il densifier en hauteur la périphérie, la verdir, la couvrir partiellement, ou réduire la place de la voiture sans construire ?"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-accent" />
                    <p className="text-xs font-black text-accent tracking-[0.3em] uppercase">LE CŒUR DU DÉBAT</p>
                  </div>
                </div>
                <p>
                  Cette controverse oppose deux visions : une <span className="text-white font-bold underline decoration-accent/30 underline-offset-8">métropole mondiale compétitive</span> et une <span className="text-white font-bold underline decoration-accent-purple/30 underline-offset-8">ville-patrimoine horizontale</span>.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 sticky top-32">
              <TiltImage 
                src="https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&q=80&w=1000" 
                alt="Architecture Paris" 
                className="aspect-[4/5] shadow-3xl"
                caption="Le paysage Haussmannien face à la verticalité."
              />
              <div className="mt-12 grid grid-cols-2 gap-6">
                <div className="glass p-8 rounded-3xl border border-white/5">
                  <span className="text-accent font-black text-4xl block mb-2 tracking-tighter">11%</span>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Trafic intra-muros</p>
                </div>
                <div className="glass p-8 rounded-3xl border border-white/5">
                  <span className="text-accent font-black text-4xl block mb-2 tracking-tighter">260k</span>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Véhicules / jour</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tour Triangle Focus */}
        <section id="triangle">
          <SectionHeading subtitle="Focus Projet" id="tri-focus">La Tour Triangle</SectionHeading>
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <TiltImage 
              src="https://images.unsplash.com/photo-1493397862567-479988817bf1?auto=format&fit=crop&q=80&w=1000" 
              alt="Tour Triangle Rendering" 
              className="aspect-video"
              caption="Rendu architectural du projet de Herzog & de Meuron."
            />
            <div className="space-y-10">
              <h3 className="text-5xl font-display font-black text-white leading-tight tracking-tighter">Une pyramide de 180 mètres au cœur des débats</h3>
              <p className="text-2xl text-white/40 font-light leading-relaxed">
                Portée par <strong className="text-white font-bold">Unibail-Rodamco-Westfield</strong>, la Tour Triangle est le symbole même de cette "manhattanisation". Sa forme pyramidale unique a été conçue pour minimiser les ombres portées, mais elle reste le point de cristallisation de toutes les oppositions.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-accent/30 transition-colors group">
                  <h4 className="text-accent font-black text-xs uppercase mb-3 tracking-widest">Architectes</h4>
                  <p className="text-white font-bold text-xl group-hover:text-accent transition-colors">Herzog & de Meuron</p>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-accent/30 transition-colors group">
                  <h4 className="text-accent font-black text-xs uppercase mb-3 tracking-widest">Hauteur Totale</h4>
                  <p className="text-white font-bold text-xl group-hover:text-accent transition-colors">180 Mètres</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section id="chronologie">
          <SectionHeading subtitle="Historique">Frise de la Controverse</SectionHeading>
          <div className="grid lg:grid-cols-2 gap-32">
            <div className="space-y-4">
              <TimelineItem 
                year="1950-1960" 
                title="Le Plan d'Urbanisme Directeur" 
                description="Raymond Lopez et Michel Holley défendent l'implantation de tours en périphérie pour 'ceinturer' le centre historique et éviter de toucher au cœur patrimonial." 
                index={0}
              />
              <TimelineItem 
                year="1973" 
                title="Le Périphérique & Montparnasse" 
                description="Achèvement du périphérique. Inauguration de la Tour Montparnasse, qui traumatisera durablement l'opinion parisienne face à la hauteur." 
                index={1}
              />
              <TimelineItem 
                year="2008" 
                title="L'Impulsion Triangle" 
                description="Bertrand Delanoë et Anne Hidalgo évoquent pour la première fois le projet d'une tour de 180 mètres à la Porte de Versailles." 
                index={2}
              />
              <TimelineItem 
                year="2014-2015" 
                title="Le Bras de Fer Politique" 
                description="Le Conseil de Paris rejette d'abord le projet (5 voix) avant de l'approuver après des modifications et une bataille juridique intense." 
                index={3}
              />
              <TimelineItem 
                year="2020-2021" 
                title="Justice & Chantiers" 
                description="Anticor dépose plainte pour favoritisme. Perquisitions à la mairie. Les travaux commencent malgré une polémique renouvelée." 
                index={4}
              />
              <TimelineItem 
                year="2023" 
                title="Le Nouveau PLUb" 
                description="Adoption du PLU bioclimatique qui limite à nouveau la hauteur des bâtiments à 37 mètres. La fin d'une ère ?" 
                index={5}
              />
            </div>
            <div className="sticky top-40 h-fit">
              <div className="glass rounded-[4rem] p-16 overflow-hidden relative group border border-white/5">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 blur-[120px]" />
                <div className="flex items-center gap-6 mb-12 relative z-10">
                  <div className="p-5 bg-accent/20 rounded-3xl text-accent">
                    <History className="w-10 h-10" />
                  </div>
                  <h3 className="text-4xl font-display font-black text-white tracking-tighter">Évolution Temporelle</h3>
                </div>
                <div className="space-y-8 relative z-10">
                   <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/box">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">Années 50</span>
                        <Info className="w-4 h-4 text-white/20 group-hover/box:text-accent transition-colors" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2 font-display">Capitale Bicéphale</h4>
                      <p className="text-sm text-white/40 leading-relaxed">Une vision d'urbanisme où le centre reste bas et la périphérie se densifie verticalement.</p>
                   </div>
                   <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group/box">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-accent-purple/20 text-accent-purple text-[10px] font-black uppercase tracking-widest">2026</span>
                        <AlertTriangle className="w-4 h-4 text-white/20 group-hover/box:text-accent-purple transition-colors" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2 font-display">L'Enjeu des Municipales</h4>
                      <p className="text-sm text-white/40 leading-relaxed">La hauteur reste un sujet politique majeur pour les prochaines élections parisiennes.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actors Grid */}
        <section id="acteurs">
          <SectionHeading subtitle="Les Protagonistes">Cartographie des Acteurs</SectionHeading>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ActorCard 
              name="Ville de Paris" 
              role="Soutien Politique (Hidalgo/Missika)" 
              description="Défend une ville capable de rivaliser avec Londres ou Dubaï en offrant des espaces de bureaux ultra-modernes."
              side="pro"
            />
            <ActorCard 
              name="URW (Unibail)" 
              role="Promoteur Économique" 
              description="Propriétaire des Halles et de nombreux centres, veut développer un parc immobilier de prestige à la Porte de Versailles."
              side="pro"
            />
            <ActorCard 
              name="Herzog & de Meuron" 
              role="Architectes" 
              description="Voient dans Triangle une innovation architecturale majeure capable de renouveler l'image de la ville."
              side="pro"
            />
            <ActorCard 
              name="Opposition LR/EELV" 
              role="Opposants Municipaux" 
              description="Convergent pour critiquer un projet inadapté aux besoins réels des Parisiens et trop orienté vers des intérêts privés."
              side="con"
            />
            <ActorCard 
              name="SOS Paris / Monts 14" 
              role="Associations de Riverains" 
              description="Inquiets pour l'ensoleillement et l'impact sur le cadre de vie. Utilisent les leviers juridiques pour bloquer le projet."
              side="con"
            />
            <ActorCard 
              name="UNESCO" 
              role="Observateur Patrimonial" 
              description="Met en garde contre la rupture de l'unité visuelle de Paris, redoutant la fin du paysage Haussmannien."
              side="con"
            />
            <ActorCard 
              name="Anticor" 
              role="Vigie de Transparence" 
              description="A porté l'affaire devant le PNF pour favoritisme, soupçonnant des avantages indus accordés au promoteur."
              side="con"
            />
            <ActorCard 
              name="Tribunal Administratif" 
              role="Arbitre Institutionnel" 
              description="Valide la légalité des décisions prises par la ville. Un rôle technique mais central dans la controverse."
              side="neutral"
            />
            <ActorCard 
              name="Habitants" 
              role="Société Civile" 
              description="Divisés entre désir de modernité et crainte de la densification excessive des transports et des nuisances."
              side="neutral"
            />
          </div>
        </section>

        {/* Comparison Section */}
        <section>
          <SectionHeading subtitle="Confrontation">Les Enjeux du Débat</SectionHeading>
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-[4rem] bg-accent/5 border border-accent/20 p-16 transition-all hover:bg-accent/10"
            >
              <div className="mb-12 w-24 h-24 rounded-[2rem] bg-accent/20 flex items-center justify-center text-accent shadow-[0_0_40px_rgba(0,210,255,0.25)]">
                <Shield className="w-12 h-12" />
              </div>
              <h3 className="text-5xl font-black mb-12 font-display tracking-tighter text-white uppercase">Pro-Tours</h3>
              <ul className="space-y-10">
                <li className="flex gap-8">
                  <div className="mt-1 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xl mb-2 tracking-tight">Compétitivité Mondiale</h4>
                    <p className="text-white/40 leading-relaxed text-lg font-light">Attirer les investissements et offrir des bureaux répondant aux standards internationaux.</p>
                  </div>
                </li>
                <li className="flex gap-8">
                  <div className="mt-1 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xl mb-2 tracking-tight">Espace Public</h4>
                    <p className="text-white/40 leading-relaxed text-lg font-light">La verticalité permet de libérer de l'emprise au sol pour des parcs et des zones piétonnes.</p>
                  </div>
                </li>
                <li className="flex gap-8">
                  <div className="mt-1 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xl mb-2 tracking-tight">Densification</h4>
                    <p className="text-white/40 leading-relaxed text-lg font-light">Éviter l'étalement urbain en concentrant les activités dans des pôles d'activités denses.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-[4rem] bg-accent-purple/5 border border-accent-purple/20 p-16 transition-all hover:bg-accent-purple/10"
            >
              <div className="mb-12 w-24 h-24 rounded-[2rem] bg-accent-purple/20 flex items-center justify-center text-accent-purple shadow-[0_0_40px_rgba(157,80,187,0.25)]">
                <Leaf className="w-12 h-12" />
              </div>
              <h3 className="text-5xl font-black mb-12 font-display tracking-tighter text-white uppercase">Anti-Tours</h3>
              <ul className="space-y-10">
                <li className="flex gap-8">
                  <div className="mt-1 w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-accent-purple" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xl mb-2 tracking-tight">Bureaux Inoccupés</h4>
                    <p className="text-white/40 leading-relaxed text-lg font-light"><strong className="text-accent-purple">10% de vacances</strong> en 2026. Pourquoi construire de nouvelles surfaces tertiaires ?</p>
                  </div>
                </li>
                <li className="flex gap-8">
                  <div className="mt-1 w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center shrink-0">
                    <Scale className="w-4 h-4 text-accent-purple" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xl mb-2 tracking-tight">Rupture Identitaire</h4>
                    <p className="text-white/40 leading-relaxed text-lg font-light">Violence visuelle vis-à-vis du patrimoine Haussmannien et dégradation du skyline historique.</p>
                  </div>
                </li>
                <li className="flex gap-8">
                  <div className="mt-1 w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center shrink-0">
                    <Leaf className="w-4 h-4 text-accent-purple" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xl mb-2 tracking-tight">Bilan Carbone</h4>
                    <p className="text-white/40 leading-relaxed text-lg font-light">Impact écologique massif (béton/acier) et création d'îlots de chaleur urbains localisés.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Cartographie Section - STYLE ADAPTATION */}
        <section id="cartographie">
          <SectionHeading subtitle="Visualisation" id="vis">Perception du Projet</SectionHeading>
          
          <div className="glass rounded-[4rem] p-16 relative overflow-hidden border border-white/10 shadow-3xl">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <div className="grid grid-cols-10 h-full w-full">
                      {Array.from({length: 10}).map((_, i) => <div key={i} className="border-r border-white/20 h-full" />)}
                  </div>
              </div>

              <div className="relative h-[750px] w-full flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
                      <div>
                        <h4 className="text-5xl font-black font-display text-white tracking-tighter mb-3">Cartographie des Acteurs</h4>
                        <p className="text-white/30 text-lg font-light">Positionnement stratégique selon l'attitude (Hostile → Favorable) et la perception (Négative → Positive).</p>
                      </div>
                      <div className="flex flex-wrap gap-8 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-accent shadow-[0_0_15px_rgba(0,210,255,0.6)]" /> <span className="text-xs font-black uppercase text-white/50 tracking-widest">Favorables</span></div>
                          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-accent-purple shadow-[0_0_15px_rgba(157,80,187,0.6)]" /> <span className="text-xs font-black uppercase text-white/50 tracking-widest">Opposants</span></div>
                          <div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full bg-white/40" /> <span className="text-xs font-black uppercase text-white/50 tracking-widest">Neutres</span></div>
                      </div>
                  </div>

                  <div className="flex-1 relative ml-16 mb-16 mr-16">
                      {/* Axes */}
                      <div className="absolute left-0 bottom-0 w-full h-2 bg-gradient-to-r from-white/20 via-white/10 to-transparent rounded-full" />
                      <div className="absolute left-0 bottom-0 w-2 h-full bg-gradient-to-t from-white/20 via-white/10 to-transparent rounded-full" />

                      {/* Axes Labels */}
                      <div className="absolute -left-20 top-1/2 -rotate-90 text-[12px] font-black tracking-[0.6em] text-white/10 uppercase whitespace-nowrap">Perception du Projet</div>
                      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-[12px] font-black tracking-[0.6em] text-white/10 uppercase">Attitude vis-à-vis du projet</div>

                      {/* Values */}
                      <div className="absolute -bottom-10 left-0 text-[11px] font-black text-white/20 tracking-widest">HOSTILE</div>
                      <div className="absolute -bottom-10 right-0 text-[11px] font-black text-white/20 tracking-widest">FAVORABLE</div>
                      <div className="absolute -left-12 bottom-0 text-[11px] font-black text-white/20 rotate-90 origin-bottom-left tracking-widest">NÉGATIVE</div>
                      <div className="absolute -left-12 top-0 text-[11px] font-black text-white/20 rotate-90 origin-bottom-left tracking-widest">POSITIVE</div>

                      {/* Actor Nodes from perception du projet.png data */}
                      <MatrixNode x={90} y={10} label="Mairie de Paris" detail="Acteur majeur, soutien politique indéfectible depuis 2008." color="#00d2ff" />
                      <MatrixNode x={85} y={5} label="Unibail-Rodamco-Westfield" detail="Propriétaire et financeur. Position ultra-favorable." color="#00d2ff" />
                      <MatrixNode x={80} y={15} label="Herzog & de Meuron" detail="Architectes concepteurs. Défendent l'innovation technique." color="#00d2ff" />
                      
                      <MatrixNode x={15} y={85} label="Opposition LR/EELV" detail="Hostilité politique frontale, critique du modèle urbain." color="#9d50bb" />
                      <MatrixNode x={10} y={90} label="Collectif Monts 14" detail="Opposant historique, multiplie les recours juridiques." color="#9d50bb" />
                      <MatrixNode x={20} y={75} label="Anticor" detail="Plainte pour favoritisme, critique la gestion financière." color="#9d50bb" />
                      
                      <MatrixNode x={30} y={60} label="UNESCO" detail="Met en garde contre l'impact visuel mondial." color="#ffffff66" />
                      <MatrixNode x={50} y={45} label="Tribunal Administratif" detail="Arbitre les litiges. Rôle central mais perception neutre." color="#ffffff66" />
                      <MatrixNode x={40} y={55} label="Expert Urbanisme" detail="Produisent des rapports techniques parfois contradictoires." color="#ffffff66" />
                      <MatrixNode x={70} y={25} label="Futur locataire" detail="Perception positive mais attitude attentiste." color="#ffffff66" />
                  </div>
              </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="équipe">
          <SectionHeading subtitle="Auteurs" id="team">L'Équipe BATYM</SectionHeading>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { name: "Barnabé Jouanard", bio: "Curieux et en recherche d'amélioration constante.", role: "Analyse" },
              { name: "Titouan Guerin", bio: "Expert en débats argumentés et dynamiques sociales.", role: "Contenu" },
              { name: "Aurélien Trancart", bio: "Passionné par le contact humain et le travail d'équipe.", role: "Coordination" },
              { name: "Yohann Hesbert", bio: "Passionné par les progrès technologiques et les sciences.", role: "Recherche" },
              { name: "Martin Hernandez", bio: "Motivé par l'innovation et les défis complexes.", role: "Design" }
            ].map((member) => (
              <motion.div 
                key={member.name}
                whileHover={{ y: -15, scale: 1.05 }}
                className="glass p-10 rounded-[3rem] flex flex-col items-center text-center group transition-all duration-500 hover:bg-white/[0.05] border border-white/5 shadow-xl"
              >
                <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-accent to-accent-purple mb-8 flex items-center justify-center font-display font-black text-4xl text-black shadow-2xl group-hover:rotate-6 transition-transform">
                  {member.name[0]}
                </div>
                <h4 className="font-black mb-1 text-white text-xl">{member.name}</h4>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">{member.role}</span>
                <p className="text-xs text-white/40 leading-relaxed font-medium">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-48 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-accent/5 blur-[150px] rounded-full" />
        <div className="flex flex-col items-center gap-12 relative z-10">
          <div className="flex items-center gap-4 scale-150">
            <div className="w-10 h-10 bg-accent rounded flex items-center justify-center font-black text-black text-sm">B</div>
            <span className="font-display font-black tracking-tighter text-3xl text-white">BATYM</span>
          </div>
          <div className="flex flex-wrap justify-center gap-16 text-[11px] font-black tracking-[0.4em] uppercase text-white/10">
            <span className="hover:text-white transition-colors cursor-default">ESIEE Paris 2026</span>
            <span className="hover:text-white transition-colors cursor-default">Projet Académique</span>
            <span className="hover:text-white transition-colors cursor-default">Controverse Urbaine</span>
          </div>
          <p className="text-white/20 text-sm max-w-xl mt-12 leading-relaxed">
            Support d'analyse pour le cours de Cartographie de Controverses.<br/>
            © 2026 Équipe BATYM • Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
