import Fetch from '../../services/fetch'

export async function createAppointmentRequest(
  token: string,
  data: IShowingAppointmentInput
): Promise<IPublicShowingAppointment> {
  try {
    const response = await new Fetch()
      .post(`/showings/public/${token}/appointments`)
      .send(data)

    return response.body.data
  } catch (error) {
    throw error
  }
}
