import { BoxProps, Card, CardContent, CardContentProps, CardHeader, CardHeaderProps, Typography } from '@mui/material';
import React, { PropsWithChildren } from 'react';

import { ICommonChipProps } from './CommonChip';

type ICommonEntityContainerProps = {
    containerProps?: BoxProps;
    chip?: {
        label: string;
        variant: ICommonChipProps['variant'];
    };
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    contentProps?: CardContentProps;
    titleTypographyProps?: CardHeaderProps['titleTypographyProps'];
} & PropsWithChildren;

const CommonEntityContainer = (props: ICommonEntityContainerProps) => {
    const { title, description } = props;

    return (
        <Card>
            <CardHeader
                title={
                    <>
                        {title}
                        {description && (
                            <Typography variant='subtitle1' color='text.secondary' sx={{ marginTop: 1 }}>
                                {description}
                            </Typography>
                        )}
                    </>
                }
                titleTypographyProps={{
                    ...props.titleTypographyProps,
                    ...(typeof title !== 'string' && {
                        display: 'flex',
                        flexDirection: 'column',
                        alignContent: 'flex-start',
                        flexWrap: 'nowrap',
                        rowGap: 0.5
                    })
                }}
            />

            <CardContent {...props.contentProps}>{props.children}</CardContent>
        </Card>
    );
};

export default CommonEntityContainer;
