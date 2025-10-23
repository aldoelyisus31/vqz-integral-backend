import { SetMetadata } from '@nestjs/common';

export const LOG_ACTION_KEY = 'log_action';

export interface LogActionMetadata {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  description: string;
}

/**
 * Decorador para marcar endpoints que deben registrar logs de acciones
 * @param action - Tipo de acción: CREATE, UPDATE o DELETE
 * @param description - Descripción de la acción realizada
 * 
 * @example
 * @LogAction('CREATE', 'Usuario creado exitosamente')
 * createUser() { ... }
 * 
 * @example
 * @LogAction('UPDATE', 'Usuario actualizado exitosamente')
 * updateUser() { ... }
 */
export const LogAction = (
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  description: string,
) => {
  const metadata: LogActionMetadata = {
    action,
    description,
  };
  return SetMetadata(LOG_ACTION_KEY, metadata);
};
