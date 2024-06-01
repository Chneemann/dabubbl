import { Injectable } from '@angular/core';
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DownloadFilesService {
  uploadFiles: File[] = [];
  downloadedFiles: BehaviorSubject<{ id: string; files: string[] }[]> =
    new BehaviorSubject<{ id: string; files: string[] }[]>([]);

  fileNames: any[] = [];

  constructor() {
    this.listAllFiles();
  }

  async checkChatHasFiles(chatId: string): Promise<string | undefined> {
    try {
      const storage = getStorage();
      const listRef = ref(storage, `chatFiles/${chatId}`);

      const result = await listAll(listRef);
      if (result.items.length > 0) {
        return result.items[0].fullPath;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error('Error listing files:', error);
      return undefined;
    }
  }

  /**
   * Uploads all files and updates the list.
   * @param {string} docID - The documentId under which the files are to be saved.
   */
  uploadAllFiles(docID: string) {
    const storage = getStorage();
    for (const file of this.uploadFiles) {
      const storageRef = ref(storage, `chatFiles/${docID}/${file.name}`);
      uploadBytes(storageRef, file).then((snapshot) => {
        this.listAllFiles();
      });
    }
  }

  /**
   * Lists all files in 'chatFiles' and updates the downloaded files.
   */
  listAllFiles() {
    const storage = getStorage();
    const listRef2 = ref(storage, 'chatFiles');

    listAll(listRef2)
      .then(async (res) => {
        const downloadedFilesData: { id: string; files: string[] }[] = [];

        for (const folderRef of res.prefixes) {
          const folderID = folderRef.name;
          const folderFiles = [];

          const folderRes = await listAll(folderRef);

          for (const fileRef of folderRes.items) {
            const url = await getDownloadURL(fileRef);
            folderFiles.push(url);
          }

          downloadedFilesData.push({ id: folderID, files: folderFiles });
        }
        // Emit the updated value
        this.downloadedFiles.next(downloadedFilesData);
      })
      .catch((error) => {
        console.error('Error when retrieving the files:', error);
      });
  }

  checkFiles(chatId: string) {
    const storage = getStorage();
    const listRef = ref(storage, `chatFiles/${chatId}`);
    return listAll(listRef)
      .then((result) => {
        if (result.items.length > 0) {
          return result.items[0].fullPath;
        }
        return;
      })
      .catch((error) => {
        console.error('Error listing files:', error);
        return false;
      });
  }

  async downloadFiles(path: string): Promise<string | null> {
    try {
      const storage = getStorage();
      const forestRef = ref(storage, path);
      const downloadUrl = await getDownloadURL(forestRef);
      return downloadUrl;
    } catch (error) {
      console.error('Error downloading file:', error);
      return null;
    }
  }
}
