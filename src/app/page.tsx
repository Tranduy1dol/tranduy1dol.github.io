import fs from "fs"
import Link from "next/link";
import Markdown from "markdown-to-jsx";

const GetPostMetadata = () => {
  const folder = "posts/"
  const file = fs.readdirSync(folder)
  const markdownPosts = file.filter(f => f.endsWith(".md"))
  return markdownPosts.map(f => f.replace(".md", ""));
}

const HomePage = () => {
  const posts = GetPostMetadata();
  const postPreview = posts.map(p => (
      <div>
        <Link href={`/posts/${p}`}>
          <Markdown>{p}</Markdown>
        </Link>
      </div>
  ))
  return <div>{postPreview}</div>
}

export default HomePage;