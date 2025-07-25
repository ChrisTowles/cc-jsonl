import { and, asc, desc, eq, type SQL, sql } from "drizzle-orm";
import { err, ok, type Result } from "neverthrow";
import type { SessionRepository } from "@/core/domain/session/ports/sessionRepository";
import {
  type CreateSessionParams,
  type ListSessionQuery,
  type Session,
  type SessionId,
  sessionSchema,
} from "@/core/domain/session/types";
import { RepositoryError } from "@/lib/error";
import { validate } from "@/lib/validation";
import type { Database } from "./client";
import { sessions } from "./schema";

export class DrizzleSqliteSessionRepository implements SessionRepository {
  constructor(private readonly db: Database) {}

  async upsert(
    params: CreateSessionParams,
  ): Promise<Result<Session, RepositoryError>> {
    try {
      const values = params.id
        ? params
        : {
            projectId: params.projectId || null,
            name: params.name || null,
            cwd: params.cwd,
          };
      const result = await this.db
        .insert(sessions)
        .values(values)
        .onConflictDoUpdate({
          target: sessions.id,
          set: {
            projectId: params.projectId || null,
            name: params.name || null,
            cwd: params.cwd,
            updatedAt: new Date(),
          },
        })
        .returning();

      const session = result[0];
      if (!session) {
        return err(new RepositoryError("Failed to upsert session"));
      }

      return validate(sessionSchema, session).mapErr((error) => {
        return new RepositoryError("Invalid session data", error);
      });
    } catch (error) {
      return err(new RepositoryError("Failed to upsert session", error));
    }
  }

  async findById(
    id: SessionId,
  ): Promise<Result<Session | null, RepositoryError>> {
    try {
      const result = await this.db
        .select()
        .from(sessions)
        .where(eq(sessions.id, id))
        .limit(1);

      const session = result[0];
      if (!session) {
        return ok(null);
      }

      return validate(sessionSchema, session)
        .map((validSession) => validSession)
        .mapErr((error) => new RepositoryError("Invalid session data", error));
    } catch (error) {
      return err(new RepositoryError("Failed to find session", error));
    }
  }

  async updateCwd(
    id: SessionId,
    cwd: string,
  ): Promise<Result<Session, RepositoryError>> {
    try {
      const result = await this.db
        .update(sessions)
        .set({
          cwd,
          updatedAt: new Date(),
        })
        .where(eq(sessions.id, id))
        .returning();

      const session = result[0];
      if (!session) {
        return err(new RepositoryError("Session not found"));
      }

      return validate(sessionSchema, session).mapErr((error) => {
        return new RepositoryError("Invalid session data after update", error);
      });
    } catch (error) {
      return err(new RepositoryError("Failed to update session cwd", error));
    }
  }

  async updateLastMessageAt(
    id: SessionId,
    timestamp: Date,
  ): Promise<Result<Session, RepositoryError>> {
    try {
      const result = await this.db
        .update(sessions)
        .set({
          lastMessageAt: timestamp,
          updatedAt: new Date(),
        })
        .where(eq(sessions.id, id))
        .returning();

      const session = result[0];
      if (!session) {
        return err(new RepositoryError("Session not found"));
      }

      return validate(sessionSchema, session).mapErr((error) => {
        return new RepositoryError("Invalid session data after update", error);
      });
    } catch (error) {
      return err(
        new RepositoryError("Failed to update session lastMessageAt", error),
      );
    }
  }

  async updateName(
    id: SessionId,
    name: string,
  ): Promise<Result<Session, RepositoryError>> {
    try {
      const result = await this.db
        .update(sessions)
        .set({
          name,
          updatedAt: new Date(),
        })
        .where(eq(sessions.id, id))
        .returning();

      const session = result[0];
      if (!session) {
        return err(new RepositoryError("Session not found"));
      }

      return validate(sessionSchema, session).mapErr((error) => {
        return new RepositoryError("Invalid session data after update", error);
      });
    } catch (error) {
      return err(new RepositoryError("Failed to update session name", error));
    }
  }

  async delete(id: SessionId): Promise<Result<void, RepositoryError>> {
    try {
      await this.db.delete(sessions).where(eq(sessions.id, id));
      return ok(undefined);
    } catch (error) {
      return err(new RepositoryError("Failed to delete session", error));
    }
  }

  async list(
    query: ListSessionQuery,
  ): Promise<Result<{ items: Session[]; count: number }, RepositoryError>> {
    const { pagination, filter } = query;
    const limit = pagination.limit;
    const offset = (pagination.page - 1) * pagination.limit;

    const conditions = [];
    if (filter?.projectId) {
      conditions.push(eq(sessions.projectId, filter.projectId));
    }

    // Build order clause
    const getOrderColumn = (orderBy: string) => {
      switch (orderBy) {
        case "id":
          return sessions.id;
        case "projectId":
          return sessions.projectId;
        case "name":
          return sessions.name;
        case "cwd":
          return sessions.cwd;
        case "lastMessageAt":
          return sessions.lastMessageAt;
        case "createdAt":
          return sessions.createdAt;
        case "updatedAt":
          return sessions.updatedAt;
        default:
          return sessions.lastMessageAt; // Default to lastMessageAt ordering
      }
    };

    const orderColumn = getOrderColumn(pagination.orderBy);
    let orderClause: SQL;

    // Special handling for lastMessageAt to put nulls last when descending, first when ascending
    if (pagination.orderBy === "lastMessageAt") {
      if (pagination.order === "desc") {
        // For desc order: non-null values first (newest messages first), then nulls
        orderClause = sql`${orderColumn} DESC NULLS LAST`;
      } else {
        // For asc order: nulls first, then non-null values (oldest messages first)
        orderClause = sql`${orderColumn} ASC NULLS FIRST`;
      }
    } else {
      orderClause =
        pagination.order === "desc" ? desc(orderColumn) : asc(orderColumn);
    }

    try {
      let whereClause: SQL | undefined;
      if (conditions.length === 1) {
        whereClause = conditions[0];
      } else if (conditions.length > 1) {
        whereClause = and(...conditions);
      }

      const [items, countResult] = await Promise.all([
        whereClause
          ? this.db
              .select()
              .from(sessions)
              .where(whereClause)
              .orderBy(orderClause)
              .limit(limit)
              .offset(offset)
          : this.db
              .select()
              .from(sessions)
              .orderBy(orderClause)
              .limit(limit)
              .offset(offset),
        whereClause
          ? this.db
              .select({ count: sql<number>`count(*)` })
              .from(sessions)
              .where(whereClause)
          : this.db.select({ count: sql<number>`count(*)` }).from(sessions),
      ]);

      const validItems = items
        .map((item) => validate(sessionSchema, item).unwrapOr(null))
        .filter((item) => item !== null);

      return ok({
        items: validItems,
        count: Number(countResult[0]?.count || 0),
      });
    } catch (error) {
      return err(new RepositoryError("Failed to list sessions", error));
    }
  }
}
