import { Button, Typography } from '@mui/material'
import clsx from 'clsx'
import { ReactNode } from 'react'

type IGoBackProps = {
    variant?: "primary"
    show?: boolean
    isAuthenticatedRoute?: boolean
    dontHideIfGoBackNotProvided?: boolean
    onGoBackButtonClick?: Function | null
    showInWeb?: boolean
    className?: string
    title?: string | null
    postFix?: ReactNode
    step?: string
}

const GoBack = (props: IGoBackProps) => {
    return (
        <div
            className={clsx(
                'flex md:mt-0 items-center relative w-full',
                !props.isAuthenticatedRoute && 'my-4',
                // "md:left--2",
                !props.onGoBackButtonClick && props.dontHideIfGoBackNotProvided !== true && "hidden",
                props.showInWeb === false && 'lg:hidden',
                props.className
            )}
        >
            <Button
                onClick={e => props.onGoBackButtonClick?.(e)}
                variant='outlined'
                sx={{
                    color: props.variant === "primary" ? 'white' : 'primary.main',
                    visibility: props.show ? 'visible' : 'hidden',
                    minWidth: 'unset',
                    ...((!!props.title || !!props.postFix) && {
                        border: 'none !important',
                        position: 'absolute',
                        background: 'transparent'
                    }),
                    padding: {
                        xs: props.isAuthenticatedRoute ? 0 : '6px 7px'
                    },
                    width: 'fit-content',
                    borderRadius: {
                        xs: '12px !important',
                        md: '8px !important'
                    },
                    borderColor: '#F8F8F8'
                }}
            >
                <i className='tabler-arrow-left' />
            </Button>
            {props.title ? (
                <Typography
                    variant='h3'
                    component='h3'
                    fontWeight={600}
                    className='ellipsis'
                    sx={{
                        color: props.variant === "primary" ? 'white' : 'primary.main',
                        fontSize: theme => theme.typography.h3.fontSize,
                        margin: {
                            xs: '0 auto',
                            lg: props?.step !== 'packagesss' ? '0 auto' : '0 10px',
                        },
                        paddingInline: '30px'
                    }}
                >
                    {props.title}
                </Typography>
            ) : null}
            {props.postFix}
        </div>
    )
}

export default GoBack
