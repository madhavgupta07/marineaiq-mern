import { Router } from 'express';
import { leadRateLimit, registerRateLimit } from './limits.js';
import * as admin from '../controllers/admin.controller.js';
import * as auth from '../controllers/auth.controller.js';
import * as checkout from '../controllers/checkout.controller.js';
import * as leads from '../controllers/leads.controller.js';
import * as prompts from '../controllers/prompts.controller.js';
import { optionalAuth, protect, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/auth/register', registerRateLimit, auth.register);
router.post('/auth/login', registerRateLimit, auth.login);
router.post('/auth/logout', auth.logout);
router.get('/auth/me', protect, auth.me);

router.get('/prompts', optionalAuth, prompts.listPrompts);
router.get('/prompts/:slug', optionalAuth, prompts.getPrompt);

router.post('/leads', leadRateLimit, leads.createLead);

router.post('/checkout/orders', protect, checkout.createOrder);
router.post('/checkout/orders/:id/confirm', protect, checkout.confirmOrder);

router.use('/admin', protect, requireAdmin);
router.get('/admin/overview', admin.overview);
router.get('/admin/prompts', admin.adminListPrompts);
router.post('/admin/prompts', admin.adminCreatePrompt);
router.put('/admin/prompts/:id', admin.adminUpdatePrompt);
router.delete('/admin/prompts/:id', admin.adminDeletePrompt);
router.get('/admin/leads', admin.adminListLeads);
router.get('/admin/orders', admin.adminListOrders);

export default router;
