const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).send('Invalid amount');
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'inr',
            payment_method_types: ['card'],
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
