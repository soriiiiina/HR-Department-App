export interface Message {
    id: number
    senderId: number
    senderUsername: string
    senderPhotoUrl: any
    recieverId: number
    recieverUsername: string
    recieverPhotoUrl: string
    content: string
    dateRead?: Date
    messageSent: Date
  }
  