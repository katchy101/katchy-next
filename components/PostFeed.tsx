import Link from "next/link";
const PostItem = ({ post, admin = false }) => {
  const wordCound = post?.content.trim().split(/\s+/g).length,
    minutesToRead = (wordCound / 100 + 1).toFixed(0);
  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>
      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>
      <footer>
        <span>
          {wordCound} words. {minutesToRead} min read.
        </span>
        <span> {post.heartCount} Hearts</span>
      </footer>
    </div>
  );
};

const PostFeed = ({ posts, admin }) => {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
};

export default PostFeed;
