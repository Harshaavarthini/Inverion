import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../App.css";

export const RegisterForm = () => {
  const [notification, setNotification] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await axios.post(
        `${import.meta.env.APP_API_BASE_URL}/api/v1/auth/register`,
        data
      );

      const token = response.data.token;
      const info = jwtDecode(localStorage.getItem("token"));
      if (token) {
        localStorage.setItem("token", token);
        if (info.role === "USER") {
          navigate("/agent");
        } else {
          navigate("/admin");
        }
      } else {
        console.error("Token not found in response.");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      setIsError(true);
    }
  };
  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url("https://www.chlsoftech.com/Content/product-eZ/images/inventory-banner.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        padding: 0,
      }}
    >
      <Box
        className="formClass"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: 400,
            maxWidth: 400,
            backgroundColor: "peach",
          }}
        >
          {notification && (
            <div className="notification" style={{ color: "green" }}>
              <p>{notification}</p>
            </div>
          )}
          <Typography variant="h4" gutterBottom>
            SignUp
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ marginBottom: 2 }}>
              <TextField
                label="Name"
                variant="outlined"
                size="medium"
                fullWidth
                {...register("name", {
                  required: "Name is required",
                  minLength: 6,
                })}
              />
              {errors.name?.type === "required" && (
                <p style={{ color: "red" }}>*{errors.name.message}</p>
              )}
              {errors.name?.type === "minLength" && (
                <p style={{ color: "red" }}>
                  *Username ashould be atleast 6 letters
                </p>
              )}
            </Box>
            <Box sx={{ marginBottom: 2 }}>
              <TextField
                label="email"
                variant="outlined"
                size="medium"
                fullWidth
                {...register("email", {
                  required: "email is required",
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: "Email is not valid",
                  },
                })}
              />
              {errors.email?.type === "required" && (
                <p style={{ color: "red" }}>*{errors.email.message}</p>
              )}
              {errors.email?.type === "pattern" && (
                <p style={{ color: "red" }}>*{errors.email.message}</p>
              )}
            </Box>
            <Box sx={{ marginBottom: 2 }}>
              <TextField
                type="password"
                label="Password"
                variant="outlined"
                size="medium"
                fullWidth
                {...register("password", {
                  required: "Password is required",
                  validate: {
                    checkLength: (value) => value.length >= 6,
                    matchPattern: (value) =>
                      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*])/.test(
                        value
                      ),
                  },
                })}
              />
              {errors.password?.type === "required" && (
                <p style={{ color: "red" }}>Password is required.</p>
              )}
              {errors.password?.type === "checkLength" && (
                <p style={{ color: "red" }}>
                  Password should be at-least 6 characters.
                </p>
              )}
              {errors.password?.type === "matchPattern" && (
                <p style={{ color: "red" }}>
                  Password should contain at least one uppercase letter,
                  lowercase letter, digit, and special symbol.
                </p>
              )}
            </Box>
            <Button variant="contained" size="large" fullWidth type="submit">
              Register
            </Button>
          </form>
          {isError && (
            <p style={{ color: "red" }}>
              The email or password provided are already registered!
            </p>
          )}
          <p>
            Already an user? <Link to="/login">Click here</Link>
          </p>
        </Paper>
      </Box>
    </div>
  );
};
