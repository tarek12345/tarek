import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import {UploaderOptions, UploadFile, UploadInput, UploadOutput} from 'ngx-uploader';
@Component({
  selector: 'app-photo-utilisateur',
  templateUrl: './photo-utilisateur.component.html',
  styleUrls: ['./photo-utilisateur.component.css']
})
export class PhotoUtilisateurComponent {

 
  @Input() defaultPicture: string = '';
  @Input() picture: string = '';
  @Input() uploaderOptions: UploaderOptions;
  @Input() canDelete: boolean = true;
  @Output() onUpload = new EventEmitter<any>();
  @Output() onUploadCompleted = new EventEmitter<any>();
  @Output() onLogoChanged = new EventEmitter<any>();
  @ViewChild('fileUpload') public _fileUpload: ElementRef;
  @ViewChild('selectfile') public selectfile: ElementRef;
  



  constructor(private renderer: Renderer2) {
  }


  formData: FormData;
  files: UploadFile;
  uploadInput: EventEmitter<UploadInput>;
   options: UploaderOptions;
  bringFileSelector(): boolean {
  this.renderer.selectRootElement(this._fileUpload.nativeElement).click()

      return false;
  }
  _changePicture(file:File):void {
      const reader = new FileReader();
      reader.addEventListener('load', (event:Event) => {
          this.picture = (<any> event.target).result;
          this.onLogoChanged.emit(this.picture);
      }, false);
      reader.readAsDataURL(file);
  }
  removePicture() {
      this.picture = '';
      this.onLogoChanged.emit(this.picture);
     // return false;

  }
  onUploadOutput(output: UploadOutput): void {

        if ( typeof output.file !== 'undefined')  // add file to array when added
        { this.files=output.file;
       this._changePicture(output.file.nativeFile);}

       }




  removeFile(id: string): void {
      this.uploadInput.emit({ type: 'remove', id: id });
  }



}
