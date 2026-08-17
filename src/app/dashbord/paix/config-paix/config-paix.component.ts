import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../services/api.service';
import { SharedConfigService } from '../../../services/shared-config.service';

@Component({
  selector: 'app-config-paix',
  standalone: false,
  
  templateUrl: './config-paix.component.html',
  styleUrl: './config-paix.component.css'
})
export class ConfigPaixComponent {
    @Input() userdetaile: any;
    @Input() datauser: any;
  
      @Output() configUpdated = new EventEmitter<void>(); // 🔹 Événement pour le parent
      allusers: any[] = [];
      userid :any
   displayStyleFiche: string = "none";
  configs: any[] = [];
  
ngOnChanges(changes: SimpleChanges): void {
  if (changes['userdetaile']) {
    this.allusers = changes['userdetaile']?.currentValue || [];
  }

  if (changes['datauser']) {
    this.userid = changes['datauser']?.currentValue?.user;
  }
}

    constructor(private configpaix: ApiService,    private toastr: ToastrService,private sharedConfig: SharedConfigService ) {}
  
  formDataconfig = {
    nom: '',
    prenom: '',
    matricule: '',
    cin: '',
    cnss: '',
    poste: '',
    entreprise: '',
    matricule_fiscal: '',
  };
ngOnInit() {
    this.loadConfigs();
  }

  loadConfigs() {
    this.configpaix.getAllConfigPaix().subscribe(data => {
      this.configs = data;
    });
  }

  addConfig() {
    if (!this.formDataconfig.nom ||
       !this.formDataconfig.prenom ||
        !this.formDataconfig.poste ||
         !this.formDataconfig.matricule_fiscal ||
         !this.formDataconfig.cin ||
         !this.formDataconfig.cnss ||
         !this.formDataconfig.entreprise||
         !this.formDataconfig.matricule
        ) return;
    this.configpaix.addConfigPaix({
      nom: this.formDataconfig.nom,
      prenom: this.formDataconfig.prenom,
      poste: this.formDataconfig.poste,
      matricule_fiscal :this.formDataconfig.matricule_fiscal,
      cin:this.formDataconfig.cin ,
      cnss: this.formDataconfig.cnss ,
      entreprise: this.formDataconfig.entreprise ,
      matricule :this.formDataconfig.matricule ,
      }).subscribe(() => {

  this.formDataconfig.nom = '';
  this.formDataconfig.prenom = '';
  this.formDataconfig.matricule = '';
  this.formDataconfig.cin = '';
  this.formDataconfig.cnss = '';
  this.formDataconfig.poste = '';
  this.formDataconfig.entreprise = '';
  this.formDataconfig.matricule_fiscal = '';

  this.loadConfigs();
  this.sharedConfig.triggerRefresh();

  this.toastr.success('Configuration ajoutée avec succès');

});
  }

deleteConfig(id: number) {
  console.log("wxfwxf",id)
this.configpaix.deleteConfigPaix(id).subscribe(() => {
    this.loadConfigs();
    this.sharedConfig.triggerRefresh();
    this.toastr.success('Configuration supprimée');
});
}

  selectedFiche: any

EditPaix(): void {
  const data = {
    nom: this.selectedFiche.nom,
    prenom: this.selectedFiche.prenom,
    matricule :this.selectedFiche.matricule,
    matricule_fiscal :this.selectedFiche.matricule_fiscal,
    cin : this.selectedFiche.cin,
    cnss: this.selectedFiche.cnss,
    poste : this.selectedFiche.poste
  };

  this.configpaix.EditConfigPaix(this.selectedFiche.id, data).subscribe({
    next: (res) => {
      this.toastr.success("Config paie à jour");
      this.closePopupFiche();
      this.loadConfigs();
    },
    error: (err) => {
      this.toastr.error("Erreur lors de la mise à jour", err.message);
    }
  });
}
closePopupFiche(){
this.displayStyleFiche = "none"
}
OpenEditFiche(data :  any){
  this.displayStyleFiche = "block";
  this.selectedFiche =data
  console.log("donne de  cofig fiche   de  paix",this.selectedFiche)
 
}
}
