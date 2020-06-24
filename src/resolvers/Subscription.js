const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0;

      setInterval(() => {
        count++;
        pubsub.publish("count", {
          count,
        });
      }, 1000);

      return pubsub.asyncIterator("count");
    },
  },

  comment: {
    subscribe(parent, {postId}, { pubsub, db }, info) { 
        const post = db.posts.find(post => post.id === postId && post.published)

        if(!post) {
            throw new Error("Post Not Found")
        }

        return pubsub.asyncIterator(`comment ${postId}`)
    }
  }
};

export default Subscription;
