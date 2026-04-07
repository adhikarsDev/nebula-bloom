import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const showcaseItems = [
  { title: 'Autonomous Agents', description: 'Self-directing AI entities that reason, plan, and execute complex tasks independently.' },
  { title: 'Multimodal Fusion', description: 'Seamlessly processing text, vision, audio, and sensor data in unified representations.' },
  { title: 'Adaptive Learning', description: 'Systems that continuously improve from interaction, without catastrophic forgetting.' },
];

export default function ShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden" id="showcase">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[150px] -translate-y-1/2" />

      <div className="section-padding">
        <motion.div style={{ opacity }} className="mb-20">
          <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Experience</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-3xl">
            Where intelligence meets <span className="gradient-text">imagination</span>
          </h2>
        </motion.div>
      </div>

      {/* Horizontal scrolling cards */}
      <motion.div style={{ x }} className="flex gap-8 px-6 md:px-12 lg:px-24">
        {showcaseItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="min-w-[350px] md:min-w-[500px] rounded-3xl glass-surface gradient-border p-10 md:p-14 flex flex-col justify-end aspect-[4/3]"
          >
            <span className="text-primary font-display text-sm tracking-widest uppercase mb-4">0{i + 1}</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">{item.title}</h3>
            <p className="text-muted-foreground font-body leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
