const express = require("express")
const cors = require("cors")
const { AgentClient } = require("@21st-sdk/node")

const app = express()
app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.json())

const client = new AgentClient({ apiKey: process.env.API_KEY_21ST })

app.post("/api/an-token", async (req, res) => {
  try {
    const token = await client.tokens.create({ agent: "my-agent" })
    res.json(token)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Token server running on http://localhost:${PORT}`)
})
