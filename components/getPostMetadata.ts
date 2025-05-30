import {PostMetadata} from "./PostMetadata";
import fs from "fs";
import matter from "gray-matter";

const GetPostMetadata = (): PostMetadata[] => {
    const folder = "posts/"
    const file = fs.readdirSync(folder)
    const markdownPosts = file.filter(f => f.endsWith(".md"))

    return markdownPosts.map(filename => {
        const fileContent = fs.readFileSync(`posts/${filename}`, "utf-8")
        const matterResult = matter(fileContent)
        return {
            title: matterResult.data.title,
            date: matterResult.data.date,
            subtitle: matterResult.data.subtitle,
            slug: filename.replace(".md", "")
        };
    });
}

export default GetPostMetadata;