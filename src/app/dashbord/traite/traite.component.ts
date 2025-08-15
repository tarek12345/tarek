import { Component, Input, SimpleChanges } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { SharedConfigService } from '../../services/shared-config.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-traite',
  templateUrl: './traite.component.html',
  styleUrls: ['./traite.component.css'],
  standalone: false
})
export class TraiteComponent {
    private sub!: Subscription;
  @Input() userdetaile: any;
  @Input() datauser: any;
    allusers: any[] = [];
    users: any
    userid :any
      traites: any[] = [];
  total: number = 0;
  loading = true;
 public apiUrl = environment.baseUrl; // Base URL de l'API

  ngOnChanges(changes: SimpleChanges): void {
     
    if (changes['userdetaile']) {

      this.allusers = changes['userdetaile']?.currentValue;
          console.log('dddddddddddddd',this.allusers) 
    }
    else  {
      this.userid = changes['datauser']?.currentValue?.user
   
      if(this.userid?.role=='administrator'){
         this.getTraitList()
      }
      else{
      this.getTraitListByUser()
      }
      
    }
  }
  ngOnInit(): void {
     this.sub = this.sharedConfig.refresh$.subscribe(refresh => {
       if (refresh) {
      this.getTraitListByUser(); // 🔹 recharge la liste
    }

  });
  }

  isDepassee(dateEcheance: string): boolean {
  const today = new Date();
  const echeance = new Date(dateEcheance);
  return echeance < today;
}
getAlerteType(dateEcheance: string): 'depassee' | 'derniere' | null {
  const today = new Date();
  const echeance = new Date(dateEcheance);

  const todayStr = today.toISOString().split('T')[0];
  const echeanceStr = echeance.toISOString().split('T')[0];

  if (echeanceStr < todayStr) return 'depassee';
  if (echeanceStr === todayStr) return 'derniere';
  return null;
}


    getUserId(): number | null {
  if (Array.isArray(this.userdetaile)) {
  
    return this.userdetaile[0]?.id || null; // si tableau
  } else {
    return this.userdetaile?.id || null; // si objet
  }
}


  constructor(private lettreService: ApiService, private toastr: ToastrService,private sharedConfig: SharedConfigService) {}

getTraitListByUser(){ 
if (this.userid?.id) {
      this.lettreService.getTraitListByUser(this.userid?.id).subscribe(
        (res: any) => {
          this.traites = res.traites;
          this.total = res.total;
          this.loading = false;
           
        },
        (error) => {
          console.error("Erreur lors de la récupération des traites :", error);
          this.loading = false;
        }
      );
    } else {
      console.warn('Aucun utilisateur fourni pour la récupération des traites.');
      this.loading = false;
    }
  
  }


getTraitList() {
  this.lettreService.getTraitList().subscribe({
    next: (res: any) => {
      this.traites = res.traites;
      this.total = this.traites.length;
      this.loading = false;
       this.sharedConfig.triggerRefresh();
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des traites :', err);
      this.loading = false;
    }
  });
}

onEdit(traite: any) {
  console.log('Modifier', traite);
  // ouvrir modal ou naviguer vers le formulaire
}
  onDelete(traite: any): void {
  if (confirm('Voulez-vous vraiment supprimer cette lettre de change ?')) {
    this.lettreService.Deletetraite(traite.id).subscribe({
      next: () => {
        this.traites = this.traites.filter(t => t.id !== traite.id);
        this.total = this.traites.length;
        this.sharedConfig.triggerRefresh();
        this.toastr.success('Lettre de change supprimée.');
    
      },
      error: () => {
        this.toastr.error("Erreur lors de la suppression.");
      }
    });
  }
}
onPay(traite: any) {
  console.log('Payer', traite);
  // appel API pour changer statut ou autre logique
}




}
