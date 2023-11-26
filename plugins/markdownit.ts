import md from "markdown-it";

export default defineNuxtPlugin(() => {
  const renderer = md();
  renderer.set({
  breaks: true
});
  return {
    provide: {
      mdRenderer: renderer,
    },
  };
});