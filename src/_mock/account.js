// ----------------------------------------------------------------------

import { getFullname, getUsername } from "src/routes/auth";

export const account = {
  fullname: getFullname(),
  username: getUsername(),
  photoURL: '/assets/images/avatars/avatar_25.jpg',
};
