export type User = {
  sub: string;
  role: "Applicant" | "Administrator";
};

export const getUserFromToken = (token: string | null): User | null => {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return { sub: decoded.sub, role: decoded.role };
  } catch {
    return null;
  }
};
