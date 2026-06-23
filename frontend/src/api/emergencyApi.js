import { listCalls, getCall } from './callsApi'

export async function getEmergencies(params = {}) {
  // backward-compat: delegate to callsApi
  return listCalls(params)
}

export async function getEmergency(id) {
  return getCall(id)
}
