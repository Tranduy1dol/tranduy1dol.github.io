import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { rehype } from 'rehype';
import rehypeSlug from 'rehype-slug';

const booksDirectory = path.join(process.cwd(), '_books');

export type BookData = {
    id: string;
    title: string;
    author: string;
    cover: string;
    tags: string[];
    rating?: number;
    dateRead?: string;
    status?: 'reading' | 'completed' | 'want-to-read';
    contentHtml?: string;
};

export type BilingualBookData = {
    id: string;
    cover: string;
    tags: string[];
    rating?: number;
    dateRead?: string;
    status?: 'reading' | 'completed' | 'want-to-read';
    vn: BookData;
    en: BookData;
};

// Ensure books directory exists
function ensureBooksDirectory() {
    if (!fs.existsSync(booksDirectory)) {
        fs.mkdirSync(booksDirectory, { recursive: true });
    }
}

export function extractLanguage(fileName: string): 'vn' | 'en' | null {
    if (fileName.endsWith('.vn.md')) return 'vn';
    if (fileName.endsWith('.en.md')) return 'en';
    return null;
}

export function getBaseId(fileName: string): string {
    return fileName.replace(/\.vn\.md$/, '').replace(/\.en\.md$/, '').replace(/\.md$/, '');
}

function parseTags(tags: unknown): string[] {
    return [...new Set((Array.isArray(tags) ? tags : [tags])
        .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
        .map(tag => tag.trim()))];
}

function parseBookFile(fullPath: string, id: string): BookData | null {
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // Convert Date objects to ISO strings for serialization
    const dateRead = matterResult.data.dateRead;
    const dateReadStr = dateRead instanceof Date
        ? dateRead.toISOString().split('T')[0]
        : dateRead;

    return {
        id,
        title: matterResult.data.title as string,
        author: matterResult.data.author as string,
        cover: (matterResult.data.cover as string).replace(/^\[\[(.*?)\]\]$/, '/$1'),
        tags: parseTags(matterResult.data.tags),
        rating: matterResult.data.rating as number | undefined,
        dateRead: dateReadStr as string | undefined,
        status: matterResult.data.status as 'reading' | 'completed' | 'want-to-read' | undefined,
    };
}

// Gets and sorts all book data for the books page
export function getSortedBooksData(): BilingualBookData[] {
    ensureBooksDirectory();

    const fileNames = fs.readdirSync(booksDirectory);
    const mdFiles = fileNames.filter(file => file.endsWith('.md'));

    if (mdFiles.length === 0) {
        return [];
    }

    const idSet = new Set<string>();
    for (const fileName of mdFiles) {
        idSet.add(getBaseId(fileName));
    }

    const allBooksData: BilingualBookData[] = Array.from(idSet).map((id) => {
        let vnData = parseBookFile(path.join(booksDirectory, `${id}.vn.md`), id);
        let enData = parseBookFile(path.join(booksDirectory, `${id}.en.md`), id);
        const legacyData = parseBookFile(path.join(booksDirectory, `${id}.md`), id);

        vnData = vnData || legacyData || enData || ({} as BookData);
        enData = enData || legacyData || vnData || ({} as BookData);

        const base = vnData.cover ? vnData : enData;

        return {
            id,
            cover: base.cover,
            tags: [...new Set([...vnData.tags, ...enData.tags])],
            rating: base.rating,
            dateRead: base.dateRead,
            status: base.status,
            vn: vnData as BookData,
            en: enData as BookData,
        };
    });

    // Sort by dateRead (most recent first), then by title
    return allBooksData.sort((a, b) => {
        if (a.dateRead && b.dateRead) {
            return a.dateRead < b.dateRead ? 1 : -1;
        }
        if (a.dateRead) return -1;
        if (b.dateRead) return 1;
        return (a.en.title || '').localeCompare(b.en.title || '');
    });
}

// Gets all possible slugs/IDs for dynamic routing
export function getAllBookIds() {
    ensureBooksDirectory();

    const fileNames = fs.readdirSync(booksDirectory);
    const mdFiles = fileNames.filter(file => file.endsWith('.md'));
    
    const idSet = new Set<string>();
    for (const fileName of mdFiles) {
        idSet.add(getBaseId(fileName));
    }
    
    return Array.from(idSet).map(id => ({ params: { id } }));
}

async function processContent(matterResult: matter.GrayMatterFile<string>): Promise<string> {
    if (!matterResult || !matterResult.content) return '';
    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);

    // Add IDs to headings
    const contentWithIds = await rehype()
        .use(rehypeSlug)
        .process(processedContent.toString());

    return contentWithIds.toString();
}

async function getBookVariant(fullPath: string, id: string): Promise<BookData | null> {
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const contentHtml = await processContent(matterResult);

    const dateRead = matterResult.data.dateRead;
    const dateReadStr = dateRead instanceof Date
        ? dateRead.toISOString().split('T')[0]
        : dateRead;

    return {
        id,
        contentHtml,
        title: matterResult.data.title as string,
        author: matterResult.data.author as string,
        cover: (matterResult.data.cover as string).replace(/^\[\[(.*?)\]\]$/, '/$1'),
        tags: parseTags(matterResult.data.tags),
        rating: matterResult.data.rating as number | undefined,
        dateRead: dateReadStr as string | undefined,
        status: matterResult.data.status as 'reading' | 'completed' | 'want-to-read' | undefined,
    };
}

// Gets the full data for a single book, including HTML content
export async function getBookData(id: string): Promise<BilingualBookData> {
    let vnData = await getBookVariant(path.join(booksDirectory, `${id}.vn.md`), id);
    let enData = await getBookVariant(path.join(booksDirectory, `${id}.en.md`), id);
    const legacyData = await getBookVariant(path.join(booksDirectory, `${id}.md`), id);

    vnData = vnData || legacyData || enData || ({} as BookData);
    enData = enData || legacyData || vnData || ({} as BookData);

    const base = vnData.cover ? vnData : enData;

    return {
        id,
        cover: base.cover,
        tags: [...new Set([...vnData.tags, ...enData.tags])],
        rating: base.rating,
        dateRead: base.dateRead,
        status: base.status,
        vn: vnData as BookData,
        en: enData as BookData,
    };
}
