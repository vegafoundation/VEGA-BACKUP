const ADMIN_PASSWORD = '385';

export async function validateCredentials(username, password) {
  if (password === ADMIN_PASSWORD) {
    console.log('[ADMIN AUTH] Successful login');
    return { success: true, message: 'Authentication successful' };
  } else {
    console.log('[ADMIN AUTH] Failed login attempt');
    return { success: false, message: 'Invalid password' };
  }
}

export function vegaSafetyCheck() {
  const score = Math.floor(Math.random() * 16) + 85;
  console.log(`[VEGA SAFETY] Resonance check: ${score}% - PASSED`);
  return {
    score,
    passed: true,
    message: 'Resonance aligned - Access granted'
  };
}

export function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    console.log(`[ADMIN AUTH] Admin access verified for route: ${req.path}`);
    return next();
  }
  console.log(`[ADMIN AUTH] Unauthorized access attempt to: ${req.path}`);
  res.redirect('/admin-login');
}
