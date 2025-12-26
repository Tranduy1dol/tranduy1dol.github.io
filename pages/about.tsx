import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import { Timeline } from '@/components/Timeline';

const socialLinks = [
    { icon: FiGithub, href: 'https://github.com/tranduy1dol', label: 'GitHub' },
    { icon: FiTwitter, href: 'https://twitter.com/tranduy1dol', label: 'Twitter' },
    { icon: FiLinkedin, href: 'https://linkedin.com/in/tranduy1dol', label: 'LinkedIn' },
    { icon: FiMail, href: 'mailto:contact@tranduy1dol.com', label: 'Email' },
];

const readingList = [
    { title: 'The Pragmatic Programmer', author: 'David Thomas & Andrew Hunt' },
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann' },
];

const About: NextPage = () => {
    return (
        <>
            <Head>
                <title>About - tranduy1dol</title>
                <meta name="description" content="Learn more about tranduy1dol - a developer passionate about building thoughtful software." />
            </Head>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 lg:gap-16">
                    {/* Left Column - Profile (Sticky) */}
                    <aside className="lg:sticky lg:top-8 lg:self-start">
                        {/* Profile Image with Polaroid Effect */}
                        <div
                            className="mb-6 p-4 border-2 inline-block"
                            style={{
                                borderColor: 'rgb(var(--color-border))',
                                backgroundColor: 'rgb(var(--color-bg))'
                            }}
                        >
                            <div className="relative w-64 h-64 md:w-72 md:h-72 overflow-hidden">
                                <Image
                                    src="/profile.png"
                                    alt="tranduy1dol"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 256px, 288px"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="mb-6">
                            <h1
                                className="text-2xl md:text-3xl mb-2"
                                style={{ fontFamily: 'var(--font-serif)' }}
                            >
                                tranduy1dol
                            </h1>
                            <p
                                className="text-sm uppercase tracking-wider mb-4"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                            >
                                Software Developer
                            </p>
                            <p
                                className="text-sm leading-relaxed"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                            >
                                Crafting thoughtful software with precision.
                                Based in Vietnam 🇻🇳
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 border-2 transition-all hover:opacity-70"
                                        style={{ borderColor: 'rgb(var(--color-border))' }}
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Right Column - Content */}
                    <main className="space-y-12">
                        {/* Lead Paragraph */}
                        <section>
                            <p
                                className="text-xl md:text-2xl leading-relaxed"
                                style={{ fontFamily: 'var(--font-serif)' }}
                            >
                                I build accessible, pixel-perfect digital experiences for the web.
                                With a passion for clean architecture and thoughtful design,
                                I strive to create software that is both beautiful and functional.
                            </p>
                        </section>

                        {/* Divider */}
                        <div
                            className="h-[2px] w-24"
                            style={{ backgroundColor: 'rgb(var(--color-border))' }}
                        />

                        {/* Bio Body */}
                        <section className="space-y-6">
                            <h2 style={{ fontFamily: 'var(--font-serif)' }}>Background</h2>
                            <div className="space-y-4 text-base leading-relaxed font-sans" style={{ color: 'rgb(var(--color-text-muted))' }}>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <p>
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                                    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                    sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                                <p>
                                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                                    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                                    veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                                </p>
                            </div>
                        </section>

                        {/* Divider */}
                        <div
                            className="h-[2px] w-24"
                            style={{ backgroundColor: 'rgb(var(--color-border))' }}
                        />

                        {/* Timeline */}
                        <section>
                            <h2 className="mb-8" style={{ fontFamily: 'var(--font-serif)' }}>Journey</h2>
                            <Timeline />
                        </section>

                        {/* Divider */}
                        <div
                            className="h-[2px] w-24"
                            style={{ backgroundColor: 'rgb(var(--color-border))' }}
                        />

                        {/* What I'm Reading */}
                        <section>
                            <h2 className="mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
                                What I&apos;m Reading
                            </h2>
                            <div className="space-y-4">
                                {readingList.map((book, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <span
                                            className="text-lg"
                                            style={{ fontFamily: 'var(--font-serif)' }}
                                        >
                                            📖
                                        </span>
                                        <div>
                                            <h4
                                                className="font-medium"
                                                style={{ fontFamily: 'var(--font-serif)' }}
                                            >
                                                {book.title}
                                            </h4>
                                            <p
                                                className="text-sm"
                                                style={{ color: 'rgb(var(--color-text-muted))' }}
                                            >
                                                by {book.author}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Contact CTA */}
                        <section
                            className="border-2 p-8"
                            style={{
                                borderColor: 'rgb(var(--color-border))',
                                backgroundColor: 'rgb(var(--color-surface))'
                            }}
                        >
                            <h3
                                className="text-xl mb-4"
                                style={{ fontFamily: 'var(--font-serif)' }}
                            >
                                Let&apos;s Connect
                            </h3>
                            <p
                                className="mb-6 leading-relaxed"
                                style={{ color: 'rgb(var(--color-text-muted))' }}
                            >
                                Have a project in mind or just want to chat about technology?
                                Feel free to reach out. I&apos;m always open to interesting conversations
                                and collaborations.
                            </p>
                            <a
                                href="mailto:contact@tranduy1dol.com"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-wider no-underline transition-all hover:opacity-80"
                                style={{
                                    backgroundColor: 'rgb(var(--color-text))',
                                    color: 'rgb(var(--color-bg))'
                                }}
                            >
                                <FiMail className="w-4 h-4" />
                                Get in Touch
                            </a>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
};

export default About;
