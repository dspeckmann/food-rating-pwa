import { Axios } from 'axios';
import Invitation from '../domain/invitation';
import Pet from '../domain/pet';
import InvalidInvitationError from '../errors/invalid-invitation-error';

export default class InvitationService {
  private _axios: Axios

  constructor(axios: Axios) {
    this._axios = axios
  }

  async createInvitation(petId: string) {
    const response = await this._axios.post(`/api/pets/${petId}/invitations`)
    return response.data as Invitation
  }

  async acceptInvitation(invitationId: string) {
    try {
    const response = await this._axios.post(`/api/invitations/${invitationId}/accept`)
    return response.data as Pet
    } catch (_) {
      // TODO: Catch specific status code?
      throw new InvalidInvitationError()
    }
  }
}