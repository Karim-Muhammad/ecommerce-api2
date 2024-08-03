const sendEmail = require("../utils/send-emails");

const ApiError = require("../utils/ApiError");

const {
  createToken,
  generateRandomCode,
  hashOnce,
  verifyToken,
} = require("../helpers");

const User = require("../models/User");

/**
 * @class AuthController
 * @description This class contains all the methods required to handle the authentication
 * of the user
 */
class AuthController {
  /**
   * @description This method is used to register a new user
   */
  signup() {
    return function (req, res, next) {
      const user = new User(req.body);
      let token;

      try {
        user.save();
        token = createToken({ id: user._id, role: user.role });
      } catch (error) {
        return next(ApiError.badRequest(error.message));
      }

      res.status(201).json({
        message: "User created successfully",
        user,
        token,
      });
    };
  }

  /**
   * @description This method is used to login a user
   */
  signin() {
    return function (req, res, next) {
      const { user } = req;
      const token = createToken({ id: user._id, role: user.role });
      return res.status(200).json({
        token: token,
      });
    };
  }

  /**
   * @description This method is used to get the details of the logged in user
   * @returns
   */
  me() {
    return function (req, res, next) {
      const { user } = req;
      return res.status(200).json({
        user,
      });
    };
  }

  /**
   * @description This method is used to logout a user
   */
  signout() {
    return function (req, res, next) {};
  }

