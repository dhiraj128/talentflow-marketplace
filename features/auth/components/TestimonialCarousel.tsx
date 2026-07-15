"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "This platform reduced hiring time by 70%.",
    author: "HR Director",
    company: "Infosys",
  },
  {
    id: 2,
    quote: "We hired verified freelancers in less than a day.",
    author: "Startup Founder",
    company: "TechNova",
  },
  {
    id: 3,
    quote: "Our employee training is now completely digital.",
    author: "Training Manager",
    company: "EduCorp",
  }
];

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[160px] w-full overflow-hidden flex flex-col justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute w-full"
        >
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>
          <blockquote className="text-xl md:text-2xl font-medium leading-tight mb-4">
            "{testimonials[index].quote}"
          </blockquote>
          <p className="text-sm text-primary-foreground/80">
            {testimonials[index].author}, <span className="font-semibold text-primary-foreground">{testimonials[index].company}</span>
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
