/**
 * Converts backend errors into user-friendly, actionable English messages.
 * Handles common authorization errors, actor availability issues, and other backend traps.
 */
export function humanizeBackendError(error: Error | unknown): string {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Authorization errors
  if (errorMessage.includes('Unauthorized') || errorMessage.includes('Only the owner')) {
    return 'You do not have permission to perform this action. Please log in as the content owner.';
  }
  
  if (errorMessage.includes('Only users can')) {
    return 'Please log in to perform this action.';
  }
  
  // Actor/connection errors
  if (errorMessage.includes('Actor not available')) {
    return 'Connection to the backend is not available. Please refresh the page and try again.';
  }
  
  // Validation errors
  if (errorMessage.includes('required')) {
    return 'Please fill in all required fields.';
  }
  
  // Network/timeout errors
  if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Generic fallback with original message
  return errorMessage || 'An unexpected error occurred. Please try again.';
}
