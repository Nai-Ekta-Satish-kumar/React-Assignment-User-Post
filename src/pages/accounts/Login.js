import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import CryptoJS from "crypto-js";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import {
  Email_REQUIRED,
  INVALID_CREDENTIALS,
  INVALID_EMAIL,
  INVALID_USER_EMAIL,
  INVALID_PASSWORD,
  LOGIN_SUCCESS,
  PASSWORD_MAXLENGTH,
  PASSWORD_MINLENGTH,
  PASSWORD_REQUIRED,
} from "../../constants/constants.js";
import { Box, Button, TextField, Typography } from "@mui/material";
import { AuthContext } from "../../context/authContext.js";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm();
  const { login } = useContext(AuthContext);
  const [loginSuccess, setLoginSuccess] = useState("false");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const { email, password } = data;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInUser = users.find((user) => user.email === email);
    if (loggedInUser) {
      const decryptedPassword = CryptoJS.AES.decrypt(
        loggedInUser.password,
        "secret-key"
      ).toString(CryptoJS.enc.Utf8);
      if (decryptedPassword === password) {
        login(loggedInUser);
        setLoginSuccess(true, "true");
        navigate("/post");
        toast.success(LOGIN_SUCCESS);
        return;
      }
    }
    let errorMessage = "";
    const userWithEmail = users.find((user) => user.email === email);
    const userWithPassword = users.find((user) => {
      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        "secret-key"
      ).toString(CryptoJS.enc.Utf8);
      return decryptedPassword === password;
    });
    if (!userWithEmail && !userWithPassword) {
      errorMessage = INVALID_CREDENTIALS;
      toast.error(INVALID_CREDENTIALS);
    } else if (!userWithEmail) {
      errorMessage = INVALID_USER_EMAIL;
      toast.error(INVALID_USER_EMAIL);
    } else if (!userWithPassword) {
      errorMessage = INVALID_PASSWORD;
      toast.error(INVALID_PASSWORD);
    }
    setErrorMessage(errorMessage);
  };
  return (
    <div>
      <div className="form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            maxWidth={400}
            display="flex"
            flexDirection={"column"}
            alignItems="center"
            justifyContent={"center"}
            boxShadow="10px 10px 20px #ccc"
            padding={3}
            margin="auto"
            marginTop={5}
            borderRadius={5}
          >
            <Typography variant="h2" padding={3} textAlign={"center"}>
              Login
            </Typography>
            <TextField
              name="email"
              type="email"
              placeholder="Email"
              margin="normal"
              {...register("email", {
                required: Email_REQUIRED,
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: INVALID_EMAIL,
                },
              })}
              error={!!formErrors.email}
              helperText={formErrors.email?.message}
            />
            <TextField
              name="password"
              type="password"
              placeholder="Password"
              margin="normal"
              {...register("password", {
                required: PASSWORD_REQUIRED,
                minLength: {
                  value: 4,
                  message: PASSWORD_MINLENGTH,
                },
                maxLength: {
                  value: 20,
                  message: PASSWORD_MAXLENGTH,
                },
              })}
              error={!!formErrors.password}
              helperText={formErrors.password?.message}
            />

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <Button
              type="submit"
              variant="outlined"
              sx={{
                borderRadius: 3,
                marginTop: 2,
                marginBottom: 2,
                color: "black",
              }}
            >
              Submit
            </Button>

            <Link to="/signup">Create account</Link>
          </Box>
        </form>
      </div>
    </div>
  );
};

export default Login;
