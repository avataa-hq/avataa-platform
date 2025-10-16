export const scrollToElementId = (id: string) => {
  const e = document.getElementById(id);

  if (e) {
    e.scrollIntoView({ behavior: 'smooth' });
  }
};
