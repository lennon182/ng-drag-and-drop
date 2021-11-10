import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpUserEvent,
} from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class UploadFilesService {
  private _uploadFiles = new BehaviorSubject<Uploads[]>([]);

  constructor(private http: HttpClient) {}

  public setFiles(files: Uploads[]): void {
    this._uploadFiles.next(files);
  }
  public getFiles(): BehaviorSubject<Uploads[]> {
    return this._uploadFiles;
  }

  public uploadFiles(file: Uploads): Observable<HttpEvent<Object>> {
    const filesData = new FormData();
    filesData.append('file', file.file);
    const path = 'http://localhost:3000/upload';
    return this.http
      .post(path, filesData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((e: HttpEvent<Object>) => {
          return e;
        })
      );
  }
}

export interface Uploads {
  file: File;
  status: string;
}

export interface uploadedBodyResponse {
  msg: string;
  name: string;
}
