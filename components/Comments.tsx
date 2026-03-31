import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

export default function Comments() {
    const { resolvedTheme } = useTheme();

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
            emitMetadata="0"
            inputPosition="bottom"
            theme={resolvedTheme === 'dark' ? 'dark_tritanopia' : 'light'}
            lang="vi"
            loading="lazy"
        />
    );
}
