'use client';

import CommonChip from '@/components/common/CommonChip';
// Component Imports
import CommonEntityContainer from '@/components/common/CommonEntityContainer';
import CommonKeyValueField, { ICommonKeyValueField } from '@/components/common/CommonKeyValueField';

// Utils & Models
import { IShopRegister } from '@/models/shop-register.model';
import { utils } from '@/utils/utils';

type IShopDetailsProps = {
    shop: IShopRegister;
};

const ShopDetails = ({ shop }: IShopDetailsProps) => {
    const keyProps: Partial<ICommonKeyValueField> = {
        keyProps: {
            sx: {
                minWidth: '40%'
            }
        },
        valueProps: {
            sx: {
                wordBreak: 'break-word',
                maxWidth: '70%'
            }
        }
    };

    return (
        <div className='flex flex-col space-y-6'>
            <CommonEntityContainer
                title='Shop Details'
                contentProps={{
                    sx: { display: 'flex', flexDirection: 'column', rowGap: 2 }
                }}
            >
                <CommonKeyValueField key_='Store Name' {...keyProps} value={shop.storeName} />
                <CommonKeyValueField key_='Company Name' {...keyProps} value={shop.business.companyName} />
                <CommonKeyValueField key_='Company Number' {...keyProps} value={shop.business.companyNumber} />
                <CommonKeyValueField key_='Business Email' {...keyProps} value={shop.business.businessEmail} />
                <CommonKeyValueField key_='Business Phone' {...keyProps} value={shop.business.businessPhone} />
                <CommonKeyValueField
                    key_='Address'
                    {...keyProps}
                    value={`${shop.business.addressStreet}, ${shop.business.addressSuburb}, ${shop.business.addressCity}, ${shop.business.addressPostcode}`}
                />
            </CommonEntityContainer>

            <CommonEntityContainer
                title='Subscription Details'
                contentProps={{
                    sx: { display: 'flex', flexDirection: 'column', rowGap: 2 }
                }}
            >
                <CommonKeyValueField key_='Plan' {...keyProps} value={shop.subscription.plan} />
                <CommonKeyValueField key_='Payment Method' {...keyProps} value={shop.subscription.paymentMethod} />
                <CommonKeyValueField key_='Billing Name' {...keyProps} value={shop.subscription.billingName} />
                <CommonKeyValueField key_='Billing Email' {...keyProps} value={shop.subscription.billingEmail} />
                <CommonKeyValueField key_='Billing Address' {...keyProps} value={shop.subscription.billingAddress} />
                <CommonKeyValueField
                    key_='Status'
                    {...keyProps}
                    value={
                        <CommonChip
                            variant='primary'
                            label={utils.string.capitalizeFirstLetter(shop.subscription.plan)}
                            sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
                        />
                    }
                />
            </CommonEntityContainer>

            <CommonEntityContainer
                title='Admin Details'
                contentProps={{
                    sx: { display: 'flex', flexDirection: 'column', rowGap: 4 }
                }}
            >
                {/* ADMIN INFO */}
                <CommonKeyValueField key_='Role' {...keyProps} value={shop.admin?.role} />
            </CommonEntityContainer>

            <CommonEntityContainer
                title='Directors'
                contentProps={{
                    sx: { display: 'flex', flexDirection: 'column', rowGap: 4 }
                }}
            >
                {/* DIRECTORS INFO */}
                <div className='flex flex-col gap-2'>
                    {shop.directors?.length > 0 ? (
                        shop.directors.map((director, index) => (
                            <CommonKeyValueField
                                key={`director-${index}`}
                                key_={`Director ${index + 1}`}
                                {...keyProps}
                                value={`${director.firstName} ${director.middleName || ''} ${director.lastName}${
                                    director.email ? ` (${director.email})` : ''
                                }`}
                            />
                        ))
                    ) : (
                        <CommonKeyValueField key_='Directors not added' withoutValue={true} />
                    )}
                </div>
            </CommonEntityContainer>
        </div>
    );
};

export default ShopDetails;
