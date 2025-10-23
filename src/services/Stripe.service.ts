import Stripe from 'stripe';

class StripeService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    }

    // Customer Management
    async createCustomer(email: string, name: string): Promise<Stripe.Customer> {
        return this.stripe.customers.create({
            email,
            name,
        });
    }

    async getCustomer(customerId: string): Promise<Stripe.Customer | null> {
        const customer = await this.stripe.customers.retrieve(customerId);

        if ((customer as Stripe.DeletedCustomer).deleted) {
            return null;
        }

        return customer as Stripe.Customer;
    }

    async updateCustomer(customerId: string, data: Partial<Stripe.CustomerUpdateParams>): Promise<Stripe.Customer> {
        return this.stripe.customers.update(customerId, data);
    }

    async deleteCustomer(customerId: string): Promise<Stripe.DeletedCustomer> {
        return this.stripe.customers.del(customerId);
    }

    // Card Management
    async addCard(customerId: string, cardToken: string, cardHolderName: string): Promise<Stripe.Card | null> {
        const paymentMethod = await this.stripe.customers.createSource(customerId, {
            source: cardToken,
            metadata: {
                name: cardHolderName
            }
        });

        // Check if the returned source is a card
        if (paymentMethod.object === 'card') {
            return paymentMethod as Stripe.Card;
        }

        // If it's not a card, return null or handle it as needed
        return null;
    }

    async getCard(cardId: string): Promise<Stripe.PaymentMethod | null> {
        return this.stripe.paymentMethods.retrieve(cardId);
    }

    async deleteCard(customerId: string, cardId: string): Promise<Stripe.PaymentMethod | Stripe.Card | null> {
        const deletedSource = await this.stripe.customers.deleteSource(customerId, cardId);

        if ('deleted' in deletedSource && deletedSource.deleted) {
            return null;
        }

        if (deletedSource.object === 'card') {
            return deletedSource as Stripe.Card;
        }

        return null;
    }

    async listCards(customerId: string): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
        return this.stripe.paymentMethods.list({
            customer: customerId,
            type: 'card',
        });
    }

    // Payment Management
    async createPaymentIntent(data: {
        customerId: string;
        cardId: string;
        amount: number;
    }): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: data.amount,
                currency: "usd",
                customer: data.customerId,
                payment_method: data.cardId,
                confirm: true, // Confirm the payment immediately
                off_session: true, // For off-session payments
                payment_method_types: ['card'], // Specify card as the payment method
                use_stripe_sdk: false, // Ensure it doesn't require additional customer action
                return_url: process.env.NEXT_PUBLIC_APP_HOSTNAME
            });

            return paymentIntent;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    }

    // Create Test Card Token
    async createTestCardToken(cardDetails: Stripe.TokenCreateParams.Card & { customerId?: string }): Promise<string> {
        try {
            const { customerId, ...rest } = cardDetails;
            const token = await this.stripe.tokens.create({
                ...(customerId && {
                    customer: customerId,
                }),
                card: rest,
            });

            return token.id;
        } catch (error) {
            console.error('Error creating test card token:', error);
            throw error;
        }
    }
}

export default new StripeService();
