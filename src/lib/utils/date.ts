export function formatDate(dateString: string | number): string {
  if (!dateString || dateString === "1970-01-01T00:00:00Z" || dateString === 0) {
    return 'N/A';
  }
  return new Date(dateString).toLocaleString();
}