import { useScroll, useTransform, motion } from 'framer-motion';
import abstractGeo1 from '@/assets/abstract-geo-1.png';
import abstractGeo2 from '@/assets/abstract-geo-2.png';

export default function FixedHeroSphere() {
  const { scrollYProgress } = useScroll();

  // Image 1 (hero + left positions)
  const scale1 = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [1.1, 0.85, 0.7, 0.5]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [1, 0.7, 0.5, 0.2]);
  const x1 = useTransform(scrollYProgress, [0, 0.12, 0.2, 0.38, 0.48, 0.65, 0.75, 1], ['0%', '0%', '-55%', '-55%', '55%', '55%', '-55%', '-55%']);
  const y1 = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ['0%', '10%', '20%', '30%']);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 15]);

  // Image 2 (secondary, offset)
  const scale2 = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0.8, 0.65, 0.55, 0.4]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.1, 0.85, 1], [0.6, 0.5, 0.35, 0.15]);
  const x2 = useTransform(scrollYProgress, [0, 0.12, 0.2, 0.38, 0.48, 0.65, 0.75, 1], ['10%', '10%', '-45%', '-45%', '45%', '45%', '-45%', '-45%']);
  const y2 = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ['15%', '25%', '35%', '45%']);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -10]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Primary abstract image */}
      <motion.img
        src={abstractGeo1}
        alt=""
        width={1024}
        height={1024}
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] md:w-[650px] md:h-[650px] lg:w-[800px] lg:h-[800px] object-contain drop-shadow-[0_0_40px_hsl(var(--primary)/0.3)]"
        style={{
          x: x1,
          y: y1,
          scale: scale1,
          opacity: opacity1,
          rotate: rotate1,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Secondary abstract image */}
      <motion.img
        src={abstractGeo2}
        alt=""
        loading="lazy"
        width={1024}
        height={1024}
        className="absolute top-1/2 left-1/2 w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] object-contain drop-shadow-[0_0_30px_hsl(var(--primary)/0.2)] blur-[0.5px]"
        style={{
          x: x2,
          y: y2,
          scale: scale2,
          opacity: opacity2,
          rotate: rotate2,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  );
}
