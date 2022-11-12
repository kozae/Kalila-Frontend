export function isCellContentUpdate(topic: string) {
  return topic.endsWith('PageContentUpdate.Edition');
}
export function isCellUpdate(topic: string) {
  return topic === 'ContentUpdate.Edition';
}

export function isBookUnitUpdate(topic: string) {
  return topic.endsWith('ContentUpdate.BookUnit');
}

export function isBookUnitCreation(topic: string) {
  return topic.endsWith('Creation.BookUnit');
}

export function isBookUnitDeletion(topic: string) {
  return topic.endsWith('Delete.BookUnit');
}

export function isOrderChanged(order: number[] | null | undefined) {
  return order && order.length !== 0;
}
