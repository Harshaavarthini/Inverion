import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const isAdmin = localStorage.getItem("isAdmin");

  return (
    <AppBar position="static" sx={{ backgroundColor: "#005580" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, textAlign: "left" }}
        >
          {isAdmin === "true"
            ? `ADMIN ${localStorage.getItem("username")} `
            : `AGENT ${localStorage.getItem("username")} `}
        </Typography>

        {/* <React.Fragment>
          <Button
            sx={{ margin: "1rem" }}
            color="inherit"
            component={Link}
            to={
              isAdmin === "true"
                ? "/admin/appointments"
                : `/user/appointments/${localStorage.getItem("username")}`
            }
          >
            Appointments
          </Button>
          <Button
            sx={{ margin: "1rem" }}
            color="inherit"
            component={Link}
            to={isAdmin === "true" ? "/admin/centres" : "/user/centers"}
          >
            Vaccine Centers
          </Button>
        </React.Fragment> */}

        <Button sx={{ margin: "1rem" }} color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
