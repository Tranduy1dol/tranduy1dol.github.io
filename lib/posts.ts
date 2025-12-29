import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { rehype } from 'rehype';
import rehypeSlug from 'rehype-slug';

const postsDirectory = path.join(process.cwd(), '_posts');

export type Heading = {
    text: string;
    slug: string;
    level: number;
};

export type PostData = {
    id: string;
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
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const slug = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

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

        // Combine the data with the id
        return {
            id,
            readTime,
            tags,
            ...(matterResult.data as {
                date: string;
                title: string;
                excerpt?: string;
                category?: string;
            }),
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

// Gets all possible slugs/IDs for dynamic routing
export function getAllPostIds() {
    const allFiles = getAllMarkdownFiles(postsDirectory);
    return allFiles.map(({ filePath }) => {
        const fileName = path.basename(filePath);
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
}

// Find a post file by id (searches recursively)
function findPostFile(id: string): string | null {
    const allFiles = getAllMarkdownFiles(postsDirectory);
    const found = allFiles.find(({ filePath }) => {
        const fileName = path.basename(filePath);
        return fileName.replace(/\.md$/, '') === id;
    });
    return found ? found.filePath : null;
}

// Gets the full data for a single post, including HTML content
export async function getPostData(id: string): Promise<PostData> {
    const filePath = findPostFile(id);
    if (!filePath) {
        throw new Error(`Post not found: ${id}`);
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');

    // Get tag from folder if in subdirectory
    const relativePath = path.relative(postsDirectory, filePath);
    const parts = relativePath.split(path.sep);
    const tag = parts.length > 1 ? parts[0] : null;

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Extract headings from markdown before processing
    const headings = extractHeadings(matterResult.content);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);

    // Add IDs to headings using rehype-slug
    const contentWithIds = await rehype()
        .use(rehypeSlug)
        .process(processedContent.toString());

    const contentHtml = contentWithIds.toString();

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

    // Combine the data with the id and contentHtml
    return {
        id,
        contentHtml,
        readTime,
        headings,
        tags,
        ...(matterResult.data as {
            date: string;
            title: string;
            excerpt?: string;
            category?: string;
        }),
    };
}
