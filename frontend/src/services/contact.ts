import { apiClient } from "./api-client";
import { ContactMessagePayload, ContactMessageResponse } from "./api.types";

export async function sendContactMessage(
  payload: ContactMessagePayload,
): Promise<ContactMessageResponse> {
  return apiClient.post<ContactMessageResponse>("contact/messages/", payload);
}