  /**
   * [1# FORGOT PASSWORD]
   * @description This method is used to get the ask for a password reset
   */
  forgotPassword() {
    return async function (req, res, next) {
      // 1) Get user based on POSTed email
      const user = await User.findOne({ email: req.body.email });
      // 2) Check if user exists with this email or not
      if (!user) return next(ApiError.notFound("Email is not exists!"));
      // 3) Generate the random reset token, save it to the database
      const resetCode = generateRandomCode(6);
      const resetCodeHashed = hashOnce(resetCode);
      // 4) Save the reset code and the expiration date to the user in the database
      user.passwordResetToken = resetCodeHashed;
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
      user.passwordResetVerified = false; // code first hasn't verified yet
      await user.save();

      // 5) Send it to user's email
      const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              font-family: Arial, sans-serif;
            }
            .container h1 {
              font-size: 24px;
              color: #333;
            }

            .container p {
              font-size: 16px;
              color: #666;
            }

            .container a {
              text-decoration: none;
              color: #007bff;
            }
          </style>

        </head>
        <body>
          <div class="container">
            <h1>Forgot your password?</h1>
            <p>
              Don't worry! Click the link below to reset your password.
            </p>
            
            <strong>Reset Code: ${resetCode}</strong>
            </div>
        </body>
      </html>
      `;

      try {
        await sendEmail({
          email: user.email,
          subject: "Your password reset token (valid for 10 minutes)",
          message: htmlContent,
        });
      } catch (error) {
        // 6) if something goes wrong, then reset the passwordResetToken and passwordResetExpires and passwordResetVerified to be undefined then save the user in db again.
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        user.save();
        return next(
          ApiError.inServer(
            "There was an error sending the email. Try again later!"
          )
        );
      }

      // 7) Send the response
      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    };
  }

  /**
   * [2# VERIFY RESET CODE]
   * @description This method is used to verify the reset code which is sent to the user's email
   */
  verifyResetCode() {
    return async function (req, res, next) {
      // 1) Get Reset Code from Request
      const { resetCode } = req.body;

      // 2) Get the user which has this reset code (could be issue...)
      const resetCodeHashed = hashOnce(resetCode);
      const user = await User.findOne({
        passwordResetToken: resetCodeHashed,
      });

      // 3) Check if the user exists or not
      if (!user) return next(ApiError.notFound("Invalid reset code!"));

      // 4) Check if the reset code has expired or not
      if (user.passwordResetExpires < Date.now())
        return next(ApiError.badRequest("Reset code has expired!"));

      // 5) Check if the reset code has been verified before or not
      if (user.passwordResetVerified)
        return next(
          ApiError.badRequest(
            "Reset code has been verified before! (1 time only)"
          )
        );

      // 6) If everything is okay, update the user's passwordResetVerified to be true
      user.passwordResetVerified = true;
      user.save();

      // 7) Send the response
      res.status(200).json({
        status: "success",
        message:
          "Reset code verified successfully, now you can reset your new password!",
      });
    };
  }

  /**
   * [3# RESET NEW PASSWORD]
   * @description This method is used to reset the new password (only for UN-Authenticated users)
   */
  resetPassword() {
    return async function (req, res, next) {
      // 1) Get the email, password, passwordConfirmation from the request
      const { email, password } = req.body;
      // 2) Get the user based on the email
      const user = await User.findOne({ email });
      // 3) Check if the user exists or not
      if (!user) return next(ApiError.notFound("Email is not exists!")); // we could put this validation in the validation layer rules (resetPasswordRule)
      // 4) Check if the reset code has been verified or not
      if (!user.passwordResetVerified)
        return next(
          ApiError.badRequest("Reset code has not been verified yet!")
        );

      // 5) If everything is okay, then reset the password
      user.password = password;
      user.passwordChangedAt = Date.now();
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;

      await user.save();

      // 6) Generate the token, because old token's user no longer can use it, because its expireation data < passwordChangedAt
      const token = createToken({ id: user._id, role: user.role });

      // 7) Send the response
      res.status(200).json({
        status: "success",
        message: "Password reset successfully!",
        token,
      });
    };
  }

  /**
   * [CHANGE LOGGED IN USER PASSWORD]
   * @description This method is used to change the password (only for Authenticated users)
   */
  changePassword() {
    return function (req, res, next) {};
  }

  /**
   * [1# ASK EMAIL VERIFICATION]
   * @description This method is used to ask to verify the email
   * @story User enter the email, then the system will send an email has a link to verify the email
   */
  verifyEmail() {
    return async function (req, res, next) {
      // 1) Get the email from the request
      const { email } = req.body;

      // 2) Get the user based on the email
      const user = await User.findOne({ email });

      // 3) Check if the user exists or not
      if (!user) return next(ApiError.notFound("Email is not exists!"));

      // 4) Check if the email has been verified before or not
      if (!user.email_verified_at)
        return next(ApiError.badRequest("Email has been verified before!"));

      // 5) Send the email to the user
      const token = createToken({ id: user._id });

      const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              font-family: Arial, sans-serif;
            }
            .container h1 {
              font-size: 24px;
              color: #333;
            }

            .container p {
              font-size: 16px;
              color: #666;
            }

            .container a {
              text-decoration: none;
              color: #007bff;
            }
          </style>

        </head>
        <body>
          <div class="container">
            <h1>Verify your email</h1>
            <p>
              Click the link below to verify your email.
            </p>
            <a href="http://localhost:8000/api/v1/auth/verify-email?token=${token}">Verify Email</a>
          </div>
        </body>
      `;

      try {
        await sendEmail({
          email: email,
          subject: "Verify your email",
          message: htmlContent,
        });
      } catch (error) {
        return next(
          ApiError.inServer(
            "There was an error sending the email. Try again later!"
          )
        );
      }
    };
  }

  /**
   * [2# VERIFY EMAIL]
   * @description This method is used to verify the email
   * @story User click the link which is sent to the email, then the system will verify the email
   */
  emailVerification() {
    return function (req, res, next) {
      const { token } = req.query;

      const { id } = verifyToken(token);

      try {
        const user = User.findByIdAndUpdate(id, {
          $set: { email_verified_at: Date.now() },
        });

        if (!user) return next(ApiError.notFound("User is not exists!"));
      } catch (error) {
        return next(ApiError.badRequest("Invalid token!"));
      }

      res.status(200).json({
        status: "success",
        message: "Email verified successfully!",
      });
    };
  }

  /**
   * @description This method is used to resend the email verification
   */
  resendEmailVerification() {
    return function (req, res, next) {};
  }

  /**
   * @description This method is used to update the profile of the user
   */
  updateProfile() {
    return function (req, res, next) {};
  }
}

exports.AuthController = new AuthController();
