type Listener = () => void;

export function createEventEmitter() {
  const listeners = new Set<Listener>();

  return {
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    emit() {
      listeners.forEach((fn) => fn());
    }
  };
}
