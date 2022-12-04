import 'firebase/firestore';

import firebase from 'firebase/app';

import { PostComment } from './post-comment';

export interface Post {
  id?: string;
  title: string;
  image: string;
  author: string;
  authorID: string;
  content: string;
  summary: string;
  published: firebase.firestore.Timestamp;
  edited?: firebase.firestore.Timestamp;
  comments?: PostComment[];
}
