import firebase from 'firebase/app';
import 'firebase/firestore';

import { PostComment } from './post-comment';

describe('PostComment', () => {
  let a: PostComment = {
    author: 'author',
    authorID: 'authorID',
    content: 'content',
    published: firebase.firestore.Timestamp.now(),
  };
  it('should create an instance', () => {
    expect(a).toBeTruthy();
  });
});
