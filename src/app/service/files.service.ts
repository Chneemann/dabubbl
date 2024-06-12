import { Injectable } from '@angular/core';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class DownloadFilesService {
  uploadFiles: File[] = [];

  constructor(private chatService: ChatService) {}

  /**
   * Uploads all files and updates the list.
   * @param {string} docID - The documentId under which the files are to be saved.
   */
  uploadAllFiles(docID: string) {
    const storage = getStorage();
    for (const file of this.uploadFiles) {
      const storageRef = ref(storage, `chatFiles/${docID}/${file.name}`);
      uploadBytes(storageRef, file)
        .then((snapshot) => {
          getDownloadURL(storageRef)
            .then((url) => {
              this.chatService.updateChatFile(docID, url);
            })
            .catch((error) =>
              console.error('Error retrieving the download URL:', error)
            );
        })
        .catch((error) => {
          console.error('Upload error:', error);
        });
    }
  }
}
