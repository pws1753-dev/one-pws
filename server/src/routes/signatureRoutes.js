const router = require('express').Router();
const {
  createSignature,
  getSignatures,
  getSignatureById,
  updateSignature,
  getSignatureStats,
  exportSignatures,
} = require('../controllers/signatureController');

router.get('/stats', getSignatureStats);
router.get('/export', exportSignatures);
router.get('/', getSignatures);
router.get('/:id', getSignatureById);
router.post('/', createSignature);
router.put('/:id', updateSignature);

module.exports = router;
