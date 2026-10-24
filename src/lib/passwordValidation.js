/**
 * Uniform Password Validation and Strength Utility for Web Application.
 * Synchronized with Mobile App and Backend Django validator.
 */

export const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;

export const PASSWORD_REQUIREMENTS_LIST = [
  { id: 'minLength', label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { id: 'hasUpper', label: 'At least one uppercase letter (A-Z)', test: (pwd) => /[A-Z]/.test(pwd) },
  { id: 'hasLower', label: 'At least one lowercase letter (a-z)', test: (pwd) => /[a-z]/.test(pwd) },
  { id: 'hasNumber', label: 'At least one number (0-9)', test: (pwd) => /[0-9]/.test(pwd) },
  { id: 'hasSpecial', label: 'At least one special character (!@#$%^&*)', test: (pwd) => SPECIAL_CHAR_REGEX.test(pwd) },
];

export function evaluatePassword(password = '', confirmPassword = null) {
  const pwd = String(password || '');

  const requirements = PASSWORD_REQUIREMENTS_LIST.map((req) => ({
    id: req.id,
    label: req.label,
    met: req.test(pwd),
  }));

  const metCount = requirements.filter((r) => r.met).length;
  const isValid = metCount === PASSWORD_REQUIREMENTS_LIST.length;

  let score = 0;
  if (!pwd) {
    score = 0;
  } else if (pwd.length < 8 || metCount <= 2) {
    score = 1;
  } else if (metCount === 3) {
    score = 2;
  } else if (metCount === 4) {
    score = 3;
  } else if (isValid) {
    score = 4;
  }

  const STRENGTH_LEVELS = [
    { score: 0, label: 'Very Weak', color: '#EF4444', tailwindColor: 'bg-rose-500', textColor: 'text-rose-500', percent: 5 },
    { score: 1, label: 'Weak', color: '#EF4444', tailwindColor: 'bg-rose-500', textColor: 'text-rose-500', percent: 25 },
    { score: 2, label: 'Fair', color: '#F59E0B', tailwindColor: 'bg-amber-500', textColor: 'text-amber-500', percent: 50 },
    { score: 3, label: 'Good', color: '#3B82F6', tailwindColor: 'bg-blue-500', textColor: 'text-blue-500', percent: 75 },
    { score: 4, label: 'Strong', color: '#10B981', tailwindColor: 'bg-emerald-500', textColor: 'text-emerald-500', percent: 100 },
  ];

  const strength = STRENGTH_LEVELS[score];

  const hasConfirm = confirmPassword !== null && confirmPassword !== undefined;
  const confirmMatches = hasConfirm ? Boolean(pwd && pwd === String(confirmPassword)) : null;

  return {
    password: pwd,
    requirements,
    metCount,
    totalCount: PASSWORD_REQUIREMENTS_LIST.length,
    isValid,
    score,
    strength,
    confirmMatches,
  };
}
