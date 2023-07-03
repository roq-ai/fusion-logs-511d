const mapping: Record<string, string> = {
  'game-servers': 'game_server',
  logs: 'log',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
