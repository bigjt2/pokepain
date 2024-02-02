const initSession = (trainer: any) => {
  console.log(JSON.stringify(trainer));
  localStorage.setItem("session", JSON.stringify(trainer));
};

const getSession = () => {
  const session = JSON.parse(localStorage.getItem("session") || "");
  return session;
};

const removeSession = () => {
  localStorage.removeItem("session");
};

const sessionService = {
  initSession,
  getSession,
  removeSession,
};

export default sessionService;
