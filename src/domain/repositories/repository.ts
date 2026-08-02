/**
 * Contrato base de repositório da camada de domínio.
 *
 * Esta interface é deliberadamente genérica e livre de frameworks.
 * Cada agregado do Motor Inteligente de Alocação Patrimonial terá
 * seu próprio contrato estendendo este padrão.
 */
export interface Repository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(filters?: Record<string, unknown>): Promise<T[]>;
  create(entity: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: ID, changes: Partial<T>): Promise<T | null>;
  remove(id: ID): Promise<void>;
}

export type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};
