import { supabase, type Database } from "./client";
import type { Repository } from "@/domain/repositories/repository";

/**
 * Implementação base de repositório usando o cliente Supabase do browser.
 *
 * As políticas RLS do projeto existente continuam sendo respeitadas
 * porque o cliente mantém a sessão do usuário autenticado.
 */
export abstract class SupabaseBaseRepository<T, ID = string>
  implements Repository<T, ID>
{
  protected abstract tableName: keyof Database["public"]["Tables"];

  async findById(id: ID): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName as string)
      .select("*")
      .eq("id", id as string)
      .maybeSingle();

    if (error) throw error;
    return (data as T | null) ?? null;
  }

  async findAll(filters?: Record<string, unknown>): Promise<T[]> {
    let query = supabase.from(this.tableName as string).select("*");

    if (filters) {
      for (const [column, value] of Object.entries(filters)) {
        query = query.eq(column, value);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as T[]) ?? [];
  }

  async create(entity: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName as string)
      .insert(entity as Record<string, unknown>)
      .select("*")
      .single();

    if (error) throw error;
    if (!data) throw new Error("Nenhum dado retornado após inserção.");
    return data as T;
  }

  async update(id: ID, changes: Partial<T>): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName as string)
      .update(changes as Record<string, unknown>)
      .eq("id", id as string)
      .select("*")
      .single();

    if (error) throw error;
    return (data as T | null) ?? null;
  }

  async remove(id: ID): Promise<void> {
    const { error } = await supabase
      .from(this.tableName as string)
      .delete()
      .eq("id", id as string);

    if (error) throw error;
  }
}
