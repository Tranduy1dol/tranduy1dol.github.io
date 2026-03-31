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
import GithubSlugger from 'github-slugger';


const postsDirectory = path.join(process.cwd(), '_posts');

export type Heading = {
    text: string;
    slug: string;
    level: number;
};

export type PostData = {
    id: string;
    slug: string[];
    date: string;
    title: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
    readTime?: string;
    contentHtml?: string;
    headings?: Heading[];
};

export type TagCount = {
    name: string;
    count: number;
};

// Convert a string to a URL-friendly slug
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Build the slug array from the file path relative to _posts
function buildSlug(filePath: string): string[] {
    const relativePath = path.relative(postsDirectory, filePath);
    const parts = relativePath.split(path.sep);
    // Last part is the filename, rest are folder names
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

        headings.push({ text, slug, level });
    }

    return headings;
}

// Recursively get all markdown files with their tag (folder name)
function getAllMarkdownFiles(dir: string, tag: string | null = null): Array<{ filePath: string; tag: string | null }> {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files: Array<{ filePath: string; tag: string | null }> = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Folder name becomes the tag
            const subFiles = getAllMarkdownFiles(fullPath, entry.name);
            files.push(...subFiles);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            files.push({ filePath: fullPath, tag });
        }
    }

    return files;
}

// Gets and sorts all post data for the blog index page
export function getSortedPostsData(): PostData[] {
    const allFiles = getAllMarkdownFiles(postsDirectory);

    const allPostsData = allFiles.map(({ filePath, tag }) => {
        // Get id from filename
        const fileName = path.basename(filePath);
        const id = fileName.replace(/\.md$/, '');

        // Build slug from file path
        const slug = buildSlug(filePath);

        // Read markdown file as string
        const fileContents = fs.readFileSync(filePath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents);

        // Calculate read time if not provided
        const readTime = matterResult.data.readTime || calculateReadTime(matterResult.content);

        // Build tags array - folder tag + any frontmatter tags
        const tags: string[] = [];
        if (tag) tags.push(tag);
        if (matterResult.data.tags) {
            const frontmatterTags = Array.isArray(matterResult.data.tags)
                ? matterResult.data.tags
                : [matterResult.data.tags];
            tags.push(...frontmatterTags);
        }

        // Convert Date objects to ISO strings for serialization
        const dateValue = matterResult.data.date;
        const dateStr = dateValue instanceof Date
            ? dateValue.toISOString().split('T')[0]
            : dateValue;

        // Combine the data with the id
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

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

// Get all tags with counts
export function getAllTags(): TagCount[] {
    const allPosts = getSortedPostsData();
    const tagCounts: Record<string, number> = {};

    for (const post of allPosts) {
        if (post.tags) {
            for (const tag of post.tags) {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            }
        }
    }

    return Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

// Gets all possible slugs for dynamic routing (catch-all [...slug])
export function getAllPostSlugs() {
    const allFiles = getAllMarkdownFiles(postsDirectory);
    return allFiles.map(({ filePath }) => {
        const slug = buildSlug(filePath);
        return {
            params: {
                slug,
            },
        };
    });
}

// Find a post file by slug array (searches recursively)
function findPostFileBySlug(slug: string[]): string | null {
    const allFiles = getAllMarkdownFiles(postsDirectory);
    const found = allFiles.find(({ filePath }) => {
        const fileSlug = buildSlug(filePath);
        return fileSlug.length === slug.length && fileSlug.every((s, i) => s === slug[i]);
    });
    return found ? found.filePath : null;
}

// Gets the full data for a single post, including HTML content
export async function getPostData(slug: string[]): Promise<PostData> {
    const filePath = findPostFileBySlug(slug);
    if (!filePath) {
        throw new Error(`Post not found: ${slug.join('/')}`);
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');

    // Get id from filename
    const fileName = path.basename(filePath);
    const id = fileName.replace(/\.md$/, '');

    // Get tag from folder if in subdirectory
    const relativePath = path.relative(postsDirectory, filePath);
    const parts = relativePath.split(path.sep);
    const tag = parts.length > 1 ? parts[0] : null;

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Extract headings from markdown before processing
    const headings = extractHeadings(matterResult.content);

    // Replace `public/` prefix in markdown image links so they work in both Obsidian (which needs public/) and Next.js (which serves from /)
    const contentWithFixedImages = matterResult.content.replace(/!\[([^\]]*)\]\(public\/(.*?)\)/g, '![$1](/$2)');

    // Use unified pipeline to convert markdown into HTML with math support
    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeSlug)
        .use(rehypeStringify)
        .process(contentWithFixedImages);

    const contentHtml = processedContent.toString();

    // Calculate read time if not provided
    const readTime = matterResult.data.readTime || calculateReadTime(matterResult.content);

    // Build tags array
    const tags: string[] = [];
    if (tag) tags.push(tag);
    if (matterResult.data.tags) {
        const frontmatterTags = Array.isArray(matterResult.data.tags)
            ? matterResult.data.tags
            : [matterResult.data.tags];
        tags.push(...frontmatterTags);
    }

    // Convert Date objects to ISO strings for serialization
    const dateValue = matterResult.data.date;
    const dateStr = dateValue instanceof Date
        ? dateValue.toISOString().split('T')[0]
        : dateValue;

    // Combine the data with the id and contentHtml
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
