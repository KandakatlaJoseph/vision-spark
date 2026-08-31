import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/blog').then((res) => setPosts(res.data)).catch(() => setPosts([]));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <span className="text-teal text-sm">Blog</span>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-cloud mt-3 mb-10">
        Insights &amp; Updates
      </h1>

      {posts.length === 0 && <p className="text-mist">No posts published yet.</p>}

      <div className="space-y-6">
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="card p-6 block hover:border-spark/50 transition-colors">
            <h3 className="font-display text-xl font-semibold text-cloud mb-2">{p.title}</h3>
            <p className="text-mist text-sm mb-3">{p.excerpt}</p>
            <span className="text-xs text-mist">{new Date(p.published_at).toLocaleDateString()}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
