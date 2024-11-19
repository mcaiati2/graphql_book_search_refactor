// DONE:   Create a schemas directory within src and add the following files:

// resolvers.ts: Export an object with sub Query and Mutation objects within it. Convert the functions in src/controllers/user_controllers.ts and src/controllers/auth_controllers.ts to resolvers within the respective Query and Mutation objects.

// Hint: Read through the functions in the controller files thoroughly before moving the functionality code over.

// Bonus: Create a nested resolvers folder within schemas and make an auth_resolvers.ts and user_resolvers.ts file to seperate the resolver functionality. You will then need to import them into resolvers.ts and spread the Query and Mutation objects into their respective properties. (Refer to our example in-class application for help)


// ---------------------------------- GET USER 
// Returns the logged in user object or returns a null user if no cookie is attached or the JTW is not valid
export const getUser = async (_: any, __: any, { req }: { req: Request }) => {
  // Retrieves the user_id from the request object - Check out services/auth.ts->getUserId
  const user_id = getUserId(req);

  if (!user_id) {
    return {
      user: null
    };
  }

  const user = await User.findById(user_id).select('_id username savedBooks');

  if (!user) {
    return {
      user: null
    };
  }

  return {
    user: user
  };
};


// -------------------------------------- REGISTER USER 
/* 
  Registering a user by attempting to create a new user object in the database with their form
  credentials.
  If we are able to create their new user object, we send a cookie with a JWT attached and return their user object
  Related to SignupForm.tsx in client/src/components
*/
export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    // Create a JWT token
    const token = signToken(user._id as Types.ObjectId);

    // Send a cookie back with the JWT attached
    res.cookie('book_app_token', token, {
      httpOnly: true,
      secure: process.env.PORT ? true : false,
      sameSite: true
    });

    return res.json({ user });
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);


    return res.status(403).json({
      message: errorMessage
    });
  }
};
export const Mutation = {
  registerUser: async (_: any, { input }: { input: any }, { res }: { res: Response }) => {
    try {
      const user = await User.create(input);
      const token = signToken(user._id as Types.ObjectId);

      res.cookie('book_app_token', token, {
        httpOnly: true,
        secure: process.env.PORT ? true : false,
        sameSite: true
      });

      return { user };
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);

      return {
        message: errorMessage
      };
    }
  }
};



// ---------------------------- login user 
/* 
  Log a user in by first finding their user object in the database then validating their password
  Once we verify their credentials, we send a cookie with a JWT attached and return their user object
  Related to LoginForm.tsx in client/src/components
*/
export const loginUser = async (req: Request, res: Response) => {
  // Find their user object by the email address provided in the client form
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ message: "No user found with that email address" });
  }

  // Check if their password matches the encrypted password stored on their user object
  const valid_pass = await user.validatePassword(req.body.password);

  if (!valid_pass) {
    return res.status(400).json({ message: 'Wrong password!' });
  }

  // Create a JWT token
  const token = signToken(user._id as Types.ObjectId);

  // Send a cookie back with the JWT attached
  res.cookie('book_app_token', token, {
    httpOnly: true,
    secure: process.env.PORT ? true : false,
    sameSite: true
  });

  return res.json({
    user: user
  });
};
export const Mutation = {
  ...Mutation,
  loginUser: async (_: any, { input }: { input: any }, { res }: { res: Response }) => {
    const user = await User.findOne({ email: input.email });

    if (!user) {
      return { message: "No user found with that email address" };
    }

    const valid_pass = await user.validatePassword(input.password);

    if (!valid_pass) {
      return { message: 'Wrong password!' };
    }

    const token = signToken(user._id as Types.ObjectId);

    res.cookie('book_app_token', token, {
      httpOnly: true,
      secure: process.env.PORT ? true : false,
      sameSite: true
    });

    return { user };
  }
};



// -------------------------- logout user 
// Clears the client-side cookie to log the user out
export const Mutation = {
  ...Mutation,
  logoutUser: async (_: any, __: any, { res }: { res: Response }) => {
    res.clearCookie('book_app_token');
    return {
      message: 'Logged out successfully!'
    };
  }
};