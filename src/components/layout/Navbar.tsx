import { motion, useScroll, useTransform } from 'framer-motion';

const navItems = ['Features', 'Showcase', 'About'];

export default function Navbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.8]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.15]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 px-6 md:px-12 lg:px-24"
      style={{
        backgroundColor: `hsla(250, 20%, 2%, ${bgOpacity.get()})`,
        backdropFilter: 'blur(20px)',
      }}
    >
      <motion.div
        className="flex items-center justify-between h-20 border-b"
        style={{ borderColor: `hsla(250, 15%, 15%, ${borderOpacity.get()})` }}
      >
        <a href="#" className="font-display text-lg font-bold gradient-text">
          NovaMind
        </a>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-muted-foreground hover:text-foreground font-body text-sm transition-colors duration-300"
            >
              {item}
            </a>
          ))}
          <button className="px-5 py-2 rounded-full glow-border glass-surface text-foreground font-display text-xs tracking-wider uppercase hover:scale-105 transition-transform duration-300">
            Get Started
          </button>
        </div>
      </motion.div>
    </motion.nav>
  );
}
