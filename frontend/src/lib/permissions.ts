import type { AuthContextType, AuthUser } from '@/contexts/AuthContext.types'
import { Permissions } from '@/constants/permissions'

export const can = {
    viewCreatedBy(user: AuthUser | null) {
        return user?.role === 'master'
    },

    createCliente(auth: AuthContextType) {
        return auth.hasPermission(Permissions.CLIENTE_CREATE)
    },

    editCliente(auth: AuthContextType) {
        return auth.hasPermission(Permissions.CLIENTE_UPDATE)
    },

    deleteCliente(auth: AuthContextType) {
        return auth.hasPermission(Permissions.CLIENTE_DELETE)
    },
}
