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
    logout(!loggedInUser);
    navigate("/");
  };

  return (
    <AppBar position="sticky" sx={{ background: "black" }}>
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
                  to="/adminPost"
                  label="AdminPost"
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
                variant="outlined"
                sx={{ margin: 1, borderRadius: 10, color: "cyan" }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="outlined"
                sx={{ margin: 1, borderRadius: 10, color: "cyan" }}
              >
                SignUp
              </Button>
            </>
          )}
        </Box>
        {loggedInUser && (
          <Button
            variant="outlined"
            size="small"
            sx={{ marginX: 1, borderRadius: 10, color: "cyan" }}
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
