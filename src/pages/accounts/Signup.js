import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { Box, Button, TextField, Typography } from "@mui/material";
import { AuthContext } from "../../context/authContext.js";
import {
  Email_REQUIRED,
  INVALID_EMAIL,
  NAME_VALIDATION,
  PASSWORD_MAXLENGTH,
  PASSWORD_MINLENGTH,
  PASSWORD_REQUIRED,
  SIGNUP_SUCCESS,
  PHONE_REQUIRED,
  PHONE_VALIDATION,
  LNAME_REQUIRED,
  FNAME_REQUIRED,
  CONFIRM_PASSWORD_ERROR,
  EMAIL_EXIST,
} from "../../constants/constants.js";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const onSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.some((user) => user.email === data.email);
    if (emailExists) {
      toast.error("Email already registered");
      return;
    }

    const encryptedPassword = CryptoJS.AES.encrypt(
      data.password,
      "secret-key"
    ).toString();
    data.password = encryptedPassword;
    users.push(data);
    signup(data);
    toast.success(SIGNUP_SUCCESS);
    navigate("/");
  };

  const password = watch("password");

  const checkEmailExists = async (email) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.some((user) => user.email === email) ? EMAIL_EXIST : true;
  };

  return (
    <div className="form">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            maxWidth={400}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            boxShadow="10px 10px 20px #ccd"
            padding={1}
            margin="auto"
            marginTop={5}
            borderRadius={5}
          >
            <Typography variant="h4" padding={2} textAlign="center">
              Signup
            </Typography>

            <TextField
              name="fname"
              type="name"
              placeholder="First Name"
              margin="normal"
              {...register("name", {
                required: FNAME_REQUIRED,
                validate: {
                  noBlankSpace: (value) =>
                    value.trim() !== "" || NAME_VALIDATION,
                },
              })}
              error={!!formErrors.name}
              helperText={formErrors.name?.message}
            />
            <TextField
              name="lname"
              type="name"
              placeholder="Last Name"
              margin="normal"
              {...register("lname", {
                required: LNAME_REQUIRED,
                validate: {
                  noBlankSpace: (value) =>
                    value.trim() !== "" || NAME_VALIDATION,
                },
              })}
              error={!!formErrors.lname}
              helperText={formErrors.lname?.message}
            />
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
                validate: checkEmailExists,
              })}
              error={!!formErrors.email}
              helperText={formErrors.email?.message}
            />
            <TextField
              name="phone"
              type="phone"
              placeholder="Phone Number"
              margin="normal"
              {...register("phone", {
                required: PHONE_REQUIRED,
                pattern: {
                  value: /^[0-9]+$/,
                  message: PHONE_VALIDATION,
                },
              })}
              error={!!formErrors.phone}
              helperText={formErrors.phone?.message}
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
            <TextField
              name="cpassword"
              type="password"
              placeholder="Confirm Password"
              margin="normal"
              {...register("cpassword", {
                required: PASSWORD_REQUIRED,
                minLength: {
                  value: 4,
                  message: PASSWORD_MINLENGTH,
                },
                maxLength: {
                  value: 20,
                  message: PASSWORD_MAXLENGTH,
                },
                validate: (value) =>
                  value === password || CONFIRM_PASSWORD_ERROR,
              })}
              error={!!formErrors.cpassword}
              helperText={formErrors.cpassword?.message}
            />
            <Button type="submit" variant="outlined" margin="normal">
              Submit
            </Button>
          </Box>
        </form>
      </div>
    </div>
  );
};

export default Signup;
