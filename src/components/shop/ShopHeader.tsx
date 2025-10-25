"use client";

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const pages = ["How it Works", "FAQs", "Contact"];

const ShopHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Top Bar */}
      <Box sx={{ backgroundColor: "#111", color: "#fff", py: 1, borderBottom:"1px solid #fff" }}>
        <Container sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography style={{color:"#fff", fontSize:"13px"}}>
            <strong>Welcome to SellYourMac NZ!</strong> <a href="#" style={{ color: "#fff", textDecoration: "underline" }}>Get an Instant Quote »</a>
          </Typography>
        </Container>
      </Box>

      {/* Main Header */}
      <AppBar position="static" sx={{ backgroundColor: "#000" }}>
        <Container>
          <Toolbar disableGutters>
            {/* Logo */}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              73INC
            </Typography>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              {pages.map((page) => (
                <Button key={page} color="inherit">{page}</Button>
              ))}
              <Button variant="contained" color="secondary" sx={{ ml: 2 }} href="/shop-register">Register</Button>
            </Box>

            {/* Mobile Menu */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton color="inherit" onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <IconButton onClick={() => setOpen(false)} sx={{ float: "right" }}>
            <CloseIcon />
          </IconButton>
          <List sx={{ mt: 4 }}>
            {pages.map((page) => (
              <ListItem key={page} disablePadding>
                <ListItemButton>{page}</ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton>Register</ListItemButton>
            </ListItem>

          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ShopHeader;
