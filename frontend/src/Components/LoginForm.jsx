// import { Box, Button, Paper, TextField, Typography } from "@mui/material";
// import axios from "axios";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";

// export const LoginForm = () => {
//   const [notification, setNotification] = useState("");

//   const {
//     reset,
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     console.log(data);
//     axios
//       .post("http://localhost:8080/agent/login", data, {
//         headers: { "Content-Type": "application/json" },
//       })
//       .then((response) => {
//         console.log(response.data);
//         setNotification("LOGIN SUCCESSFULL");
//         reset();
//       })
//       .catch((error) => {
//         console.log(error.data);
//       });
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//       }}
//     >
//       <Paper elevation={3} sx={{ padding: 4, maxWidth: 400 }}>
//         {notification && (
//           <div className="notification" style={{ color: "green" }}>
//             <p>{notification}</p>
//           </div>
//         )}
//         <Typography variant="h4" gutterBottom>
//           LOGIN
//         </Typography>

//         <form onSubmit={handleSubmit(onSubmit)}>
//           <Box sx={{ marginBottom: 2 }}>
//             <TextField
//               label="Name"
//               variant="outlined"
//               size="medium"
//               fullWidth
//               {...register("name", {
//                 required: "Name is required",
//               })}
//             />
//             {errors.name && (
//               <p style={{ color: "red" }}>{errors.name.message}</p>
//             )}
//           </Box>
//           <Box sx={{ marginBottom: 2 }}>
//             <TextField
//               type="password"
//               label="Password"
//               variant="outlined"
//               size="medium"
//               fullWidth
//               {...register("password", {
//                 required: "Password is required",
//               })}
//             />
//             {errors.password && (
//               <p style={{ color: "red" }}>{errors.password.message}</p>
//             )}
//           </Box>
//           <Button variant="contained" size="large" fullWidth type="submit">
//             Login
//           </Button>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const LoginForm = () => {
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
      const response = await axios.post(
        `${import.meta.env.APP_API_BASE_URL}/api/v1/auth/authenticate`,
        data
      );

      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
        const info = jwtDecode(localStorage.getItem("token"));
        localStorage.setItem("username", info.username);
        //console.log(info);
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
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: 500, height: 350 }}>
          {notification && (
            <div className="notification" style={{ color: "green" }}>
              <p>{notification}</p>
            </div>
          )}
          <Typography variant="h4" gutterBottom>
            LOGIN
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
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
              {/* {errors.email && <p className="errorMsg">{errors.email.message}</p>} */}
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
              Login
            </Button>
          </form>
          {isError && (
            <p style={{ color: "red" }}>
              The email or password provided are incorrect!
            </p>
          )}
          <p>
            New user? <Link to="/register">Register here</Link>
          </p>
        </Paper>
      </Box>
    </div>
  );
};

export default LoginForm;
