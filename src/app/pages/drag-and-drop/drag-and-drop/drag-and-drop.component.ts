import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { UploadFilesService } from '@dragandrop/upload-files.service';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss'],
})
export class DragAndDropComponent implements OnInit {
  @ViewChild('dragSection', { static: true })
  dragSection!: ElementRef<HTMLDivElement>;
  @ViewChild('uploadBtn', { static: true })
  uploadBtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('inputFile', { static: true })
  inputFile!: ElementRef<HTMLInputElement>;

  public files: Uploads[] = [];
  public preloadFiles: Uploads[] = [];
  public uploadingFiles: Uploads[] = [];
  public uploadedFiles: Uploads[] = [];
  private filelist: FileList | null = null;
  public showPreloader: boolean = false;
  private fileTypeAcept: string[] = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/zip',
    'video/mp4',
    'video/x-m4v',
    'video/*',
  ];

  public uploadProgress: number = 0;
  // public currentUploadingItem: number = 0;

  constructor(
    private r2: Renderer2,
    private uploadService: UploadFilesService
  ) {}

  ngOnInit() {
    this.initDragAndDrop();
    // this.uploaddButton();
    this.loadInput();
    this.uploadedFilesObs();
  }

  /**
   * =========[ Drag and Drop ] =========
   */
  private initDragAndDrop() {
    const dragSection = this.dragSection.nativeElement;
    this.dragOver(dragSection);
    this.dragLeave(dragSection);
    this.drop(dragSection);
  }
  private dragOver(dragSection: HTMLDivElement) {
    this.r2.listen(dragSection, 'dragover', (e: Event) => {
      e.preventDefault();
      dragSection.classList.add('drag-hover');
    });
  }
  private dragLeave(dragSection: HTMLDivElement) {
    this.r2.listen(dragSection, 'dragleave', (e: Event) => {
      e.preventDefault();
      dragSection.classList.remove('drag-hover');
    });
  }
  private drop(dragSection: HTMLDivElement) {
    this.r2.listen(dragSection, 'drop', (e: DragEvent) => {
      e.preventDefault();
      const filelist = e.dataTransfer?.files;
      this, this.preLoadingFiles(filelist);
      dragSection.classList.remove('drag-hover');
    });
  }

  /**
   * =========[ Traditional Loader ] =========
   */
  /**
   * Load Button
   */
  private uploaddButton() {
    this.r2.listen(this.uploadBtn.nativeElement, 'click', (e: Event) => {
      e.preventDefault();
      this.inputFile.nativeElement.click();
    });
  }
  /**
   * Load Input
   */
  private loadInput() {
    this.r2.listen(this.inputFile.nativeElement, 'change', (e: Event) => {
      const filelist = this.inputFile.nativeElement.files;
      this, this.preLoadingFiles(filelist);
    });
  }

  /**
   * ========= [PreLoader && and Send Files] =========
   * @param filesList
   * @returns Promise Void
   */

  private async preLoadingFiles(filesList: FileList | null | undefined) {
    const listLength = filesList!.length;
    for (let index = 0; index < listLength; index++) {
      if (this.fileTypeAcept.includes(filesList![index].type)) {
        this.files = [
          ...this.files,
          { file: filesList![index], status: 'loading' },
        ];
      }
    }
    /**
     * Send Emmiter - Preloader
     */
    this.uploadingFiles = [...this.uploadingFiles, ...this.files];
    this.uploadService.setFiles(this.uploadingFiles);
    this.showPreloader = true;
    /**
     * Upload
     */
    this.files.forEach(async (file: Uploads, i) => {
      /**
       * Sends File to Api Server - UPLOAD FILES
       * @param file - this is it the file to save
       * @returns e: HttpEvent<Object>
       */
      this.uploadService.uploadFiles(file).subscribe((e: HttpEvent<Object>) => {
        if (e.type == 1) {
          this.preloadFiles[i].loaded = e.loaded;
          this.preloadFiles[i].total = e.total;
          this.preloadFiles[i].porcent = Math.round(
            (e.loaded / (e.total || 0)) * 100
          );
          this.preloadFiles[i].progressBar = `${this.preloadFiles[i].porcent}%`;

          if (this.preloadFiles[i].loaded === this.preloadFiles[i].total) {
            this.preloadFiles[i].status = 'loaded';
            this.uploadedFiles = [...this.uploadedFiles, file];
          }
        } else if (e.type === 3) {
          this.files = [];
          this.uploadingFiles = [];
          // console.log(this.uploadedFiles);
        } else if (e.type === 4) {
          if (e.body?.hasOwnProperty('name')) {
            const fileUploade: uploadedBodyResponse =
              e.body.valueOf() as uploadedBodyResponse;
            console.log('FileUploaded=> ', fileUploade.name);
          }
        }
      });
    });
  }

  /**
   *
   * ========= [Files Preloader Observer] =========
   * Files Preloader Observer
   * Listens the files while are loading
   */
  private uploadedFilesObs() {
    this.uploadService.getFiles().subscribe((files) => {
      this.preloadFiles = files;
    });
  }

  public closeProloader(): void {
    this.showPreloader = !this.showPreloader;
  }
}

export interface Uploads {
  file: File;
  status: string;
  loaded?: number;
  porcent?: number;
  total?: number;
  progressBar?: string;
}

export interface uploadedBodyResponse {
  msg: string;
  name: string;
}
