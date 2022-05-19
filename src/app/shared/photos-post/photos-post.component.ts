import {Component,OnInit,Input,EventEmitter,Output,ViewChild,ElementRef,Renderer2,Inject,NgZone,} from "@angular/core";
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import {UploaderOptions,UploadFile,UploadInput,UploadOutput,
} from "ngx-uploader";
import { NotificationsService } from "angular2-notifications";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { ServiceGlobalService } from "src/app/pages/service-global.service";
import { CarouselComponent } from 'ngx-bootstrap/carousel';
@Component({
  selector: "app-photos-post",
  templateUrl: "./photos-post.component.html",
  styleUrls: ["./photos-post.component.css"],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: false, showIndicators: true } }
 ],
})
export class PhotosPostComponent implements OnInit {
  @Input() pictures: Array<any> = [
    {
      attachement_id: 0,
      attachement_nom: "",
      attachement_post: 0,
      attachement_ordre: 0,
    },
  ];
  editmode = false;
  @Input() defaultPicture: string = "";
  @Input() picture: string = "";
  @Input() uploaderOptions: UploaderOptions;
  @Input() canDelete: boolean = true;
  showPictures: boolean = false;
  @Output() onUpload = new EventEmitter<any>();
  @Output() onUploadCompleted = new EventEmitter<any>();
  @Output() onImageChanged = new EventEmitter<any>();
  @Output() onDelateImage = new EventEmitter<any>();
  @ViewChild("upload") myModal;
  @ViewChild("fileUpload") public _fileUpload: ElementRef;
  public uploadInProgress: boolean;
  fileExtention = this.picture.substr(this.picture.length - 3).toLowerCase();
  closeResult = "";
  active3 = 1;
  Albums: Array<any> = [];
  show_album: boolean = false;
  loading: boolean = false;
  principal_photo;
  principal_cat;
  total_photo;
  currentcat : boolean = false;
  current_categorie

  ServerConditionImageType(): boolean {
    if (this.picture) {
      let a = ["jpg", "jpeg", "png", "gif"];
      let picExtention = this.picture
        .substr(this.picture.length - 3)
        .toLowerCase();
      return a.indexOf(picExtention) === -1;
    } else {
      return false;
    }
  }
  imageCondition(image): boolean {
    let listImagesEx = ["jpg", "peg", "png", "gif"];
    return this.in_array(
      image.substr(image.length - 3).toLowerCase(),
      listImagesEx
    );
  }

  ServerConditionFileType(): boolean {
    if (this.picture) {
      let a = ["rar", "zip", "txt", "doc", "docx", "ppt", "pdf"];
      let picExtention = this.picture
        .substr(this.picture.length - 3)
        .toLowerCase();
      return a.indexOf(picExtention) === -1;
    } else {
      return false;
    }
  }
  LiveConditionImageType: boolean = false;
  LiveConditionFileType: boolean = false;
  formData: FormData;
  files: UploadFile;
  uploadInput: EventEmitter<UploadInput>;
  options: UploaderOptions;



  @ViewChild(CarouselComponent) myCarousel: CarouselComponent;


  constructor(
    private renderer: Renderer2,
    @Inject(NgZone) private zone: NgZone,
    private modalService: NgbModal,
    private _Notificationservice: NotificationsService,
    private ServiceGlobale: ServiceGlobalService
  ) {
    this.options = { concurrency: 1, maxUploads: 1,  maxFileSize: 1000000  ,};
  }
  ngOnInit(): void {
    this.getAlbums('');

  }

  getAlbums(Album) {
    this.ServiceGlobale.getAlbums(Album).subscribe((result) => {
      this.Albums = result.message;
      for (let j = 0; j < this.Albums.length; j++) {
        this.total_photo = this.Albums.length;
      }

   
    });
  }

  select_photo(item ,photo) {
    item.list.forEach((val) => {
      if (photo == val) {
        if (val.status == "") {
          val.status = true;
        } else if (val.status == true) {
          val.status = false;
        }
      }

      else if(photo != val)
      {
        val.status = "";
      }
    });

    this.editmode = true;

  }

