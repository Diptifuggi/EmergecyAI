export function formatTimestamp(ts){
  if(!ts) return ''
  return new Date(ts).toLocaleString()
}

export function noop(){ }
