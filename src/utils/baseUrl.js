export const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://tame-bat-gaiters.cyclic.app"
    : "http://localhost:5000";

export default baseUrl;
