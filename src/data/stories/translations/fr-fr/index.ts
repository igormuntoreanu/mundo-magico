const modules = import.meta.glob<{ default: Record<string, string[]> }>("./part-*.ts", {
  eager: true,
});

export const FR_FR: Record<string, string[]> = Object.assign(
  {},
  ...Object.values(modules).map((m) => m.default),
);
