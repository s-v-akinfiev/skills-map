const logoModules = import.meta.glob("../assets/logos/*", {
  eager: true,
  import: "default",
});

const logoMap = Object.fromEntries(
  Object.entries(logoModules).map(([path, url]) => {
    const fileName = path.split("/").pop() ?? "";
    const key = fileName.replace(/\.[^.]+$/, "");

    return [key, url];
  }),
);

export function getSkillLogo(icon) {
  if (!icon) {
    return null;
  }

  return logoMap[icon] ?? null;
}
