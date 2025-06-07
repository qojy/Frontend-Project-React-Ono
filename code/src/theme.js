import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#b3d236", // Fresh lime green
      light: "#c4e04a", // Lighter shade for hover states
      dark: "#9cbc2e", // Darker shade for active states
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4a5c23", // Dark olive green
      light: "#5d722c",
      dark: "#3a481b",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8faf5", // Very light green
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e0f", // Dark green for text
      secondary: "#4a5c23", // Olive green for secondary text
    },
    success: {
      main: "#b3d236",
      light: "#c4e04a",
      dark: "#9cbc2e",
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
      main: "#4a5c23",
      light: "#5d722c",
      dark: "#3a481b",
    },
  },
  typography: {
    fontFamily:
      '"Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      letterSpacing: "-0.02em",
      color: "#2c3e0f",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "-0.01em",
      color: "#2c3e0f",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      color: "#2c3e0f",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "#2c3e0f",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      color: "#2c3e0f",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      color: "#2c3e0f",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
    subtitle1: {
      fontSize: "1.1rem",
      fontWeight: 500,
      color: "#4a5c23",
    },
    subtitle2: {
      fontSize: "0.9rem",
      fontWeight: 500,
      color: "#4a5c23",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
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
            background: "#9cbc2e",
          },
        },
        containedSecondary: {
          background: "#4a5c23",
          "&:hover": {
            background: "#3a481b",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
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
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          "&.MuiChip-filled": {
            backgroundColor: "#f8faf5",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e8f0e0",
          padding: "16px",
        },
        head: {
          fontWeight: 600,
          backgroundColor: "#f8faf5",
          color: "#2c3e0f",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: "background-color 0.2s ease",
          "&:hover": {
            backgroundColor: "#f8faf5",
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
          },
        },
      },
    },
  },
});

export default theme;
