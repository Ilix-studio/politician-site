import { createContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ExpandableCardContextType {
  onClose: () => void;
  id: string;
}

const ExpandableCardContext = createContext<
  ExpandableCardContextType | undefined
>(undefined);

export interface ExpandableCardProps {
  children: React.ReactNode;
  className?: string;
}

export interface Card {
  id: string;
  content: React.ReactNode;
  className?: string;
  thumbnail: React.ReactNode;
}

export function ExpandableCard({ children, className }: ExpandableCardProps) {
  const [active, setActive] = useState<Card | boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useEffect(() => {
    const onClick = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setActive(null);
      }
    };

    if (active && typeof active === "object") {
      document.addEventListener("mousedown", onClick);
    }

    return () => {
      document.removeEventListener("mousedown", onClick);
    };
  }, [ref, active]);

  return (
    <div className={cn("w-full", className)}>
      <ExpandableCardContext.Provider
        value={{ onClose: () => setActive(null), id: "" }}
      >
        <AnimatePresence>
          {active && typeof active === "object" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/20 h-full w-full z-50'
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {active && typeof active === "object" ? (
            <div className='fixed inset-0 grid place-items-center z-[100]'>
              <motion.button
                key={`button-${active.id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className='flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6 z-10'
                onClick={() => setActive(null)}
              >
                <X className='h-4 w-4 text-black' />
              </motion.button>
              <motion.div
                layoutId={`card-${active.id}`}
                ref={ref}
                className='w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden'
              >
                <motion.div layoutId={`image-${active.id}`}>
                  {active.thumbnail}
                </motion.div>
                <div>
                  <div className='flex justify-between items-start p-4'>
                    <div>{active.content}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>
        <ul className={cn("mx-auto w-full gap-4", className)}>{children}</ul>
      </ExpandableCardContext.Provider>
    </div>
  );
}

export function ExpandableCardItem({
  card,
  index,
  hovered,
  setHovered,
}: {
  card: Card;
  index: number;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  return (
    <motion.div
      layoutId={`card-${card.id}`}
      key={`card-${card.id}`}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-80 w-full transition-all duration-300 ease-out cursor-pointer",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
        card.className
      )}
    >
      <motion.div layoutId={`image-${card.id}`} className='absolute inset-0'>
        {card.thumbnail}
      </motion.div>
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <div className='text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200'>
          {card.content}
        </div>
      </div>
    </motion.div>
  );
}
