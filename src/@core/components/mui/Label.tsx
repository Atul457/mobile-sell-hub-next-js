import { InputLabel } from '@mui/material'
import { styled } from '@mui/system'

const LabelStyled = styled(InputLabel)(({ theme }) => ({
  maxWidth: '100%',
  [theme.breakpoints.down('lg')]: {
    fontSize: 12
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: 13
  },
  marginBottom: theme.spacing(1),
  left: theme.spacing(3),
  top: theme.spacing(1.5),
  color: 'var(--mui-palette-customColors-textGray40)',

  '&:not(.Mui-error).MuiFormLabel-colorPrimary.Mui-focused': {
    color: 'var(--mui-palette-primary-main) !important'
  },

  '&.Mui-disabled': {
    color: 'var(--mui-palette-text-disabled)'
  },

  '&.Mui-error': {
    color: 'var(--mui-palette-customColors-textGray40)'
  }
}))

export default LabelStyled
