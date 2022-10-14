export function bookUnitOrderDisplay(
  order: number[],
  tags: string[],
  variant: string | undefined
) {
  return (
    `${tags[tags.length - 1]}.${order
      .slice(tags.length)
      .map((num) => num.toString())
      .join('.')}` + (variant ?? '')
  );
}
