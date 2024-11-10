export function useAuthData() {
  const persistedState = JSON.parse(
    localStorage.getItem("auth-object") || "{}",
  );
  const token = persistedState?.state?.token || null;
  const userName = persistedState?.state?.userName || null;

  return {
    token,
    userName,
  };
}
