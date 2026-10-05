export function debounce<parameters extends unknown[]>(
  callback: (...args: parameters) => void,
  delay: number,
  signal?: AbortSignal,
): ((...args: parameters) => void) & { cancel(): void } {
  let timer: ReturnType<typeof setTimeout> | undefined

  function cancel() {
    clearTimeout(timer)
    timer = undefined
  }

  function debounced(...args: parameters) {
    if (signal?.aborted) return
    cancel()
    timer = setTimeout(() => {
      timer = undefined
      callback(...args)
    }, delay)
  }

  if (signal && !signal.aborted) {
    signal.addEventListener('abort', cancel, { once: true })
  }

  return Object.assign(debounced, { cancel })
}
