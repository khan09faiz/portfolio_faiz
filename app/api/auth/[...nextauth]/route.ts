/**
 * Auth.js route handlers — sign-in, callback, sign-out, session.
 * All auth traffic goes through /api/auth/*.
 */

import { handlers } from '@/auth'

export const { GET, POST } = handlers
