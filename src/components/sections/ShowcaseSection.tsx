import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { SplineScene } from '@/components/ui/splite';

const showcaseItems = [
  { title: 'Autonomous Agents', description: 'Self-directing AI entities that reason, plan, and execute complex tasks independently.' },
  { title: 'Multimodal Fusion', description: 'Seamlessly processing text, vision, audio, and sensor data in unified representations.' },
  { title: 'Adaptive Learning', description: 'Systems that continuously improve from interaction, without catastrophic forgetting.' },
];

export default function ShowcaseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding relative min-h-screen flex items-center" id="showcase">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[150px] -translate-y-1/2" />

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* LEFT-aligned content */}
          <div>
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <p className="text-primary font-display text-sm tracking-[0.3em] uppercase mb-4">Experience</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Where intelligence meets <span className="gradient-text">imagination</span>
              </h2>
            </motion.div>

            <div className="flex flex-col gap-6">
              {showcaseItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="rounded-2xl glass-surface gradient-border p-8"
                >
                  <span className="text-primary font-display text-sm tracking-widest uppercase mb-3 block">0{i + 1}</span>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground font-body leading-relaxed text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right side — 3D Spline object */}
          <div className="hidden lg:flex items-center justify-center h-[600px]">
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
