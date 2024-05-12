export const publicChannels: string[] = [
  'ktoVhTjif9OndCsLfEF7',
  't0zOHsjKzq0uYSqsMx8j',
];
export interface Channel {
  id?: string;
  name: string;
  description: string;
  creator: string;
  privatChannel: boolean;
  hashtag: string;
  createdDate: string;
  addedUser: Array<string>;
}

export interface PrvChannel {
  id?: string;
  creatorId: string;
  talkToUserId: string;
}
