const { GraphQLError } = require('graphql');
const { PubSub } = require('graphql-subscriptions');
const jwt = require('jsonwebtoken');
const Book = require('./models/Book');
const Author = require('./models/Author');
const User = require('./models/User');

const pubsub = new (PubSub.default || PubSub)();

const resolvers = {
  Query: {
    bookCount: async () => (await Book.find({})).length,
    authorCount: async () => (await Author.find({})).length,
    allBooks: async (root, args) => {
      const filter = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          filter.author = author._id;
        } else {
          return [];
        }
      }
      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }
      return await Book.find(filter).populate('author');
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      const books = await Book.find({});
      return authors.map((author) => ({
        ...author.toObject(),
        bookCount: books.filter(
          (book) => String(book.author) === String(author._id)
        ).length
      }));
    },

    me: (root, args, context) => {
      return context.currentUser;
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        });
      }
      try {
        let author = await Author.findOne({ name: args.author });
        if (!author) {
          author = new Author({ name: args.author, born: null });
          await author.save();
        }
        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id
        });
        await book.save();
        const populatedBook = await Book.findById(book._id).populate('author');
        pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook });
        return populatedBook;
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args
          }
        });
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        });
      }
      try {
        const author = await Author.findOne({ name: args.name });
        if (!author) {
          throw new GraphQLError('Author not found', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args
            }
          });
        }
        author.born = args.setBornTo;
        await author.save();
        return author;
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args
          }
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      });
      return await user.save().catch((error) => {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args
          }
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      // All users have the same hardcoded password: 'secret'
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }
      const userForToken = {
        username: user.username,
        id: user._id
      };
      const token = jwt.sign(userForToken, process.env.JWT_SECRET);
      return { value: token };
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  },
  Author: {
    bookCount: async (root) => {
      return await Book.countDocuments({ author: root._id });
    }
  }
};

module.exports = resolvers;
