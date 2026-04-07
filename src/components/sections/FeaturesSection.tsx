import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Brain, Zap, Shield, Layers } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Neural Architecture',
    description: 'Advanced neural networks that learn, adapt, and evolve with unprecedented efficiency and accuracy.',
  },
  {
    icon: Zap,
    title: 'Real-Time Processing',
    description: 'Lightning-fast inference with sub-millisecond latency, enabling real-time decision making at scale.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Military-grade encryption with zero-trust architecture ensuring your data remains sovereign.',
  },
  {
    icon: Layers,
    title: 'Modular Pipeline',
    description: 'Composable AI modules that seamlessly integrate into your existing infrastructure and workflows.',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative rounded-2xl p-8 glass-surface gradient-border hover:scale-[1.02] transition-transform duration-500 cursor-default"
    >
      <div className="absolute inset-0 rounded-2xl bg-primary/0 group-hover:bg-primary/[0.03] transition-colors duration-500" />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-500">
          <feature.icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
        <p className="text-muted-foreground font-body leading-relaxed text-sm">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding relative" id="features">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Capabilities</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Built for the <span className="gradient-text">impossible</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
