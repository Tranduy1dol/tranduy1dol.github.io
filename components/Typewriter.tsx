import { useState, useEffect } from 'react';

interface TypewriterProps {
    texts: string[];
    speed?: number;
    deleteSpeed?: number;
    pauseDuration?: number;
    className?: string;
    style?: React.CSSProperties;
}

export function Typewriter({
    texts,
    speed = 100,
    deleteSpeed = 50,
    pauseDuration = 2000,
    className = '',
    style = {}
}: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        const currentText = texts[textIndex];

        let timeout: NodeJS.Timeout;

        if (!isDeleting) {
            // Typing
            if (charIndex < currentText.length) {
                timeout = setTimeout(() => {
                    setDisplayedText(currentText.substring(0, charIndex + 1));
                    setCharIndex(prev => prev + 1);
                }, speed);
            } else {
                // Finished typing, pause then start deleting
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, pauseDuration);
            }
        } else {
            // Deleting
            if (charIndex > 0) {
                timeout = setTimeout(() => {
                    setDisplayedText(currentText.substring(0, charIndex - 1));
                    setCharIndex(prev => prev - 1);
                }, deleteSpeed);
            } else {
                // Finished deleting, move to next text
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % texts.length);
            }
        }

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, textIndex, texts, speed, deleteSpeed, pauseDuration]);

    // Blinking cursor effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 530);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <span className={className} style={style}>
            {displayedText}
            <span
                className="inline-block w-[3px] h-[1em] ml-1 align-middle"
                style={{
                    backgroundColor: 'rgb(var(--color-text))',
                    opacity: showCursor ? 1 : 0,
                    transition: 'opacity 0.1s'
                }}
            />
        </span>
    );
}
