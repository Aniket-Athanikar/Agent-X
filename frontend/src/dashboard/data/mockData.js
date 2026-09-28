export const MOCK_USER = {
  id: 'usr_001',
  name: 'Sarah Chen',
  firstName: 'Sarah',
  role: 'Principal AI Engineer',
  department: 'Core Intelligence',
  company: 'Agent-X',
  avatar: null,
  initials: 'SC',
  productivityScore: 98,
  streak: 14,
  joinDate: '2024-03-15'
};

export const MOCK_SPRINT = {
  id: 'SPR-18',
  name: 'Sprint 18: Model Alignment Pipeline',
  startDate: '2025-06-16',
  endDate: '2025-06-30',
  completedTasks: 23,
  totalTasks: 31,
  openPRs: 8,
  mergedPRs: 15,
  meetingsToday: 3,
  learningProgress: 78,
  repoHealth: 94,
  knowledgeArticles: 1248,
  daysLeft: 4,
  velocity: 92
};

export const MOCK_PROJECT = {
  id: 'proj_001',
  name: 'Agent-X Enterprise v2',
  status: 'On Track',
  progress: 67,
  team: 12,
  description: 'Next-generation AI alignment and employee onboarding platform'
};

export const QUICK_ACTIONS = [
  { id: 'qa1', label: 'Ask AI', icon: 'Sparkles', color: 'emerald', desc: 'Query the AI copilot' },
  { id: 'qa2', label: 'Analyze Repo', icon: 'GitBranch', color: 'blue', desc: 'Deep repo analysis' },
  { id: 'qa3', label: 'Upload Docs', icon: 'FileUp', color: 'purple', desc: 'Add documentation' },
  { id: 'qa4', label: 'Generate API', icon: 'Code2', color: 'orange', desc: 'Auto-generate APIs' },
  { id: 'qa5', label: 'Start Meeting', icon: 'Video', color: 'rose', desc: 'Quick standup' },
  { id: 'qa6', label: 'Architecture', icon: 'Workflow', color: 'cyan', desc: 'View system design' },
  { id: 'qa7', label: 'Create Task', icon: 'ListTodo', color: 'yellow', desc: 'New Jira ticket' },
  { id: 'qa8', label: 'Knowledge', icon: 'BookOpen', color: 'indigo', desc: 'Search wiki' }
];

export const MOCK_TASKS = [
  { id: 'TSK-442', title: 'Review PR #442: RLHF Pipeline Optimization', status: 'in-progress', priority: 'high', assignee: 'Sarah Chen', dueDate: 'Today', labels: ['backend', 'ml'] },
  { id: 'TSK-438', title: 'Update alignment evaluation metrics dashboard', status: 'in-progress', priority: 'medium', assignee: 'Sarah Chen', dueDate: 'Tomorrow', labels: ['frontend'] },
  { id: 'TSK-435', title: 'Write integration tests for reward model API', status: 'todo', priority: 'high', assignee: 'Sarah Chen', dueDate: 'Jun 28', labels: ['testing'] },
  { id: 'TSK-430', title: 'Document GRPO training configuration', status: 'done', priority: 'low', assignee: 'Sarah Chen', dueDate: 'Jun 25', labels: ['docs'] },
  { id: 'TSK-427', title: 'Optimize tokenizer memory allocation', status: 'done', priority: 'medium', assignee: 'Sarah Chen', dueDate: 'Jun 24', labels: ['performance'] }
];

export const MOCK_REPOS = [
  { name: 'core-intelligence-api', lang: 'Python', stars: 234, lastCommit: '2 hours ago', branch: 'main', status: 'passing', files: 847 },
  { name: 'alignment-dashboard', lang: 'TypeScript', stars: 89, lastCommit: '5 hours ago', branch: 'feat/metrics', status: 'passing', files: 312 },
  { name: 'reward-model-service', lang: 'Python', stars: 156, lastCommit: '1 day ago', branch: 'main', status: 'failing', files: 523 },
  { name: 'agent-orchestrator', lang: 'Go', stars: 312, lastCommit: '3 days ago', branch: 'main', status: 'passing', files: 198 }
];

export const MOCK_MEETINGS = [
  { id: 'm1', title: 'Sprint 18 Standup', time: '10:00 AM', duration: '15 min', attendees: 8, type: 'standup', status: 'upcoming' },
  { id: 'm2', title: 'Architecture Review: GRPO Pipeline', time: '2:00 PM', duration: '45 min', attendees: 5, type: 'review', status: 'upcoming' },
  { id: 'm3', title: '1:1 with Engineering Lead', time: '4:30 PM', duration: '30 min', attendees: 2, type: '1on1', status: 'upcoming' }
];

export const MOCK_ACTIVITY = [
  { id: 'a1', type: 'commit', message: 'feat: implement GRPO reward scaling', repo: 'core-intelligence-api', time: '2 hours ago', user: 'Sarah Chen' },
  { id: 'a2', type: 'pr_merged', message: 'PR #439: Fix tokenizer OOM on large batches', repo: 'core-intelligence-api', time: '4 hours ago', user: 'Alex Kim' },
  { id: 'a3', type: 'review', message: 'Approved PR #441: Add alignment benchmarks', repo: 'alignment-dashboard', time: '5 hours ago', user: 'Sarah Chen' },
  { id: 'a4', type: 'deploy', message: 'Deployed reward-model-service v2.4.1 to staging', repo: 'reward-model-service', time: '6 hours ago', user: 'CI/CD Bot' },
  { id: 'a5', type: 'comment', message: 'Commented on issue #87: Memory leak in eval loop', repo: 'core-intelligence-api', time: '8 hours ago', user: 'Sarah Chen' }
];

export const MOCK_ANNOUNCEMENTS = [
  { id: 'ann1', title: 'Agent-X Series B: $25M Raised!', date: 'Jun 20', category: 'Company', pinned: true },
  { id: 'ann2', title: 'New RLHF certification program launching July 1', date: 'Jun 18', category: 'Learning' },
  { id: 'ann3', title: 'Q3 OKRs published — review by Friday', date: 'Jun 15', category: 'Strategy' }
];

export const VELOCITY_DATA = [
  { day: 'Mon', tasks: 4, prs: 2 },
  { day: 'Tue', tasks: 7, prs: 3 },
  { day: 'Wed', tasks: 5, prs: 1 },
  { day: 'Thu', tasks: 11, prs: 5 },
  { day: 'Fri', tasks: 8, prs: 4 },
  { day: 'Sat', tasks: 2, prs: 0 },
  { day: 'Sun', tasks: 3, prs: 1 }
];

export const SYSTEM_HEALTH = [
  { name: 'API Gateway', latency: 42, status: 'healthy' },
  { name: 'DB Primary', latency: 18, status: 'healthy' },
  { name: 'DB Replica', latency: 23, status: 'healthy' },
  { name: 'ML Worker', latency: 210, status: 'warning' },
  { name: 'Cache (Redis)', latency: 3, status: 'healthy' },
  { name: 'Queue (Kafka)', latency: 67, status: 'healthy' }
];

export const AI_SUGGESTIONS = [
  'Review the 3 open PRs assigned to you before standup',
  'Your RLHF certification module 4 is due in 2 days',
  'The reward-model-service CI is failing — check the latest commit',
  'Sprint 18 velocity is 12% above average — great work!'
];
