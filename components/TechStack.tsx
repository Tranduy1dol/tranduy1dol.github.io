import { SiRust, SiNextdotjs, SiTypescript, SiTailwindcss, SiReact, SiNodedotjs, SiDocker, SiPostgresql } from 'react-icons/si';

const technologies = [
    { icon: SiRust, name: 'Rust', color: '#DEA584' },
    { icon: SiNextdotjs, name: 'Next.js', color: '#000000' },
    { icon: SiTypescript, name: 'TypeScript', color: '#3178C6' },
    { icon: SiTailwindcss, name: 'Tailwind', color: '#06B6D4' },
    { icon: SiReact, name: 'React', color: '#61DAFB' },
    { icon: SiNodedotjs, name: 'Node.js', color: '#339933' },
    { icon: SiDocker, name: 'Docker', color: '#2496ED' },
    { icon: SiPostgresql, name: 'PostgreSQL', color: '#4169E1' },
];

export function TechStack() {
    // Duplicate array for seamless loop
    const doubledTechnologies = [...technologies, ...technologies];

    return (
        <section className="py-12 overflow-hidden">
            <div className="max-w-3xl mx-auto relative px-4 mask-gradient">
                <div
                    className="flex animate-marquee gap-8 md:gap-12"
                    style={{
                        width: 'fit-content',
                    }}
                >
                    {doubledTechnologies.map((tech, index) => {
                        const Icon = tech.icon;
                        return (
                            <div
                                key={`${tech.name}-${index}`}
                                className="group flex flex-col items-center gap-2 transition-all duration-300 min-w-[60px]"
                            >
                                <Icon
                                    className="w-8 h-8 md:w-10 md:h-10 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                                />
                                <span
                                    className="text-xs uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
                                    style={{ color: 'rgb(var(--color-text-muted))' }}
                                >
                                    {tech.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                .mask-gradient {
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }

                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
                
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
