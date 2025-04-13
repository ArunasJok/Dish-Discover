// This file defines the theme for the Material-UI components used in the application.
// It customizes the color palette, typography, and other styles to create a consistent look and feel across the app.
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#333333', // Dark gray for headers, buttons, etc.
    },
    secondary: {
      main: '#F56476', // Accent color for highlights or secondary buttons
    },
    background: {
      default: '#FFFFFF', // Overall page background
      paper: '#FFFFFF',   // Surfaces like cards, modals
    },
    text: {
      primary: '#333333', // Main text color
      secondary: '#555555', // Lighter text for hints or subheadings
    },
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners for buttons, cards, etc.
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

export default theme;
