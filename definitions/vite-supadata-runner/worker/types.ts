export interface ApiResponse<T = unknown> { success: boolean; data?: T; error?: string; }

export interface MCPResult {
  content: string;
}

export interface ErrorResult {
  error: string;
}

export interface SessionInfo {
  id: string;
  title: string;
  createdAt: number;
  lastActive: number;
}
