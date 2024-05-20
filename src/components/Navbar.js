import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(user);

  useEffect(() => {
    setLoggedInUser(user);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar position="sticky" sx={{ background: "grey" }}>
      <Toolbar>
        {loggedInUser && (
          <>
            <Typography variant="h5" sx={{ color: "white" }}>
              All Post
            </Typography>

            <Box display="flex" marginLeft="auto">
              <Tabs>
                <Tab
                  component={Link}
                  to="/post"
                  label="Post"
                  sx={{ color: "white" }}
                />
              </Tabs>

              <Tabs>
                <Tab
                  component={Link}
                  to="/user"
                  label="User"
                  sx={{ color: "white" }}
                />
              </Tabs>
            </Box>
          </>
        )}
        <Box display="flex" marginLeft="auto">
          {!loggedInUser && (
            <>
              <Button
                component={Link}
                to="/"
                variant="contained"
                sx={{ margin: 1, borderRadius: 10 }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                sx={{ margin: 1, borderRadius: 10 }}
              >
                SignUp
              </Button>
            </>
          )}
        </Box>
        {loggedInUser && (
          <Button
            variant="contained"
            size="small"
            sx={{ marginX: 1, borderRadius: 10 }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
