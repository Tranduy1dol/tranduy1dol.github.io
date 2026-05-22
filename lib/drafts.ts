import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import GithubSlugger from 'github-slugger';
import katex from 'katex';
import type { PostData, Heading } from './posts';

const draftsDirectory = path.join(process.cwd(), '_drafts');

// Convert a string to a URL-friendly slug
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Build the slug array from the file path relative to _drafts
function buildSlug(filePath: string): string[] {
    const relativePath = path.relative(draftsDirectory, filePath);
    const parts = relativePath.split(path.sep);
    const folderParts = parts.slice(0, -1).map(slugify);
    const fileName = parts[parts.length - 1].replace(/\.md$/, '');
    return [...folderParts, slugify(fileName)];
}

// Calculate estimated reading time
function calculateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
}

// Extract headings from markdown content
function extractHeadings(content: string): Heading[] {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: Heading[] = [];
    const slugger = new GithubSlugger();
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const slug = slugger.slug(text);

        const htmlText = text.replace(/\$(.*?)\$/g, (m, math) => {
            try {
                return katex.renderToString(math, { throwOnError: false });
            } catch {
                return m;
            }
        });

        headings.push({ text, htmlText, slug, level });
    }

    return headings;
}

// Recursively get all markdown files with their tag (folder name)
function getAllMarkdownFiles(dir: string, tag: string | null = null): Array<{ filePath: string; tag: string | null }> {
    if (!fs.existsSync(dir)) return [];

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files: Array<{ filePath: string; tag: string | null }> = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            const subFiles = getAllMarkdownFiles(fullPath, entry.name);
            files.push(...subFiles);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            files.push({ filePath: fullPath, tag });
        }
    }

    return files;
}

// Gets and sorts all draft data for the drafts index page
export function getSortedDraftsData(): PostData[] {
    const allFiles = getAllMarkdownFiles(draftsDirectory);

    const allDraftsData = allFiles.map(({ filePath, tag }) => {
        const fileName = path.basename(filePath);
        const id = fileName.replace(/\.md$/, '');
        const slug = buildSlug(filePath);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const matterResult = matter(fileContents);
        const readTime = matterResult.data.readTime || calculateReadTime(matterResult.content);

        const tags: string[] = [];
        if (tag) tags.push(tag);
        if (matterResult.data.tags) {
            const frontmatterTags = Array.isArray(matterResult.data.tags)
                ? matterResult.data.tags
                : [matterResult.data.tags];
            tags.push(...frontmatterTags);
        }

        const dateValue = matterResult.data.date;
        const dateStr = dateValue instanceof Date
            ? dateValue.toISOString().split('T')[0]
            : dateValue;

        return {
            id,
            slug,
            readTime,
            tags,
            date: dateStr as string,
            title: matterResult.data.title as string,
            excerpt: matterResult.data.excerpt as string | undefined,
            category: matterResult.data.category as string | undefined,
        };
    });

    return allDraftsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

// Get all draft tags with counts
export function getAllDraftTags(): Array<{ name: string; count: number }> {
    const allDrafts = getSortedDraftsData();
    const tagCounts: Record<string, number> = {};

    for (const draft of allDrafts) {
        if (draft.tags) {
            for (const tag of draft.tags) {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            }
        }
    }

    return Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

// Gets all possible slugs for dynamic routing
export function getAllDraftSlugs() {
    const allFiles = getAllMarkdownFiles(draftsDirectory);
    return allFiles.map(({ filePath }) => {
        const slug = buildSlug(filePath);
        return {
            params: {
                slug,
            },
        };
    });
}

// Find a draft file by slug array
function findDraftFileBySlug(slug: string[]): string | null {
    const allFiles = getAllMarkdownFiles(draftsDirectory);
    const found = allFiles.find(({ filePath }) => {
        const fileSlug = buildSlug(filePath);
        return fileSlug.length === slug.length && fileSlug.every((s, i) => s === slug[i]);
    });
    return found ? found.filePath : null;
}

// Gets the full data for a single draft, including HTML content
export async function getDraftData(slug: string[]): Promise<PostData> {
    const filePath = findDraftFileBySlug(slug);
    if (!filePath) {
        throw new Error(`Draft not found: ${slug.join('/')}`);
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const id = fileName.replace(/\.md$/, '');

    const relativePath = path.relative(draftsDirectory, filePath);
    const parts = relativePath.split(path.sep);
    const tag = parts.length > 1 ? parts[0] : null;

    const matterResult = matter(fileContents);
    const headings = extractHeadings(matterResult.content);

    const contentWithFixedImages = matterResult.content.replace(/!\[([^\]]*)\]\(public\/(.*?)\)/g, '![$1](/$2)');

    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        // @ts-expect-error: Options type parameter is not explicitly provided in the library definition, causing a mismatch
        .use(rehypeHighlight, { ignoreMissing: true })
        .use(rehypeSlug)
        .use(rehypeStringify)
        .process(contentWithFixedImages);

    const contentHtml = processedContent.toString();
    const readTime = matterResult.data.readTime || calculateReadTime(matterResult.content);

    const tags: string[] = [];
    if (tag) tags.push(tag);
    if (matterResult.data.tags) {
        const frontmatterTags = Array.isArray(matterResult.data.tags)
            ? matterResult.data.tags
            : [matterResult.data.tags];
        tags.push(...frontmatterTags);
    }

    const dateValue = matterResult.data.date;
    const dateStr = dateValue instanceof Date
        ? dateValue.toISOString().split('T')[0]
        : dateValue;

    return {
        id,
        slug,
        contentHtml,
        readTime,
        headings,
        tags,
        date: dateStr as string,
        title: matterResult.data.title as string,
        excerpt: matterResult.data.excerpt as string | undefined,
        category: matterResult.data.category as string | undefined,
    };
}
