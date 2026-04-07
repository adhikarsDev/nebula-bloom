import { motion } from 'framer-motion';

const links = {
  Product: ['Platform', 'API', 'Pricing', 'Docs'],
  Company: ['About', 'Careers', 'Blog', 'Press'],
  Legal: ['Privacy', 'Terms', 'Security'],
};

const socials = ['Twitter', 'LinkedIn', 'GitHub'];

export default function FooterSection() {
  return (
    <footer className="section-padding border-t border-border/50 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-bold gradient-text mb-4">NovaMind</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              Engineering the next frontier of artificial intelligence.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wider uppercase">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-muted-foreground hover:text-primary font-body text-sm transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 gap-4">
          <p className="text-muted-foreground font-body text-xs">
            © 2026 NovaMind. All rights reserved.
          </p>
          <div className="flex gap-6">
            {socials.map((s) => (
              <a key={s} href="#" className="text-muted-foreground hover:text-primary font-body text-xs transition-colors duration-300 tracking-wider uppercase">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
