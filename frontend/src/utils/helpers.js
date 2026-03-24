export const formatTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h > 0 ? h + 'h ' : ''}${m}m`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'OPEN': return '#ef4444'; // Red
    case 'ASSIGNED': return '#f59e0b'; // Yellow
    case 'IN_PROGRESS': return '#3b82f6'; // Blue
    case 'RESOLVED': return '#10b981'; // Green
    default: return '#6b7280'; // Gray
  }
};
