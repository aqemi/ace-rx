'use strict';

import { createTheme, alpha } from '@mui/material/styles';
import { grey, deepOrange, common } from '@mui/material/colors';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
    disableCssColorScheme: true // fix Brave forcing dark colors when light mode selected
  },
  components: {
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--mui-palette-primary-main)',
          color: 'var(--mui-palette-primary-contrastText)'
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '20px 24px !important'
        }
      }
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          whiteSpace: 'pre-line'
        }
      }
    },
    MuiIconButton: {
      variants: [
        {
          props: { variant: 'overlay' },
          style: {
            borderRadius: '50%',
            backgroundColor: 'var(--mui-palette-overlay-bgcolor)',
            color: 'var(--mui-palette-overlay-color)',
            '&:hover': {
              backgroundColor: 'var(--mui-palette-overlay-hover)'
            },
            '&.Mui-disabled': {
              backgroundColor: 'var(--mui-palette-overlay-bgcolor)'
            },
            '& .MuiIconButton-loadingIndicator': {
              color: 'var(--mui-palette-overlay-color)'
            }
          }
        }
      ]
    }
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: deepOrange[500]
        },
        secondary: {
          main: deepOrange[200]
        },
        text: {
          primary: alpha(common.white, 0.87),
          secondary: alpha(common.white, 0.54)
        },
        overlay: {
          bgcolor: alpha(common.black, 0.54),
          hover: alpha(common.black, 0.75),
          color: common.white
        }
      }
    },
    light: {
      palette: {
        primary: {
          main: grey[900]
        },
        overlay: {
          bgcolor: alpha(common.black, 0.54),
          hover: alpha(common.black, 0.75),
          color: common.white
        }
      }
    }
  }
});

export default theme;
