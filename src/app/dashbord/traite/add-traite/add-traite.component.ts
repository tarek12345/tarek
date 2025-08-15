import { Component, Input, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { SharedConfigService } from '../../../services/shared-config.service';
import { Subscription } from 'rxjs';

@Component({
 selector: 'app-add-traite',
  templateUrl: './add-traite.component.html',
  styleUrl: './add-traite.component.css',
  standalone: false
})
export class AddTraiteComponent {
  private sub!: Subscription;
  @Input() userdetaile: any;
  @Input() datauser: any;
    allusers: any[] = [];
    userid :any
 configs: any[] = [];
ribOptions: string[] = []; // Liste RIB filtrés selon le fournisseur choisi
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userdetaile']) {
      this.allusers = changes['userdetaile']?.currentValue;
    }
    else  {
      this.userid = changes['datauser']?.currentValue?.user
    }
  }
ngOnInit() {
  this.sub = this.sharedConfig.refresh$.subscribe(refresh => {
    if (refresh) {
      this.loadConfigs(); // 🔹 recharge la liste
    }
  });
}
  loadConfigs() {
    this.lettreService.getAllConfig().subscribe(data => {
      this.configs = data;
    });
  }
  uploadedFile: File | null = null;

  // Données du formulaire
  formData = {
    nom: '',
    rib: '',
    date_echeance: '',
    montant: '',
    ml: '',
    date_creation: '',
    lieu: '',
    lieuc: '',
    nd: '',
    domicilation: '',
    valeur_en: 'dinar' // valeur par défaut sélectionnée
  };

  constructor(private lettreService: ApiService,    private toastr: ToastrService,private sharedConfig: SharedConfigService) {}

  // Méthode appelée à la sélection d’un fichier PDF
  onFileSelected(event: any) {
    this.uploadedFile = event.target.files[0];
  }

  // Méthode appelée à la saisie du montant
  onMontantInput() {
    const montant = Number(this.formData.montant);
    if (!isNaN(montant)) {
      this.formData.ml = this.convertirMontantEnLettres(montant);
    } else {
      this.formData.ml = '';
    }
  }

convertirMontantEnLettres(nombre: number): string {
  if (nombre === 0) return 'zéro dinar';

  const unite = [
    '', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
    'dix-sept', 'dix-huit', 'dix-neuf'
  ];

  const dizaine = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];

  const convert_hundred = (n: number): string => {
    let text = '';
    const centaine = Math.floor(n / 100);
    const reste = n % 100;

    if (centaine > 0) {
      if (centaine === 1) {
        text += 'cent';
      } else {
        text += unite[centaine] + ' cent';
      }

      if (reste === 0 && centaine > 1) text += 's';
      if (reste > 0) text += ' ';
    }

    if (reste > 0) {
      if (reste < 20) {
        text += unite[reste];
      } else {
        const d = Math.floor(reste / 10);
        const u = reste % 10;
        if (d === 7 || d === 9) {
          text += dizaine[d - 1] + (u === 1 ? ' et ' : '-') + unite[u + 10];
        } else {
          text += dizaine[d];
          if (u === 1 && d !== 8) text += ' et un';
          else if (u > 0) text += '-' + unite[u];
          if (d === 8 && u === 0) text += 's'; // exemple : quatre-vingts
        }
      }
    }

    return text;
  };

  const millions = Math.floor(nombre / 1_000_000);
  const milliers = Math.floor((nombre % 1_000_000) / 1000);
  const reste = nombre % 1000;

  let resultat = '';

  if (millions > 0) {
    resultat += (millions === 1 ? 'un million' : convert_hundred(millions) + ' millions') + ' ';
  }

  if (milliers > 0) {
    if (milliers === 1) {
      resultat += 'mille ';
    } else {
      resultat += convert_hundred(milliers) + ' mille ';
    }
  }

  if (reste > 0) {
    resultat += convert_hundred(reste);
  }

  return resultat.trim() + ' dinars';
}

  // Nettoyage et découpe RIB en 4 parties
  get ribParts() {
    const ribClean = (this.formData.rib || '').replace(/\D/g, '').padEnd(20, '0');

    return {
      codeBanque: ribClean.substring(0, 2),
      codeAgence: ribClean.substring(2, 5),
      numCompte: ribClean.substring(5, 18),
      cle: ribClean.substring(18, 20),
    };
  }

  // Méthode appelée à chaque saisie dans le champ RIB
  onRibChange() {
    // Supprimer les caractères non numériques
    this.formData.rib = this.formData.rib.replace(/\D/g, '');

    // Limiter à 20 chiffres max
    if (this.formData.rib.length > 20) {
      this.formData.rib = this.formData.rib.substring(0, 20);
    }
  }

 
onSubmit(form: NgForm) {
  if (form.invalid || !this.uploadedFile) {
    this.toastr.error("Veuillez remplir tous les champs requis et importer un fichier PDF.");
    return;
  }

  const userId =  this.userid?.id
  if (!userId) {
    this.toastr.error('Utilisateur introuvable.');
    return;
  }

  const data = new FormData();
  data.append('pdf_modele', this.uploadedFile);

  Object.entries(this.formData).forEach(([key, value]) => {
    data.append(key, value);
  });

  data.append('user_id', userId.toString());

  this.lettreService.createtraite(data).subscribe(
    (res: Blob) => {
      // Affichage ou téléchargement PDF (optionnel)
      const blob = new Blob([res], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'lettre_traite_personnalise.pdf';
      a.click();

      this.toastr.success('Lettre enregistrée et PDF généré avec succès !');
      this.sharedConfig.triggerRefresh();
      form.resetForm();
      this.uploadedFile = null;
    },
    error => {
      console.error(error);
      this.toastr.error("Erreur lors de la génération ou de l’enregistrement du PDF.");
    }
  );
}
onFournisseurChange(event: any) {
  const fournisseurId = event.target.value;
  const fournisseur = this.configs.find(c => c.id == fournisseurId);
  if (fournisseur) {
    // Mettre à jour la liste RIB selon le fournisseur
    this.ribOptions = [fournisseur.rib];
    // Sélectionner automatiquement le RIB
    this.formData.rib = fournisseur.rib;
  } else {
    this.ribOptions = [];
    this.formData.rib = '';
  }
}
}
