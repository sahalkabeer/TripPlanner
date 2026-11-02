import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface WidgetProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  delay?: number;
}

export function Widget({ children, className, title, icon, delay = 0 }: WidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/20 bg-white/30 backdrop-blur-2xl p-5 md:p-6 shadow-xl flex flex-col',
        className
      )}
    >
      {(title || icon) && (
        <div className="mb-4 flex items-center gap-3 shrink-0">
          {icon && <div className="text-gray-600">{icon}</div>}
          {title && <h3 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h3>}
        </div>
      )}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">{children}</div>
    </motion.div>
  );
}
