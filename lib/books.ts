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
    rating?: number;
    dateRead?: string;
    status?: 'reading' | 'completed' | 'want-to-read';
    contentHtml?: string;
};

// Ensure books directory exists
function ensureBooksDirectory() {
    if (!fs.existsSync(booksDirectory)) {
        fs.mkdirSync(booksDirectory, { recursive: true });
    }
}

// Gets and sorts all book data for the books page
export function getSortedBooksData(): BookData[] {
    ensureBooksDirectory();

    const fileNames = fs.readdirSync(booksDirectory);
    const mdFiles = fileNames.filter(file => file.endsWith('.md'));

    if (mdFiles.length === 0) {
        return [];
    }

    const allBooksData = mdFiles.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(booksDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            id,
            ...(matterResult.data as {
                title: string;
                author: string;
                cover: string;
                rating?: number;
                dateRead?: string;
                status?: 'reading' | 'completed' | 'want-to-read';
            }),
        };
    });

    // Sort by dateRead (most recent first), then by title
    return allBooksData.sort((a, b) => {
        if (a.dateRead && b.dateRead) {
            return a.dateRead < b.dateRead ? 1 : -1;
        }
        if (a.dateRead) return -1;
        if (b.dateRead) return 1;
        return a.title.localeCompare(b.title);
    });
}

// Gets all possible slugs/IDs for dynamic routing
export function getAllBookIds() {
    ensureBooksDirectory();

    const fileNames = fs.readdirSync(booksDirectory);
    const mdFiles = fileNames.filter(file => file.endsWith('.md'));

    return mdFiles.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
}

// Gets the full data for a single book, including HTML content
export async function getBookData(id: string): Promise<BookData> {
    const fullPath = path.join(booksDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);

    // Add IDs to headings
    const contentWithIds = await rehype()
        .use(rehypeSlug)
        .process(processedContent.toString());

    const contentHtml = contentWithIds.toString();

    return {
        id,
        contentHtml,
        ...(matterResult.data as {
            title: string;
            author: string;
            cover: string;
            rating?: number;
            dateRead?: string;
            status?: 'reading' | 'completed' | 'want-to-read';
        }),
    };
}
