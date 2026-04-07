import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  { value: '10B+', label: 'Parameters' },
  { value: '<1ms', label: 'Latency' },
  { value: '99.9%', label: 'Uptime' },
  { value: '150+', label: 'Enterprise Clients' },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.6], ['0%', '100%']);

  return (
    <section ref={containerRef} className="section-padding relative" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: animated line + text */}
          <motion.div ref={ref}>
            <div className="relative pl-8">
              {/* Animated vertical line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border">
                <motion.div style={{ height: lineHeight }} className="w-full bg-gradient-to-b from-primary to-accent" />
              </div>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-6"
              >
                Our Mission
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight"
              >
                Pushing the boundaries of what AI can{' '}
                <span className="gradient-text">achieve</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-muted-foreground font-body text-lg leading-relaxed"
              >
                We believe in building AI systems that amplify human potential.
                Our research-driven approach combines cutting-edge algorithms
                with responsible development practices, creating technology
                that's powerful yet trustworthy.
              </motion.p>
            </div>
          </motion.div>

          {/* Right: stats grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-2xl glass-surface gradient-border p-8 text-center"
              >
                <p className="font-display text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</p>
                <p className="text-muted-foreground font-body text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
