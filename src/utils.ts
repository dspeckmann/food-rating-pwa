import { Axios } from "axios";
import NewPicture from "./domain/new-picture";

export function blobToBase64(blob: Blob): Promise<string> {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise(resolve => {
    reader.onloadend = () => {
      resolve(reader.result!.toString());
    };
  });
};

export function readFileAsDataUrl(file: File): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = reject;
      fr.onload = () => {
          resolve(fr.result?.toString());
      }
      fr.readAsDataURL(file);
  });
}

export function getPrettyDate(dateString: string) {
  // TODO: Directly create date when DTO is being created
  return new Date(dateString).toLocaleDateString(undefined, { dateStyle: 'long' })
}

export function getPrettyTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString(undefined, { timeStyle: 'short' }) + ' Uhr'
}