  addpicturesalbums() {
    this.pictures = []
    this.picturesToAdd = []
    
    this.Albums[0].list.forEach((val) => {
      if (val.status == true) {
        this.picturesToAdd.push({
          attachement_id: val.id,
          attachement_nom: val.file,
        });
        this.pictures.push({
          attachement_id: val.id,
          attachement_nom: val.file,
        });
        setTimeout(() => {
          this.modalService.dismissAll("Dismissed after saving data");
          this.onImageChanged.emit(this.picturesToAdd);
        }, 1000);
      }
    });
 
    
  }



  show_albums(search) {
    
    this.currentcat = true
    this.current_categorie = search
    this.ServiceGlobale.getAlbums(search).subscribe((result) => {

      this.Albums = result.message;
       this.show_album = !this.show_album;

       for (let i = 0; i <this.Albums.length; i++) {
        this.Albums[i].list.forEach((val) => {
          val.status = "";
        });
       }


       console.log(this.Albums)


  });
  }

  retoursgalerie(){
    
    this.current_categorie = ""
    this.currentcat = false
    this.ServiceGlobale.getAlbums("").subscribe((result) => {

      this.Albums = result.message;
       this.show_album = false;


  });
  }

  OrderArray: Array<any> = [];
  errorMessage: string;
  imagesNOduplicate = [];
  picturesToAdd = [];
  width
  height
  _changePicture(file: any): void {
    this.pictures = []
    this.picturesToAdd = []

    if(file.size < 4000)
    {
      this._Notificationservice.error("Erreur", 
      
      'La photo que vous avez importée est trop petite',
      'Elle doit mesurer au moins 400 pixels de large et 300 pixels de haut',
      {
        id: "InfoAuth",
        timeOut: 6000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      });

      
    }


  

    else{
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        (event: Event) => {
     

          let imgCode64 = (<any>event.target).result;
          if (!this.in_array(imgCode64, this.imagesNOduplicate)) {
            this.imagesNOduplicate.push(imgCode64);
            this.pictures.push({
              attachement_id: 0,
              attachement_nom: imgCode64,
            });
            this.picturesToAdd.push({
              attachement_id: 0,
              attachement_nom: imgCode64,
            });
  
            if (this.pictures.length > 0) {
              this.loading = true;
  
              setTimeout(() => {
                this.modalService.dismissAll("Dismissed after saving data");
                this.loading = false;
              }, 3000);
            }
          }
        },
        false
      );
      reader.readAsDataURL(file);
      this.onImageChanged.emit(this.picturesToAdd);
    }

  }

  in_array(string, array) {
    var result = false;
    var i;
    for (i = 0; i < array.length; i++) {
      if (array[i] == string) {
        result = true;
      }
    }

    return result;
  }

  bringFileSelector(): boolean {
    this.pictures = []
    this.renderer.selectRootElement("#keywordsInput").click();
    return false;
  }

  removePicture(): boolean {
    this.picture = "";
    return false;
  }

  removePictures(): boolean {
    this.pictures.splice(0, this.pictures.length);
    return false;
  }
  onUploadOutput(output: UploadOutput): void {
    if (typeof output.file !== "undefined") {
      // add file to array when added
      this.files = output.file;
      this._changePicture(output.file.nativeFile);
    }
  }

  _onUpload(data): void {
    if (data["done"] || data["abort"] || data["error"]) {
      this._onUploadCompleted(data);
    } else {
      this.onUpload.emit(data);
    }
  }

  _onUploadCompleted(data): void {
    this.uploadInProgress = false;
    this.onUploadCompleted.emit(data);

    this.ServerConditionImageType();
    this.ServerConditionFileType();
  }

  _canUploadOnServer(): boolean {
    return !!this.uploaderOptions["url"];
  }

  deleteImage(index: number, data: string) {

    this.pictures = []
    this.picturesToAdd= []


  }



  deleteAllImage(pictures) {
    console.log("pictures===");
    console.log(pictures);

    for (let i = 0; i < pictures.length; i++) {
      this.onDelateImage.emit(pictures[i]);
    }

    this.pictures = [];
  }
  Openupload(upload) {
    this.modalService
      .open(upload, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  Annuler_importphoto() {
    this.pictures = [];
    this.modalService.dismissAll("Dismissed after saving data");
  }
}
