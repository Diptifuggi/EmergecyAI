import { useContext } from 'react'
import { GlobalContext } from '../context/GlobalContext'

export default function useAuth(){
  const { state } = useContext(GlobalContext)
  return { user: state.user }
}
