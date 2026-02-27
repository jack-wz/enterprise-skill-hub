/**
 * 会话 API 路由
 */

import { Router, Request, Response } from 'express';
import SessionManager, { Session, Priority } from '../session/session-manager';

const router = Router();
const sessionManager = new SessionManager();

/**
 * GET /api/v1/sessions
 * 获取会话收件箱
 */
router.get('/sessions', (req: Request, res: Response) => {
  try {
    const { status, priority, tags, limit } = req.query;
    
    const filters = {
      status: status ? (status as string).split(',') as any[] : undefined,
      priority: priority ? (priority as string).split(',') as any[] : undefined,
      tags: tags ? (tags as string).split(',') : undefined,
      limit: limit ? parseInt(limit as string) : undefined
    };

    const sessions = sessionManager.getInbox(filters);
    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * GET /api/v1/sessions/stats
 * 获取会话统计
 */
router.get('/sessions/stats', (req: Request, res: Response) => {
  try {
    const stats = sessionManager.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * POST /api/v1/sessions
 * 创建新会话
 */
router.post('/sessions', (req: Request, res: Response) => {
  try {
    const { title, priority, tags, context, initialMessage } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    const session = sessionManager.createSession({
      title,
      priority: priority as Priority,
      tags,
      context,
      initialMessage
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * GET /api/v1/sessions/:id
 * 获取单个会话
 */
router.get('/sessions/:id', (req: Request, res: Response) => {
  try {
    const session = sessionManager.getSession(req.params.id);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * PUT /api/v1/sessions/:id/status
 * 更新会话状态
 */
router.put('/sessions/:id/status', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const session = sessionManager.updateStatus(req.params.id, status);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * POST /api/v1/sessions/:id/messages
 * 添加消息到会话
 */
router.post('/sessions/:id/messages', (req: Request, res: Response) => {
  try {
    const { role, content } = req.body;
    
    if (!role || !content) {
      return res.status(400).json({
        success: false,
        error: 'Role and content are required'
      });
    }

    const session = sessionManager.addMessage(req.params.id, {
      role,
      content
    });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

/**
 * POST /api/v1/sessions/archive
 * 归档已完成的会话
 */
router.post('/sessions/archive', (req: Request, res: Response) => {
  try {
    const { olderThanDays = 7 } = req.body;
    const archived = sessionManager.archiveCompletedSessions(olderThanDays);
    
    res.json({
      success: true,
      data: { archived }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});

export default router;
