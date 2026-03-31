import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const SITE_URL = 'https://tranduy1dol.github.io';

export default function Comments() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Use custom CSS themes hosted in /public so Giscus iframe matches the site
    const giscusTheme = resolvedTheme === 'dark'
        ? `${SITE_URL}/giscus-dark.css`
        : `${SITE_URL}/giscus-light.css`;

    return (
        <Giscus
            id="comments"
            repo="Tranduy1dol/tranduy1dol.github.io"
            repoId="R_kgDON7ZCIQ"
            category="General"
            categoryId="DIC_kwDON7ZCIc4C5qh7"
            mapping="pathname"
            strict="0"
            reactionsEnabled="1"
            emitMetadata="1"
            inputPosition="bottom"
            theme={giscusTheme}
            lang="en"
            loading="lazy"
        />
    );
}
