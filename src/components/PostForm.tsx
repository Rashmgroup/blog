import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthContext } from 'context/AuthContext';
import { useCreatePost, useGetPost, useUpdatePost } from 'hooks/api';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css'; // Import Quill's styles

import styles from './PostForm.module.css';
import { CATEGORIES } from './PostList';

export default function PostForm() {
  const { mutateAsync: createPost, isLoading } = useCreatePost();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const params = useParams();
  const postId = params.id as string;
  const { data: post } = useGetPost(postId, {
    enabled: !!postId,
  });

  const { mutateAsync: updatePost, isLoading: updateLoading } = useUpdatePost(postId);

  // Use useForm hook
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
    mode: 'onSubmit',
  });

  // Set form values when editing a post
  useEffect(() => {
    if (postId && post) {
      setValue('title', post.title);
      setValue('summary', post.summary);
      setValue('content', post.content); // Set initial content for the editor
      setValue('category', post.category);
    }
  }, [postId, post, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const { title, summary, content, category } = data;

    try {
      if (post) {
        // Update post
        await updatePost({
          title,
          summary,
          content,
          category,
        });
        navigate(`/posts/${postId}`);
      } else {
        // Create a new post
        const res = await createPost({
          title,
          summary,
          content,
          email: user?.email || '',
          category,
        });
        navigate(`/posts/${res.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <form onSubmit={onSubmit} action="/post" method="POST" className={styles.form}>
      <div className={styles.block}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" required {...register('title', { required: true })} />
      </div>

      <div className={styles.block}>
        <label htmlFor="category">Category</label>
        <select id="category" {...register('category')}>
          <option value="">Please select a category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.block}>
        <label htmlFor="summary">Summary</label>
        <input type="text" id="summary" required {...register('summary', { required: true })} />
      </div>

      {/* Use ReactQuill for rich text editor */}
      <div className={styles.block}>
        <label htmlFor="content">Content</label>
        <ReactQuill
          id="content"
          value={getValues('content')} // Get content from useForm
          onChange={(value) => setValue('content', value)} // Set content in the form
          theme="snow"
          modules={{
            toolbar: [
              [{ header: '1' }, { header: '2' }, { font: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ align: [] }],
              ['link', 'image'],
              [{ 'color': [] }, { 'background': [] }], // Font color and background color
              [{ 'font': [] }], // Font options
              ['blockquote', 'code-block'], // Blockquote and Code block
              [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript and Superscript
              ['clean'], // Clear formatting
            ],
          }}
        />
      </div>

      <button disabled={isLoading || updateLoading} className={styles.submitBtn}>
        {postId && (updateLoading ? 'loading...' : 'Update')}
        {!postId && (isLoading ? 'loading...' : 'Submit')}
      </button>
    </form>
  );
}
