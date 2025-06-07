import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#b3d236", // Accent color for buttons and highlights
      light: "#d7eb8a", // Light state
      dark: "#8ea62b", // Hover state
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6e861f", // Navbar color
      light: "#8ea62b",
      dark: "#5a6f1a",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f9f9f9", // Soft white background
      paper: "#ffffff", // Pure white for cards and surfaces
    },
    text: {
      primary: "#333333", // Dark gray for main text
      secondary: "#666666", // Medium gray for secondary text
    },
    success: {
      main: "#b3d236",
      light: "#d7eb8a",
      dark: "#8ea62b",
    },
    warning: {
      main: "#e6b800",
      light: "#ffcc00",
      dark: "#cc9900",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
    },
    info: {
      main: "#a5c632", // Icons and links
      light: "#d7eb8a",
      dark: "#8ea62b",
    },
    action: {
      active: "#b3d236",
      hover: "rgba(179, 210, 54, 0.08)",
      selected: "rgba(179, 210, 54, 0.16)",
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
    },
  },
  typography: {
    fontFamily:
      '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      letterSpacing: "-0.02em",
      color: "#333333",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "-0.01em",
      color: "#333333",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      color: "#333333",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "#333333",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      color: "#333333",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      color: "#333333",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
    subtitle1: {
      fontSize: "1.1rem",
      fontWeight: 500,
      color: "#666666",
    },
    subtitle2: {
      fontSize: "0.9rem",
      fontWeight: 500,
      color: "#666666",
    },
    link: {
      color: "#8ea62b",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#6e861f",
          color: "#ffffff",
          height: "64px", // Reduced height
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Subtle shadow
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 20px",
          fontWeight: 600,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        contained: {
          boxShadow: "0 2px 4px rgba(179, 210, 54, 0.2)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(179, 210, 54, 0.3)",
            transform: "translateY(-1px)",
          },
        },
        containedPrimary: {
          background: "#b3d236",
          "&:hover": {
            background: "#8ea62b",
          },
        },
        containedSecondary: {
          background: "#6e861f",
          "&:hover": {
            background: "#5a6f1a",
          },
        },
        containedActions: {
          background: "#4CAF50",
          "&:hover": {
            background: "#388E3C",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
            backgroundColor: "rgba(179, 210, 54, 0.04)",
          },
        },
        text: {
          color: "#666666",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#8ea62b",
          textDecoration: "none",
          "&:hover": {
            color: "#6e861f",
            textDecoration: "underline",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderLeft: "4px solid #b3d236",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        },
        elevation1: {
          backgroundColor: "#ffffff",
          color: "#333333",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          "&.MuiChip-filled": {
            backgroundColor: "#f5f5f5",
          },
          "&.MuiChip-outlined": {
            borderColor: "#b3d236",
            color: "#666666",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e0e0e0",
          padding: "16px",
        },
        head: {
          fontWeight: 600,
          backgroundColor: "#f5f5f5",
          color: "#333333",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
        title: {
          backgroundColor: "#ffffff",
          color: "#333333",
          padding: "16px 24px",
          borderBottom: "1px solid #e0e0e0",
          "& .MuiTypography-root": {
            color: "#333333",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#b3d236",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#b3d236",
            },
          },
          "& .MuiInputLabel-root": {
            "&.Mui-focused": {
              color: "#b3d236",
            },
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: "#6e861f",
          color: "#ffffff",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#6e861f",
          color: "#ffffff",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#666666",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#666666",
          "&.Mui-checked": {
            color: "#b3d236",
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: "#666666",
          "&.Mui-checked": {
            color: "#b3d236",
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          "& .MuiSwitch-switchBase.Mui-checked": {
            color: "#b3d236",
            "& + .MuiSwitch-track": {
              backgroundColor: "#b3d236",
            },
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#b3d236",
        },
        thumb: {
          "&:hover, &.Mui-focusVisible": {
            boxShadow: "0 0 0 8px rgba(179, 210, 54, 0.16)",
          },
        },
      },
    },
  },
});

export default theme;
