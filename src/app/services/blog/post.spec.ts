import 'firebase/firestore';

import firebase from 'firebase/app';

import { Post } from './post';

describe('Post', () => {
  it('should create an instance', () => {
    let a: Post = {
      id: 'id',
      title: 'title',
      image: 'image',
      author: 'author',
      authorID: 'authorID',
      content: 'content',
      summary: 'summary',
      published: firebase.firestore.Timestamp.now(),
    };
    expect(a).toBeTruthy();
  });
});
