export function bookUnitOrderDisplay(
  order: number[],
  tags: string[],
  variant: string | undefined
) {
  if (!tags || tags.length === 0) {
    return (
      `${order
        .slice(tags.length)
        .map((num) => num.toString())
        .join('.')}` + (variant ?? '')
    );
  }

  return (
    `${tags[tags.length - 1]}.${order
      .slice(tags.length)
      .map((num) => num.toString())
      .join('.')}` + (variant ?? '')
  );
}
