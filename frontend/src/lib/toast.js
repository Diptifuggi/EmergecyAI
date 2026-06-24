import { toast } from '@/components/ui/use-toast'

export const toastSuccess = (msg, title = 'Success') => toast({ title, description: msg })
export const toastError = (msg, title = 'Error') => toast({ title, description: msg, variant: 'destructive' })
export const toastInfo = (msg) => toast({ title: 'Info', description: msg })
export const toastPipeline = (priority, score) => toast({ title: 'Pipeline Complete', description: `Priority: ${priority} · Score: ${score}/100` })

export default {
  toastSuccess,
  toastError,
  toastInfo,
  toastPipeline,
}
