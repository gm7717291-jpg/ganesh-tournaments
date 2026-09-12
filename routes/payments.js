const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');

router.post('/create', auth, async (req, res) => {
  try {
    const { tournamentId, amount } = req.body;
    const payment = new Payment({
      user: req.user.userId,
      tournament: tournamentId,
      amount,
      status: 'pending'
    });
    await payment.save();
    res.json({ msg: 'Payment created', payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:paymentId/confirm', auth, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.paymentId,
      { status: 'completed' },
      { new: true }
    );
    res.json({ msg: 'Payment confirmed', payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
