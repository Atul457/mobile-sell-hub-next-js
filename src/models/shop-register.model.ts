import { Document, Model, model, models, Schema, Types } from 'mongoose';

export interface IShopRegister extends Document {
    storeName: string;
    slug: string;
    userId: Types.ObjectId;

    business: {
        companyName: string;
        companyNumber?: string;
        addressStreet: string;
        addressSuburb: string;
        addressCity: string;
        addressPostcode: string;
        businessEmail: string;
        businessPhone: string;
    };

    admin: {
        role?: string;
    };

    directors: {
        firstName: string;
        middleName?: string;
        lastName: string;
        email?: string;
        mobile?: string;
    }[];

    subscription: {
        plan: string;
        paymentMethod: string;
        billingName: string;
        billingEmail: string;
        billingAddress?: string;
        termsAccepted: boolean;
    };

    branding: {
        primaryColor: string;
        secondaryColor: string;
        backgroundColor: string;
        primaryTextColor: string;
        secondaryTextColor: string;
        thankYouMessage?: string;
        headerText?: string;
        footerText?: string;
    };
}

const ShopRegisterSchema: Schema<IShopRegister> = new Schema(
    {
        storeName: { type: String, required: true, unique: true },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        business: {
            companyName: { type: String, required: true },
            companyNumber: { type: String },
            addressStreet: { type: String, required: true },
            addressSuburb: { type: String, required: true },
            addressCity: { type: String, required: true },
            addressPostcode: { type: String, required: true },
            businessEmail: { type: String, required: true },
            businessPhone: { type: String, required: true }
        },

        admin: {
            role: { type: String }
        },

        directors: [
            {
                firstName: { type: String, required: true },
                middleName: { type: String },
                lastName: { type: String, required: true },
                email: { type: String },
                mobile: { type: String }
            }
        ],

        subscription: {
            plan: { type: String, required: true },
            paymentMethod: { type: String, required: true },
            billingName: { type: String, required: true },
            billingEmail: { type: String, required: true },
            billingAddress: { type: String }
        },

        branding: {
            primaryColor: { type: String, required: true },
            secondaryColor: { type: String, required: true },
            backgroundColor: { type: String, required: true },
            primaryTextColor: { type: String, required: true },
            secondaryTextColor: { type: String, required: true },
            thankYouMessage: { type: String },
            headerText: { type: String },
            footerText: { type: String }
        }
    },
    { timestamps: true }
);

const ShopRegisterModel =
    (models?.ShopRegister as Model<IShopRegister>) ||
    model<IShopRegister>('ShopRegister', ShopRegisterSchema, 'shop_register');

export default ShopRegisterModel;
