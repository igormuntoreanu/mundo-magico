const modules = import.meta.glob<{ default: Record<string, string[]> }>("./part-*.ts", {
  eager: true,
});

export const EN_GB: Record<string, string[]> = Object.assign(
  {},
  ...Object.values(modules).map((m) => m.default),
);
