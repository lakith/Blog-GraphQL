const Comment = {
  owner: (parent, args, { db }, info) => {
    return db.users.find((user) => user.id === parent.owner);
  },
  post: (parent, args, { db }, info) => {
    return db.posts.find((post) => post.id === parent.post);
  },
};

export default Comment;
