const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const app = express()
const cors = require('cors')
const port = 3000

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPAURL
const websiteUrl = process.env.VITE_WEBSITEURL

app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cors({
  origin: [websiteUrl, supabaseUrl],
  methods: ['GET', 'POST']
}))

app.post('/create-customer', async (req, res) => {
  try {
    const { email } = req.body

    const customer = await stripe.customers.create({
      email,
    })

    res.json({ customer })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/list-subscriptions/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    })

    res.json({ subscriptions })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/list-subscriptions', async (req, res) => {
  try {
    const products = await stripe.products.list({
      limit: 3,
    })
    res.json({ products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/create-payment-link', async (req, res) => {
  try {
    const { customerId, priceId } = req.body

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${websiteUrl}/upgrades`,
      cancel_url: `${websiteUrl}/upgrades`,
    })

    res.json({ url: session.url })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/promote-payment', async (req, res) => {
  const { customerId } = req.body

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: "price_1OHX1lHpvCWGf2YPEbI1esjU",
        quantity: 1,
      },
    ],
    success_url: websiteUrl,
    cancel_url: websiteUrl,
  })

  res.json({ url: session.url })
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
