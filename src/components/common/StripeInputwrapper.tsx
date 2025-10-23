import React, { forwardRef } from 'react';

type StripeInputWrapperProps = {
    component: React.ComponentType<any>;
} & any;

const StripeInputWrapper = forwardRef<any, StripeInputWrapperProps>(function StripeInputWrapper(
    { component: Component, options, ...rest },
    ref
) {
    return (
        <Component
            ref={ref}
            options={options}
            {...rest}
        />
    );
});

export default StripeInputWrapper;
