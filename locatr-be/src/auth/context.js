import { verifyAccessToken } from './jwt.js';

export const getAuthContext = ({ req, res }) => {
  const accessToken = req.cookies?.accessToken;
  
  let user = null;
  if (accessToken) {
    const decoded = verifyAccessToken(accessToken);
    if (decoded) {
      user = {
        userId: decoded.userId,
        email: decoded.email,
      };
    }
  }

  return {
    req,
    res,
    user,
  };
};
