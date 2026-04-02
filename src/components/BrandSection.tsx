import { ScrollReveal } from "@/hooks/useScrollReveal";

const BrandSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-10">
      <ScrollReveal>
        <div className="group relative cursor-default select-none py-8">
          <svg
            viewBox="0 0 1400 220"
            className="w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              className="fill-transparent stroke-[0.5] transition-all duration-700 group-hover:fill-primary/10 group-hover:stroke-primary"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "140px",
                fontWeight: 700,
                stroke: "hsl(0 0% 20%)",
                strokeWidth: 0.8,
                letterSpacing: "-0.02em",
              }}
            >
              Abhay Digital
            </text>
          </svg>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default BrandSection;
