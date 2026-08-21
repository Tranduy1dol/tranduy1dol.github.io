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

const postsDirectory = path.join(process.cwd(), '_posts');

export type Heading = {
    text: string;
    htmlText: string;
    slug: string;
    level: number;
};

export type RelatedPost = {
    title: string;
    slug: string[];
};

export type PostData = {
    id: string;
    slug: string[];
    date: string;
    title: string;
    excerpt?: string;
    tags?: string[];
    readTime?: string;
    contentHtml?: string;
    headings?: Heading[];
    relatedPosts?: RelatedPost[];
};

export type TagCount = {
    name: string;
    count: number;
};

export type BilingualPostData = {
    slug: string[];
    date: string;
    tags?: string[];
    vn: PostData;
    en: PostData;
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
    let fileName = parts[parts.length - 1].replace(/\.md$/, '');
    // Strip language suffix (.vn or .en)
    fileName = fileName.replace(/\.(vn|en)$/, '');
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
    if (!fs.existsSync(dir)) {
        return [];
    }

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

// Extract language from filename
function extractLanguage(filePath: string): 'vn' | 'en' | null {
    if (filePath.endsWith('.vn.md')) return 'vn';
    if (filePath.endsWith('.en.md')) return 'en';
    return null;
}

// Extract the inline post metadata parsing into a reusable function
function parsePostMetadata(filePath: string): PostData {
    const fileName = path.basename(filePath);
    const id = fileName.replace(/\.md$/, '').replace(/\.(vn|en)$/, '');
    const slug = buildSlug(filePath);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const matterResult = matter(fileContents);
    
    const readTime = matterResult.data.readTime || calculateReadTime(matterResult.content);
    
    const tags: string[] = [];
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
    };
}

// Same as parsePostMetadata but also compiles the markdown content
async function compilePostContent(filePath: string): Promise<PostData> {
    const baseMetadata = parsePostMetadata(filePath);
    const fileContents = fs.readFileSync(filePath, 'utf8');
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
    
    const relatedPosts = matterResult.data.relatedPosts
        ? getRelatedPosts(
            Array.isArray(matterResult.data.relatedPosts)
                ? matterResult.data.relatedPosts
                : [matterResult.data.relatedPosts]
        )
        : [];
        
    return {
        ...baseMetadata,
        contentHtml,
        headings,
        relatedPosts,
    };
}

// Gets and sorts all post data for the blog index page
export function getSortedPostsData(): BilingualPostData[] {
    const allFiles = getAllMarkdownFiles(postsDirectory);
    
    // Group files by base slug
    const grouped = new Map<string, { vn?: string; en?: string; fallback?: string }>();
    for (const { filePath } of allFiles) {
        const slugKey = buildSlug(filePath).join('/');
        const lang = extractLanguage(filePath);
        
        let group = grouped.get(slugKey);
        if (!group) {
            group = {};
            grouped.set(slugKey, group);
        }
        
        if (lang === 'vn') group.vn = filePath;
        else if (lang === 'en') group.en = filePath;
        else group.fallback = filePath;
    }
    
    const allPostsData: BilingualPostData[] = [];
    
    for (const [, group] of grouped.entries()) {
        const vnPath = group.vn || group.fallback || group.en;
        const enPath = group.en || group.fallback || group.vn;
        
        if (!vnPath || !enPath) continue;
        
        const vnData = parsePostMetadata(vnPath);
        const enData = parsePostMetadata(enPath);
        
        // Merge tags from both vn and en
        const tagsSet = new Set<string>();
        if (vnData.tags) vnData.tags.forEach(t => tagsSet.add(t));
        if (enData.tags) enData.tags.forEach(t => tagsSet.add(t));
        
        allPostsData.push({
            slug: vnData.slug,
            date: vnData.date,
            tags: Array.from(tagsSet),
            vn: vnData,
            en: enData,
        });
    }
    
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
    const slugMap = new Map<string, string[]>();
    
    for (const { filePath } of allFiles) {
        const slug = buildSlug(filePath);
        const slugKey = slug.join('/');
        if (!slugMap.has(slugKey)) {
            slugMap.set(slugKey, slug);
        }
    }
    
    return Array.from(slugMap.values()).map(slug => ({
        params: { slug },
    }));
}

// Find all language variants for a given slug
function findPostFilesBySlug(slug: string[]): { vn?: string; en?: string; fallback?: string } {
    const allFiles = getAllMarkdownFiles(postsDirectory);
    const result: { vn?: string; en?: string; fallback?: string } = {};
    
    for (const { filePath } of allFiles) {
        const fileSlug = buildSlug(filePath);
        if (fileSlug.length === slug.length && fileSlug.every((s, i) => s === slug[i])) {
            const lang = extractLanguage(filePath);
            if (lang === 'vn') result.vn = filePath;
            else if (lang === 'en') result.en = filePath;
            else result.fallback = filePath;
        }
    }
    
    return result;
}

export function getRelatedPosts(slugStrings: string[]): RelatedPost[] {
    return slugStrings
        .map((slugStr) => {
            const targetSlug = slugStr.split('/').map(slugify);
            const files = findPostFilesBySlug(targetSlug);
            const targetPath = files.vn || files.fallback || files.en;
            if (!targetPath) return null;
            
            const content = fs.readFileSync(targetPath, 'utf8');
            const { data } = matter(content);
            return { title: data.title as string, slug: targetSlug };
        })
        .filter((p): p is RelatedPost => p !== null);
}

// Gets the full data for a single post, including HTML content
export async function getPostData(slug: string[]): Promise<BilingualPostData> {
    const files = findPostFilesBySlug(slug);
    
    const vnPath = files.vn || files.fallback || files.en;
    const enPath = files.en || files.fallback || files.vn;
    
    if (!vnPath || !enPath) {
        throw new Error(`Post not found: ${slug.join('/')}`);
    }
    
    const vnData = await compilePostContent(vnPath);
    const enData = await compilePostContent(enPath);
    
    // Merge tags from both vn and en
    const tagsSet = new Set<string>();
    if (vnData.tags) vnData.tags.forEach(t => tagsSet.add(t));
    if (enData.tags) enData.tags.forEach(t => tagsSet.add(t));

    return {
        slug: vnData.slug,
        date: vnData.date,
        tags: Array.from(tagsSet),
        vn: vnData,
        en: enData,
    };
}
