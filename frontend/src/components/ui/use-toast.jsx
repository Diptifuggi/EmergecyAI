import { toast as hotToast } from 'react-hot-toast'

export function toast({ title, description, variant }){
  const msg = title ? `${title} — ${description || ''}` : (description || '')
  if (variant === 'destructive') return hotToast.error(msg)
  return hotToast.success(msg)
}

export default { toast }
