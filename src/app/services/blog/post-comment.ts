import firebase from 'firebase/app';
import 'firebase/firestore';

export interface PostComment {
  id?: string;
  author: string;
  authorID: string;
  content: string;
  published: firebase.firestore.Timestamp;
}
