import { ScrollReveal } from "@/hooks/useScrollReveal";

const BrandSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-10">
      <ScrollReveal>
        <div className="group relative cursor-default select-none py-8">
          <svg
            viewBox="0 0 1800 220"
            className="w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              className="fill-transparent transition-all duration-700 group-hover:fill-primary/10"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "130px",
                fontWeight: 700,
                stroke: "hsl(214 32% 82%)",
                strokeWidth: 0.8,
                letterSpacing: "-0.02em",
                filter: "drop-shadow(0 0 0px transparent)",
                transition: "filter 0.7s ease, fill 0.7s ease, stroke 0.7s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.stroke = "hsl(217 91% 60%)";
                el.style.filter = "drop-shadow(0 0 20px hsl(217 91% 60% / 0.4)) drop-shadow(0 0 60px hsl(217 91% 60% / 0.2))";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.stroke = "hsl(214 32% 82%)";
                el.style.filter = "drop-shadow(0 0 0px transparent)";
              }}
            >
              Abhay Digital Products
            </text>
          </svg>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default BrandSection;
