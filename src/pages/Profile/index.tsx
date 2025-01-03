import { useAuthContext } from 'context/AuthContext';
import { logout } from 'api/firebase';
import PostList from 'components/PostList';
import { Page } from 'components/ui';
import styles from './index.module.css';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user } = useAuthContext();

  // Default avatar URL in case user doesn't have a photoURL
  const defaultAvatar = 'https://www.w3schools.com/w3images/avatar2.png';

  return (
    <Page>
      <div className={styles.profileBox}>
        <div className={`${styles.flexBox} ${styles.Large}`}>
          <div
            className={styles.avatar}
            style={{
              backgroundImage: `url(${user?.photoURL || defaultAvatar})`,
              backgroundSize: 'cover', // Ensures the image covers the avatar box
              backgroundPosition: 'center', // Center the image within the avatar box
            }}
          />
          <div>
            <p className={styles.email}>{user?.email}</p>
            <p className={styles.username}>{user?.displayName || 'User'}</p>
          </div>
        </div>
        <div
          onClick={async () => {
            try {
              await logout();
              toast.success('LOGOUT SUCCESSFUL', { hideProgressBar: true });
            } catch (e: any) {
              toast.error(e.message);
              console.error(e.message);
            }
          }}
          role="presentation"
          className={styles.logoutBtn}
        >
          Logout
        </div>
      </div>
      <PostList onFilter={false} defaultFilter="my" />
    </Page>
  );
}
