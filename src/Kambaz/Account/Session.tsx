import * as client from './client';
import { useEffect, useState } from 'react';
import { setCurrentUser } from './reducer';
import { useDispatch } from 'react-redux';
export default function Session({ children }: { children: any }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();
  const fetchProfile = async () => {
    const startTime = Date.now();
    try {
      console.log('🚀 Starting profile fetch...');
      const currentUser = await client.profile();
      const duration = Date.now() - startTime;
      console.log(`✅ Profile fetch successful in ${duration}ms`);
      dispatch(setCurrentUser(currentUser));
    } catch (err: any) {
      const duration = Date.now() - startTime;
      console.error(`❌ Profile fetch failed after ${duration}ms:`, err);
      console.log('🌐 Network info:', {
        online: navigator.onLine,
        connection: (navigator as any).connection?.effectiveType || 'unknown',
      });
    }
    setPending(false);
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  if (!pending) {
    return children;
  } else {
    return <div>Loading...</div>;
  }
}

// The 'pending' state in Session component serves as an authentication gate
// to prevent rendering child components before user authentication is complete.

// Why we need the 'pending' state:

// 1. **Prevents Flash of Unauthenticated Content (FOUC)**
//    - Without pending state, the app would immediately render children
//    - Then suddenly change UI state when fetchProfile() completes
//    - This causes users to see "logged out" state flash, then switch to "logged in"

// 2. **Ensures Authentication Completes First**
//    - fetchProfile() is async and takes time to fetch user info from server
//    - pending ensures we don't render components that depend on user state
//    - until authentication verification is complete

// 3. **Prevents Unauthorized Access**
//    - Child components may contain protected routes requiring user login
//    - Rendering before identity verification could lead to security issues

// Current workflow:
// 1. Component mounts → pending = true → children not rendered
// 2. useEffect triggers → calls fetchProfile()
// 3. fetchProfile() completes → setPending(false)
// 4. pending = false → renders children

// Note: Current code has a small issue - if fetchProfile() fails,
// user sees blank page because pending becomes false but the condition
// at line 20-22 doesn't return anything. Should add loading indicator.
