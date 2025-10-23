// React Imports
import type { ForwardRefRenderFunction, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Style Imports
import styles from '../../styles/styles.module.css'

// Styled Component Imports
import StyledHorizontalSubMenuContent from '../../styles/horizontal/StyledHorizontalSubMenuContent'
// Type Imports
import type { ChildrenType, RootStylesType } from '../../types'

export type SubMenuContentProps = HTMLAttributes<HTMLDivElement> &
  RootStylesType &
  Partial<ChildrenType> & {
    open?: boolean
    browserScroll?: boolean
    firstLevel?: boolean
    top?: number
  }

const SubMenuContent: ForwardRefRenderFunction<HTMLDivElement, SubMenuContentProps> = (props, ref) => {
  // Props
  const { children, open, firstLevel, top, browserScroll, ...rest } = props

  return (
    <StyledHorizontalSubMenuContent
      ref={ref}
      firstLevel={firstLevel}
      open={open}
      top={top}
      browserScroll={browserScroll}
      {...rest}
    >
      {/* If browserScroll is false render PerfectScrollbar */}
      {!browserScroll ? (
        <PerfectScrollbar
          options={{ wheelPropagation: false, suppressScrollX: true }}
          style={{ maxBlockSize: `calc((var(--vh, 1vh) * 100) - ${top}px)` }}
        >
          <ul className={styles.ul}>{children}</ul>
        </PerfectScrollbar>
      ) : (
        <ul className={styles.ul}>{children}</ul>
      )}
    </StyledHorizontalSubMenuContent>
  )
}

export default forwardRef(SubMenuContent)
