let VEGA_MEMORY = {};

export function updateMemory(update) {
  VEGA_MEMORY = { ...VEGA_MEMORY, ...update };
}

export function getMemory() {
  return VEGA_MEMORY;
}
