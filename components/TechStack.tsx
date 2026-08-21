import {
    SiRust, SiCplusplus, SiGo, SiApachekafka, SiRedis,
    SiPostgresql, SiMongodb, SiDocker, SiKubernetes, SiLinux, SiGit, SiGithub
} from 'react-icons/si';

const technologies = [
    { icon: SiRust, name: 'Rust', color: '#DEA584' },
    { icon: SiCplusplus, name: 'C++', color: '#00599C' },
    { icon: SiGo, name: 'Golang', color: '#00ADD8' },
    { icon: SiApachekafka, name: 'Kafka', color: '#231F20' },
    { icon: SiRedis, name: 'Redis', color: '#DC382D' },
    { icon: SiPostgresql, name: 'PostgreSQL', color: '#4169E1' },
    { icon: SiMongodb, name: 'MongoDB', color: '#47A248' },
    { icon: SiDocker, name: 'Docker', color: '#2496ED' },
    { icon: SiKubernetes, name: 'Kubernetes', color: '#326CE5' },
    { icon: SiLinux, name: 'Linux', color: '#FCC624' },
    { icon: SiGit, name: 'Git', color: '#F05032' },
    { icon: SiGithub, name: 'GitHub', color: '#181717' },
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
