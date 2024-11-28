import React from 'react';
import styles from './AuthorProfile.module.css';
import formatTimestamp from 'utils/formatTimestamp';

interface AuthorProfileProps {
  author: string;
  createdAt: string;
  profilePhotoUrl?: string;  // This is the new prop for the custom profile photo
}

export default function AuthorProfile({
  author,
  createdAt,
  profilePhotoUrl = 'https://www.w3schools.com/w3images/avatar2.png', // Default image URL
}: AuthorProfileProps) {
  return (
    <div className={styles.profileBox}>
      <div className={styles.profileLeft}>
        {/* If profilePhotoUrl is provided, it will use that, else the default image */}
        <div className={styles.avatar}>
          <img
            src={profilePhotoUrl}
            alt="Profile"
            className={styles.avatarImage}
          />
        </div>
        <p className={styles.authorName}>{author}</p>
      </div>
      <p className={styles.postDate}>{formatTimestamp(createdAt)}</p>
    </div>
  );
}
