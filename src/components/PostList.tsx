import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from 'context/AuthContext';
import PostBox from 'components/PostBox';
import { useGetPosts } from 'hooks/api';
import styles from './PostList.module.css';

interface PostListProps {
  onFilter?: boolean;
  defaultFilter?: FilterType | CategoryType;
}

export type FilterType = 'all' | 'my';

export type CategoryType = 'Frontend' | 'Backend' | 'Web' | 'Native' | 'Lifestyle' | 'Educational' | 'Trending' | 'Motivation' | 'Relationship' | 'Technical';

export const CATEGORIES: CategoryType[] = [
  'Frontend',
  'Backend',
  'Web',
  'Native',
  'Lifestyle',
  'Educational',
  'Trending',
  'Motivation',
  'Relationship',
  'Technical',
];

export default function PostList({
  onFilter = true,
  defaultFilter = 'all',
}: PostListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType | CategoryType>(defaultFilter);
  const { user } = useAuthContext();
  const userId = user?.email || '';  // Ensure userId is correctly obtained

  // Fetch posts with the appropriate filter
  const { data: posts, isLoading, error } = useGetPosts({
    userId: activeFilter === 'my' ? userId : undefined,
    activeFilter,
  });

  // Handle loading and error states
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error(error);  // Log the error for debugging
    return <p>Error loading posts. Please try again later.</p>;
  }

  return (
    <section>
      {onFilter && (
        <ul className={styles.filter}>
          <div className={styles.filterLeft}>
            <li
              role="presentation"
              className={`${styles.filterItem} ${activeFilter === 'all' && styles.active}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </li>
            <li
              role="presentation"
              className={`${styles.filterItem} ${activeFilter === 'my' && styles.active}`}
              onClick={() => setActiveFilter('my')}
            >
              My Posts
            </li>
          </div>

          <div className={styles.divider} />

          <div className={styles.filterRight}>
            {CATEGORIES.map((category) => (
              <li
                key={category}
                role="presentation"
                className={`${styles.filterItem} ${activeFilter === category && styles.active}`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </li>
            ))}
          </div>
        </ul>
      )}

      {!!posts?.length ? (
        <ul className={styles.postList}>
          {posts.map((post) => (
            <PostBox post={post} key={post.id} />
          ))}
        </ul>
      ) : (
        <div className={styles.noPosts}>
          <p>No Posts</p>
          <Link to="/posts/new">Let's write your first post</Link>
        </div>
      )}
    </section>
  );
}
