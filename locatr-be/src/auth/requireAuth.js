import { GraphQLError } from 'graphql';

/**
 * Middleware to require authentication for GraphQL resolvers
 * Throws UNAUTHENTICATED error if user is not logged in
 * 
 * Usage in resolver:
 * myResolver: async (_, args, { user }) => {
 *   requireAuth(user);
 *   // ... rest of resolver logic
 * }
 */
export const requireAuth = (user) => {
  if (!user) {
    throw new GraphQLError('Authentication required. Please log in.', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }
  return user;
};

/**
 * Optional: Require specific user to own a resource
 */
export const requireOwnership = (user, resourceUserId) => {
  requireAuth(user);
  
  if (user.userId !== resourceUserId) {
    throw new GraphQLError('Forbidden. You do not have access to this resource.', {
      extensions: {
        code: 'FORBIDDEN',
        http: { status: 403 },
      },
    });
  }
  
  return true;
};
