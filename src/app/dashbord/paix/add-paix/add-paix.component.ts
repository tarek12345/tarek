import { Component, Input, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { SharedConfigService } from '../../../services/shared-config.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add-paix',
  templateUrl: './add-paix.component.html',
  styleUrl: './add-paix.component.css',
  standalone: false
})
export class AddPaixComponent {

 configs: any[] = [];
  private sub!: Subscription;


  @Input() userdetaile: any;
  @Input() datauser: any;


  userid: any;
  allusers: any[] = [];



  uploadedFile: File | null = null;



  formData = {


    // salarié
    nom: '',
    prenom: '',
    matricule: '',
    cin: '',
    cnss: '',
    poste: '',


    // famille
    chef_famille: false,
    nombre_enfants: 0,


    // salaire
    salaire_brut: 0,
    salaire_net: 0,


    retenue_cnss: 0,
    salaire_brut_imposable: 0,
    retenue_source: 0,
    contribution_sociale: 0,


    // société
    entreprise: '',
    matricule_fiscal: '',


    // période
    mois: '',
    annee: ''

  };




  constructor(
    private lettreService: ApiService,
    private toastr: ToastrService,
    private sharedConfig: SharedConfigService
  ) { }





  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userdetaile']) {
      this.allusers = changes['userdetaile']?.currentValue;
    }
    else  {
      this.userid = changes['datauser']?.currentValue?.user
    }
  }
ngOnInit() {

  this.loadConfigs();

  this.sub = this.sharedConfig.refresh$.subscribe(refresh => {
    if (refresh) {
      this.loadConfigs();
    }
  });

}
loadConfigs() {
  this.lettreService.getAllConfigPaix().subscribe(data => {
    this.configs = data;

    if ((this.configs.length > 0) &&(this.formData.matricule == null)){

      const cfg = this.configs[0];

      this.formData.nom = cfg.nom;
      this.formData.prenom = cfg.prenom;
      this.formData.matricule = cfg.matricule;
      this.formData.cin = cfg.cin;
      this.formData.cnss = cfg.cnss;
      this.formData.poste = cfg.poste;
      this.formData.entreprise = cfg.entreprise;
      this.formData.matricule_fiscal = cfg.matricule_fiscal;

    }
  });
  
}
onConfigChange(event: any) {

  const id = Number(event.target.value);

  // Aucun matricule sélectionné
  if (!id) {

    this.formData.matricule = '';
    this.formData.nom = '';
    this.formData.prenom = '';
    this.formData.cin = '';
    this.formData.cnss = '';
    this.formData.poste = '';
    this.formData.entreprise = '';
    this.formData.matricule_fiscal = '';

    return;
  }

  const cfg = this.configs.find(c => c.id === id);

  if (!cfg) {
    return;
  }

  this.formData.matricule = cfg.matricule;
  this.formData.nom = cfg.nom;
  this.formData.prenom = cfg.prenom;
  this.formData.cin = cfg.cin;
  this.formData.cnss = cfg.cnss;
  this.formData.poste = cfg.poste;
  this.formData.entreprise = cfg.entreprise;
  this.formData.matricule_fiscal = cfg.matricule_fiscal;
}


  onFileSelected(event: any) {

    this.uploadedFile =
      event.target.files[0];

  }




  /*
  ===========================
   Calcul fiche paie Tunisie
  ===========================
  */

calculDepuisBrut() {

let brut = Number(this.formData.salaire_brut) || 0;


this.formData.retenue_cnss =
Number((brut * 0.0918).toFixed(3));


this.formData.salaire_brut_imposable =
Number((brut - this.formData.retenue_cnss).toFixed(3));


let imposable = this.formData.salaire_brut_imposable;


this.formData.retenue_source =
imposable > 5000 
? Number(((imposable - 5000) * 0.15).toFixed(3))
: 0;


this.formData.contribution_sociale =
Number((brut * 0.01).toFixed(3));


this.formData.salaire_net =
Number(
(
brut
- this.formData.retenue_cnss
- this.formData.retenue_source
- this.formData.contribution_sociale
).toFixed(3)
);


}
calculDepuisNet(){

let net = Number(this.formData.salaire_net) || 0;


let brut = net / (1 - 0.0918 - 0.01);


this.formData.salaire_brut =
Number(brut.toFixed(3));


this.calculDepuisBrut();


}
resetCalcul(){

 this.formData.retenue_cnss = 0;
 this.formData.salaire_brut_imposable = 0;
 this.formData.retenue_source = 0;
 this.formData.contribution_sociale = 0;
 this.formData.salaire_net = 0;

}

  onSubmit(form: NgForm) {



    if (form.invalid || !this.uploadedFile) {

      this.toastr.error(
        "Veuillez importer le modèle PDF"
      );

      return;

    }




    const userId = this.userid?.id;



    if (!userId) {

      this.toastr.error(
        "Utilisateur introuvable"
      );

      return;

    }



    const data = new FormData();



    data.append(
      'pdf_modele',
      this.uploadedFile
    );



    Object.entries(this.formData)
      .forEach(([key, value]) => {

        data.append(
          key,
          String(value)
        );

      });



    data.append(
      'user_id',
      userId.toString()
    );





    this.lettreService
      .createtpaix(data)
      .subscribe(


        (res: Blob) => {


          const blob =
            new Blob(
              [res],
              {
                type: 'application/pdf'
              }
            );



          const url =
            window.URL.createObjectURL(blob);



          const a =
            document.createElement('a');


          a.href = url;

          a.download =
            'fiche_paie.pdf';


          a.click();




          this.toastr.success(
            "Fiche de paie générée"
          );



          this.sharedConfig.triggerRefresh();



          form.resetForm();


          this.uploadedFile = null;



        },



        error => {


          console.error(error);


          this.toastr.error(
            "Erreur génération fiche paie"
          );


        }



      );



  }



}