declare interface IChatMessage extends IModel<'message'> {
  acked_by: UUID | null
  attachments: IFile[]
  author: IUser | null
  activity: UUID
  comment: string | null
  deliveries: IChatMessageDelivery[] | null
  document_url: string | null
  image_thumbnail_url: string | null
  image_url: string | null
  mentions: unknown | null
  mid: UUID
  notification: unknown | null
  recommendation: unknown | null
  reference: unknown | null
  room: string
  video_url: string | null
}

declare interface IChatActivity extends IChatMessage {
  activity: UUID
}

declare interface IChatMessageDelivery extends IModel<'notification_delivery'> {
  user: UUID
  delivery_type: string // 'sms' | 'email' | '?' ...
}
