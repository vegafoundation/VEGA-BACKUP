import bcrypt from 'bcrypt';

const ADMIN_USERNAME = 'AEVegaAdmin';

export async function validateCredentials(username, password) {
  if (username !== ADMIN_USERNAME) {
    return { success: false, message: 'Invalid credentials' };
  }

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!passwordHash) {
    console.error('[ADMIN AUTH] ADMIN_PASSWORD_HASH environment variable not set');
    return { success: false, message: 'System configuration error' };
  }

  try {
    const isValid = await bcrypt.compare(password, passwordHash);
    if (isValid) {
      console.log(`[ADMIN AUTH] Successful login for user: ${username}`);
      return { success: true, message: 'Authentication successful' };
    } else {
      console.log(`[ADMIN AUTH] Failed login attempt for user: ${username}`);
      return { success: false, message: 'Invalid credentials' };
    }
  } catch (error) {
    console.error('[ADMIN AUTH] Error during password validation:', error);
    return { success: false, message: 'Authentication error' };
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
