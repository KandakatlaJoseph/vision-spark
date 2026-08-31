import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/api';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!slug) return;
    api.get(`/blog/${slug}`).then((res) => setPost(res.data)).catch(() => setPost(null));
  }, [slug]);

  if (!post) return <div className="max-w-3xl mx-auto px-6 py-20 text-mist">Loading…</div>;

  return (
    <article className="max-w-3xl mx-auto px-6 py-20">
      <span className="text-xs text-mist">{new Date(post.published_at).toLocaleDateString()}</span>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-cloud mt-3 mb-8">
        {post.title}
      </h1>
      <div className="text-mist leading-relaxed whitespace-pre-line">{post.content}</div>
    </article>
  );
}
