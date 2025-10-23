import { ClickAwayListener, styled, Tooltip, tooltipClasses, TooltipProps } from '@mui/material'
import { cloneElement, ReactElement, ReactNode, useState } from 'react'

type ICommonTooltip = {
  children: ReactNode
  description: string
  tooltipVariant?: 'click' | 'hover'
  tooltipProps?: Omit<TooltipProps, 'children' | 'title'>
}

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 300
  }
})

const CommonTooltip = (props: ICommonTooltip) => {
  const [open, setOpen] = useState(false)

  const tooltipVariant = props.tooltipVariant ?? 'hover'

  const handleTooltipClose = () => {
    setOpen(false)
  }

  const handleTooltipOpen = () => {
    setOpen(true)
  }

  const childWithClickHandler = (child: ReactElement) => {
    if (tooltipVariant === 'hover') {
      return child
    }
    return cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        if (child.props.onClick) {
          child.props.onClick(e)
        }
        if (open) {
          handleTooltipClose()
        } else {
          handleTooltipOpen()
        }
      }
    })
  }

  const toolTip = (
    <CustomWidthTooltip
      {...props.tooltipProps}
      PopperProps={{
        disablePortal: true
      }}
      {...(tooltipVariant === 'click' && {
        onClose: handleTooltipClose,
        open,
        disableFocusListener: true,
        disableHoverListener: true,
        disableTouchListener: true
      })}
      title={props.description}
    >
      {childWithClickHandler(props.children as ReactElement)}
    </CustomWidthTooltip>
  )

  if (tooltipVariant === 'hover') {
    return toolTip
  }

  return <ClickAwayListener onClickAway={handleTooltipClose}>{toolTip}</ClickAwayListener>
}

export default CommonTooltip
