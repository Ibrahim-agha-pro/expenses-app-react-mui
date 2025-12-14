import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Avatar, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Create, Logout, Settings } from "@mui/icons-material";
import Person2Icon from "@mui/icons-material/Person2";
import { Outlet, Link as RouterLink, useLocation } from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useContext, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { UserContext } from "../contexts/userContext";

const drawerWidth = 240;

function MyAppAndDrewer({ myMode, setMyMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const currentLocation = useLocation();

  const { currentUser } = useContext(UserContext);

  const userName = currentUser?.userName || "";
  const userImage = currentUser?.userImage || "";

  const theme = useTheme();

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully ✅");
    } catch (error) {
      console.error("Error logging out ❌", error);
    }
  };

  const drewerList = [
    { text: "Home", icon: <HomeIcon />, path: "/home" },
    { text: "Create", icon: <Create />, path: "/create" },
    { text: "Profile", icon: <Person2Icon />, path: "/profile" },
    // { text: "Settings", icon: <Settings />, path: "/settings" },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
        <IconButton
          onClick={() => {
            setMyMode((prev) => (prev === "light" ? "dark" : "light"));
          }}
        >
          {myMode === "light" ? (
            <DarkModeIcon color="inherit" />
          ) : (
            <LightModeIcon />
          )}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {drewerList.map((e, i) => {
          return (
            <ListItem
              key={i}
              disablePadding
              sx={{
                bgcolor:
                  currentLocation.pathname === e.path
                    ? theme.palette.grey.main
                    : null,
              }}
            >
              <ListItemButton component={RouterLink} to={e.path}>
                <ListItemIcon>{e.icon}</ListItemIcon>
                <ListItemText primary={e.text} />
              </ListItemButton>
            </ListItem>
          );
        })}

        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Link
            color="inherit"
            underline="none"
            sx={{ flexGrow: 1 }}
            variant="inherit"
          >
            My expenses
          </Link>

          <Typography variant="body1" color="inherit" sx={{ mr: "10px" }}>
            {userName}
          </Typography>

          <Avatar variant="circular" src={userImage}></Avatar>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
        }}
      >
        <Box
          sx={{
            minHeight: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MyAppAndDrewer;
