/**
 * 会话管理模块
 * 支持多会话并发管理、状态跟踪、优先级排序
 */

import { v4 as uuidv4 } from 'uuid';

export type SessionStatus = 
  | 'pending'
  | 'active'
  | 'completed'
  | 'failed'
  | 'flagged'
  | 'archived';

export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface Session {
  id: string;
  title: string;
  status: SessionStatus;
  priority: Priority;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  assignedTo?: string;
  context: Record<string, any>;
  messages: SessionMessage[];
}

export interface SessionMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export class SessionManager {
  private sessions: Map<string, Session> = new Map();

  /**
   * 创建新会话
   */
  createSession(params: {
    title: string;
    priority?: Priority;
    tags?: string[];
    context?: Record<string, any>;
    initialMessage?: string;
  }): Session {
    const id = uuidv4();
    const now = new Date();

    const session: Session = {
      id,
      title: params.title,
      status: 'pending',
      priority: params.priority || 'NORMAL',
      tags: params.tags || [],
      createdAt: now,
      updatedAt: now,
      context: params.context || {},
      messages: params.initialMessage
        ? [{
            id: uuidv4(),
            role: 'user',
            content: params.initialMessage,
            timestamp: now
          }]
        : []
    };

    this.sessions.set(id, session);
    return session;
  }

  /**
   * 获取会话
   */
  getSession(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  /**
   * 更新会话状态
   */
  updateStatus(id: string, status: SessionStatus): Session | undefined {
    const session = this.sessions.get(id);
    if (!session) return undefined;

    session.status = status;
    session.updatedAt = new Date();

    if (status === 'completed' || status === 'failed' || status === 'archived') {
      session.completedAt = new Date();
    }

    return session;
  }

  /**
   * 添加消息到会话
   */
  addMessage(sessionId: string, message: Omit<SessionMessage, 'id' | 'timestamp'>): Session | undefined {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;

    session.messages.push({
      id: uuidv4(),
      ...message,
      timestamp: new Date()
    });

    session.updatedAt = new Date();
    return session;
  }

  /**
   * 获取会话收件箱（支持过滤和排序）
   */
  getInbox(filters?: {
    status?: SessionStatus[];
    priority?: Priority[];
    tags?: string[];
    limit?: number;
  }): Session[] {
    let sessions = Array.from(this.sessions.values());

    // 过滤
    if (filters?.status) {
      sessions = sessions.filter(s => filters.status!.includes(s.status));
    }
    if (filters?.priority) {
      sessions = sessions.filter(s => filters.priority!.includes(s.priority));
    }
    if (filters?.tags) {
      sessions = sessions.filter(s => 
        filters.tags!.some(tag => s.tags.includes(tag))
      );
    }

    // 排序（优先级优先，然后更新时间）
    const priorityOrder = { URGENT: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
    sessions.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    // 限制数量
    if (filters?.limit) {
      sessions = sessions.slice(0, filters.limit);
    }

    return sessions;
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    total: number;
    byStatus: Record<SessionStatus, number>;
    byPriority: Record<Priority, number>;
  } {
    const stats = {
      total: this.sessions.size,
      byStatus: {} as Record<SessionStatus, number>,
      byPriority: {} as Record<Priority, number>
    };

    const allStatuses: SessionStatus[] = ['pending', 'active', 'completed', 'failed', 'flagged', 'archived'];
    const allPriorities: Priority[] = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

    allStatuses.forEach(s => stats.byStatus[s] = 0);
    allPriorities.forEach(p => stats.byPriority[p] = 0);

    this.sessions.forEach(session => {
      stats.byStatus[session.status]++;
      stats.byPriority[session.priority]++;
    });

    return stats;
  }

  /**
   * 归档已完成的会话
   */
  archiveCompletedSessions(olderThanDays: number = 7): number {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);

    let archived = 0;
    this.sessions.forEach(session => {
      if (
        (session.status === 'completed' || session.status === 'failed') &&
        session.completedAt &&
        session.completedAt < cutoff
      ) {
        session.status = 'archived';
        session.updatedAt = new Date();
        archived++;
      }
    });

    return archived;
  }
}

export default SessionManager;
