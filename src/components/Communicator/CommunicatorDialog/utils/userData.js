export const isLoggedIn = userData =>
  !!userData && 'name' in userData && 'email' in userData;
