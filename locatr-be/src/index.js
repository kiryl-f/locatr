import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { getAuthContext } from './auth/context.js';

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => getAuthContext({ req, res }),
});

await server.start();
server.applyMiddleware({ 
  app, 
  cors: false, // We handle CORS above
  path: '/graphql'
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🔐 Authentication enabled with HTTP-only cookies`);
});
