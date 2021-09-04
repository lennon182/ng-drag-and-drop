import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpEvent } from '@angular/common/http';
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

  public uploadFiles(file: FormData): Promise<void> {
    const path = 'http://localhost:3000/upload';
    return this.http
      .post(path, file, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((e) => {
          return console.log(e);
        })
      )
      .toPromise();
  }
}

export interface Uploads {
  file: File;
  status: string;
}
