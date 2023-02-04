export default class InvalidInvitationError extends Error {
  constructor (message?: string) {
    super(message ?? 'The received invitation was already expired or did not exist.')
  }
}