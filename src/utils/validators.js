
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\s+/g, "");

  // Accept +91XXXXXXXXXX
  if (cleaned.startsWith("+91")) {
    return /^\+91[6-9]\d{9}$/.test(cleaned);
  }

  // Accept 10-digit Indian number (optional)
  return /^[6-9]\d{9}$/.test(cleaned);
};

export const isValidOTP = (otp) =>
  /^\d{6}$/.test(otp);

export const isStrongPassword = (pwd) =>
  pwd.length >= 8;
