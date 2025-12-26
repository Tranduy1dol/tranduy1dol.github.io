type TimelineItem = {
    year: string;
    title: string;
    description: string;
};

const milestones: TimelineItem[] = [
    {
        year: '2025',
        title: 'Rebranding & New Chapter',
        description: 'Launched personal brand with a focus on minimalist design and quality content.',
    },
    {
        year: '2024',
        title: 'Deep Dive into Rust',
        description: 'Explored systems programming and cryptography with Rust.',
    },
    {
        year: '2023',
        title: 'Full-Stack Development',
        description: 'Built production applications with Next.js, TypeScript, and modern tooling.',
    },
    {
        year: '2022',
        title: 'Started the Journey',
        description: 'Began learning web development and programming fundamentals.',
    },
];

export function Timeline() {
    return (
        <div className="relative">
            {/* Vertical line */}
            <div
                className="absolute left-[7px] top-2 bottom-2 w-[2px]"
                style={{ backgroundColor: 'rgb(var(--color-border))' }}
            />

            <div className="space-y-8">
                {milestones.map((item, index) => (
                    <div key={index} className="relative pl-8">
                        {/* Dot */}
                        <div
                            className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2"
                            style={{
                                borderColor: 'rgb(var(--color-border))',
                                backgroundColor: 'rgb(var(--color-bg))'
                            }}
                        />

                        {/* Content */}
                        <div>
                            <span
                                className="text-xs font-mono uppercase tracking-wider"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                            >
                                {item.year}
                            </span>
                            <h4 className="text-lg font-semibold mt-1" style={{ fontFamily: 'var(--font-serif)' }}>
                                {item.title}
                            </h4>
                            <p
                                className="text-sm mt-1 leading-relaxed"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                            >
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
